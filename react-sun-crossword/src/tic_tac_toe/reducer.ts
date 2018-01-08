import { FontLoadingState,FONT_LOADING } from './webFontLoader'
import { AnyAction } from 'redux'
import { ArrowDirection, BOARD_HIT_TEST, BOARD_HIT_TEST_RESULT, Arrow_Press, Finished_Confirmed, Play_Again, Take_Go } from "./actions";
import { combineReducers } from 'redux'
export { FontLoadingState } from './webFontLoader'


//#region redux state
export enum SquareGo { X, O, None }
export enum Player { X, O }
export enum PlayState { X, O, Playing, Draw, FinishedConfirmed }
export interface ScoreboardCountState {
    playCount: number,
    drawCount: number,
    playerXWinCount: number
}
export interface PlayerColourState {
    xColour: string
    oColour: string
}
export interface RowColumnIndices {
    row: number,
    column: number
}

export interface BoardHitTestReq {
    x: number, y: number
}
export interface BoardHitTestRes {
    hit: boolean,
    row: number,
    column: number
}
interface BoardHitTestState {
    request: BoardHitTestReq,
    result: BoardHitTestRes
}
interface GameState extends ScoreboardCountState  {
    board: SquareGo[][],
    currentPlayer: Player,
    playState: PlayState,
    selectedSquare: RowColumnIndices
}
export interface TicTacToeState {
    gameState: GameState,
    fontLoadingState: FontLoadingState
    boardHitTest: BoardHitTestState,
    playerColours:PlayerColourState
}
//#endregion
//#region state defaults
var numRowsAndColumns = 4;
function getDefaultBoard(): SquareGo[][] {
    var rows = [];
    for (var i = 0; i < numRowsAndColumns; i++) {
        var squares = [];
        for (var j = 0; j < numRowsAndColumns; j++) {
            squares.push(SquareGo.None);
        }
        rows.push(squares);
    }
    return rows;
}
var firstPlayer = Player.X;
function getDefaultSelectedSquare() {
    return { row: 0, column: 0 };
}
//#endregion
//#region reducer 
//#region check winner
function checkWinner(board: SquareGo[][]): SquareGo {
    var winner = checkRowsWinner(board);
    if (winner === SquareGo.None) {
        winner = checkColumnsWinner(board);
        if (winner === SquareGo.None) {
            winner = checkDiagonalWinner(board);
        }
    }
    return winner;
}
function checkRowsWinner(board: SquareGo[][]): SquareGo {
    var checkSquareGo;
    var winner;
    for (var i = 0; i < board.length; i++) {
        winner = true;
        for (var j = 0; j < board.length; j++) {
            var squareGo = board[i][j];
            if (squareGo == SquareGo.None) {
                winner = false;
                break;
            }
            if (j === 0) {
                checkSquareGo = squareGo;
            } else {
                if (checkSquareGo !== squareGo) {
                    winner = false;
                    break;
                }
            }

        }
        if (winner) {
            break;
        }
    }
    if (!winner) {
        checkSquareGo = SquareGo.None;
    }
    return checkSquareGo;
}
function checkColumnsWinner(board: SquareGo[][]): SquareGo {
    var checkSquareGo;
    var winner;
    for (var i = 0; i < board.length; i++) {
        winner = true;
        for (var j = 0; j < board.length; j++) {
            var squareGo = board[j][i];
            if (squareGo == SquareGo.None) {
                winner = false;
                break;
            }
            if (j === 0) {
                checkSquareGo = squareGo;
            } else {
                if (checkSquareGo !== squareGo) {
                    winner = false;
                    break;
                }
            }

        }
        if (winner) {
            break;
        }
    }
    if (!winner) {
        checkSquareGo = SquareGo.None;
    }
    return checkSquareGo;
}
function checkDiagonalWinner(board: SquareGo[][]): SquareGo {
    var checkSquareGo;
    var winner = true;
    for (var i = 0; i < board.length; i++) {
        var squareGo = board[i][i];
        if (squareGo == SquareGo.None) {
            winner = false;
            break;
        }
        if (i === 0) {
            checkSquareGo = squareGo;
        } else {
            if (checkSquareGo !== squareGo) {
                winner = false;
                break;
            }
        }
    }
    if (!winner) {
        winner = true;
        for (var i = 0; i < board.length; i++) {
            var squareGo = board[i][board.length - 1 - i];
            if (squareGo == SquareGo.None) {
                winner = false;
                break;
            }
            if (i === 0) {
                checkSquareGo = squareGo;
            } else {
                if (checkSquareGo !== squareGo) {
                    winner = false;
                    break;
                }
            }
        }
    }
    if (!winner) {
        checkSquareGo = SquareGo.None;
    }
    return checkSquareGo;
}
//#endregion
function checkDraw(board: SquareGo[][]) {
    var isDraw = true;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var square = board[i][j];
            if (square === SquareGo.None) {
                isDraw = false;
                break;
            }
        }
    }
    return isDraw;
}
function getSelectedSquare(currentSelectedSquare: RowColumnIndices, numSquares, direction: ArrowDirection): RowColumnIndices {
    if (currentSelectedSquare) {
        var newColumn
        var newRow
        var currentColumn = currentSelectedSquare.column
        var currentRow = currentSelectedSquare.row
        switch (direction) {
            case ArrowDirection.Left:
                newRow = currentRow;
                if (currentColumn === 0) {
                    newColumn = numSquares - 1;
                } else {
                    newColumn = currentColumn - 1;
                }
                break;
            case ArrowDirection.Right:
                newRow = currentRow;
                if (currentColumn === numSquares - 1) {
                    newColumn = 0;
                } else {
                    newColumn = currentColumn + 1;
                }
                break;
            case ArrowDirection.Up:
                newColumn = currentColumn;
                if (currentRow === 0) {
                    newRow = numSquares - 1;
                } else {
                    newRow = currentRow - 1;
                }
                break;
            case ArrowDirection.Down:
                newColumn = currentColumn;
                if (currentRow === numSquares - 1) {
                    newRow = 0
                } else {
                    newRow = currentRow + 1;
                }
                break;
        }
        return { column: newColumn, row: newRow };
    } else {
        return { column: 0, row: 0 }
    }

}


