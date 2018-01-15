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
var reducer_1 = require("./reducers/reducer");
var react_redux_1 = require("react-redux");
var style_1 = require("./style");
var textStrings = require("./textStrings");
var scoreboardPlayer_1 = require("./scoreboardPlayer");
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
                React.createElement(scoreboardPlayer_1.RadiumScoreboardPlayer, { isCurrent: this.props.currentPlayer === reducer_1.Player.X, playerColour: this.props.xColour, playerId: textStrings.cross, playerBoldStyle: this.props.currentPlayer === reducer_1.Player.X ? "bolder" : "normal", drawn: this.props.drawCount, won: this.props.playerXWinCount, lost: playerXLossCount }),
                React.createElement(scoreboardPlayer_1.RadiumScoreboardPlayer, { isCurrent: this.props.currentPlayer === reducer_1.Player.O, borderRadius: style_1.style.borderRadius, playerColour: this.props.oColour, playerId: textStrings.nought, playerBoldStyle: this.props.currentPlayer === reducer_1.Player.O ? "bolder" : "normal", drawn: this.props.drawCount, won: playerOWinCount, lost: playerOLossCount })));
    };
    return Scoreboard;
}(React.Component));
exports.ConnectedScoreboard = react_redux_1.connect(function (state) {
    var gameState = state.gameState;
    var scoreboardState = {
        currentPlayer: gameState.currentPlayer,
        drawCount: gameState.drawCount,
        playCount: gameState.playCount,
        playerXWinCount: gameState.playerXWinCount,
        oColour: state.playerColours.oColour,
        xColour: state.playerColours.xColour
    };
    return scoreboardState;
})(Scoreboard);
//# sourceMappingURL=scoreboard.js.map