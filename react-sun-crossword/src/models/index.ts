export interface CrosswordModel {
    id: string
    title: string
    //to look at..................
    datePublished: Date
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
    number: string,
    wordId:number
    word:IWord
}
export interface IWord {
    squares: Square[],
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



export function ConvertCrosswordModelToJson(crosswordModel: CrosswordModel): CrosswordModelJson {
    //dates different types
    var grid = crosswordModel.grid.map(function (row) {
        return row.map(function (square: Square) {
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
        id: crosswordModel.id,
        solvingMode: crosswordModel.solvingMode,
        title: crosswordModel.title,
        grid:grid,
        words: words,
        clueProviders: clueProviders
    }
    return crosswordModelJson;
}
export function ConvertCrosswordJsonToModel(crosswordJson: CrosswordModelJson): CrosswordModel{
    var crosswordModel: CrosswordModel = {
        id: crosswordJson.id,
        datePublished: new Date(crosswordJson.datePublished),
        title: crosswordJson.title,
        selectedSquare: null,
        selectedWord: null,
        solvingMode: crosswordJson.solvingMode,
        words: null,
        clueProviders: null,
        grid: null
    }
    var selectedSquare = null;
    
    var grid: Square[][] = crosswordJson.grid.map((row, rowIndex) => {
        return row.map((square, columnIndex) => {
            var crosswordSquare: Square = {
                autoSolved: square.autoSolved,
                columnIndex: columnIndex,
                rowIndex: rowIndex,
                acrossWord: null,
                downWord: null,
                guess: square.guess,
                letter: square.letter,
                number: square.number,
                selected: square.selected,
                wordSelected: square.wordSelected,
                solvingMode: SolvingMode.Guessing
            }
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
            var crosswordSquare: Square = grid[y - 1][x - 1];

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

//var lookupJson = { id: crossword.id, datePublished: crossword.datePublished, title: crossword.title };

