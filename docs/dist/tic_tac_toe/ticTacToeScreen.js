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
var reducer_1 = require("./reducers/reducer");
var actions_1 = require("./actions");
var style_1 = require("./style");
var fontFamilies = require("./fontFamilies");
var textStrings = require("./textStrings");
var idsAndClassNames = require("./idsAndClassNames");
var modalEnhanced_1 = require("./modalEnhanced");
var configuredRadium_1 = require("./configuredRadium");
var scoreboard_1 = require("./scoreboard");
var ticTacToeBoard_1 = require("./ticTacToeBoard");
var mergeAnimations_1 = require("./mergeAnimations");
var react_animations_1 = require("react-animations");
var TicTacToeScreen = (function (_super) {
    __extends(TicTacToeScreen, _super);
    function TicTacToeScreen(props) {
        var _this = _super.call(this, props) || this;
        _this.flipDuration = 1000;
        _this.modalShouldOpen = function () {
            var playState = _this.props.playState;
            return playState === reducer_1.PlayState.Draw || playState === reducer_1.PlayState.O || playState === reducer_1.PlayState.X;
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
                        _this.props.arrowPressed(actions_1.ArrowDirection.Down);
                        break;
                    case "ArrowUp":
                        _this.props.arrowPressed(actions_1.ArrowDirection.Up);
                        break;
                    case "ArrowLeft":
                        _this.props.arrowPressed(actions_1.ArrowDirection.Left);
                        break;
                    case "ArrowRight":
                        _this.props.arrowPressed(actions_1.ArrowDirection.Right);
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
            return React.createElement("div", { style: style_1.style.winDrawContainerStyle },
                React.createElement("span", { style: { fontFamily: fontFamilies.textFontFamilyWithDefault } }, textStrings.player + " "),
                React.createElement("span", { style: { fontFamily: fontFamilies.noughtCrossFontFamily, color: playerColour } }, playerId + " "),
                React.createElement("span", { style: { fontFamily: fontFamilies.textFontFamilyWithDefault } }, textStrings.wonMessage));
        }
        var messageElement = React.createElement("div", null);
        switch (props.playState) {
            case reducer_1.PlayState.X:
                messageElement = getWinner(textStrings.cross, props.xColour);
                break;
            case reducer_1.PlayState.O:
                messageElement = getWinner(textStrings.nought, props.oColour);
                break;
            case reducer_1.PlayState.Draw:
                messageElement = React.createElement("div", { style: __assign({}, style_1.style.winDrawContainerStyle, { fontFamily: fontFamilies.textFontFamilyWithDefault }) }, textStrings.gameDrawn);
                break;
        }
        return messageElement;
    };
    TicTacToeScreen.prototype.componentWillReceiveProps = function (props) {
        if (props.playState !== this.props.playState && this.props.playState === reducer_1.PlayState.Playing) {
            this.setState({ winDrawElement: this.getWinDrawElement(props) });
        }
    };
    TicTacToeScreen.prototype.render = function () {
        var buttonHasHover = Radium.getState(this.state, 'button', ':hover');
        var buttonAnimation = mergeAnimations_1.mergeAnimations([this.props.playState !== reducer_1.PlayState.Playing ? style_1.shakeAnimationStyle : null, buttonHasHover ? style_1.buttonHoverFocusBrightnessAnimationStyle : null]);
        var playAgainUnderlineLetter = textStrings.playAgainText[0];
        var playAgainRemainder = textStrings.playAgainText.substr(1);
        return React.createElement("div", { tabIndex: 0, ref: this.keyContainerRef, onKeyDown: this.keyDown },
            React.createElement("span", { style: { animationName: this.keyframesFlipInX } }),
            React.createElement("span", { style: { animationName: this.keyframesFlipOutX } }),
            React.createElement(Radium.Style, { rules: {
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
                React.createElement("div", { style: { marginBottom: style_1.style.componentMargin } },
                    React.createElement(scoreboard_1.ConnectedScoreboard, null)),
                React.createElement(ticTacToeBoard_1.ConnectedTicTacToeBoard, null),
                React.createElement("div", { role: "button", key: "button", className: idsAndClassNames.inactiveCursorClassName, style: [{ ":focus": {} }, { ":hover": style_1.buttonHoverShadowStyle }, { borderRadius: style_1.style.borderRadius, marginTop: style_1.style.componentMargin, fontWeight: style_1.thButtonFontWeight, fontFamily: fontFamilies.textFontFamilyWithDefault, fontSize: style_1.fontSize, borderStyle: "none", paddingTop: 10, paddingBottom: 10, backgroundColor: style_1.buttonBackgroundColor, width: "100%", cursor: "pointer" }, style_1.style.componentBoxShadow, buttonAnimation], onClick: this.props.playAgain },
                    React.createElement("div", { style: { marginLeft: "auto", marginRight: "auto", width: "99%", textAlign: "center" } },
                        React.createElement("span", { style: { textDecoration: "underline", display: "inlineBlock", userSelect: "none" } }, playAgainUnderlineLetter),
                        React.createElement("span", { style: { display: "inlineBlock", userSelect: "none" } }, playAgainRemainder)))),
            React.createElement(modalEnhanced_1.ModalCover, { parentSelector: this.getModalParent, contentStyle: { backgroundColor: style_1.componentBackgroundColor }, closeTimeoutMS: this.flipDuration, elementSelector: "#" + idsAndClassNames.ticTacToeBoardId, isOpen: this.modalShouldOpen(), onRequestClose: this.props.finishedConfirmed }, this.state.winDrawElement));
    };
    return TicTacToeScreen;
}(React.Component));
exports.ConnectedTicTacToeScreen = react_redux_1.connect(function (state) {
    var gameState = state.gameState;
    return {
        xColour: state.playerColours.xColour,
        playState: gameState.playState,
        oColour: state.playerColours.oColour,
        selectedSquare: gameState.selectedSquare,
        board: gameState.board
    };
}, function (dispatch) {
    return {
        playAgain: function () {
            dispatch(actions_1.playAgain());
        },
        finishedConfirmed: function () {
            dispatch(actions_1.finishedConfirmed());
        },
        arrowPressed: function (direction) {
            dispatch(actions_1.arrowPressed(direction));
        },
        takeGo: function (row, column) {
            dispatch(actions_1.takeGo(row, column));
        }
    };
})(configuredRadium_1.ConfiguredRadium(TicTacToeScreen));
//# sourceMappingURL=ticTacToeScreen.js.map