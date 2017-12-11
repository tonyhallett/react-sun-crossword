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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var commonStyling_1 = require("./commonStyling");
var SquareLetter = (function (_super) {
    __extends(SquareLetter, _super);
    function SquareLetter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SquareLetter.prototype.render = function () {
        var fontColor = this.props.autoSolvedGuessing ? commonStyling_1.commonColourStyles.letterSolved.backgroundColor : commonStyling_1.commonColourStyles.letter.backgroundColor;
        return React.createElement("span", { style: { color: fontColor, verticalAlign: "middle", fontSize: "20px", fontWeight: 700, lineHeight: "28px" } }, this.props.letter);
    };
    return SquareLetter;
}(React.Component));
exports.SquareLetter = SquareLetter;
//# sourceMappingURL=squareLetter.js.map