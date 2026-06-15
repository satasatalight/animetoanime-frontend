import { useEffect, useMemo, useState } from "react";
import { Anime, Staff, VoiceActor } from "./Types";
import { EntryInline, EntryListView, LoadingEntryList } from "./Components";
import Win from "./Win";
import confetti from "canvas-confetti";

export default function Game({start, end, setPage, shortestPath}: 
    {start: Anime, end: Anime, setPage: React.Dispatch<React.SetStateAction<React.JSX.Element>>, shortestPath: Array<Anime | Staff>}){
    // current entry
    const [current, setCurrent] = useState(start);

    // list of user-made connections to final entry
    const [connections, setConnections]:
        [connections: Array<Anime | Staff>, setConnections: React.Dispatch<React.SetStateAction<any>>]
            = useState([]);

    // list of entries pulled from api
    const [entryList, setEntryList]: 
        [entryList: Array<Anime | Staff | VoiceActor>, setEntryList: any] = useState([]);
    
    // user search value
    const [searchVal, setSearchVal] = useState("");

    // create filtered list
    const filteredEntryList = useMemo(() => {
        // search filter functions
        const arrayIncludes = (element: string) => 
            element.toLowerCase().includes(searchVal.toLowerCase());

        const searchFilter = (entry : Anime | Staff) => {
            if(entry.name.toLowerCase().includes(searchVal.toLowerCase()))
                return true;
            if(entry instanceof Anime)
                return entry.role.some(arrayIncludes);
            else
                return entry.positions.some(arrayIncludes);
        }

        // return filtered entry list
        return entryList.filter(searchFilter);

    }, [entryList, searchVal]);

    // call api and update connections on new entry
    useEffect(() => { const a = async () => {
        setEntryList([]);
        setConnections((c: Array<Anime | Staff>) => [...c, current]);
        setEntryList(await getEntryList(current as (Anime | Staff)));
    }; a();}, [current]);

    // check for win condition
    useEffect(() => {
        if(connections.length > 0 && connections[connections.length - 1].id == end.id){
            setPage(<Win connections={connections} shortestPath={shortestPath}/>);
            confetti({particleCount: 300, spread: 200});
        }
    }, [connections, setPage, end.id, shortestPath])

    return <div className="h-screen overflow-scroll max-w-3xl w-full scrollbar-none">
        <h2 className="pt-6 px-2 text-start">
            From <EntryInline entry={start}/> to <EntryInline entry={end}/>
        </h2>

        <div className="text-start mx-2 mt-7 flexbox text-white sticky top-0 bg-black/75 rounded-lg p-2">
            <p className="pb-3 px-2 max-h-30 overflow-scroll">
                {connections.map((connection) => {
                    return <><EntryInline key={connection.id} entry={connection}/>➡️</>
                })}
            </p>

            <hr className="mx-2"/>

            <div className="flex place-self-center justify-center">
                <input 
                    placeholder="Search:" 
                    className="mt-4 mb-2 px-2 py-1 w-md bg-black/75 resize-none rounded-lg"
                    onChange={e => setSearchVal(e.target.value)}
                />
            </div>
        </div>

        <div className="px-2 pt-5">
            <LoadingEntryList entryList={entryList}/>
            <div className="grid grid-row gap-y-4 w-full pb-10">
                {filteredEntryList.map((next : Anime | Staff | VoiceActor) => {
                    return <EntryListView key={next.id} entry={next} hook={setCurrent}/>
                })}
            </div>
        </div>
    </div>;
}

async function getEntryList(entry: (Anime | Staff)){
    let endpoint;

    // get correct endpoint for entry type
    if(entry instanceof Staff)
        endpoint = "http://localhost:8080/getStaffAnime?id=";
    else 
        endpoint = "http://localhost:8080/getAnimeStaff?id=";

    const response = await fetch(endpoint + entry.id);
    const json = await response.json()
    const list: Array<Anime | Staff | VoiceActor> = []

    // properly cast each list object to their respective class for correct type guarding
    for(const [_key, v] of Object.entries(json)){
        if('characters' in (v as object)){
            const value: VoiceActor = v as VoiceActor;
            list.push(new VoiceActor(
                value.name, value.imageUrl, value.id, value.positions, value.characters
            ));
        }

        else if('positions' in (v as object)){
            const value: Staff = v as Staff;
            list.push(new Staff(
                value.name, value.imageUrl, value.id, value.positions 
            ));
        }
        
        else {
            const value: Anime = v as Anime;
            list.push(new Anime(
                value.name, value.imageUrl, value.id, value.role
            ));
        }
    }

    return list;
}