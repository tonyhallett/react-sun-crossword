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