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
var style_1 = require("./style");
var Radium = require("radium");
var configuredRadium_1 = require("./configuredRadium");
var pulseAnimation_1 = require("./transitions/pulseAnimation");
var transitions_1 = require("./transitions/transitions");
var Pulse = pulseAnimation_1.withPulse(transitions_1.AutoOutInOnMount);
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
                        animationName: Radium.keyframes(pulseAnimation_1.createPulseKeyframes(style_1.pulseIncrease))
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
exports.RadiumScoreboardPlayer = configuredRadium_1.ConfiguredRadium(ScoreboardPlayer);
//# sourceMappingURL=scoreboardPlayer.js.map