//#region child reducers
function playerColours(state: PlayerColourState = { oColour: "yellow", xColour: "rgb(255, 51, 153)" },action:AnyAction) {
    //no actions at the moment
    return state;
}
function boardHitTestReducer(state: BoardHitTestState = { request: null, result: null}, action: AnyAction) {
    switch (action.type) {
        case BOARD_HIT_TEST:
            return {
                        request: {
                            x: action.x,
                            y: action.y
                        },
                        result: state.result
                    }
    
            
        case BOARD_HIT_TEST_RESULT:
            return  {
                        request: state.request,
                        result: {
                            hit: action.hit,
                            row: action.row,
                            column: action.column
                        }
                    }
        default:
            return state;
            
    }
}
function fontLoadingState(state: FontLoadingState = FontLoadingState.NotStarted, action: AnyAction) {
    switch (action.type) {
        case FONT_LOADING:
            return action.state as FontLoadingState;
        default:
            return state;
    }
}
function gameStateReducer(state: GameState = {
    currentPlayer: firstPlayer,
    board: getDefaultBoard(),
    playState: PlayState.Playing,
    playCount: 0,
    drawCount: 0,
    playerXWinCount: 0,
    selectedSquare: getDefaultSelectedSquare(),
}, action: AnyAction) {
    switch (action.type) {

        case Arrow_Press:
            return {
                ...state,
                selectedSquare: getSelectedSquare(state.selectedSquare, state.board.length, action.direction)
            }
        case Finished_Confirmed:
            return {
                ...state,
                playState: PlayState.FinishedConfirmed
            }
        case Play_Again:
            return {
                ...state,
                board: getDefaultBoard(),
                playState: PlayState.Playing,
                selectedSquare: getDefaultSelectedSquare()
            }
        case Take_Go:
            if (state.playState === PlayState.Playing) {
                var row = action.row;
                var column = action.column;

                var currentPlayer = state.currentPlayer;
                var nextPlayer = currentPlayer;

                var legitimatePlay = false;
                var newBoard = state.board.map((rowSquares, index) => {
                    if (index === row) {
                        return rowSquares.map((sq, colIndex) => {
                            if (colIndex === column) {
                                if (sq === SquareGo.None) {
                                    legitimatePlay = true;
                                    var squareGo = SquareGo.O;
                                    if (currentPlayer === Player.X) {
                                        squareGo = SquareGo.X;
                                    }
                                    return squareGo;
                                }

                            }
                            return sq;
                        })
                    }
                    return rowSquares;
                });
                var playState = PlayState.Playing;

                var drawCount = state.drawCount;
                var playCount = state.playCount;
                var playerXWinCount = state.playerXWinCount;

                if (legitimatePlay) {
                    nextPlayer = (currentPlayer === Player.X) ? Player.O : Player.X;

                    var winner = checkWinner(newBoard);

                    switch (winner) {
                        case SquareGo.None:
                            if (checkDraw(newBoard)) {
                                playState = PlayState.Draw;
                                playCount++;
                                drawCount++;
                            }
                            break;
                        case SquareGo.X:
                            playState = PlayState.X;
                            playCount++;
                            playerXWinCount++;
                            break;
                        case SquareGo.O:
                            playState = PlayState.O;
                            playCount++;
                            break;
                    }
                }

                return {
                    selectedSquare: { row: row, column: column },
                    board: newBoard,
                    currentPlayer: nextPlayer,
                    playState: playState,
                    drawCount: drawCount,
                    playCount: playCount,
                    playerXWinCount: playerXWinCount
                }
            } else {
                return state;
            }
        default:
            return state;
    }
}
//#endregion



export const reducer = combineReducers<TicTacToeState>({
    gameState: gameStateReducer,
    playerColours: playerColours,
    fontLoadingState: fontLoadingState,
    boardHitTest: boardHitTestReducer

})

//export function reducer(state: TicTacToeState = {}, action: AnyAction) {
    
//    return {
//        gameState:gameStateReducer(state.gameState,action),
//        playerColours: playerColours(state.playerColours,action),
//        fontLoadingState: fontLoadingState(state.fontLoadingState, action),
//        boardHitTest: boardHitTestReducer(state.boardHitTest,action)
//    } as TicTacToeState
//}
//#endregion

