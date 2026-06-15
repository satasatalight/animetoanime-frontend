import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { EntryCard } from "./Components";
import Game from "./Game";
import { Anime, DailyData, placeHolderAnime } from "./Types";

export default function({setPage}: {setPage: React.Dispatch<SetStateAction<React.JSX.Element>>}){
    // initialize and type placeholder daily data
    const [dailyData, setDailyData]: 
        [dailyData: DailyData, setDailyData: Dispatch<DailyData>] = 
        useState(new DailyData("Loading Game...", placeHolderAnime, placeHolderAnime, []));
    
    const [init, setInit] = useState(false);
    
    useEffect(() => { const a = async () => {
        const response = await fetch("http://localhost:8080/getDailyGame?date=2026-06-15");
        if(response != null){
            const json = await response.json();
            setDailyData(new DailyData(
                json.name, 
                new Anime(json.anime1.name, json.anime1.imageUrl, json.anime1.id, json.anime1.role),
                new Anime(json.anime2.name, json.anime2.imageUrl, json.anime2.id, json.anime2.role),
                json.shortestPath
            ));
            setInit(true);
        }
    }; a();}, [setDailyData])

    return (
        <>
            <h1 className=''>Anime to Anime</h1>
            <h3>Find the shortest path between these two anime via their staff and voice actors</h3>
            <div className='grid grid-cols-3 pt-10 pb-5 mx-20'>
                <EntryCard entry={dailyData.anime1}/>
                <div className='align-middle my-auto text-6xl'>➡️</div>
                <EntryCard entry={dailyData.anime2}/>
            </div>
            <button 
                type="button" 
                onClick={() => {
                    if(init)
                        setPage(<Game start={dailyData.anime1} end={dailyData.anime2}
                            setPage={setPage} shortestPath={dailyData.shortestPath}/>);
                }} 
                className='mx-auto rounded-md bg-teal-500 px-4 py-3 text-white hover:bg-teal-400 w-3xs text-center mt-5 cursor-pointer'
            >
                {(init) ? "Play Daily Game" : "Loading..."}
            </button>
        </>
    );
}