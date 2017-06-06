import { CrosswordPuzzleDataStore, CrosswordPuzzleChooseDetail } from "./stores";

class DemoStore implements CrosswordPuzzleDataStore {
    getDetailsAsync(): Promise<CrosswordPuzzleChooseDetail[]> {
        return Promise.resolve([]);
    }
}
export var crosswordPuzzleDataStore: CrosswordPuzzleDataStore = new DemoStore();

