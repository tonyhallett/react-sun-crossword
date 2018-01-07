"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var webFontLoader_1 = require("./webFontLoader");
var webFontLoader_2 = require("./webFontLoader");
exports.FontLoadingState = webFontLoader_2.FontLoadingState;
//#region redux
//#region redux state
var BOARD_HIT_TEST = "Board_Hit_Test";
function boardHitTest(x, y) {
    return {
        type: BOARD_HIT_TEST,
        x: x,
        y: y
    };
}
exports.boardHitTest = boardHitTest;
var BOARD_HIT_TEST_RESULT = "Board_Hit_Test_Result";
function boardHitTestResult(hit, row, column) {
    return {
        type: BOARD_HIT_TEST_RESULT,
        hit: hit,
        row: row,
        column: column
    };
}
exports.boardHitTestResult = boardHitTestResult;
var SquareGo;
(function (SquareGo) {
    SquareGo[SquareGo["X"] = 0] = "X";
    SquareGo[SquareGo["O"] = 1] = "O";
    SquareGo[SquareGo["None"] = 2] = "None";
})(SquareGo = exports.SquareGo || (exports.SquareGo = {}));
var Player;
(function (Player) {
    Player[Player["X"] = 0] = "X";
    Player[Player["O"] = 1] = "O";
})(Player = exports.Player || (exports.Player = {}));
var GameState;
(function (GameState) {
    GameState[GameState["X"] = 0] = "X";
    GameState[GameState["O"] = 1] = "O";
    GameState[GameState["Playing"] = 2] = "Playing";
    GameState[GameState["Draw"] = 3] = "Draw";
    GameState[GameState["FinishedConfirmed"] = 4] = "FinishedConfirmed";
})(GameState = exports.GameState || (exports.GameState = {}));
function gameStateString(gameState) {
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
            return "Playing";
    }
}
//#endregion
//#region action types
var Finished_Confirmed = "FINISHED_CONFIRMED";
var Play_Again = "PLAY_AGAIN";
var Take_Go = "TAKE_GO";
var Arrow_Press = "ARROW_PRESS";
//#endregion
//#region action creators
var ArrowDirection;
(function (ArrowDirection) {
    ArrowDirection[ArrowDirection["Up"] = 0] = "Up";
    ArrowDirection[ArrowDirection["Down"] = 1] = "Down";
    ArrowDirection[ArrowDirection["Left"] = 2] = "Left";
    ArrowDirection[ArrowDirection["Right"] = 3] = "Right";
})(ArrowDirection = exports.ArrowDirection || (exports.ArrowDirection = {}));
function arrowPressed(direction) {
    return {
        type: Arrow_Press,
        direction: direction
    };
}
exports.arrowPressed = arrowPressed;
function finishedConfirmed() {
    return {
        type: Finished_Confirmed
    };
}
exports.finishedConfirmed = finishedConfirmed;
function playAgain() {
    return {
        type: Play_Again
    };
}
exports.playAgain = playAgain;
function takeGo(row, column) {
    return {
        type: Take_Go,
        row: row,
        column: column
    };
}
exports.takeGo = takeGo;
//#endregion
//#region state defaults
var numRowsAndColumns = 4;
function getDefaultBoard() {
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
function checkWinner(board) {
    var winner = checkRowsWinner(board);
    if (winner === SquareGo.None) {
        winner = checkColumnsWinner(board);
        if (winner === SquareGo.None) {
            winner = checkDiagonalWinner(board);
        }
    }
    return winner;
}
function checkRowsWinner(board) {
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
            }
            else {
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
function checkColumnsWinner(board) {
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
            }
            else {
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
function checkDiagonalWinner(board) {
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
        }
        else {
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
            }
            else {
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
function checkDraw(board) {
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
function getSelectedSquare(currentSelectedSquare, numSquares, direction) {
    if (currentSelectedSquare) {
        var newColumn;
        var newRow;
        var currentColumn = currentSelectedSquare.column;
        var currentRow = currentSelectedSquare.row;
        switch (direction) {
            case ArrowDirection.Left:
                newRow = currentRow;
                if (currentColumn === 0) {
                    newColumn = numSquares - 1;
                }
                else {
                    newColumn = currentColumn - 1;
                }
                break;
            case ArrowDirection.Right:
                newRow = currentRow;
                if (currentColumn === numSquares - 1) {
                    newColumn = 0;
                }
                else {
                    newColumn = currentColumn + 1;
                }
                break;
            case ArrowDirection.Up:
                newColumn = currentColumn;
                if (currentRow === 0) {
                    newRow = numSquares - 1;
                }
                else {
                    newRow = currentRow - 1;
                }
                break;
            case ArrowDirection.Down:
                newColumn = currentColumn;
                if (currentRow === numSquares - 1) {
                    newRow = 0;
                }
                else {
                    newRow = currentRow + 1;
                }
                break;
        }
        return { column: newColumn, row: newRow };
    }
    else {
        return { column: 0, row: 0 };
    }
}
function reducer(state, action) {
    if (state === void 0) { state = {
        currentPlayer: firstPlayer,
        board: getDefaultBoard(),
        oColour: "yellow",
        xColour: "rgb(255, 51, 153)",
        gameState: GameState.Playing,
        playCount: 0,
        drawCount: 0,
        playerXWinCount: 0,
        fontLoadingState: webFontLoader_1.FontLoadingState.NotStarted,
        selectedSquare: { row: 0, column: 0 },
        boardHitTest: {
            request: null,
            result: null
        }
    }; }
    switch (action.type) {
        case BOARD_HIT_TEST:
            return __assign({}, state, { boardHitTest: {
                    request: {
                        x: action.x,
                        y: action.y
                    },
                    result: state.boardHitTest.result
                } });
        case BOARD_HIT_TEST_RESULT:
            return __assign({}, state, { boardHitTest: {
                    request: state.boardHitTest.request,
                    result: {
                        hit: action.hit,
                        row: action.row,
                        column: action.column
                    }
                } });
        case Arrow_Press:
            return __assign({}, state, { selectedSquare: getSelectedSquare(state.selectedSquare, state.board.length, action.direction) });
        case webFontLoader_1.FONT_LOADING:
            return __assign({}, state, { fontLoadingState: action.state });
        case Finished_Confirmed:
            return __assign({}, state, { gameState: GameState.FinishedConfirmed });
        case Play_Again:
            return __assign({}, state, { board: getDefaultBoard(), gameState: GameState.Playing, selectedSquare: { row: 0, column: 0 } });
        case Take_Go:
            if (state.gameState === GameState.Playing) {
                var row = action.row;
                var column = action.column;
                var currentPlayer = state.currentPlayer;
                var nextPlayer = currentPlayer;
                var legitimatePlay = false;
                var newBoard = state.board.map(function (rowSquares, index) {
                    if (index === row) {
                        return rowSquares.map(function (sq, colIndex) {
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
                        });
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
                return __assign({}, state, { selectedSquare: { row: row, column: column }, board: newBoard, currentPlayer: nextPlayer, oColour: state.oColour, xColour: state.xColour, gameState: gameState, drawCount: drawCount, playCount: playCount, playerXWinCount: playerXWinCount });
            }
            return state;
        default:
            return state;
    }
}
exports.reducer = reducer;
//#endregion
//#endregion
//# sourceMappingURL=reducer.js.map