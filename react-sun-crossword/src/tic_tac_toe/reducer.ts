import { FontLoadingState,FONT_LOADING } from './webFontLoader'
import { AnyAction } from 'redux'
export { FontLoadingState } from './webFontLoader'
//#region redux
//#region redux state

const BOARD_HIT_TEST = "Board_Hit_Test";
export function boardHitTest(x: number, y: number) {
    return {
        type: BOARD_HIT_TEST,
        x: x,
        y: y
    }
}
const BOARD_HIT_TEST_RESULT = "Board_Hit_Test_Result";
export function boardHitTestResult(hit: boolean, row: number, column: number) {
    return {
        type: BOARD_HIT_TEST_RESULT,
        hit: hit,
        row: row,
        column: column
    }
}

export enum SquareGo { X, O, None }
export enum Player { X, O }
export enum GameState { X, O, Playing, Draw, FinishedConfirmed }
function gameStateString(gameState: GameState) {
    switch (gameState) {
        case GameState.Draw:
            return "Draw";
        case GameState.FinishedConfirmed:
            return "Finished Confirmed";
        case GameState.O:
            return "O Winner";
        case GameState.X:
            return "X Winner";
        case GameState.Playing:
            return "Playing"
    }
}
//probably is a way to type a colour css property
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

export interface TicTacToeState extends ScoreboardCountState, PlayerColourState {
    board: SquareGo[][],
    currentPlayer: Player,
    gameState: GameState,
    fontLoadingState: FontLoadingState
    selectedSquare: RowColumnIndices,
    boardHitTest: {
        request: BoardHitTestReq,
        result: BoardHitTestRes
    }
}
//#endregion
//#region action types
const Finished_Confirmed = "FINISHED_CONFIRMED"
const Play_Again = "PLAY_AGAIN";
const Take_Go = "TAKE_GO"
const Arrow_Press = "ARROW_PRESS"
//#endregion
//#region action creators
export enum ArrowDirection { Up, Down, Left, Right }
export function arrowPressed(direction: ArrowDirection) {
    return {
        type: Arrow_Press,
        direction: direction
    }
}
export function finishedConfirmed() {
    return {
        type: Finished_Confirmed
    }
}
export function playAgain() {
    return {
        type: Play_Again
    }
}
export function takeGo(row: number, column: number) {
    return {
        type: Take_Go,
        row: row,
        column: column
    }
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
export function reducer(state: TicTacToeState = {
    currentPlayer: firstPlayer,
    board: getDefaultBoard(),
    oColour: "yellow",
    xColour: "rgb(255, 51, 153)",
    gameState: GameState.Playing,
    playCount: 0,
    drawCount: 0,
    playerXWinCount: 0,
    fontLoadingState: FontLoadingState.NotStarted,
    selectedSquare: { row: 0, column: 0 },
    boardHitTest: {
        request: null,
        result: null
    }
}, action: AnyAction) {
    switch (action.type) {
        case BOARD_HIT_TEST:
            return {
                ...state,
                boardHitTest: {
                    request: {
                        x: action.x,
                        y: action.y
                    },
                    result: state.boardHitTest.result
                }
            }
        case BOARD_HIT_TEST_RESULT:
            return {
                ...state,
                boardHitTest: {
                    request: state.boardHitTest.request,
                    result: {
                        hit: action.hit,
                        row: action.row,
                        column: action.column
                    }
                }
            }
        case Arrow_Press:
            return {
                ...state,
                selectedSquare: getSelectedSquare(state.selectedSquare, state.board.length, action.direction)
            }
        case FONT_LOADING:
            return {
                ...state,
                fontLoadingState: action.state
            }
        case Finished_Confirmed:
            return {
                ...state,
                gameState: GameState.FinishedConfirmed
            }
        case Play_Again:
            return {
                ...state,
                board: getDefaultBoard(),
                gameState: GameState.Playing,
                selectedSquare: { row: 0, column: 0 }
            }
        case Take_Go:
            if (state.gameState === GameState.Playing) {
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
                var gameState = GameState.Playing;

                var drawCount = state.drawCount;
                var playCount = state.playCount;
                var playerXWinCount = state.playerXWinCount;

                if (legitimatePlay) {
                    nextPlayer = (currentPlayer === Player.X) ? Player.O : Player.X;

                    var winner = checkWinner(newBoard);

                    switch (winner) {
                        case SquareGo.None:
                            if (checkDraw(newBoard)) {
                                gameState = GameState.Draw;
                                playCount++;
                                drawCount++;
                            }
                            break;
                        case SquareGo.X:
                            gameState = GameState.X;
                            playCount++;
                            playerXWinCount++;
                            break;
                        case SquareGo.O:
                            gameState = GameState.O;
                            playCount++;
                            break;
                    }
                }

                return {
                    ...state,
                    selectedSquare: { row: row, column: column },
                    board: newBoard,
                    currentPlayer: nextPlayer,
                    oColour: state.oColour,
                    xColour: state.xColour,
                    gameState: gameState,
                    drawCount: drawCount,
                    playCount: playCount,
                    playerXWinCount: playerXWinCount
                }
            }
            return state;

        default:
            return state;
    }
}
//#endregion
//#endregion
