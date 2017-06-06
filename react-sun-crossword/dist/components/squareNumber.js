"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var SquareNumber = (function (_super) {
    __extends(SquareNumber, _super);
    function SquareNumber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SquareNumber.prototype.render = function () {
        return React.createElement("span", { style: {
                position: "absolute", left: "2px", top: 0, fontSize: "10px", fontWeight: 700
            } }, this.props.number);
    };
    return SquareNumber;
}(React.Component));
exports.SquareNumber = SquareNumber;
//# sourceMappingURL=squareNumber.js.map