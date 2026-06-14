import { useEffect, useState } from "react";
import { Anime, Staff, VoiceActor } from "./Types";
import { EntryListView } from "./Components";

export default function Game({start, end} : {start: Anime, end: Anime}){
    let [current, setCurrent] = useState(start);
    let [entryList, setEntryList]: 
        [entryList: Array<Anime | Staff | VoiceActor>, setEntryList: any] = useState([]);

    useEffect(() => { let a = async () => {
        setEntryList([]);

        if(current.id == end.id)
            win();
        else
            setEntryList(await getEntryList(current as (Anime | Staff)));

    }; a();}, [current]);

    return <div className="h-screen overflow-scroll px-2 pt-15">
        <div className="grid grid-row gap-y-4 w-3xl pb-10">
            {entryList.map((next : Anime | Staff | VoiceActor) => {
                return <EntryListView key={next.id} entry={next} hook={setCurrent}/>
            })}
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