import { useState } from "react";
import { EntryInline } from "./Components";
import type { Anime, Entry, Staff } from "./Types";
import ClipboardCheck from "./assets/clipboard2-check-fill.svg";
import ClipboardEmpty from "./assets/clipboard.svg";

export default function Win({connections, shortestPath}: 
    {connections: Array<Anime | Staff>, shortestPath: Array<Anime | Staff>}){
    const [shortestPathSuffix, setShortestPathSuffix] = useState("hidden");
    const [copyIcon, setCopyIcon] = useState(ClipboardEmpty);
    
    return <div className="text-white bg-black/75 p-5 rounded-3xl">
        <p className="py-2 max-w-lg leading-11 max-h-50 overflow-scroll">
            {connections.map((c) => <><EntryInline key={c.id} entry={c}/>➡️</>)}
        </p>

        <hr className="py-2"/>
        
        <h1>
            You Made it in {connections.length - 1}!
        </h1>

        <div>
            <button 
                className="mx-auto rounded-md bg-teal-500 px-4 py-3 text-white hover:bg-teal-400 w-3xs text-center my-3 cursor-pointer"
                onClick={() => copyToClipboard(connections, setCopyIcon)}
            >
                <img className="inline invert mx-2 mb-1" src={copyIcon}/>
                Share Score
            </button>
        </div>

        <div className="py-2 text-start">
            <button className="cursor-pointer" onClick={() => 
                setShortestPathSuffix(shortestPathSuffix == "hidden" ? "cropIn" : "hidden")}>
                Show Shortest Path:🔻
            </button>
            <div className={`max-w-lg leading-11 ${shortestPathSuffix}`}>
                📏 Length: {shortestPath.length - 1}
                <hr className="py-2"/>
                <p className="max-h-50 overflow-scroll">
                    {shortestPath.map((c) => <><EntryInline key={c.id} entry={c}/>➡️</>)}
                </p>
            </div>
        </div>
    </div>;
}

function copyToClipboard(connections: Array<Entry>, setIcon: React.Dispatch<React.SetStateAction<string>>){
    let copy = "";

    copy += `I completed today's Anime to Anime in ${connections.length - 1} connections!\n\n`;

    if(connections.length < 6)
        for(let i = 0; i < connections.length - 1; i++)
            copy += cutOffString(connections[i].name) + " ➡️ ";
    
    else {
        copy += cutOffString(connections[0].name) + " ➡️ ";
        copy += cutOffString(connections[1].name) + " ➡️ ";
        copy += cutOffString(connections[2].name) + " ➡️ ";
        copy += "... ➡️ "
        copy += cutOffString(connections[connections.length - 3].name)+ " ➡️ ";
        copy += cutOffString(connections[connections.length - 2].name)+ " ➡️ ";
    }
    
    // add final entry without arrow
    copy += cutOffString(connections[connections.length - 1].name);

    copy += "\n\nBeat my score! sata.li/animetoanime";

    navigator.clipboard.writeText(copy);

    setIcon(ClipboardCheck);
    setTimeout(() => setIcon(ClipboardEmpty), 500);
}

function cutOffString(s: string){
    if(s.length > 30)
        return s.slice(0, 30) + "...";
    return s;
}