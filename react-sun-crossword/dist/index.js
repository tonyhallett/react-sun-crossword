"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var react_redux_1 = require("react-redux");
var Modal = require("react-modal");
var storage_1 = require("./helpers/storage");
var $ = require("jquery");
var Radium_1 = require("Radium");
var Transition_1 = require("react-transition-group/Transition");
var Color = require("Color");
var componentBackgroundColor = "lightgray";
var SquareGo;
(function (SquareGo) {
    SquareGo[SquareGo["X"] = 0] = "X";
    SquareGo[SquareGo["O"] = 1] = "O";
    SquareGo[SquareGo["None"] = 2] = "None";
})(SquareGo || (SquareGo = {}));
var Player;
(function (Player) {
    Player[Player["X"] = 0] = "X";
    Player[Player["O"] = 1] = "O";
})(Player || (Player = {}));
var GameState;
(function (GameState) {
    GameState[GameState["X"] = 0] = "X";
    GameState[GameState["O"] = 1] = "O";
    GameState[GameState["Playing"] = 2] = "Playing";
    GameState[GameState["Draw"] = 3] = "Draw";
    GameState[GameState["FinishedConfirmed"] = 4] = "FinishedConfirmed";
})(GameState || (GameState = {}));
var Finished_Confirmed = "FINISHED_CONFIRMED";
var Play_Again = "PLAY_AGAIN";
var Take_Go = "TAKE_GO";
function finishedConfirmed() {
    return {
        type: Finished_Confirmed
    };
}
function playAgain() {
    return {
        type: Play_Again
    };
}
function takeGo(row, column) {
    return {
        type: Take_Go,
        row: row,
        column: column
    };
}
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
function reducer(state, action) {
    if (state === void 0) { state = {
        currentPlayer: firstPlayer,
        board: getDefaultBoard(),
        oColour: "red",
        xColour: "blue",
        gameState: GameState.Playing,
        playCount: 0,
        drawCount: 0,
        playerXWinCount: 0
    }; }
    switch (action.type) {
        case Finished_Confirmed:
            return __assign({}, state, { gameState: GameState.FinishedConfirmed });
        case Play_Again:
            var nextPlayer = (currentPlayer === Player.X) ? Player.O : Player.X;
            return {
                board: getDefaultBoard(),
                currentPlayer: nextPlayer,
                oColour: state.oColour,
                xColour: state.xColour,
                gameState: GameState.Playing,
                drawCount: state.drawCount,
                playCount: state.playCount,
                playerXWinCount: state.playerXWinCount
            };
        case Take_Go:
            var row = action.row;
            var column = action.column;
            var currentPlayer = state.currentPlayer;
            var nextPlayer = (currentPlayer === Player.X) ? Player.O : Player.X;
            var newBoard = state.board.map(function (rowSquares, index) {
                if (index === row) {
                    return rowSquares.map(function (sq, colIndex) {
                        if (colIndex === column) {
                            var squareGo = SquareGo.O;
                            if (currentPlayer === Player.X) {
                                squareGo = SquareGo.X;
                            }
                            return squareGo;
                        }
                        return sq;
                    });
                }
                return rowSquares;
            });
            var winner = checkWinner(newBoard);
            var gameState = GameState.Playing;
            var drawCount = state.drawCount;
            var playCount = state.playCount;
            var playerXWinCount = state.playerXWinCount;
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
            return {
                board: newBoard,
                currentPlayer: nextPlayer,
                oColour: state.oColour,
                xColour: state.xColour,
                gameState: gameState,
                drawCount: drawCount,
                playCount: playCount,
                playerXWinCount: playerXWinCount
            };
        default:
            return state;
    }
}
var TicTacToeSquare = (function (_super) {
    __extends(TicTacToeSquare, _super);
    function TicTacToeSquare(props) {
        var _this = _super.call(this, props) || this;
        _this.squareClicked = function () {
            if (_this.props.canGo) {
                _this.props.takeGo();
            }
        };
        _this.state = { inSignal: null };
        return _this;
    }
    TicTacToeSquare.prototype.componentWillReceiveProps = function (newProps) {
        if (newProps.canGo !== this.props.canGo) {
            this.setState({ inSignal: "in!" });
        }
    };
    TicTacToeSquare.prototype.render = function () {
        var transitionDuration = 1000;
        return React.createElement(ColourChangeTransition, { inSignal: this.state.inSignal, propName: "backgroundColor", timeout: transitionDuration, enterTransition: "background-color " + transitionDuration + "ms linear", exitColour: componentBackgroundColor, change: 0.3, colourChangeType: ColourChangeType.lighten },
            React.createElement("td", { style: {
                    color: this.props.squareGoColour,
                    textAlign: "center", width: 100, height: 100, borderWidth: "1px", borderColor: "black", borderStyle: "solid", fontSize: "80px"
                }, onClick: this.squareClicked }, this.props.squareText));
        //return <td style={{
        //    color: this.props.squareGoColour,
        //    textAlign:"center",width: 100, height: 100, borderWidth: "1px", borderColor: "black", borderStyle: "solid", fontSize: "80px"
        //}} onClick={this.squareClicked}>
        //    {this.props.squareText}
        //    </td>
    };
    return TicTacToeSquare;
}(React.Component));
var ConnectedTicTacToeSquare = react_redux_1.connect(function (state, ownProps) {
    var squareGo = state.board[ownProps.rowIndex][ownProps.colIndex];
    var squareGoColour = "white";
    var squareText = "";
    var canGo = false;
    switch (squareGo) {
        case SquareGo.O:
            squareGoColour = state.oColour;
            squareText = "O";
            break;
        case SquareGo.X:
            squareText = "X";
            squareGoColour = state.xColour;
            break;
        case SquareGo.None:
            canGo = true;
            break;
    }
    if (state.gameState !== GameState.Playing) {
        canGo = false;
    }
    var connectState = {
        squareGoColour: squareGoColour,
        squareText: squareText,
        canGo: canGo
    };
    return connectState;
}, function (dispatch, ownProps) {
    return {
        takeGo: function () {
            dispatch(takeGo(ownProps.rowIndex, ownProps.colIndex));
        }
    };
})(TicTacToeSquare);
var ticTacToeBoardId = "ticTacToeBoard";
var TicTacToeBoard = (function (_super) {
    __extends(TicTacToeBoard, _super);
    function TicTacToeBoard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TicTacToeBoard.prototype.render = function () {
        return React.createElement("table", { id: ticTacToeBoardId, style: { borderCollapse: "collapse", borderWidth: "1px", borderColor: "black", borderStyle: "solid", backgroundColor: componentBackgroundColor } },
            React.createElement("tbody", null, this.props.board.map(function (rowSquares, rowIndex) {
                return React.createElement("tr", { key: rowIndex }, rowSquares.map(function (square, colIndex) {
                    return React.createElement(ConnectedTicTacToeSquare, { key: colIndex, rowIndex: rowIndex, colIndex: colIndex });
                }));
            })));
    };
    return TicTacToeBoard;
}(React.Component));
exports.TicTacToeBoard = TicTacToeBoard;
var ConnectedTicTacToeBoard = react_redux_1.connect(function (state) {
    return {
        board: state.board
    };
})(TicTacToeBoard);
var PlayerView = (function (_super) {
    __extends(PlayerView, _super);
    function PlayerView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayerView.prototype.render = function () {
        return React.createElement("div", { style: { width: 274, padding: 10, borderWidth: "3px", borderStyle: "solid", borderColor: this.props.currentColour, fontWeight: this.props.currentFontWeight, color: this.props.playerColour } },
            React.createElement("div", null, this.props.playerText),
            this.props.isWinner && React.createElement("div", null, "Winner !"));
    };
    return PlayerView;
}(React.Component));
var ConnectedPlayerView = react_redux_1.connect(function (state, ownProps) {
    var playerColour = state.oColour;
    if (ownProps.player === Player.X) {
        playerColour = state.xColour;
    }
    var isWinner = false;
    switch (state.gameState) {
        case GameState.O:
            isWinner = ownProps.player === Player.O;
            break;
        case GameState.X:
            isWinner = ownProps.player === Player.X;
            break;
    }
    var isCurrent = state.currentPlayer === ownProps.player;
    var playerId = ownProps.player === Player.X ? "X" : "O";
    return {
        playerColour: playerColour,
        isWinner: isWinner,
        currentColour: isCurrent ? "green" : "black",
        currentFontWeight: isCurrent ? "bolder" : "normal",
        playerText: "Player " + playerId
    };
})(PlayerView);
function addPaddingToStyle(style) {
    style.paddingTop = 5;
    style.paddingBottom = 5;
    return style;
}
var Scoreboard = (function (_super) {
    __extends(Scoreboard, _super);
    function Scoreboard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Scoreboard.prototype.render = function () {
        var totalWins = this.props.playCount - this.props.drawCount;
        var playerXLossCount = totalWins - this.props.playerXWinCount;
        var playerOWinCount = playerXLossCount;
        var playerOLossCount = this.props.playerXWinCount;
        return React.createElement("table", { style: { borderCollapse: "collapse", borderWidth: "1px", width: "100%", borderColor: "black", borderStyle: "solid", backgroundColor: componentBackgroundColor } },
            React.createElement("thead", null,
                React.createElement("tr", { style: { borderWidth: "1px", borderColor: "black", borderStyle: "solid" } },
                    React.createElement("th", { style: addPaddingToStyle({}) }, "Player"),
                    React.createElement("th", { style: addPaddingToStyle({}) }, "Won"),
                    React.createElement("th", { style: addPaddingToStyle({}) }, "Lost"),
                    React.createElement("th", { style: addPaddingToStyle({}) }, "Drawn"))),
            React.createElement("tbody", null,
                React.createElement(ScoreboardPlayer, { playerColour: this.props.xColour, playerId: "X", playerBoldStyle: this.props.currentPlayer === Player.X ? "bolder" : "normal", drawn: this.props.drawCount, won: this.props.playerXWinCount, lost: playerXLossCount }),
                React.createElement(ScoreboardPlayer, { playerColour: this.props.oColour, playerId: "O", playerBoldStyle: this.props.currentPlayer === Player.O ? "bolder" : "normal", drawn: this.props.drawCount, won: playerOWinCount, lost: playerOLossCount })));
    };
    return Scoreboard;
}(React.Component));
var ConnectedScoreboard = react_redux_1.connect(function (state) {
    var scoreboardState = {
        currentPlayer: state.currentPlayer,
        drawCount: state.drawCount,
        playCount: state.playCount,
        playerXWinCount: state.playerXWinCount,
        oColour: state.oColour,
        xColour: state.xColour
    };
    return scoreboardState;
})(Scoreboard);
var ScoreboardPlayer = (function (_super) {
    __extends(ScoreboardPlayer, _super);
    function ScoreboardPlayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScoreboardPlayer.prototype.render = function () {
        return React.createElement("tr", { style: { borderWidth: "1px", borderColor: "black", borderStyle: "solid" } },
            React.createElement("td", { style: addPaddingToStyle({ textAlign: "center", fontWeight: this.props.playerBoldStyle, color: this.props.playerColour }) }, this.props.playerId),
            React.createElement("td", { style: addPaddingToStyle({ textAlign: "center" }) }, this.props.won),
            React.createElement("td", { style: addPaddingToStyle({ textAlign: "center" }) }, this.props.lost),
            React.createElement("td", { style: addPaddingToStyle({ textAlign: "center" }) }, this.props.drawn));
    };
    return ScoreboardPlayer;
}(React.Component));
var ElementDimensionsChoice;
(function (ElementDimensionsChoice) {
    ElementDimensionsChoice[ElementDimensionsChoice["Content"] = 0] = "Content";
    ElementDimensionsChoice[ElementDimensionsChoice["PaddingAndBorder"] = 1] = "PaddingAndBorder";
    ElementDimensionsChoice[ElementDimensionsChoice["Padding"] = 2] = "Padding";
    ElementDimensionsChoice[ElementDimensionsChoice["PaddingBorderMargin"] = 3] = "PaddingBorderMargin";
})(ElementDimensionsChoice || (ElementDimensionsChoice = {}));
//to consider box sizing - another day !
//http://blog.jquery.com/2012/08/16/jquery-1-8-box-sizing-width-csswidth-and-outerwidth/
function getElementWidth(element, dimensionsChoice) {
    var $el = $(element);
    switch (dimensionsChoice) {
        case ElementDimensionsChoice.PaddingAndBorder:
            return $el.outerWidth(false);
        case ElementDimensionsChoice.Padding:
            return $el.innerWidth();
        case ElementDimensionsChoice.PaddingBorderMargin:
            return $el.outerWidth(true);
        case ElementDimensionsChoice.Content:
            return $el.width();
    }
}
function getElementHeight(element, dimensionsChoice) {
    var $el = $(element);
    switch (dimensionsChoice) {
        case ElementDimensionsChoice.PaddingAndBorder:
            return $el.outerHeight(false);
        case ElementDimensionsChoice.Padding:
            return $el.innerHeight();
        case ElementDimensionsChoice.PaddingBorderMargin:
            return $el.outerHeight(true);
        case ElementDimensionsChoice.Content:
            return $el.height();
    }
}
function getElementEdgeLength(element, lengthType) {
    var $el = $(element);
    return parseFloat($el.css(lengthType));
}
function getOverlay(element, dimensionsChoice) {
    if (dimensionsChoice === void 0) { dimensionsChoice = ElementDimensionsChoice.PaddingAndBorder; }
    var $element = $(element);
    var offset = $element.offset(); //border-box
    var left = offset.left;
    var top = offset.top;
    switch (dimensionsChoice) {
        case ElementDimensionsChoice.Content:
            //need function to remove the pixel
            var paddingLeft = getElementEdgeLength(element, "padding-left");
            var borderLeft = getElementEdgeLength(element, "border-left");
            var paddingTop = getElementEdgeLength(element, "padding-top");
            var borderTop = getElementEdgeLength(element, "border-top");
            top = top + paddingTop + borderTop;
            left = left + paddingLeft + borderLeft;
            break;
        case ElementDimensionsChoice.Padding:
            var borderLeft = getElementEdgeLength(element, "border-left");
            var borderTop = getElementEdgeLength(element, "border-top");
            top = top + borderTop;
            left = left + borderLeft;
            break;
        case ElementDimensionsChoice.PaddingAndBorder:
            //no change
            break;
        case ElementDimensionsChoice.PaddingBorderMargin:
            var marginLeft = getElementEdgeLength(element, "margin-left");
            var marginTop = getElementEdgeLength(element, "margin-top");
            top = top - marginTop;
            left = left - marginLeft;
            break;
    }
    return {
        left: left,
        top: top,
        width: getElementWidth(element, dimensionsChoice),
        height: getElementHeight(element, dimensionsChoice)
    };
}
function getTime(date) {
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() +
        ":" + date.getMilliseconds();
}
var TransitionHelper = (function (_super) {
    __extends(TransitionHelper, _super);
    function TransitionHelper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onExiting = function () {
        };
        _this.onEntering = function () {
        };
        return _this;
    }
    TransitionHelper.prototype.render = function () {
        var _this = this;
        //should remove that do not pertain
        console.log("Transition helper rendering");
        var transition = React.createElement(Transition_1.default, __assign({}, this.props, { onEntering: this.onEntering, onExiting: this.onExiting }), function (state) {
            console.log("In transition: state is " + state + ", " + getTime(new Date()));
            var style = {};
            switch (state) {
                case "entering":
                case "entered":
                    style = __assign({}, _this.props.enterStyle);
                    style.transition = _this.props.enterTransition;
                    break;
                case "exiting":
                case "exited":
                    style = __assign({}, _this.props.exitStyle);
                    style.transition = _this.props.exitTransition ? _this.props.exitTransition : _this.props.enterTransition;
                    break;
            }
            //should use the isValidElement guard https://stackoverflow.com/questions/42261783/how-to-assign-the-correct-typing-to-react-cloneelement-when-giving-properties-to
            var childElement = _this.props.children;
            var childStyle = childElement.props.style;
            var newStyle = __assign({}, childStyle, style);
            console.log("TransitionHelper applied style");
            console.log(newStyle);
            var newProps = {
                style: newStyle
            };
            var clonedElement = React.cloneElement(childElement, newProps);
            return clonedElement;
        });
        return transition;
    };
    return TransitionHelper;
}(React.Component));
var ColourChangeType;
(function (ColourChangeType) {
    ColourChangeType[ColourChangeType["lighten"] = 0] = "lighten";
    ColourChangeType[ColourChangeType["darken"] = 1] = "darken";
    ColourChangeType[ColourChangeType["saturate"] = 2] = "saturate";
    ColourChangeType[ColourChangeType["desaturate"] = 3] = "desaturate";
    ColourChangeType[ColourChangeType["fade"] = 4] = "fade";
    ColourChangeType[ColourChangeType["opaquer"] = 5] = "opaquer";
})(ColourChangeType || (ColourChangeType = {}));
var ColourChangeTransition = (function (_super) {
    __extends(ColourChangeTransition, _super);
    function ColourChangeTransition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColourChangeTransition.prototype.render = function () {
        var enterStyle = {};
        var exitColor = Color(this.props.exitColour);
        var enterColor;
        var change = this.props.change;
        //note that whiten/blacken is not css3!
        switch (this.props.colourChangeType) {
            case ColourChangeType.darken:
                enterColor = exitColor.darken(change);
                break;
            case ColourChangeType.desaturate:
                enterColor = exitColor.desaturate(change);
                break;
            case ColourChangeType.fade:
                enterColor = exitColor.fade(change);
                break;
            case ColourChangeType.lighten:
                enterColor = exitColor.lighten(change);
                break;
            case ColourChangeType.opaquer:
                enterColor = exitColor.opaquer(change);
                break;
            case ColourChangeType.saturate:
                enterColor = exitColor.saturate(change);
                break;
        }
        var colorString = enterColor.toString();
        enterStyle[this.props.propName] = colorString; //seems that once change to different model cannot go back
        var exitStyle = {};
        var exitColourString = exitColor.toString();
        exitStyle[this.props.propName] = exitColourString;
        return React.createElement(AutoOutTransition, __assign({ enterStyle: enterStyle, exitStyle: exitStyle }, this.props));
    };
    return ColourChangeTransition;
}(React.Component));
var AutoOutTransition = (function (_super) {
    __extends(AutoOutTransition, _super);
    function AutoOutTransition(props) {
        var _this = _super.call(this, props) || this;
        _this.initialRender = true;
        _this.onEntered = function (node, isAppearing) {
            _this.props.onEntered ? _this.props.onEntered(node, isAppearing) : void 0;
            _this.setState({ entered: true });
        };
        _this.onExited = function (node) {
            _this.props.onExited ? _this.props.onExited(node) : void 0;
            _this.setState({ entered: false, in: false });
        };
        _this.state = { entered: false, in: false };
        return _this;
    }
    AutoOutTransition.prototype.componentWillReceiveProps = function (newProps) {
        if (newProps.inSignal !== null) {
            if (newProps.inSignal !== this.props.inSignal) {
                this.setState({ in: true });
            }
        }
        else {
            this.setState({ in: false });
        }
    };
    AutoOutTransition.prototype.render = function () {
        //might only need onExited and in state ?
        var actuallyIn = this.initialRender ? this.props.inSignal !== null : (this.state.in ? (this.state.entered ? false : true) : false);
        var _a = this.props, onEntered = _a.onEntered, onExited = _a.onExited, inn = _a["in"], passThroughProps = __rest(_a, ["onEntered", "onExited", "in"]);
        this.initialRender = false;
        return React.createElement(TransitionHelper, __assign({ onExited: this.onExited, onEntered: this.onEntered, in: actuallyIn }, passThroughProps));
    };
    return AutoOutTransition;
}(React.Component));
var Transitioned = (function (_super) {
    __extends(Transitioned, _super);
    function Transitioned(props) {
        var _this = _super.call(this, props) || this;
        _this.setIn = function () {
            if (_this.state.inSignal === null) {
                _this.setState({ inSignal: 0 });
            }
            else {
                _this.setState({ inSignal: _this.state.inSignal + 1 });
            }
        };
        _this.setOut = function () {
            _this.setState({ inSignal: null });
        };
        _this.changeColour = function () {
            _this.setState({ exitColour: "red" });
        };
        _this.state = { inSignal: 0, exitColour: "yellow" };
        return _this;
    }
    Transitioned.prototype.render = function () {
        var duration = 5000;
        return React.createElement("div", null,
            React.createElement("button", { onClick: this.setIn }, "In"),
            React.createElement("button", { onClick: this.setOut }, "Out"),
            React.createElement("button", { onClick: this.changeColour }, "Change colour"),
            React.createElement(ColourChangeTransition, { appear: true, inSignal: this.state.inSignal, propName: "backgroundColor", exitColour: this.state.exitColour, colourChangeType: ColourChangeType.desaturate, change: 0.6, enterTransition: "background-color " + duration + "ms linear", timeout: duration },
                React.createElement("div", { style: {
                        height: 300, width: 300
                    } })));
    };
    return Transitioned;
}(React.Component));
var duration = 5000;
var defaultStyle = {
    transition: "background-color " + duration + "ms linear",
};
var transitionStyles = {
    entering: { backgroundColor: "orange" },
    entered: { backgroundColor: "orange" },
    exiting: { backgroundColor: "yellow" },
    exited: { backgroundColor: "yellow" }
};
var TicTacToeApp = (function (_super) {
    __extends(TicTacToeApp, _super);
    function TicTacToeApp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.modalShouldOpen = function () {
            var gameState = _this.props.gameState;
            return gameState === GameState.Draw || gameState === GameState.O || gameState === GameState.X;
        };
        _this.getModalStyle = function () {
            var testOverlay = document.querySelector("#" + ticTacToeBoardId);
            return {
                overlay: getOverlay(testOverlay)
            };
        };
        return _this;
    }
    TicTacToeApp.prototype.render = function () {
        //<ConnectedTicTacToeBoard />
        /*
        <ModalCover elementSelector={"#" + ticTacToeBoardId}  isOpen={this.modalShouldOpen()} onRequestClose={this.props.finishedConfirmed}>
                            <div style={{ margin: "0 auto", width: "80%", textAlign: "center" }}>
                                {this.getWinDrawMessage()}
                            </div>
                        </ModalCover>
        */
        return React.createElement(Radium_1.StyleRoot, null,
            React.createElement(Radium_1.Style, { rules: {
                    body: {
                        margin: 0,
                        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
                    },
                    mediaQueries: {
                        '(max-width: 600px)': {
                            body: {
                                background: 'gray'
                            }
                        },
                        '(max-width: 500px)': {
                            body: {
                                background: 'blue'
                            },
                            'p, h1': {
                                color: 'white'
                            }
                        }
                    }
                } }),
            React.createElement(VerticallyCenteredContainer, { backgroundColor: "orange" },
                React.createElement(HorizontalCenter, null,
                    React.createElement("div", { style: { backgroundColor: "gray", padding: 10 } },
                        React.createElement(Transitioned, null),
                        React.createElement(Transition_1.default, { in: true, appear: true, timeout: duration }, function (state) {
                            console.log("Fade state " + state + ", " + getTime(new Date()));
                            return React.createElement("div", { style: __assign({}, defaultStyle, transitionStyles[state]) },
                                React.createElement("div", { style: { width: 300, height: 300 } }, "Fade me"));
                        }),
                        React.createElement("div", { style: { display: "inline-block" } },
                            React.createElement("div", { style: { marginTop: 10, marginBottom: 10 } },
                                React.createElement(ConnectedScoreboard, null)),
                            React.createElement("button", { style: { marginTop: 10, paddingTop: 10, paddingBottom: 10, width: "100%" }, onClick: this.props.playAgain }, "Play again"))))));
    };
    TicTacToeApp.prototype.getWinDrawMessage = function () {
        var message = "Game drawn";
        switch (this.props.gameState) {
            case GameState.X:
                message = "Player X Won !";
                break;
            case GameState.O:
                message = "Player O Won !";
                break;
        }
        return message;
    };
    return TicTacToeApp;
}(React.Component));
var HorizontalCenter = (function (_super) {
    __extends(HorizontalCenter, _super);
    function HorizontalCenter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HorizontalCenter.prototype.render = function () {
        return React.createElement("div", { style: { display: "table", margin: "0 auto" } }, this.props.children);
    };
    return HorizontalCenter;
}(React.Component));
//if this works then will want a Modal class that will overlay an element
var ModalReady = (function (_super) {
    __extends(ModalReady, _super);
    function ModalReady(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { ready: false };
        return _this;
    }
    ModalReady.prototype.componentDidMount = function () {
        this.setState({ ready: true });
    };
    ModalReady.prototype.render = function () {
        if (!this.state.ready) {
            return null;
        }
        return React.createElement(Modal, __assign({ style: this.props.getStyle() }, this.props));
    };
    return ModalReady;
}(React.Component));
var ModalCover = (function (_super) {
    __extends(ModalCover, _super);
    function ModalCover() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getStyle = function () {
            return {
                overlay: getOverlay(document.querySelector(_this.props.elementSelector), _this.props.coverType),
                content: _this.props.contentStyle
            };
        };
        return _this;
    }
    ModalCover.prototype.render = function () {
        return React.createElement(ModalReady, __assign({}, this.props, { getStyle: this.getStyle }));
    };
    return ModalCover;
}(React.Component));
ModalCover.defaultProps = {
    coverType: ElementDimensionsChoice.PaddingAndBorder
};
var VerticallyCenteredContainer = (function (_super) {
    __extends(VerticallyCenteredContainer, _super);
    function VerticallyCenteredContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VerticallyCenteredContainer.prototype.render = function () {
        var containerStyle = {
            display: "table",
            position: "absolute",
            height: "100%",
            width: " 100%"
        };
        if (this.props.backgroundColor) {
            containerStyle.backgroundColor = this.props.backgroundColor;
        }
        return React.createElement("div", { style: containerStyle },
            React.createElement("div", { style: {
                    display: "table-cell",
                    verticalAlign: "middle"
                } }, this.props.children));
    };
    return VerticallyCenteredContainer;
}(React.Component));
var ConnectedTicTacToeApp = react_redux_1.connect(function (state) {
    return {
        gameState: state.gameState
    };
}, function (dispatch) {
    return {
        playAgain: function () {
            dispatch(playAgain());
        },
        finishedConfirmed: function () {
            dispatch(finishedConfirmed());
        }
    };
})(TicTacToeApp);
var store = storage_1.createLocalStorageStore(reducer);
ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(ConnectedTicTacToeApp, null)), document.getElementById("example"));
//# sourceMappingURL=index.js.map