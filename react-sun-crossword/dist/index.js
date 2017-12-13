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
var Radium = require("Radium");
var Transition_1 = require("react-transition-group/Transition");
var Color = require("Color");
var react_animations_1 = require("react-animations");
var componentBackgroundColor = "lightgray";
//#region redux
//#region redux state
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
//#endregion
//#region action types
var Finished_Confirmed = "FINISHED_CONFIRMED";
var Play_Again = "PLAY_AGAIN";
var Take_Go = "TAKE_GO";
//#endregion
//#region action creators
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
function reducer(state, action) {
    if (state === void 0) { state = {
        currentPlayer: firstPlayer,
        board: getDefaultBoard(),
        oColour: "yellow",
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
//#endregion
//#endregion
//#region Layout Components
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
//#endregion
//#region Modal
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
function withInOnMount(Component) {
    var inOnMount = (function (_super) {
        __extends(InOnMount, _super);
        function InOnMount(props) {
            var _this = _super.call(this, props) || this;
            _this.inOnMount = false;
            _this.onEnter = function (node) {
                if (_this.props.onEnter) {
                    _this.props.onEnter(node, _this.inOnMount);
                }
            };
            _this.onEntering = function (node) {
                if (_this.props.onEntering) {
                    _this.props.onEntering(node, _this.inOnMount);
                }
            };
            _this.onEntered = function (node) {
                if (_this.props.onEntered) {
                    _this.props.onEntered(node, _this.inOnMount);
                }
                _this.inOnMount = false;
            };
            var isIn = false;
            if (props.in) {
                if (props.appear) {
                    _this.inOnMount = true;
                }
                else {
                    isIn = true; //not sure ....
                }
            }
            _this.state = { in: isIn };
            return _this;
        }
        InOnMount.prototype.componentDidMount = function () {
            var self = this;
            if (this.inOnMount) {
                this.requestAnimationStart(function () { return self.setState({ in: true }); });
            }
        };
        InOnMount.prototype.requestAnimationStart = function (callback) {
            // Feature detect rAF, fallback to setTimeout
            if (window.requestAnimationFrame) {
                // Chrome and Safari have a bug where calling rAF once returns the current
                // frame instead of the next frame, so we need to call a double rAF here.
                // See https://crbug.com/675795 for more.
                window.requestAnimationFrame(function () {
                    window.requestAnimationFrame(callback);
                });
            }
            else {
                setTimeout(callback, 0);
            }
        };
        InOnMount.prototype.render = function () {
            var _a = this.props, inn = _a["in"], onEnter = _a.onEnter, onEntering = _a.onEntering, onExiting = _a.onExiting, appear = _a.appear, passThroughProps = __rest(_a, ["in", "onEnter", "onEntering", "onExiting", "appear"]);
            var transitionProps = __assign({}, passThroughProps, { in: this.state.in, onEnter: this.onEnter, onEntering: this.onEntering, onEntered: this.onEntered });
            return React.createElement(Component, __assign({}, transitionProps));
        };
        InOnMount.prototype.componentWillReceiveProps = function (newProps) {
            this.setState({ in: newProps.in });
        };
        return InOnMount;
    }(React.Component));
    return inOnMount;
}
function withAutoOut(Component) {
    var autoOut = (function (_super) {
        __extends(AutoOutTransition, _super);
        function AutoOutTransition(props) {
            var _this = _super.call(this, props) || this;
            _this.onEntered = function (node, isAppearing) {
                _this.props.onEntered ? _this.props.onEntered(node, isAppearing) : void 0;
                _this.setState({ in: false });
            };
            _this.state = { in: props.inSignal !== null };
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
            var _a = this.props, onEntered = _a.onEntered, inn = _a["in"], inSignal = _a.inSignal, passThroughProps = __rest(_a, ["onEntered", "in", "inSignal"]);
            var transitionProps = __assign({}, passThroughProps, { onEntered: this.onEntered, in: this.state.in });
            return React.createElement(Component, __assign({}, transitionProps));
        };
        return AutoOutTransition;
    }(React.Component));
    return autoOut;
}
function withTransitionHelper(Component) {
    var transitionHelper = (function (_super) {
        __extends(TransitionHelper, _super);
        function TransitionHelper() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TransitionHelper.prototype.render = function () {
            var _this = this;
            var _a = this.props, enterStyle = _a.enterStyle, exitStyle = _a.exitStyle, enterTransition = _a.enterTransition, exitTransition = _a.exitTransition, passThroughProps = __rest(_a, ["enterStyle", "exitStyle", "enterTransition", "exitTransition"]);
            var transition = React.createElement(Component, __assign({}, passThroughProps), function (state) {
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
    return transitionHelper;
}
function withTransitionHelperFn(Component) {
    var transitionHelper = (function (_super) {
        __extends(TransitionHelper, _super);
        function TransitionHelper() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TransitionHelper.prototype.render = function () {
            var _this = this;
            var _a = this.props, enterStyle = _a.enterStyle, exitStyle = _a.exitStyle, enterTransition = _a.enterTransition, exitTransition = _a.exitTransition, passThroughProps = __rest(_a, ["enterStyle", "exitStyle", "enterTransition", "exitTransition"]);
            var transition = React.createElement(Component, __assign({}, passThroughProps), function (state) {
                var stateStyle = {};
                var stateTransition = "";
                switch (state) {
                    case "entering":
                    case "entered":
                        stateTransition = _this.props.enterTransition;
                        stateStyle = __assign({}, _this.props.enterStyle);
                        break;
                    case "exiting":
                    case "exited":
                        stateTransition = _this.props.exitTransition ? _this.props.exitTransition : _this.props.enterTransition;
                        stateStyle = __assign({}, _this.props.exitStyle);
                        break;
                }
                if (typeof _this.props.children === 'function') {
                    return _this.props.children(state, passThroughProps, stateStyle, stateTransition);
                }
                else {
                    throw new Error("withTransitionHelperFn requires child function");
                }
            });
            return transition;
        };
        return TransitionHelper;
    }(React.Component));
    return transitionHelper;
}
//#endregion
//#region ColourChangeTransition
var ColourChangeType;
(function (ColourChangeType) {
    ColourChangeType[ColourChangeType["lighten"] = 0] = "lighten";
    ColourChangeType[ColourChangeType["darken"] = 1] = "darken";
    ColourChangeType[ColourChangeType["saturate"] = 2] = "saturate";
    ColourChangeType[ColourChangeType["desaturate"] = 3] = "desaturate";
    ColourChangeType[ColourChangeType["fade"] = 4] = "fade";
    ColourChangeType[ColourChangeType["opaquer"] = 5] = "opaquer";
})(ColourChangeType || (ColourChangeType = {}));
function withColourChangeTransitionFn(Component) {
    var TransitionHelper = withTransitionHelperFn(Component);
    var colourChangeTransition = (function (_super) {
        __extends(ColourChangeTransition, _super);
        function ColourChangeTransition() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ColourChangeTransition.prototype.render = function () {
            var enterStyle = {};
            var exitColor = Color(this.props.exitColour);
            var enterColor;
            var changeAmount = this.props.change;
            //note that whiten/blacken is not css3!
            switch (this.props.colourChangeType) {
                case ColourChangeType.darken:
                    enterColor = exitColor.darken(changeAmount);
                    break;
                case ColourChangeType.desaturate:
                    enterColor = exitColor.desaturate(changeAmount);
                    break;
                case ColourChangeType.fade:
                    enterColor = exitColor.fade(changeAmount);
                    break;
                case ColourChangeType.lighten:
                    enterColor = exitColor.lighten(changeAmount);
                    break;
                case ColourChangeType.opaquer:
                    enterColor = exitColor.opaquer(changeAmount);
                    break;
                case ColourChangeType.saturate:
                    enterColor = exitColor.saturate(changeAmount);
                    break;
            }
            var colorString = enterColor.toString();
            enterStyle[this.props.propName] = colorString; //seems that once change to different model cannot go back
            var exitStyle = {};
            var exitColourString = exitColor.toString();
            exitStyle[this.props.propName] = exitColourString;
            var _a = this.props, change = _a.change, exitColour = _a.exitColour, colourChangeType = _a.colourChangeType, propName = _a.propName, passThroughProps = __rest(_a, ["change", "exitColour", "colourChangeType", "propName"]);
            return React.createElement(TransitionHelper, __assign({ enterStyle: enterStyle, exitStyle: exitStyle }, this.props));
        };
        return ColourChangeTransition;
    }(React.Component));
    return colourChangeTransition;
}
function withColourChangeTransition(Component) {
    var TransitionHelper = withTransitionHelper(Component);
    var colourChangeTransition = (function (_super) {
        __extends(ColourChangeTransition, _super);
        function ColourChangeTransition() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ColourChangeTransition.prototype.render = function () {
            var enterStyle = {};
            var exitColor = Color(this.props.exitColour);
            var enterColor;
            var changeAmount = this.props.change;
            //note that whiten/blacken is not css3!
            switch (this.props.colourChangeType) {
                case ColourChangeType.darken:
                    enterColor = exitColor.darken(changeAmount);
                    break;
                case ColourChangeType.desaturate:
                    enterColor = exitColor.desaturate(changeAmount);
                    break;
                case ColourChangeType.fade:
                    enterColor = exitColor.fade(changeAmount);
                    break;
                case ColourChangeType.lighten:
                    enterColor = exitColor.lighten(changeAmount);
                    break;
                case ColourChangeType.opaquer:
                    enterColor = exitColor.opaquer(changeAmount);
                    break;
                case ColourChangeType.saturate:
                    enterColor = exitColor.saturate(changeAmount);
                    break;
            }
            var colorString = enterColor.toString();
            enterStyle[this.props.propName] = colorString; //seems that once change to different model cannot go back
            var exitStyle = {};
            var exitColourString = exitColor.toString();
            exitStyle[this.props.propName] = exitColourString;
            var _a = this.props, change = _a.change, exitColour = _a.exitColour, colourChangeType = _a.colourChangeType, propName = _a.propName, passThroughProps = __rest(_a, ["change", "exitColour", "colourChangeType", "propName"]);
            return React.createElement(TransitionHelper, __assign({ enterStyle: enterStyle, exitStyle: exitStyle }, this.props));
        };
        return ColourChangeTransition;
    }(React.Component));
    return colourChangeTransition;
}
//should change to enable not using function and having component to merge transition style with default Style provided as property
function withPulse(Component) {
    function scale3d(a, b, c) {
        return 'scale3d(' + a + ', ' + b + ', ' + c + ')';
    }
    ;
    var pulse = (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.render = function () {
            var _this = this;
            var fromTo = scale3d(1, 1, 1);
            var pulse = {
                from: {
                    transform: fromTo
                },
                '50%': {
                    transform: scale3d(this.props.pulseAmount, this.props.pulseAmount, this.props.pulseAmount)
                },
                to: {
                    transform: fromTo
                }
            };
            //passthrough to do
            return React.createElement(Component, __assign({}, this.props), function (state, additionalProps) {
                var transitionStyle = {};
                switch (state) {
                    case "entering":
                    case "entered":
                        transitionStyle = {
                            animationDuration: _this.props.timeout + "ms",
                            animationName: Radium.keyframes(pulse)
                        };
                        break;
                }
                return _this.props.children(state, additionalProps, transitionStyle);
            });
        };
        return class_1;
    }(React.Component));
    return pulse;
}
var defaultProvider = function (state, props) {
    return props;
};
function transitionHelperFn(cb, provider) {
    var transitionHelper = function (state, props) {
        var res = provider(state, props);
        var stateStyle;
        var stateTransition;
        switch (state) {
            case "entering":
            case "entered":
                stateStyle = res.enterStyle;
                stateTransition = res.enterTransition;
                break;
            case "exiting":
            case "exited":
                stateStyle = res.exitStyle;
                stateTransition = res.exitTransition ? res.exitTransition : res.enterTransition;
                break;
        }
        return cb(state, props, stateStyle, stateTransition);
    };
    return transitionHelper;
}
//refactor to method that takes in props ( HOC same code )
var colourTransitionProvider = function (state, props) {
    var enterStyle = {};
    var exitColor = Color(props.exitColour);
    var enterColor;
    var changeAmount = props.change;
    //note that whiten/blacken is not css3!
    switch (props.colourChangeType) {
        case ColourChangeType.darken:
            enterColor = exitColor.darken(changeAmount);
            break;
        case ColourChangeType.desaturate:
            enterColor = exitColor.desaturate(changeAmount);
            break;
        case ColourChangeType.fade:
            enterColor = exitColor.fade(changeAmount);
            break;
        case ColourChangeType.lighten:
            enterColor = exitColor.lighten(changeAmount);
            break;
        case ColourChangeType.opaquer:
            enterColor = exitColor.opaquer(changeAmount);
            break;
        case ColourChangeType.saturate:
            enterColor = exitColor.saturate(changeAmount);
            break;
    }
    var colorString = enterColor.toString();
    enterStyle[props.propName] = colorString; //seems that once change to different model cannot go back
    var exitStyle = {};
    var exitColourString = exitColor.toString();
    exitStyle[props.propName] = exitColourString;
    return {
        enterStyle: enterStyle,
        exitStyle: exitStyle,
        enterTransition: props.enterTransition,
        exitTransition: props.exitTransition
    };
};
//#endregion
//#endregion
//#region demo
var demoTimeout = {
    enter: 1000,
    exit: 1000
};
var demoStyle = {
    entering: {
        backgroundColor: "red",
        transition: "background-color " + demoTimeout.enter + "ms linear"
    },
    entered: {
        backgroundColor: "red"
    },
    exiting: {
        backgroundColor: "yellow",
        transition: "background-color " + demoTimeout.exit + "ms linear"
    },
    exited: {
        backgroundColor: "yellow"
    }
};
var demoDefaultStyle = {
    width: 300,
    height: 300
};
var Demo = (function (_super) {
    __extends(Demo, _super);
    function Demo(props) {
        var _this = _super.call(this, props) || this;
        _this.out = function () {
            _this.setState({ inSignal: null, in: false });
        };
        _this.in = function () {
            _this.setState({ in: true, inSignal: {} });
        };
        _this.state = { in: false, inSignal: {} };
        return _this;
    }
    Demo.prototype.onEntering = function (node, appear) {
        console.log("OnEntering, appear : " + appear);
    };
    /*
    var duration = 3000;//need ms or s qualifier
    <button onClick={this.out}>out</button>
            <button onClick={this.in}>in</button >
    <AutoOutInOnMount appear={true} inSignal={this.state.inSignal} timeout={duration}>
                {
                    (state: TransitionState) => {
                        var style: React.CSSProperties = {}
                        switch (state) {
                            case "entering":
                            case "entered":
                                style= {
                                    animationName: Radium.keyframes(flipOutX),
                                    animationDuration:duration + "ms"

                                }
                                break;
                            case "exited":

                                break;
                            case "exiting":

                                break;
                        }
                        return <div style={style}>Flipped on in </div>
                    }

                }
            </AutoOutInOnMount>
    */
    Demo.prototype.render = function () {
        return null;
    };
    return Demo;
}(React.Component));
var RadiumDemo = Radium(Demo);
//#endregion
//#region styling
//borderWidth: "1px", borderColor: "black", borderStyle: "solid"
var style = {
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    componentBackgroundColor: "lightgray",
    borderRadius: 5,
    scoreboard: {
        cellStyle: {
            paddingTop: 5,
            paddingBottom: 5,
            textAlign: "center",
            fontSize: 20,
        },
        tdStyle: {
            borderTop: "solid 1px",
            borderColor: "black"
        },
        rowStyle: {},
        winColour: "green",
        loseColour: "red",
        drawColour: "orange"
    }
};
style.scoreboard.cellStyle.backgroundColor = style.componentBackgroundColor;
var pulseIncrease = 1.5;
style.scoreboard.rowStyle.height = style.scoreboard.cellStyle.fontSize * pulseIncrease + style.scoreboard.cellStyle.paddingTop + style.scoreboard.cellStyle.paddingBottom;
//#endregion
//#region App components
var RadiumTransition = Radium(Transition_1.default);
var AutoOutInOnMount = withAutoOut(withInOnMount(RadiumTransition));
var AutoOutInOnMountColourChangeRadiumTransition = withColourChangeTransitionFn(AutoOutInOnMount);
var TicTacToeSquare = (function (_super) {
    __extends(TicTacToeSquare, _super);
    function TicTacToeSquare(props) {
        var _this = _super.call(this, props) || this;
        _this.squareClicked = function () {
            if (_this.props.canGo) {
                _this.props.takeGo();
            }
        };
        _this.state = { inSignal: {}, kill: false };
        return _this;
    }
    TicTacToeSquare.prototype.componentWillReceiveProps = function (newProps) {
        if (newProps.canGo !== this.props.canGo) {
            if (!newProps.canGo) {
                this.setState({ inSignal: {}, kill: false });
            }
            else {
                this.setState({ kill: true });
            }
        }
    };
    TicTacToeSquare.prototype.render = function () {
        var _this = this;
        var transitionDuration = 1000;
        var exitColour = style.componentBackgroundColor;
        var defaultStyle = {
            color: this.props.squareGoColour,
            textAlign: "center", width: 100, height: 100, borderWidth: "1px", borderColor: "black", borderStyle: "solid", fontSize: "80px"
        };
        return React.createElement(AutoOutInOnMountColourChangeRadiumTransition, { appear: true, inSignal: this.state.inSignal, propName: "backgroundColor", timeout: transitionDuration, enterTransition: "background-color " + transitionDuration + "ms linear", exitColour: exitColour, change: 0.3, colourChangeType: ColourChangeType.lighten }, function (state, props, stateStyle, stateTransition) {
            var style;
            if (_this.state.kill) {
                style = __assign({}, defaultStyle, { backgroundColor: exitColour });
            }
            else {
                style = __assign({}, defaultStyle, stateStyle, { transition: stateTransition });
            }
            return React.createElement("td", { style: style, onClick: _this.squareClicked }, _this.props.squareText);
        });
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
        return React.createElement("table", { id: ticTacToeBoardId, style: { borderCollapse: "collapse", borderWidth: "1px", borderColor: "black", borderStyle: "solid", backgroundColor: style.componentBackgroundColor } },
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
        return React.createElement("table", { style: { width: "100%", borderSpacing: 0 } },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", { style: __assign({ borderTopLeftRadius: style.borderRadius }, style.scoreboard.cellStyle) }, "Player"),
                    React.createElement("th", { style: style.scoreboard.cellStyle }, "Won"),
                    React.createElement("th", { style: style.scoreboard.cellStyle }, "Lost"),
                    React.createElement("th", { style: __assign({ borderTopRightRadius: style.borderRadius }, style.scoreboard.cellStyle) }, "Drawn"))),
            React.createElement("tbody", null,
                React.createElement(ScoreboardPlayer, { playerColour: this.props.xColour, playerId: "X", playerBoldStyle: this.props.currentPlayer === Player.X ? "bolder" : "normal", drawn: this.props.drawCount, won: this.props.playerXWinCount, lost: playerXLossCount }),
                React.createElement(ScoreboardPlayer, { borderRadius: style.borderRadius, playerColour: this.props.oColour, playerId: "O", playerBoldStyle: this.props.currentPlayer === Player.O ? "bolder" : "normal", drawn: this.props.drawCount, won: playerOWinCount, lost: playerOLossCount })));
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
var Pulse = withPulse(AutoOutInOnMount);
var ScoreboardPlayer = (function (_super) {
    __extends(ScoreboardPlayer, _super);
    function ScoreboardPlayer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { inSignal: null };
        return _this;
    }
    ScoreboardPlayer.prototype.componentWillReceiveProps = function (newProps) {
        if (newProps.won !== this.props.won) {
            this.setState({ inSignal: {} });
        }
    };
    ScoreboardPlayer.prototype.render = function () {
        var _this = this;
        var pulseTimeout = 1000;
        //animation-timing-function obtained from http://easings.net/#easeOutQuint
        var animationTimingFunction = "cubic-bezier(0.23, 1, 0.32, 1)";
        return React.createElement("tr", { style: style.scoreboard.rowStyle },
            React.createElement("td", { style: __assign({}, style.scoreboard.cellStyle, style.scoreboard.tdStyle, { borderBottomLeftRadius: this.props.borderRadius, fontWeight: this.props.playerBoldStyle, color: this.props.playerColour }) }, this.props.playerId),
            React.createElement(Pulse, { inSignal: this.state.inSignal, timeout: pulseTimeout, pulseAmount: pulseIncrease }, function (state, props, pulseStyle) {
                return React.createElement("td", { style: [style.scoreboard.cellStyle, style.scoreboard.tdStyle, pulseStyle, { color: style.scoreboard.winColour, animationTimingFunction: animationTimingFunction }] }, _this.props.won);
            }),
            React.createElement("td", { style: __assign({}, style.scoreboard.cellStyle, style.scoreboard.tdStyle, { color: style.scoreboard.loseColour }) }, this.props.lost),
            React.createElement("td", { style: __assign({}, style.scoreboard.cellStyle, style.scoreboard.tdStyle, { color: style.scoreboard.drawColour, borderBottomRightRadius: this.props.borderRadius }) },
                " ",
                this.props.drawn));
    };
    return ScoreboardPlayer;
}(React.Component));
ScoreboardPlayer.defaultProps = {
    borderRadius: 0
};
var TicTacToeApp = (function (_super) {
    __extends(TicTacToeApp, _super);
    function TicTacToeApp(props) {
        var _this = _super.call(this, props) || this;
        _this.flipDuration = 1000;
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
        _this.keyframesFlipInX = Radium.keyframes(react_animations_1.flipInX);
        _this.flipInXAnimationName = _this.keyframesFlipInX.__process("all").animationName;
        _this.keyframesFlipOutX = Radium.keyframes(react_animations_1.flipOutX);
        _this.flipOutXAnimationName = _this.keyframesFlipOutX.__process("all").animationName;
        return _this;
    }
    TicTacToeApp.prototype.render = function () {
        return React.createElement(Radium_1.StyleRoot, { radiumConfig: { userAgent: "all" } },
            React.createElement(Radium_1.Style, { rules: {
                    body: {
                        margin: 0,
                        fontFamily: style.fontFamily
                    },
                    button: {
                        fontFamily: style.fontFamily
                    }
                } }),
            React.createElement("span", { style: { animationName: this.keyframesFlipInX } }),
            React.createElement("span", { style: { animationName: this.keyframesFlipOutX } }),
            React.createElement(Radium_1.Style, { rules: {
                    ".ReactModal__Overlay": {
                        animationName: this.flipInXAnimationName,
                        animationDuration: this.flipDuration + "ms"
                    },
                    ".ReactModal__Overlay--before-close": {
                        animationName: this.flipOutXAnimationName,
                        animationDuration: this.flipDuration + "ms"
                    }
                } }),
            React.createElement(VerticallyCenteredContainer, { backgroundColor: "orange" },
                React.createElement(HorizontalCenter, null,
                    React.createElement("div", { style: { backgroundColor: "gray", padding: 10, borderRadius: style.borderRadius } },
                        React.createElement("div", { style: { display: "inline-block" } },
                            React.createElement("div", { style: { marginTop: 10, marginBottom: 10 } },
                                React.createElement(ConnectedScoreboard, null)),
                            React.createElement(ConnectedTicTacToeBoard, null),
                            React.createElement("button", { style: { borderStyle: "none", borderRadius: style.borderRadius, marginTop: 10, paddingTop: 10, paddingBottom: 10, width: "100%" }, onClick: this.props.playAgain }, "Play again")),
                        React.createElement(ModalCover, { closeTimeoutMS: this.flipDuration, elementSelector: "#" + ticTacToeBoardId, isOpen: this.modalShouldOpen(), onRequestClose: this.props.finishedConfirmed },
                            React.createElement("div", { style: { fontFamily: style.fontFamily, fontWeight: "bold", margin: "0 auto", width: "80%", textAlign: "center" } }, this.getWinDrawMessage()))))));
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
//#endregion
//#endregion
var store = storage_1.createLocalStorageStore(reducer);
ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(ConnectedTicTacToeApp, null)), document.getElementById("example"));
//# sourceMappingURL=index.js.map