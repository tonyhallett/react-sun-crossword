"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var lightbulb_1 = require("./lightbulb");
var Lightbulbs = (function (_super) {
    __extends(Lightbulbs, _super);
    function Lightbulbs(props) {
        var _this = _super.call(this, props) || this;
        _this.buttonClicked = function () {
            _this.setState(function (prevState) {
                return { bulbOn: !prevState.bulbOn };
            });
        };
        _this.state = {
            bulbOn: false
        };
        return _this;
    }
    Lightbulbs.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement(lightbulb_1.Lightbulb, { on: this.state.bulbOn, rayColour: "red", onGlowColour: "red", text: "Cheat", id: "cheatBulb", bulbOuterColour: "red", innerGlowColour: "red" }),
            React.createElement(lightbulb_1.Lightbulb, { on: this.state.bulbOn, rayColour: "yellow", onGlowColour: "yellow", text: "Solve", id: "solveBulb", bulbOuterColour: "yellow", innerGlowColour: "yellow" }));
    };
    return Lightbulbs;
}(React.Component));
exports.Lightbulbs = Lightbulbs;
//# sourceMappingURL=Lighbulbs.js.map