export interface ICrosswordModel {
    id: string
    title: string
    //to look at..................
    datePublished: Date,
    dateStarted: Date,
    duration:number,
    clueProviders: ClueProvider[],
    grid: ISquare[][],
    selectedSquare: ISquare,
    selectedWord: IWord
    selectWord: (word: IWord) => void;
    selectSquare: (square: ISquare) => void;
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
    number: string,
    wordId:number
    word:IWord
}
export interface IWord {
    squares: ISquare[],
    solved(): boolean,
    select: () => void,
    deselect: () => void,
    selected:boolean,
    solvingMode: SolvingMode,
    isAcross: boolean,
    id: number
    x: number
    y: number
    length: number
}
export interface ISquare {
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
    autoSolved: boolean,
    isStartOfWord:(across:boolean)=>boolean
}
export enum SolvingMode { Guessing,Solving, Cheating  }

export class Word implements IWord {
    squares: ISquare[] = [];
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
    solvingMode: SolvingMode;
    selected: boolean;
    isAcross: boolean
    id: number
    x: number
    y: number
    length: number

}


export interface CrosswordModelJson {
    id: string
    title: string
    //to look at..................
    datePublished: string
    dateStarted: string
    duration:number
    clueProviders: CrosswordModelJsonClueProvider[]
    words: CrosswordModelJsonWord[]
    grid: CrosswordModelJsonSquare[][]
    solvingMode: SolvingMode
}
export interface CrosswordModelJsonClueProvider {
    name: string
    acrossClues: CrosswordModelJsonClue[]
    downClues: CrosswordModelJsonClue[]
}
export interface CrosswordModelJsonClue {
    format: string
    text: string
    number: string
    wordId: number
}
export interface CrosswordModelJsonWord {
    isAcross: boolean
    id: number
    x: number
    y: number
    length: number,
    solvingMode: SolvingMode,
    selected:boolean
}
export interface CrosswordModelJsonSquare {
    guess: string
    letter: string
    number: string
    selected: boolean
    wordSelected: boolean
    solvingMode: SolvingMode
    autoSolved: boolean
}

