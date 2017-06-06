import { CrosswordModelJson } from "../models/index";

export interface CrosswordPuzzleStore {
    getDetailsAsync(): Promise<CrosswordPuzzleChooseDetail[]>
}
export interface CrosswordPuzzleJsonStore extends CrosswordPuzzleStore {

}
export interface CrosswordPuzzleDataStore extends CrosswordPuzzleStore {

}
export interface CrosswordPuzzleChooseDetail {
    inStore: boolean // isNew the same
    getAsync(): Promise<CrosswordModelJson>
    title: string,
    id: string,
    datePublished:Date

    //specifics name, percentageComplete...
}