import { Anime, Entry, Staff } from "./Types";

export function EntryCard({entry} : {entry: Entry}){
    return (
        <div className="flex-col outline-teal-100 outline-2 outline-offset-2 bg-slate-900 rounded-lg overflow-hidden">
            <img className="min-w-2xs" src={entry.imageUrl}/>
            <h4 className="my-1">{entry.name}</h4>
        </div>
    );
}

export function EntryListView({entry, hook} : {entry: Anime | Staff, hook: Function}){
    let subtitle: Array<string> = [];

    if(entry instanceof Anime)
        subtitle = entry.role;
    else
        subtitle = entry.positions;

    return (
        <button type="button" className="flex h-40 w-full overflow-hidden outline-teal-100 outline-2 outline-offset-2 bg-slate-900 hover:bg-slate-600 rounded-lg cursor-pointer" onClick={() => hook(entry)}>
            <img className="h-full min-h-full w-30 object-cover" src={entry.imageUrl}/>
            <div className="text-start m-2 grow">
                <h2>{entry.name}</h2>
                <h3>
                    {subtitle.map((position) => {
                        return <p key={position}>{position}<br/></p>;
                    })}
                </h3>
            </div>
        </button>
    );
}