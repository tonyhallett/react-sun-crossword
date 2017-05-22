//it will only be necessary to read this the once - after that will be working from IndexedDbModelProvider or JsonModelProvider
import * as Crossword from "../models/index"


export function ModelFromJson(json: SunJson): Crossword.CrosswordModel{
    var grid: Crossword.Square[][] = json.data.grid.map((row,rowIndex) => {
        return row.map((square, columnIndex) => {
            var crosswordSquare: Crossword.Square = {
                autoSolved: false,
                columnIndex: columnIndex,
                rowIndex: rowIndex,
                acrossWord: null,
                downWord: null,
                guess: "",
                letter: square.Letter,
                number: square.Number,
                selected: false,
                wordSelected: false,
                solvingMode: Crossword.SolvingMode.Guessing
            }
            return crosswordSquare;
        });
    });
    var crosswordWords=json.data.copy.words.map(word => {
        
        var isAcross = true;
        var lengthEnd: number;
        //"2-12", means starts on 2 finishes on 12 - length = 12-1+1
        var xParts = word.x.split("-");//*************** X is columns
        var yParts = word.y.split("-");//*************** Y is rows
        var x = parseInt(xParts[0]);//lowest is 1
        var start = x;
        var y = parseInt(yParts[0]);
        var lengthParts = xParts;
        if (yParts.length == 2) {
            lengthParts = yParts;
            isAcross = false;
            start = y;
        }
        lengthEnd = parseInt(lengthParts[1]);
        var length = lengthEnd - start+1;
        var crosswordWord = new Crossword.Word();
        crosswordWord.isAcross = isAcross;
        crosswordWord.id = word.id;
        
        for (var i = 0; i < length; i++){
            var crosswordSquare: Crossword.Square= grid[y - 1][x - 1];

            crosswordWord.squares.push(crosswordSquare);

            if (isAcross) {
                crosswordSquare.acrossWord = crosswordWord;
                x = x + 1;
            } else {
                crosswordSquare.downWord = crosswordWord;
                y = y + 1;
            }
        }
        return crosswordWord;
    })
    //at the moment it is {"name": "Cryptic","title": "Across",..} , {"name": "Cryptic", "title": "Down",..}, {"name": "Coffee time","title": "Across",},{"name": "Coffee time","title": "Down",}
    var sunCluesByProviderAndDirection = json.data.copy.clues;

    function findCrossword(id: number) {
        var crossword: Crossword.Word;
        for (var i = 0; i < crosswordWords.length; i++) {
            var cw = crosswordWords[i];
            if (cw.id === id) {
                crossword = cw;
                break;
            }
        }
        return crossword;
    }
    function mapClues(clues: Clue[]): Crossword.Clue[] {
        return clues.map(clue => {
            var crosswordClue: Crossword.Clue = {
                format: clue.format,
                text: clue.clue,
                number: clue.number,
                word: findCrossword(clue.word)
            };
            return crosswordClue;
        })
    }

    //for simplicity...
    var crosswordModel: Crossword.CrosswordModel = {
        grid: grid,
        clueProviders: [
            {
                name: "Cryptic",
                acrossClues: mapClues(sunCluesByProviderAndDirection[0].clues),
                downClues: mapClues(sunCluesByProviderAndDirection[1].clues)
            },
            {
                name: "Coffee time",
                acrossClues: mapClues(sunCluesByProviderAndDirection[2].clues),
                downClues: mapClues(sunCluesByProviderAndDirection[3].clues)
            }
        ],
        selectedSquare: null,
        selectedWord: null,
        solvingMode: Crossword.SolvingMode.Guessing,
        words: crosswordWords
    }
    return crosswordModel;
}

export interface SunJson {
    data:Data
}
interface Data {
    "headline": string,
    "type": string,
    "meta": {
        "pdf": string,
        "print_index": string
    },
    "copy": {
        "title": string,
        "id": string,
        "description": string,
        "publisher": string,
        "setter": string,
        "byline": string,
        "date-publish": string,
        "date-publish-email": string,
        "date-publish-analytics": string,
        "date-release": string,
        "date-solution": string,
        "crosswordtype": string,
        "correctsolutionmessagetext": string,
        "previoussolutiontext": string,
        "previoussolutionlink": string,
        "type": string,
        "gridsize": {
            "type": string,
            "cols": string,
            "rows": string
        },
        "settings": {
            "solution_hashed": string,
            "solution": string
        },
        "hints": {
            "Mark Errors": string,
            "Solve Letter": string,
            "Solve Word": string,
            "Ask A Friend": string
        },
        "clues": Array<ClueProviderAcrossOrDown>,
        "words":Array<Word>
    },
    "options": any,
    "competitioncrossword": number,
    "grid":Square[][],
    "created": string
}
interface ClueProviderAcrossOrDown {
    name: string,
    title: string,
    clues:Array<Clue>
}
interface Clue {
    "word": number,
    "number": string,
    "clue": string,
    "format": string,
    "length": number,
    "answer": string
}
interface Word{
    "id": number,
    "x": string,
    "y": string,
    "solution": string
}
interface Square {
    "SquareID": number,
    "Number": string,
    "Letter": string,
    "Blank": string,
    "WordAcrossID": string|number,
    "WordDownID": string|number
}
