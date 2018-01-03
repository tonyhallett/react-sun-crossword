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
var WebFont = require("webfontloader");
//will not be necessary if the placeholder worked 
function mergeAnimations(animationStyles) {
    var animationProperties = [{ name: "animationDuration", default: "0s" }, { name: "animationTimingFunction", default: "ease" }, { name: "animationDelay", default: "0s" }, { name: "animationIterationCount", default: "1" }, { name: "animationDirection", default: "normal" }, { name: "animationFillMode", default: "none" }, { name: "animationPlayState", default: "running" }];
    var mergedAnimationStyle = {
        animationName: [],
        animationDuration: "",
        animationTimingFunction: "",
        animationDelay: "",
        animationIterationCount: "",
        animationDirection: "",
        animationFillMode: "",
        animationPlayState: ""
    };
    var hadFirst = false;
    for (var i = 0; i < animationStyles.length; i++) {
        var animationStyle = animationStyles[i];
        if (animationStyle && animationStyle.animationName) {
            mergedAnimationStyle.animationName.push(animationStyle.animationName);
            for (var j = 0; j < animationProperties.length; j++) {
                var animationProperty = animationProperties[j];
                var animationPropertyName = animationProperty.name;
                var animationValue = animationStyle.hasOwnProperty(animationPropertyName) ? animationStyle[animationPropertyName] : animationProperty.default;
                if (hadFirst) {
                    animationValue = "," + animationValue;
                }
                mergedAnimationStyle[animationPropertyName] = mergedAnimationStyle[animationPropertyName] + animationValue;
            }
            hadFirst = true;
        }
    }
    return mergedAnimationStyle;
}
function animationSupported() {
    var animation = false, animationstring = 'animation', keyframeprefix = '', domPrefixes = 'Webkit Moz O ms Khtml'.split(' '), pfx = '', elem = document.createElement('div');
    if (elem.style.animationName !== undefined) {
        animation = true;
    }
    if (animation === false) {
        for (var i = 0; i < domPrefixes.length; i++) {
            if (elem.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                pfx = domPrefixes[i];
                animationstring = pfx + 'Animation';
                keyframeprefix = '-' + pfx.toLowerCase() + '-';
                animation = true;
                break;
            }
        }
    }
    return animation;
}
//#endregion
//#region redux
//#region redux state
//this is not for all circumstances, just for what is appropriate for me - a single font
var FontLoadingState;
(function (FontLoadingState) {
    FontLoadingState[FontLoadingState["NotStarted"] = 0] = "NotStarted";
    FontLoadingState[FontLoadingState["Loading"] = 1] = "Loading";
    FontLoadingState[FontLoadingState["Active"] = 2] = "Active";
    FontLoadingState[FontLoadingState["Inactive"] = 3] = "Inactive";
})(FontLoadingState || (FontLoadingState = {}));
var FONT_LOADING = "FONT_LOADING";
function fontLoading(state) {
    return {
        type: FONT_LOADING,
        state: state
    };
}
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
})(ArrowDirection || (ArrowDirection = {}));
function arrowPressed(direction) {
    return {
        type: Arrow_Press,
        direction: direction
    };
}
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
        fontLoadingState: FontLoadingState.NotStarted,
        selectedSquare: { row: 0, column: 0 }
    }; }
    switch (action.type) {
        case Arrow_Press:
            return __assign({}, state, { selectedSquare: getSelectedSquare(state.selectedSquare, state.board.length, action.direction) });
        case FONT_LOADING:
            return __assign({}, state, { fontLoadingState: action.state });
        case Finished_Confirmed:
            return __assign({}, state, { gameState: GameState.FinishedConfirmed });
        case Play_Again:
            return {
                board: getDefaultBoard(),
                currentPlayer: state.currentPlayer,
                oColour: state.oColour,
                xColour: state.xColour,
                gameState: GameState.Playing,
                drawCount: state.drawCount,
                playCount: state.playCount,
                playerXWinCount: state.playerXWinCount,
                selectedSquare: { row: 0, column: 0 }
            };
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
exports.translate3d = function (a, b, c) { return "translate3d(" + a + "px, " + b + "px, " + c + "px)"; };
function createShakeKeyframes(shakeDistance) {
    var noShake = {
        transform: exports.translate3d(0, 0, 0)
    };
    var downShake = {
        transform: exports.translate3d(-shakeDistance, 0, 0)
    };
    var upShake = {
        transform: exports.translate3d(shakeDistance, 0, 0)
    };
    /*
    without pause ( easy enough to calculate based upon a pause percent)
    return {
        from: noShake,
        '10%': downShake,
        '20%': upShake,
        '30%': downShake,
        '40%': upShake,
        '50%': downShake,
        '60%': upShake,
        '70%': downShake,
        '80%': upShake,
        '90%': downShake,
        to: noShake
    };
    */
    return {
        from: noShake,
        '10%': downShake,
        '20%': upShake,
        '30%': downShake,
        '40%': upShake,
        '50%': downShake,
        '60%': noShake,
        to: noShake
    };
}
function scale3d(a, b, c) {
    return 'scale3d(' + a + ', ' + b + ', ' + c + ')';
}
;
function createPulseKeyframes(pulseAmount) {
    var fromTo = scale3d(1, 1, 1);
    return {
        from: {
            transform: fromTo
        },
        '50%': {
            transform: scale3d(pulseAmount, pulseAmount, pulseAmount)
        },
        to: {
            transform: fromTo
        }
    };
}
function withPulse(Component) {
    var pulse = (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.render = function () {
            var _this = this;
            var pulse = createPulseKeyframes(this.props.pulseAmount);
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
function addEventListener(eventName, el, fn) {
    if (el.addEventListener) {
        el.addEventListener(eventName, fn);
    }
    else {
        var ieEl = el;
        ieEl.attachEvent("on" + eventName, fn);
    }
}
function removeEventListener(eventName, el, fn) {
    if (el.removeEventListener) {
        el.removeEventListener(eventName, fn);
    }
    else {
        var ieEl = el;
        ieEl.detachEvent("on" + eventName, fn);
    }
}
var MouseBodyPosition = (function (_super) {
    __extends(MouseBodyPosition, _super);
    function MouseBodyPosition(props) {
        var _this = _super.call(this, props) || this;
        _this.mouseMove = function (e) {
            var pageX = e.pageX;
            var pageY = e.pageY;
            // IE 8
            if (pageX === undefined) {
                pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            _this.setState({ x: pageX, y: pageY, active: true });
        };
        _this.state = {
            x: 0,
            y: 0,
            active: false
        };
        return _this;
    }
    MouseBodyPosition.prototype.componentDidMount = function () {
        addEventListener("mousemove", document.body, this.mouseMove);
    };
    MouseBodyPosition.prototype.componentWillUnmount = function () {
        removeEventListener("mousemove", document.body, this.mouseMove);
    };
    MouseBodyPosition.prototype.render = function () {
        var _this = this;
        return React.Children.map(this.props.children, (function (child) { return React.cloneElement(child, _this.state); }));
    };
    return MouseBodyPosition;
}(React.Component));
//will probably change to BodyCursorPlacement - with a zIndex?
var BodyCursor = (function (_super) {
    __extends(BodyCursor, _super);
    function BodyCursor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BodyCursor.prototype.render = function () {
        if (this.props.active && this.props.replaceCursor) {
            document.body.style.cursor = "none";
            var replacedCursorStyle = { position: "absolute", left: this.props.x, top: this.props.y, pointerEvents: "none" };
            var childElement = this.props.children;
            var childStyle = childElement.props.style;
            var newStyle = __assign({}, childStyle, replacedCursorStyle);
            var newProps = {
                style: newStyle
            };
            return React.cloneElement(this.props.children, newProps);
        }
        else {
            document.body.style.cursor = this.props.cursor;
            return this.props.children;
        }
    };
    return BodyCursor;
}(React.Component));
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
var RadiumDemo = ConfiguredRadium(Demo);
//#endregion
//#region styling
var thButtonFontWeight = "bold";
//these have been taken from https://www.w3schools.com/colors/colors_picker.asp
var scoreboardBackgroundColor = "rgb(226, 220, 207)";
var buttonBackgroundColor = "rgb(226, 220, 207)";
var hoverButtonBackground = Color(buttonBackgroundColor).lighten(0.1);
var componentBackgroundColor = "rgb(207, 197, 175)";
var indicatorWinningSquareColor = Color(componentBackgroundColor).lighten(0.1);
var ticTacToeSquareBorderWidth = 5;
var backgroundColor = "orange";
var animationIsSupported = animationSupported();
var startEndBoxShadow = "0 0 5px 2px " + backgroundColor + " inset";
var focusKeyframes = {
    '0%': {
        boxShadow: startEndBoxShadow
    },
    '50%': {
        boxShadow: "0 0 10px 5px " + backgroundColor + " inset"
    },
    '100%': {
        boxShadow: startEndBoxShadow
    }
};
var focusAnimationStyle = {
    animationName: Radium.keyframes(focusKeyframes),
    animationDuration: "2000ms",
    animationIterationCount: "infinite",
    animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)"
};
var shakeKeyframes = createShakeKeyframes(5);
var shakeAnimationStyle = {
    animationName: Radium.keyframes(shakeKeyframes),
    animationDuration: "2000ms",
    animationIterationCount: "infinite",
};
var boxShadowHover = "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)";
var buttonHoverFocusBrightnessAnimationStyle = {
    animationName: Radium.keyframes({
        "100%": {
            backgroundColor: hoverButtonBackground
        }
    }),
    animationDuration: "1s",
    animationFillMode: "forwards"
};
var buttonHoverShadowStyle = {
    boxShadow: boxShadowHover,
};
var fontSize = 20;
var pulseIncrease = 1.5;
var scoreboardPadding = 5;
var textFontFamily = "Pacifico";
var noughtCrossFontFamily = "Short Stack";
var defaultFontFamily = ",Helvetica Neue, Helvetica, Arial, sans-serif";
var noughtCrossFontFamilyWithDefault = noughtCrossFontFamily + defaultFontFamily;
var textFontFamilyWithDefault = textFontFamily + defaultFontFamily;
var ticTacToeSquareFontSize = 80;
//override scoreboard.cellStyle with noughtCrossStyle for the player cells
var style = {
    winDrawContainerStyle: { fontWeight: "bold", margin: "0 auto", width: "80%", textAlign: "center", fontSize: fontSize },
    componentBackgroundColor: componentBackgroundColor,
    componentBoxShadow: {
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        transition: "all 0.3s cubic-bezier(.25, .8, .25, 1)"
    },
    componentBoxShadowHover: {
        ":hover": { boxShadow: boxShadowHover }
    },
    componentMargin: 10,
    borderRadius: 5,
    loadingIndicator: {
        cellStyle: {
            backgroundColor: componentBackgroundColor,
            width: 20,
            height: 20,
            fontSize: 10,
            textAlign: "center",
            fontWeight: "bold"
        },
        winningCellStyle: {
            animationName: Radium.keyframes({
                '100%': {
                    fontSize: 18,
                    backgroundColor: indicatorWinningSquareColor
                }
            }),
            animationDuration: "1s",
            animationIterationCount: "infinite",
            animationDirection: "alternate"
        }
    },
    scoreboard: {
        cellStyle: {
            paddingTop: scoreboardPadding,
            paddingBottom: scoreboardPadding,
            textAlign: "center",
            fontSize: fontSize,
            backgroundColor: scoreboardBackgroundColor,
            fontFamily: textFontFamilyWithDefault
        },
        noughtCrossStyle: {
            fontFamily: noughtCrossFontFamilyWithDefault
        },
        rowStyle: {
            borderTopWidth: 1, borderTopColor: "black", borderTopStyle: "solid",
            height: fontSize * pulseIncrease + 2 * scoreboardPadding
        },
        winColour: "green",
        loseColour: "red",
        drawColour: "orange",
        thFontWeight: thButtonFontWeight
    },
    ticTacToeSquare: {
        verticalAlign: "center",
        textAlign: "center", width: 100, height: 100,
        borderColor: "white", borderStyle: "solid", borderWidth: 0, fontSize: ticTacToeSquareFontSize, fontFamily: noughtCrossFontFamilyWithDefault,
    },
    ticTacToeSquareBorderWidth: ticTacToeSquareBorderWidth,
    cursor: {
        fontSize: ticTacToeSquareBorderWidth / 2
    }
};
//#endregion
//#region text strings
var player = "Player";
var won = "Won";
var lost = "Lost";
var drawn = "Drawn";
var playAgainText = "Play again";
var nought = "O";
var cross = "X";
var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var gameDrawn = "Game drawn";
var wonMessage = won + " !";
var toOptimise = [player, won, lost, drawn, playAgainText, nought, cross, gameDrawn].concat(numbers);
var letters = "";
toOptimise.forEach(function (word) {
    for (var i = 0; i < word.length; i++) {
        var letter = word[i];
        if (letter !== " ") {
            if (letters.indexOf(letter) === -1) {
                letters += letter;
            }
        }
    }
});
var WebFontLoader = (function (_super) {
    __extends(WebFontLoader, _super);
    function WebFontLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebFontLoader.prototype.loadFonts = function () {
        WebFont.load(this.props.config);
    };
    WebFontLoader.prototype.componentDidMount = function () {
        this.loadFonts();
    };
    WebFontLoader.prototype.shouldComponentUpdate = function () {
        return false;
    };
    WebFontLoader.prototype.render = function () {
        return this.props.children;
    };
    return WebFontLoader;
}(React.Component));
//preloadedState going to be an issue - will need to override or not save 
var ConnectedWebFontLoader = react_redux_1.connect(null, function (dispatch) {
    return {
        loading: function () {
            dispatch(fontLoading(FontLoadingState.Loading));
        },
        active: function () {
            dispatch(fontLoading(FontLoadingState.Active));
        },
        inactive: function () {
            dispatch(fontLoading(FontLoadingState.Inactive));
        },
    };
}, function (stateProps, dispatchProps, ownProps) {
    //for own use not concerned with overriding callbacks
    var mergedProps = __assign({}, ownProps, { config: __assign({}, ownProps.config, dispatchProps) });
    return mergedProps;
})(WebFontLoader);
function keyframesPluginArray(_a) {
    var addCSS = _a.addCSS, config = _a.config, style = _a.style;
    var newStyle = Object.keys(style).reduce(function (newStyleInProgress, key) {
        var value = style[key];
        if (key === 'animationName' && value && (value.__radiumKeyframes || Array.isArray(value))) {
            if (Array.isArray(value)) {
                value = value.map(function (v) {
                    var keyframesValue = v;
                    var _a = keyframesValue.__process(config.userAgent), animationName = _a.animationName, css = _a.css;
                    addCSS(css);
                    return animationName;
                }).join(", ");
            }
            else {
                var keyframesValue = value;
                var _a = keyframesValue.__process(config.userAgent), animationName = _a.animationName, css = _a.css;
                addCSS(css);
                value = animationName;
            }
        }
        newStyleInProgress[key] = value;
        return newStyleInProgress;
    }, {});
    return { style: newStyle };
}
function ConfiguredRadium(component) {
    return Radium({
        plugins: [
            Radium.Plugins.mergeStyleArray,
            Radium.Plugins.checkProps,
            Radium.Plugins.resolveMediaQueries,
            Radium.Plugins.resolveInteractionStyles,
            keyframesPluginArray,
            Radium.Plugins.visited,
            Radium.Plugins.removeNestedStyles,
            Radium.Plugins.prefix,
            Radium.Plugins.checkProps,
        ],
    })(component);
}
var TicTacToeCursor = (function (_super) {
    __extends(TicTacToeCursor, _super);
    function TicTacToeCursor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TicTacToeCursor.prototype.render = function () {
        return React.createElement(MouseBodyPosition, null,
            React.createElement(BodyCursor, { cursor: "pointer", replaceCursor: this.props.active },
                React.createElement("span", { style: { zIndex: 1000, fontSize: style.cursor.fontSize, fontFamily: noughtCrossFontFamily, color: this.props.cursorColour } }, this.props.cursorText)));
    };
    return TicTacToeCursor;
}(React.Component));
var ConnectedTicTacToeCursor = react_redux_1.connect(function (state) {
    //need
    var currentPlayer = state.currentPlayer;
    var cursorColour = currentPlayer === Player.X ? state.xColour : state.oColour;
    var cursorText = currentPlayer === Player.X ? cross : nought;
    var active = state.gameState === GameState.Playing;
    return {
        cursorColour: cursorColour,
        cursorText: cursorText,
        active: active
    };
}, null)(TicTacToeCursor);
var RadiumTransition = ConfiguredRadium(Transition_1.default);
var AutoOutInOnMount = withAutoOut(withInOnMount(RadiumTransition));
var AutoOutInOnMountColourChangeRadiumTransition = withColourChangeTransitionFn(AutoOutInOnMount);
var RadiumHorizontalCenter = ConfiguredRadium(HorizontalCenter);
var TicTacToeSquare = (function (_super) {
    __extends(TicTacToeSquare, _super);
    function TicTacToeSquare(props) {
        var _this = _super.call(this, props) || this;
        _this.squareSelected = function () {
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
        var specificStyle = {
            color: this.props.squareGoColour,
        };
        if (this.props.rowIndex !== 0) {
            specificStyle.borderTopWidth = ticTacToeSquareBorderWidth;
        }
        if (this.props.colIndex !== 0) {
            specificStyle.borderLeftWidth = ticTacToeSquareBorderWidth;
        }
        return React.createElement(AutoOutInOnMountColourChangeRadiumTransition, { appear: true, inSignal: this.state.inSignal, propName: "backgroundColor", timeout: transitionDuration, enterTransition: "background-color " + transitionDuration + "ms linear", exitColour: exitColour, change: 0.1, colourChangeType: ColourChangeType.lighten }, function (state, props, stateStyle, stateTransition) {
            var transitionStyle;
            if (_this.state.kill) {
                transitionStyle = { backgroundColor: exitColour };
            }
            else {
                transitionStyle = __assign({}, stateStyle, { transition: stateTransition });
            }
            return React.createElement("td", { style: [style.ticTacToeSquare, specificStyle, transitionStyle], onMouseDown: function (e) { e.preventDefault(); }, onClick: _this.squareSelected },
                React.createElement("div", { style: [{ width: "100%", height: "100%", userSelect: "none" }, _this.props.isSelected ? focusAnimationStyle : null] },
                    " ",
                    _this.props.squareText));
        });
    };
    return TicTacToeSquare;
}(React.Component));
function getSquareTextAndColour(state, rowIndex, colIndex) {
    var squareGo = state.board[rowIndex][colIndex];
    var squareGoColour = "white";
    var squareText = "";
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
            break;
    }
    return { colour: squareGoColour, text: squareText };
}
var ConnectedTicTacToeSquare = react_redux_1.connect(function (state, ownProps) {
    var _a = getSquareTextAndColour(state, ownProps.rowIndex, ownProps.colIndex), colour = _a.colour, text = _a.text;
    var squareGo = state.board[ownProps.rowIndex][ownProps.colIndex];
    var canGo = state.gameState === GameState.Playing && squareGo === SquareGo.None;
    var isSelected = false;
    if (state.selectedSquare) {
        isSelected = state.selectedSquare.column === ownProps.colIndex && state.selectedSquare.row == ownProps.rowIndex;
    }
    var connectState = {
        squareGoColour: colour,
        squareText: text,
        canGo: canGo,
        isSelected: isSelected
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
        var boardDimensions = this.props.board.length;
        return React.createElement("table", { id: ticTacToeBoardId, style: [{
                    borderCollapse: "collapse", backgroundColor: style.componentBackgroundColor
                }, style.componentBoxShadow, style.componentBoxShadowHover] },
            React.createElement("tbody", null, this.props.board.map(function (rowSquares, rowIndex) {
                return React.createElement("tr", { key: rowIndex }, rowSquares.map(function (square, colIndex) {
                    return React.createElement(ConnectedTicTacToeSquare, { tabIndex: (rowIndex * boardDimensions) + colIndex + 1, key: colIndex, rowIndex: rowIndex, colIndex: colIndex });
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
})(ConfiguredRadium(TicTacToeBoard));
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
        return React.createElement("table", { style: { width: "100%", borderSpacing: 0, borderCollapse: "collapse" } },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", { style: __assign({ fontWeight: thButtonFontWeight, borderTopLeftRadius: style.borderRadius }, style.scoreboard.cellStyle) }, player),
                    React.createElement("th", { style: __assign({}, style.scoreboard.cellStyle, { fontWeight: thButtonFontWeight }) }, won),
                    React.createElement("th", { style: __assign({}, style.scoreboard.cellStyle, { fontWeight: thButtonFontWeight }) }, lost),
                    React.createElement("th", { style: __assign({ fontWeight: thButtonFontWeight, borderTopRightRadius: style.borderRadius }, style.scoreboard.cellStyle) }, drawn))),
            React.createElement("tbody", null,
                React.createElement(RadiumScoreboardPlayer, { isCurrent: this.props.currentPlayer === Player.X, playerColour: this.props.xColour, playerId: cross, playerBoldStyle: this.props.currentPlayer === Player.X ? "bolder" : "normal", drawn: this.props.drawCount, won: this.props.playerXWinCount, lost: playerXLossCount }),
                React.createElement(RadiumScoreboardPlayer, { isCurrent: this.props.currentPlayer === Player.O, borderRadius: style.borderRadius, playerColour: this.props.oColour, playerId: nought, playerBoldStyle: this.props.currentPlayer === Player.O ? "bolder" : "normal", drawn: this.props.drawCount, won: playerOWinCount, lost: playerOLossCount })));
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
            React.createElement("td", { style: __assign({}, style.scoreboard.cellStyle, style.scoreboard.noughtCrossStyle, { borderBottomLeftRadius: this.props.borderRadius, fontWeight: this.props.playerBoldStyle, color: this.props.playerColour }) },
                " ",
                React.createElement("div", { style: this.props.isCurrent ? {
                        animationDuration: pulseTimeout + "ms",
                        animationTimingFunction: animationTimingFunction,
                        animationIterationCount: "infinite",
                        animationName: Radium.keyframes(createPulseKeyframes(pulseIncrease))
                    } : {} }, this.props.playerId)),
            React.createElement("td", { style: style.scoreboard.cellStyle },
                React.createElement(Pulse, { inSignal: this.state.inSignal, timeout: pulseTimeout, pulseAmount: pulseIncrease }, function (state, props, pulseStyle) {
                    return React.createElement("div", { style: [pulseStyle, { color: style.scoreboard.winColour, animationTimingFunction: animationTimingFunction }] }, _this.props.won);
                })),
            React.createElement("td", { style: __assign({}, style.scoreboard.cellStyle, { color: style.scoreboard.loseColour }) }, this.props.lost),
            React.createElement("td", { style: __assign({}, style.scoreboard.cellStyle, { color: style.scoreboard.drawColour, borderBottomRightRadius: this.props.borderRadius }) },
                " ",
                this.props.drawn));
    };
    return ScoreboardPlayer;
}(React.Component));
ScoreboardPlayer.defaultProps = {
    borderRadius: 0
};
var RadiumScoreboardPlayer = ConfiguredRadium(ScoreboardPlayer);
//refactor to a loader ?
var TicTacToeApp = (function (_super) {
    __extends(TicTacToeApp, _super);
    function TicTacToeApp(props) {
        var _this = _super.call(this, props) || this;
        _this.hasLoaded = false;
        _this.state = { showLoadingIndicator: true };
        return _this;
    }
    TicTacToeApp.prototype.componentWillReceiveProps = function (props) {
        var self = this;
        if (this.props.fontLoadingState !== props.fontLoadingState && props.fontLoadingState === FontLoadingState.Loading) {
            if (this.props.minimumLoadingIndicator) {
                window.setTimeout(function () {
                    self.setState({ showLoadingIndicator: false });
                }, this.props.minimumLoadingIndicator);
            }
            else {
                self.setState({ showLoadingIndicator: false });
            }
        }
    };
    TicTacToeApp.prototype.render = function () {
        var showLoading = this.props.fontLoadingState === FontLoadingState.NotStarted || this.props.fontLoadingState === FontLoadingState.Loading;
        if (!showLoading) {
            showLoading = this.state.showLoadingIndicator;
        }
        return React.createElement(Radium_1.StyleRoot, { radiumConfig: { userAgent: "all" } },
            React.createElement(Radium_1.Style, { rules: {
                    body: {
                        margin: 0
                    },
                    ":focus": {
                        outlineStyle: animationIsSupported ? "none" : "solid",
                        outlineColor: backgroundColor
                    }
                } }),
            React.createElement(ConnectedTicTacToeCursor, null),
            React.createElement(VerticallyCenteredContainer, { backgroundColor: backgroundColor },
                React.createElement(RadiumHorizontalCenter, null,
                    React.createElement("div", { style: { backgroundColor: "gray", padding: 10, borderRadius: style.borderRadius, boxShadow: " 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)" } }, showLoading ? React.createElement(ConnectedTicTacToeLoader, null) : React.createElement(ConnectedTicTacToeScreen, null)))));
    };
    return TicTacToeApp;
}(React.Component));
var TicTacToeLoader = (function (_super) {
    __extends(TicTacToeLoader, _super);
    function TicTacToeLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TicTacToeLoader.prototype.render = function () {
        return React.createElement("table", { style: { borderSpacing: 2 } },
            React.createElement("tbody", null,
                React.createElement("tr", null,
                    React.createElement("td", { style: [style.loadingIndicator.cellStyle, style.loadingIndicator.winningCellStyle, { color: this.props.xColour }] }, "X"),
                    React.createElement("td", { style: [style.loadingIndicator.cellStyle, { color: this.props.oColour }] }, "O"),
                    React.createElement("td", { style: [style.loadingIndicator.cellStyle, { color: this.props.xColour }] }, "X")),
                React.createElement("tr", null,
                    React.createElement("td", { style: [style.loadingIndicator.cellStyle, { color: this.props.xColour }] }, "X"),
                    React.createElement("td", { style: [style.loadingIndicator.cellStyle, style.loadingIndicator.winningCellStyle, { animationDelay: "0.1s", color: this.props.xColour }] }, "X"),
                    React.createElement("td", { style: [style.loadingIndicator.cellStyle, { color: this.props.oColour }] }, "O")),
                React.createElement("tr", null,
                    React.createElement("td", { style: [style.loadingIndicator.cellStyle, { color: this.props.oColour }] }, "O"),
                    React.createElement("td", { style: [style.loadingIndicator.cellStyle, { color: this.props.oColour }] }, "O"),
                    React.createElement("td", { style: [style.loadingIndicator.cellStyle, style.loadingIndicator.winningCellStyle, { animationDelay: "0.2s", color: this.props.xColour }] }, "X"))));
    };
    return TicTacToeLoader;
}(React.Component));
var ConnectedTicTacToeLoader = react_redux_1.connect(function (state) {
    return {
        oColour: state.oColour,
        xColour: state.xColour
    };
})(ConfiguredRadium(TicTacToeLoader));
var TicTacToeScreen = (function (_super) {
    __extends(TicTacToeScreen, _super);
    function TicTacToeScreen(props) {
        var _this = _super.call(this, props) || this;
        _this.flipDuration = 1000;
        _this.modalShouldOpen = function () {
            var gameState = _this.props.gameState;
            return gameState === GameState.Draw || gameState === GameState.O || gameState === GameState.X;
        };
        _this.keyDown = function (event) {
            var key = event.key;
            var modalOpen = _this.modalShouldOpen();
            if (modalOpen) {
                switch (key) {
                    case "Enter":
                    case " ":
                    case "Esc":
                        _this.props.finishedConfirmed();
                        break;
                    case "p":
                    case "P":
                        _this.props.playAgain();
                        break;
                }
            }
            else {
                switch (key) {
                    case "ArrowDown":
                        _this.props.arrowPressed(ArrowDirection.Down);
                        break;
                    case "ArrowUp":
                        _this.props.arrowPressed(ArrowDirection.Up);
                        break;
                    case "ArrowLeft":
                        _this.props.arrowPressed(ArrowDirection.Left);
                        break;
                    case "ArrowRight":
                        _this.props.arrowPressed(ArrowDirection.Right);
                        break;
                    case "p":
                    case "P":
                        _this.props.playAgain();
                        break;
                    default:
                        var selectedSquare = _this.props.selectedSquare;
                        if (selectedSquare) {
                            var squareGo = _this.props.board[selectedSquare.row][selectedSquare.column];
                            _this.props.takeGo(selectedSquare.row, selectedSquare.column);
                        }
                        break;
                }
            }
        };
        _this.getModalParent = function () {
            return _this.modalParent;
        };
        _this.keyContainerRef = function (keyContainer) {
            keyContainer.focus();
            _this.modalParent = keyContainer;
        };
        _this.state = { winDrawElement: _this.getWinDrawElement(props) };
        _this.keyframesFlipInX = Radium.keyframes(react_animations_1.flipInX);
        _this.flipInXAnimationName = _this.keyframesFlipInX.__process("all").animationName;
        _this.keyframesFlipOutX = Radium.keyframes(react_animations_1.flipOutX);
        _this.flipOutXAnimationName = _this.keyframesFlipOutX.__process("all").animationName;
        return _this;
    }
    TicTacToeScreen.prototype.getWinDrawElement = function (props) {
        function getWinner(playerId, playerColour) {
            return React.createElement("div", { style: style.winDrawContainerStyle },
                React.createElement("span", { style: { fontFamily: textFontFamilyWithDefault } }, player + " "),
                React.createElement("span", { style: { fontFamily: noughtCrossFontFamily, color: playerColour } }, playerId + " "),
                React.createElement("span", { style: { fontFamily: textFontFamilyWithDefault } }, wonMessage));
        }
        var messageElement = React.createElement("div", null);
        switch (props.gameState) {
            case GameState.X:
                messageElement = getWinner(cross, this.props.xColour);
                break;
            case GameState.O:
                messageElement = getWinner(nought, this.props.oColour);
                break;
            case GameState.Draw:
                messageElement = React.createElement("div", { style: __assign({}, style.winDrawContainerStyle, { fontFamily: textFontFamilyWithDefault }) }, gameDrawn);
                break;
        }
        return messageElement;
    };
    TicTacToeScreen.prototype.componentWillReceiveProps = function (props) {
        if (props.gameState !== this.props.gameState && this.props.gameState === GameState.Playing) {
            this.setState({ winDrawElement: this.getWinDrawElement(props) });
        }
    };
    TicTacToeScreen.prototype.render = function () {
        //this is no longer necessary 
        //var buttonHasFocus = Radium.getState(this.state, 'button', ':focus');
        var buttonHasHover = Radium.getState(this.state, 'button', ':hover');
        //var buttonFocusOrHover = buttonHasFocus || buttonHasHover;
        //var buttonAnimation = mergeAnimations([buttonHasFocus ? focusAnimationStyle : null, buttonFocusOrHover ? buttonHoverFocusBrightnessAnimationStyle : null]);
        var buttonAnimation = mergeAnimations([this.props.gameState !== GameState.Playing ? shakeAnimationStyle : null, buttonHasHover ? buttonHoverFocusBrightnessAnimationStyle : null]);
        var playAgainUnderlineLetter = playAgainText[0];
        var playAgainRemainder = playAgainText.substr(1);
        return React.createElement("div", { tabIndex: 0, ref: this.keyContainerRef, onKeyDown: this.keyDown },
            React.createElement("span", { style: { animationName: this.keyframesFlipInX } }),
            React.createElement("span", { style: { animationName: this.keyframesFlipOutX } }),
            React.createElement(Radium_1.Style, { rules: {
                    ".ReactModal__Overlay": {
                        animationName: this.flipInXAnimationName,
                        animationDuration: this.flipDuration + "ms"
                    },
                    ".ReactModal__Overlay--before-close": {
                        animationName: this.flipOutXAnimationName,
                        animationDuration: this.flipDuration + "ms",
                        animationFillMode: "forwards"
                    }
                } }),
            React.createElement("div", { style: { display: "inline-block" } },
                React.createElement("div", { style: { marginBottom: style.componentMargin } },
                    React.createElement(ConnectedScoreboard, null)),
                React.createElement(ConnectedTicTacToeBoard, null),
                React.createElement("div", { role: "button", key: "button", style: [{ ":focus": {} }, { ":hover": buttonHoverShadowStyle }, { borderRadius: style.borderRadius, marginTop: style.componentMargin, fontWeight: thButtonFontWeight, fontFamily: textFontFamilyWithDefault, fontSize: fontSize, borderStyle: "none", paddingTop: 10, paddingBottom: 10, backgroundColor: buttonBackgroundColor, width: "100%", cursor: "pointer" }, style.componentBoxShadow, buttonAnimation], onClick: this.props.playAgain },
                    React.createElement("div", { style: { marginLeft: "auto", marginRight: "auto", width: "99%", textAlign: "center" } },
                        React.createElement("span", { style: { textDecoration: "underline", display: "inlineBlock", userSelect: "none" } }, playAgainUnderlineLetter),
                        React.createElement("span", { style: { display: "inlineBlock", userSelect: "none" } }, playAgainRemainder)))),
            React.createElement(ModalCover, { parentSelector: this.getModalParent, contentStyle: { backgroundColor: componentBackgroundColor }, closeTimeoutMS: this.flipDuration, elementSelector: "#" + ticTacToeBoardId, isOpen: this.modalShouldOpen(), onRequestClose: this.props.finishedConfirmed }, this.state.winDrawElement));
    };
    return TicTacToeScreen;
}(React.Component));
var ConnectedTicTacToeScreen = react_redux_1.connect(function (state) {
    return {
        gameState: state.gameState,
        oColour: state.oColour,
        xColour: state.xColour,
        selectedSquare: state.selectedSquare,
        board: state.board
    };
}, function (dispatch) {
    return {
        playAgain: function () {
            dispatch(playAgain());
        },
        finishedConfirmed: function () {
            dispatch(finishedConfirmed());
        },
        arrowPressed: function (direction) {
            dispatch(arrowPressed(direction));
        },
        takeGo: function (row, column) {
            dispatch(takeGo(row, column));
        }
    };
})(ConfiguredRadium(TicTacToeScreen));
var ConnectedTicTacToeApp = react_redux_1.connect(function (state) {
    return {
        fontLoadingState: state.fontLoadingState,
        oColour: state.oColour,
        xColour: state.xColour
    };
})(TicTacToeApp);
//#endregion
//#endregion
var store = storage_1.createLocalStorageStore(reducer);
ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(ConnectedWebFontLoader, { config: {
            google: {
                families: [textFontFamily, noughtCrossFontFamily],
                text: letters
            }
        } },
        React.createElement(ConnectedTicTacToeApp, { minimumLoadingIndicator: 2000 }))), document.getElementById("example"));
//# sourceMappingURL=index.js.map