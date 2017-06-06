"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ClueNumber = (function (_super) {
    __extends(ClueNumber, _super);
    function ClueNumber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClueNumber.prototype.render = function () {
        return React.createElement("span", { style: {
                fontSize: "10px", fontWeight: 700
            } }, this.props.number);
    };
    return ClueNumber;
}(React.Component));
exports.ClueNumber = ClueNumber;
//# sourceMappingURL=clueNumber.js.map