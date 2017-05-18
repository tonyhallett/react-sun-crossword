export interface CrosswordModel {
    clueProviders: ClueProvider[],
    grid: Square[][],
    selectedSquare: Square,
    selectedWord: IWord
    solvingMode: SolvingMode,
    words:IWord[]
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
    //cheat: () => void,
    //uncheat: () => void,
    //solved: () => boolean,
    //unsolve:()=> void,
    solved(): boolean,
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
    columnIndex: number
    autoSolved:boolean
}
export enum SolvingMode { Guessing,Solving, Cheating  }

export class Word implements IWord {
    squares: Square[] = [];
    _setSolvingMode(solvingMode: SolvingMode) {
        this.squares.forEach(square => square.solvingMode = solvingMode);
        this.solvingMode = solvingMode;
    }
    solved(): boolean {
        var isSolved = true;
        for (var i = 0; i < this.squares.length; i++) {
            var square = this.squares[i];
            if (square.guess !== square.letter) {
                isSolved = false;
                break;
            }
        }
        return isSolved;
    }
    //cheat() {
    //    this._setSolvingMode(SolvingMode.Cheating);
    //}
    //uncheat() {
    //    this._setSolvingMode(SolvingMode.Guessing);
    //}
    //solve() {
    //    this._setSolvingMode(SolvingMode.Solving);
    //}
    //unsolve() {
    //    this._setSolvingMode(SolvingMode.Guessing);
    //}
    _setSelectionState(selected: boolean) {
        this.squares.forEach(square => square.wordSelected = selected);
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

