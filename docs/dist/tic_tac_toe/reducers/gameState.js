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
var actions_1 = require("../actions");
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
var PlayState;
(function (PlayState) {
    PlayState[PlayState["X"] = 0] = "X";
    PlayState[PlayState["O"] = 1] = "O";
    PlayState[PlayState["Playing"] = 2] = "Playing";
    PlayState[PlayState["Draw"] = 3] = "Draw";
    PlayState[PlayState["FinishedConfirmed"] = 4] = "FinishedConfirmed";
})(PlayState = exports.PlayState || (exports.PlayState = {}));
//#region defaults
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
function getDefaultSelectedSquare() {
    return { row: 0, column: 0 };
}
//#endregion
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
            case actions_1.ArrowDirection.Left:
                newRow = currentRow;
                if (currentColumn === 0) {
                    newColumn = numSquares - 1;
                }
                else {
                    newColumn = currentColumn - 1;
                }
                break;
            case actions_1.ArrowDirection.Right:
                newRow = currentRow;
                if (currentColumn === numSquares - 1) {
                    newColumn = 0;
                }
                else {
                    newColumn = currentColumn + 1;
                }
                break;
            case actions_1.ArrowDirection.Up:
                newColumn = currentColumn;
                if (currentRow === 0) {
                    newRow = numSquares - 1;
                }
                else {
                    newRow = currentRow - 1;
                }
                break;
            case actions_1.ArrowDirection.Down:
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
function gameStateReducer(state, action) {
    if (state === void 0) { state = {
        currentPlayer: firstPlayer,
        board: getDefaultBoard(),
        playState: PlayState.Playing,
        playCount: 0,
        drawCount: 0,
        playerXWinCount: 0,
        selectedSquare: getDefaultSelectedSquare(),
    }; }
    switch (action.type) {
        case actions_1.Arrow_Press:
            return __assign({}, state, { selectedSquare: getSelectedSquare(state.selectedSquare, state.board.length, action.direction) });
        case actions_1.Finished_Confirmed:
            return __assign({}, state, { playState: PlayState.FinishedConfirmed });
        case actions_1.Play_Again:
            return __assign({}, state, { board: getDefaultBoard(), playState: PlayState.Playing, selectedSquare: getDefaultSelectedSquare() });
        case actions_1.Take_Go:
            if (state.playState === PlayState.Playing) {
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
                };
            }
            else {
                return state;
            }
        default:
            return state;
    }
}
exports.gameStateReducer = gameStateReducer;
//# sourceMappingURL=gameState.js.map