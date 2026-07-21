import { Anime, Entry, Staff } from "./Types";
import LoadingIcon from "./assets/3-dots-rotate.svg";

export function EntryCard({entry} : {entry: Entry}){
    return (
        <div className="flex-col outline-white outline-2 outline-offset-2 bg-slate-900 rounded-lg overflow-hidden drop-shadow-lg">
            <img className="min-w-2xs" src={entry.imageUrl}/>
            <h4 className="my-1">{entry.name}</h4>
        </div>
    );
}

export function EntryListView({entry, hook}: 
    {entry: Anime | Staff, hook: React.Dispatch<React.SetStateAction<Anime | Staff>>}){
    let subtitle: Array<string>;

    if(entry instanceof Anime)
        subtitle = entry.role;
    else
        subtitle = entry.positions;

    return (
        <button type="button" className="flex h-40 w-full overflow-hidden outline-white outline-2 outline-offset-2 bg-slate-900 hover:bg-slate-600 rounded-lg cursor-pointer hover:drop-shadow-md/75 drop-shadow-white" onClick={() => hook(entry)}>
            <img className="h-full min-h-full w-30 object-cover" src={entry.imageUrl}/>
            <div className="text-start m-2 grow">
                <h2>{entry.name}</h2>
                <h3>
                    {subtitle.map((position) => {
                        return <p className="italic" key={position}>{position}<br/></p>;
                    })}
                </h3>
            </div>
        </button>
    );
}

export function EntryInline({entry}: {entry: Entry}){
    return <>
        <img className="inline me-1 mb-1 rounded-full aspect-1/1 object-cover max-h-8" src={entry.imageUrl}/>
        {entry.name}
    </>;
}

export function LoadingEntryList({entryList}: {entryList: Array<Entry>}){
    if(entryList.length > 0)
        return <></>;

    return <div className="text-white">
        Loading
        <img className="inline invert mx-2" src={LoadingIcon}/>
    </div>;
}