import { useEffect, useMemo, useState } from "react";
import { Anime, Staff, VoiceActor } from "./Types";
import { EntryInline, EntryListView, LoadingEntryList } from "./Components";

export default function Game({start, end} : {start: Anime, end: Anime}){
    // current entry
    let [current, setCurrent] = useState(start);

    // list of user-made connections to final entry
    let [connections, setConnections]:
        [connections: Array<Anime | Staff>, setConnections: any] = useState([]);

    // list of entries pulled from api
    let [entryList, setEntryList]: 
        [entryList: Array<Anime | Staff | VoiceActor>, setEntryList: any] = useState([]);
    
    // user search value
    let [searchVal, setSearchVal] = useState("");

    // search filter functions
    let arrayIncludes = (element: string) => 
        element.toLowerCase().includes(searchVal.toLowerCase());
    let searchFilter = (entry : Anime | Staff) => {
        if(entry.name.toLowerCase().includes(searchVal.toLowerCase()))
            return true;
        if(entry instanceof Anime)
            return entry.role.some(arrayIncludes);
        else
            return entry.positions.some(arrayIncludes);
    }

    // final filtered list
    let filteredEntryList = useMemo(() => entryList.filter(searchFilter), [entryList, searchVal]);

    useEffect(() => { let a = async () => {
        setEntryList([]);
        setConnections([...connections, current]);

        if(current.id == end.id)
            win();
        else
            setEntryList(await getEntryList(current as (Anime | Staff)));

    }; a();}, [current]);

    return <div className="h-screen overflow-scroll w-3xl scrollbar-none">
        <div className="text-start mx-2 mt-7 flexbox text-white sticky top-0 bg-black/75 rounded-lg p-2">
            <p className="pb-3">
                {connections.map((connection) => {
                    return <EntryInline entry={connection}/>
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

    let response = await fetch(endpoint + entry.id);
    let json = await response.json()
    let list: Array<Anime | Staff | VoiceActor> = []

    // properly cast each list object to their respective class for correct type guarding
    for(let [_key, v] of Object.entries(json)){
        if('characters' in (v as Object)){
            let value: VoiceActor = v as VoiceActor;
            list.push(new VoiceActor(
                value.name, value.imageUrl, value.id, value.positions, value.characters
            ));
        }

        else if('positions' in (v as Object)){
            let value: Staff = v as Staff;
            list.push(new Staff(
                value.name, value.imageUrl, value.id, value.positions 
            ));
        }
        
        else {
            let value: Anime = v as Anime;
            list.push(new Anime(
                value.name, value.imageUrl, value.id, value.role
            ));
        }
    }

    return list;
}

function win(){
    console.log("win !!!");
}