class CrosswordModel implements ICrosswordModel {
    id: string;
    title: string;
    datePublished: Date;
    dateStarted: Date;
    duration: number;
    clueProviders: ClueProvider[];
    grid: ISquare[][];
    selectedSquare: ISquare;
    selectedWord: IWord;
    selectWord(word: IWord) {
        if (this.selectedWord !== word) {
            if (this.selectedWord) {
                this.selectedWord.deselect();
            }
            word.select();
            this.selectedWord = word;
        }
    }
    selectSquare(square: ISquare) {
        var previousSelectedSquare = this.selectedSquare;
        if (previousSelectedSquare) {
            previousSelectedSquare.selected = false;
        }
        square.selected = true;
        this.selectedSquare = square;
    };
    solvingMode: SolvingMode;
    words: IWord[];


}
class Square implements ISquare {
    acrossWord: IWord;
    downWord: IWord;
    selected: boolean;
    wordSelected: boolean;
    solvingMode: SolvingMode;
    number: string;
    letter: string;
    guess: string;
    rowIndex: number;
    columnIndex: number;
    autoSolved: boolean;
    isStartOfWord(across: boolean) {
        var word = across ? this.acrossWord : this.downWord;
        var index = word.squares.indexOf(this);
        return index === 0;
    }


}
export function ConvertCrosswordModelToJson(crosswordModel: ICrosswordModel): CrosswordModelJson {
    //dates different types
    var grid = crosswordModel.grid.map(function (row) {
        return row.map(function (square: ISquare) {
            var jsonSquare: CrosswordModelJsonSquare = {
                autoSolved: square.autoSolved,
                guess: square.guess,
                letter: square.letter,
                number: square.number,
                selected: square.selected,
                wordSelected: square.wordSelected,
                solvingMode: square.solvingMode
            }
            return jsonSquare
        });
    });
    var words = crosswordModel.words.map(function (word: IWord) {
        var jsonWord: CrosswordModelJsonWord = {
            id: word.id,
            isAcross: word.isAcross,
            selected: word.selected,
            solvingMode: word.solvingMode,
            length: word.length,
            x: word.x,
            y:word.y
        }
        return jsonWord;
    });
    function mapClues(clues: Clue[]): CrosswordModelJsonClue[] {
        return clues.map(function (clue: Clue) {
            var jsonClue: CrosswordModelJsonClue = {
                format: clue.format,
                number: clue.number,
                text: clue.text,
                wordId:clue.wordId
            } 
            return jsonClue;
        })
    }
    var clueProviders = crosswordModel.clueProviders.map(function (cp: ClueProvider) {
        var jsonClueProvider: CrosswordModelJsonClueProvider = {
            name: cp.name,
            acrossClues: mapClues(cp.acrossClues),
            downClues: mapClues(cp.downClues)
        }
        return jsonClueProvider;
    });
    var crosswordModelJson: CrosswordModelJson = {
        datePublished: crosswordModel.datePublished.toString(),
        dateStarted: crosswordModel.dateStarted.toString(),
        duration: crosswordModel.duration,
        id: crosswordModel.id,
        solvingMode: crosswordModel.solvingMode,
        title: crosswordModel.title,
        grid:grid,
        words: words,
        clueProviders: clueProviders
    }
    return crosswordModelJson;
}
export function ConvertCrosswordJsonToModel(crosswordJson: CrosswordModelJson): ICrosswordModel{
    var dateStarted: Date = crosswordJson.dateStarted ? new Date(crosswordJson.dateStarted) : null;
    
    var crosswordModel = new CrosswordModel();
    crosswordModel.dateStarted = dateStarted;
    crosswordModel.duration = crosswordJson.duration;
    crosswordModel.id = crosswordJson.id;
    crosswordModel.datePublished = new Date(crosswordJson.datePublished);
    crosswordModel.title = crosswordJson.title;
    crosswordModel.solvingMode = crosswordJson.solvingMode;
    
    var selectedSquare = null;
    
    var grid: ISquare[][] = crosswordJson.grid.map((row, rowIndex) => {
        return row.map((square, columnIndex) => {
            var crosswordSquare = new Square();
            crosswordSquare.autoSolved = square.autoSolved;
            crosswordSquare.columnIndex = columnIndex;
            crosswordSquare.rowIndex = rowIndex;
            crosswordSquare.guess = square.guess;
            crosswordSquare.letter = square.letter;
            crosswordSquare.number = square.number;
            crosswordSquare.selected = square.selected;
            crosswordSquare.wordSelected = square.wordSelected;
            crosswordSquare.solvingMode = square.solvingMode;
            
            if (crosswordSquare.selected) {
                selectedSquare = crosswordSquare;
            }
            return crosswordSquare;
        });
    });
    
    var selectedWord = null;
    var crosswordWords:Word[] = crosswordJson.words.map(jsonWord => {
        var word = new Word();
        word.id = jsonWord.id;
        word.isAcross = jsonWord.isAcross;
        word.length = jsonWord.length;
        word.selected = jsonWord.selected;
        if (word.selected) {
            selectedWord = word;
        }
        word.solvingMode = jsonWord.solvingMode;
        word.x = jsonWord.x;
        word.y = jsonWord.y;
        var x = word.x;
        var y = word.y;
        
        for (var i = 0; i < word.length; i++) {
            var crosswordSquare: ISquare = grid[y - 1][x - 1];

            word.squares.push(crosswordSquare);

            if (word.isAcross) {
                crosswordSquare.acrossWord = word;
                x = x + 1;
            } else {
                crosswordSquare.downWord = word;
                y = y + 1;
            }
        }
        
        return word;
    });
    crosswordModel.words = crosswordWords;
    crosswordModel.selectedWord = selectedWord;
    crosswordModel.selectedSquare = selectedSquare;
    crosswordModel.grid = grid;
    function findWord(wordId: number): Word {
        var word: Word;
        for (var i = 0; i < crosswordWords.length; i++) {
            word = crosswordWords[i];
            if (word.id === wordId) {
                break;
            }
        }
        return word;
    }
    function mapClues(clues: CrosswordModelJsonClue[]) :Clue[]{
        return clues.map(jsonClue => {
            var clue: Clue = {
                format: jsonClue.format,
                number: jsonClue.number,
                text: jsonClue.text,
                wordId: jsonClue.wordId,
                word: findWord(jsonClue.wordId)
            }
            return clue;
        })
    }

    crosswordModel.clueProviders=crosswordJson.clueProviders.map(cp => {
        return {
            name: cp.name,
            acrossClues: mapClues(cp.acrossClues),
            downClues: mapClues(cp.downClues)
        }
    })
    //console.log(crosswordModel);
    return crosswordModel;
}

export interface CrosswordLookupJson {
    id: string
    title: string
    datePublished: string
}

export function getClueSolution(clue: Clue) {
    var clueSolution = "";
    var squares = clue.word.squares;
    squares.forEach(function (sq) {
        clueSolution += sq.letter;
    })
    return clueSolution;
}
