export class DailyData {
    name: string = "Loading Game..";
    anime1: Anime = placeHolderAnime;
    anime2: Anime = placeHolderAnime;
    shortestPath: Array<Anime> = [];

    constructor(name: string, anime1: Anime, anime2: Anime, shortestPath: Array<Anime>){
        this.name = name;
        this.anime1 = anime1;
        this.anime2 = anime2;
        this.shortestPath = shortestPath;
    }
}

export class Entry {
    name!: string;
    imageUrl!: string;
    id!: number;

    constructor(name: string, imageUrl: string, id: number){
        this.name = name;
        this.imageUrl = imageUrl;
        this.id = id;
    }
}

export class Anime extends Entry{
    role!: Array<string>;

    constructor(name: string, imageUrl: string, id: number, role: Array<string>){
        super(name, imageUrl, id);
        this.role = role;
    }
}

export class Staff extends Entry{
    positions!: Array<string>;

    constructor(name: string, imageUrl: string, id: number, positions: Array<string>){
        super(name, imageUrl, id);
        this.positions = positions;
    }
}

export class VoiceActor extends Staff{
    characters!: Array<Character>

    constructor(name: string, imageUrl: string, id: number, positions: Array<string>, characters: Array<Character>){
        super(name, imageUrl, id, positions);
        this.characters = characters;
    }
}

class Character {
    name!: string;
    imageUrl!: string;

    constructor(name: string, imageUrl: string){
        this.name = name;
        this.imageUrl = imageUrl;
    }
}

export let placeHolderAnime: Anime = {
    name: "Loading...",
    imageUrl: "https://cdn.myanimelist.net/r/42x62/images/questionmark_23.gif",
    id: -1,
    role: []
}