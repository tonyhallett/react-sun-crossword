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
var storage_1 = require("./helpers/storage");
var webFontLoader_1 = require("./tic_tac_toe/webFontLoader");
var fontFamilies = require("./tic_tac_toe/fontFamilies");
var textStrings = require("./tic_tac_toe/textStrings");
var idsAndClassNames = require("./tic_tac_toe/idsAndClassNames");
//will not need connect eventually
var react_redux_1 = require("react-redux");
var webFontLoader_2 = require("./tic_tac_toe/webFontLoader");
var style_1 = require("./tic_tac_toe/style");
var reducer_1 = require("./tic_tac_toe/reducer");
var Radium = require("Radium");
var Transition_1 = require("react-transition-group/Transition");
var Color = require("Color");
var hitTest_1 = require("./helpers/hitTest");
var configuredRadium_1 = require("./tic_tac_toe/configuredRadium");
var ticTacToeApp_1 = require("./tic_tac_toe/ticTacToeApp");
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
//#region App components
var RadiumTransition = configuredRadium_1.ConfiguredRadium(Transition_1.default);
var AutoOutInOnMount = withAutoOut(withInOnMount(RadiumTransition));
var AutoOutInOnMountColourChangeRadiumTransition = withColourChangeTransitionFn(AutoOutInOnMount);
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
        var exitColour = style_1.style.componentBackgroundColor;
        var specificStyle = {
            color: this.props.squareGoColour,
        };
        if (this.props.rowIndex !== 0) {
            specificStyle.borderTopWidth = style_1.ticTacToeSquareBorderWidth;
        }
        if (this.props.colIndex !== 0) {
            specificStyle.borderLeftWidth = style_1.ticTacToeSquareBorderWidth;
        }
        return React.createElement(AutoOutInOnMountColourChangeRadiumTransition, { appear: true, inSignal: this.state.inSignal, propName: "backgroundColor", timeout: transitionDuration, enterTransition: "background-color " + transitionDuration + "ms linear", exitColour: exitColour, change: 0.1, colourChangeType: ColourChangeType.lighten }, function (state, props, stateStyle, stateTransition) {
            var transitionStyle;
            if (_this.state.kill) {
                transitionStyle = { backgroundColor: exitColour };
            }
            else {
                transitionStyle = __assign({}, stateStyle, { transition: stateTransition });
            }
            return React.createElement("td", { style: [style_1.style.ticTacToeSquare, specificStyle, transitionStyle], onMouseDown: function (e) { e.preventDefault(); }, onClick: _this.squareSelected },
                React.createElement("div", { style: [{ width: "100%", height: "100%", userSelect: "none" }, _this.props.isSelected ? style_1.focusAnimationStyle : null] },
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
        case reducer_1.SquareGo.O:
            squareGoColour = state.oColour;
            squareText = "O";
            break;
        case reducer_1.SquareGo.X:
            squareText = "X";
            squareGoColour = state.xColour;
            break;
        case reducer_1.SquareGo.None:
            break;
    }
    return { colour: squareGoColour, text: squareText };
}
var ConnectedTicTacToeSquare = react_redux_1.connect(function (state, ownProps) {
    var _a = getSquareTextAndColour(state, ownProps.rowIndex, ownProps.colIndex), colour = _a.colour, text = _a.text;
    var squareGo = state.board[ownProps.rowIndex][ownProps.colIndex];
    var canGo = state.gameState === reducer_1.GameState.Playing && squareGo === reducer_1.SquareGo.None;
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
            dispatch(reducer_1.takeGo(ownProps.rowIndex, ownProps.colIndex));
        }
    };
})(TicTacToeSquare);
var TicTacToeBoard = (function (_super) {
    __extends(TicTacToeBoard, _super);
    function TicTacToeBoard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TicTacToeBoard.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.hitTestRequest && nextProps.hitTestRequest !== this.props.hitTestRequest) {
            this.hitTest(nextProps.hitTestRequest);
        }
    };
    TicTacToeBoard.prototype.hitTest = function (hitTestRequest) {
        var numRowColumns = this.props.board.length;
        var rows = this.tbody.rows;
        var isHit = false;
        var hitRow;
        var hitColumn;
        for (var i = 0; i < numRowColumns; i++) {
            var row = rows[i];
            //will check the row for hittest
            for (var j = 0; j < numRowColumns; j++) {
                var cell = row.cells[j];
                isHit = hitTest_1.hitTest(hitTestRequest.x, hitTestRequest.y, cell);
                if (isHit) {
                    hitRow = i;
                    hitColumn = j;
                    break;
                }
            }
            if (isHit) {
                break;
            }
        }
        this.props.hitTestResult({ hit: isHit, row: hitRow, column: hitColumn });
    };
    TicTacToeBoard.prototype.render = function () {
        var _this = this;
        var boardDimensions = this.props.board.length;
        return React.createElement("table", { id: idsAndClassNames.ticTacToeBoardId, style: [{
                    borderCollapse: "collapse", backgroundColor: style_1.style.componentBackgroundColor
                }, style_1.style.componentBoxShadow, style_1.style.componentBoxShadowHover] },
            React.createElement("tbody", { ref: function (b) { return _this.tbody = b; } }, this.props.board.map(function (rowSquares, rowIndex) {
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
        board: state.board,
        hitTestRequest: state.boardHitTest.request
    };
}, function (dispatch) {
    return {
        hitTestResult: function (res) {
            dispatch(reducer_1.boardHitTestResult(res.hit, res.row, res.column));
        }
    };
})(configuredRadium_1.ConfiguredRadium(TicTacToeBoard));
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
                    React.createElement("th", { style: __assign({ fontWeight: style_1.thButtonFontWeight, borderTopLeftRadius: style_1.style.borderRadius }, style_1.style.scoreboard.cellStyle) }, textStrings.player),
                    React.createElement("th", { style: __assign({}, style_1.style.scoreboard.cellStyle, { fontWeight: style_1.thButtonFontWeight }) }, textStrings.won),
                    React.createElement("th", { style: __assign({}, style_1.style.scoreboard.cellStyle, { fontWeight: style_1.thButtonFontWeight }) }, textStrings.lost),
                    React.createElement("th", { style: __assign({ fontWeight: style_1.thButtonFontWeight, borderTopRightRadius: style_1.style.borderRadius }, style_1.style.scoreboard.cellStyle) }, textStrings.drawn))),
            React.createElement("tbody", null,
                React.createElement(RadiumScoreboardPlayer, { isCurrent: this.props.currentPlayer === reducer_1.Player.X, playerColour: this.props.xColour, playerId: textStrings.cross, playerBoldStyle: this.props.currentPlayer === reducer_1.Player.X ? "bolder" : "normal", drawn: this.props.drawCount, won: this.props.playerXWinCount, lost: playerXLossCount }),
                React.createElement(RadiumScoreboardPlayer, { isCurrent: this.props.currentPlayer === reducer_1.Player.O, borderRadius: style_1.style.borderRadius, playerColour: this.props.oColour, playerId: textStrings.nought, playerBoldStyle: this.props.currentPlayer === reducer_1.Player.O ? "bolder" : "normal", drawn: this.props.drawCount, won: playerOWinCount, lost: playerOLossCount })));
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
        return React.createElement("tr", { style: style_1.style.scoreboard.rowStyle },
            React.createElement("td", { style: __assign({}, style_1.style.scoreboard.cellStyle, style_1.style.scoreboard.noughtCrossStyle, { borderBottomLeftRadius: this.props.borderRadius, fontWeight: this.props.playerBoldStyle, color: this.props.playerColour }) },
                " ",
                React.createElement("div", { style: this.props.isCurrent ? {
                        animationDuration: pulseTimeout + "ms",
                        animationTimingFunction: animationTimingFunction,
                        animationIterationCount: "infinite",
                        animationName: Radium.keyframes(createPulseKeyframes(style_1.pulseIncrease))
                    } : {} }, this.props.playerId)),
            React.createElement("td", { style: style_1.style.scoreboard.cellStyle },
                React.createElement(Pulse, { inSignal: this.state.inSignal, timeout: pulseTimeout, pulseAmount: style_1.pulseIncrease }, function (state, props, pulseStyle) {
                    return React.createElement("div", { style: [pulseStyle, { color: style_1.style.scoreboard.winColour, animationTimingFunction: animationTimingFunction }] }, _this.props.won);
                })),
            React.createElement("td", { style: __assign({}, style_1.style.scoreboard.cellStyle, { color: style_1.style.scoreboard.loseColour }) }, this.props.lost),
            React.createElement("td", { style: __assign({}, style_1.style.scoreboard.cellStyle, { color: style_1.style.scoreboard.drawColour, borderBottomRightRadius: this.props.borderRadius }) },
                " ",
                this.props.drawn));
    };
    return ScoreboardPlayer;
}(React.Component));
ScoreboardPlayer.defaultProps = {
    borderRadius: 0
};
var RadiumScoreboardPlayer = configuredRadium_1.ConfiguredRadium(ScoreboardPlayer);
//#endregion
//#endregion
//#endregion
var store = storage_1.createLocalStorageStore(reducer_1.reducer, function (s) {
    s.fontLoadingState = webFontLoader_2.FontLoadingState.NotStarted;
    return s;
});
ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(webFontLoader_1.ConnectedWebFontLoader, { config: { google: { families: [fontFamilies.textFontFamily, fontFamilies.noughtCrossFontFamily], text: textStrings.letters } } },
        React.createElement(ticTacToeApp_1.ConnectedTicTacToeApp, { minimumLoadingIndicator: 2000 }))), document.getElementById("example"));
//# sourceMappingURL=index.js.map