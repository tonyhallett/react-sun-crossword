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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Radium = require("Radium");
var react_redux_1 = require("react-redux");
var style_1 = require("./style");
var reducer_1 = require("./reducers/reducer");
var transitions_1 = require("./transitions/transitions");
var connectHelpers_1 = require("./connectHelpers");
var actions_1 = require("./actions");
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
    TicTacToeSquare.prototype.getFocusAnimationStyle = function () {
        var startEndBoxShadow = style_1.style.ticTacToeSquare.focusAnimation.startEndBoxShadow + this.props.currentPlayerColour + " inset";
        var focusKeyframes = {
            '0%': {
                boxShadow: startEndBoxShadow
            },
            '50%': {
                boxShadow: style_1.style.ticTacToeSquare.focusAnimation.fiftyPercentBoxShadow + this.props.currentPlayerColour + " inset"
            },
            '100%': {
                boxShadow: startEndBoxShadow
            }
        };
        return __assign({ animationName: Radium.keyframes(focusKeyframes) }, style_1.style.ticTacToeSquare.focusAnimation.animationProps);
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
        return React.createElement(transitions_1.AutoOutInOnMountColourChangeRadiumTransition, { appear: true, inSignal: this.state.inSignal, propName: "backgroundColor", timeout: transitionDuration, enterTransition: "background-color " + transitionDuration + "ms linear", exitColour: exitColour, change: 0.1, colourChangeType: transitions_1.ColourChangeType.lighten }, function (state, props, stateStyle, stateTransition) {
            var transitionStyle;
            if (_this.state.kill) {
                transitionStyle = { backgroundColor: exitColour };
            }
            else {
                transitionStyle = __assign({}, stateStyle, { transition: stateTransition });
            }
            return React.createElement("td", { style: [style_1.style.ticTacToeSquare.style, specificStyle, transitionStyle], onMouseDown: function (e) { e.preventDefault(); }, onClick: _this.squareSelected },
                React.createElement("div", { style: [{ width: "100%", height: "100%", userSelect: "none" }, _this.props.isSelected ? _this.getFocusAnimationStyle() : null] },
                    " ",
                    _this.props.squareText));
        });
    };
    return TicTacToeSquare;
}(React.Component));
function getSquareTextAndColour(state, rowIndex, colIndex) {
    var squareGo = state.gameState.board[rowIndex][colIndex];
    var squareGoColour = "white";
    var squareText = "";
    switch (squareGo) {
        case reducer_1.SquareGo.O:
            squareGoColour = state.playerColours.oColour;
            squareText = "O";
            break;
        case reducer_1.SquareGo.X:
            squareText = "X";
            squareGoColour = state.playerColours.xColour;
            break;
        case reducer_1.SquareGo.None:
            break;
    }
    return { colour: squareGoColour, text: squareText };
}
exports.ConnectedTicTacToeSquare = react_redux_1.connect(function (state, ownProps) {
    var gameState = state.gameState;
    var _a = getSquareTextAndColour(state, ownProps.rowIndex, ownProps.colIndex), colour = _a.colour, text = _a.text;
    var squareGo = gameState.board[ownProps.rowIndex][ownProps.colIndex];
    var canGo = gameState.playState === reducer_1.PlayState.Playing && squareGo === reducer_1.SquareGo.None;
    var isSelected = false;
    if (gameState.selectedSquare) {
        isSelected = gameState.selectedSquare.column === ownProps.colIndex && gameState.selectedSquare.row == ownProps.rowIndex;
    }
    var connectState = {
        squareGoColour: colour,
        squareText: text,
        canGo: canGo,
        isSelected: isSelected,
        currentPlayerColour: connectHelpers_1.getCurrentPlayerColour(state)
    };
    return connectState;
}, function (dispatch, ownProps) {
    return {
        takeGo: function () {
            dispatch(actions_1.takeGo(ownProps.rowIndex, ownProps.colIndex));
        }
    };
})(TicTacToeSquare);
//# sourceMappingURL=ticTacToeSquare.js.map