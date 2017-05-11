export interface CrosswordModel {
    clueProviders: ClueProvider[],
    grid: Square[][],
    //might want selectedSquare, selectedWord
}
export interface ClueProvider {
    name: string;
    acrossClues: Clue[];
    downClues: Clue[];
}
export interface Clue {
    text: string,
    format: string,
    word:IWord
}
export interface IWord {
    squares: Square[],
    cheat: () => void,
    uncheat: () => void,
    solve: () => void,
    unsolve:()=> void,
    select: () => void,
    deselect: () => void,
    selected:boolean,
    solvingMode: SolvingMode,
    isAcross: boolean,
    id:number
}
export interface Square {
    acrossWord: IWord,
    downWord: IWord,
    selected: boolean,
    wordSelected: boolean,
    solvingMode: SolvingMode,
    number: string,
    letter: string,
    guess: string,
    rowIndex: number,
    columnIndex:number
}
export enum SolvingMode { Guessing,Solving, Cheating  }

export class Word implements IWord {
    squares: Square[] = [];
    _setSolvingMode(solvingMode: SolvingMode) {
        this.squares.forEach(square => square.solvingMode = solvingMode);
        this.solvingMode = solvingMode;
    }
    cheat() {
        this._setSolvingMode(SolvingMode.Cheating);
    }
    uncheat() {
        this._setSolvingMode(SolvingMode.Guessing);
    }
    solve() {
        this._setSolvingMode(SolvingMode.Solving);
    }
    unsolve() {
        this._setSolvingMode(SolvingMode.Guessing);
    }
    _setSelectionState(selected: boolean) {
        this.squares.forEach(square => square.selected = selected);
        this.selected = selected;
    }
    select() {
        this._setSelectionState(true);
    }
    deselect() {
        this._setSelectionState(false);
    }
    solvingMode: SolvingMode = SolvingMode.Guessing;
    selected: boolean;
    isAcross: boolean
    id:number

}

