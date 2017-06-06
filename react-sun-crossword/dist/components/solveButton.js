"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var SolveButton = (function (_super) {
    __extends(SolveButton, _super);
    function SolveButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SolveButton.prototype.render = function () {
        var _this = this;
        var text = "Solve";
        if (this.props.isSolving) {
            text = "Unsolve";
        }
        //will add styling later
        return React.createElement("button", { onClick: function () { _this.props.clicked(); } }, text);
    };
    return SolveButton;
}(React.Component));
exports.SolveButton = SolveButton;
//# sourceMappingURL=solveButton.js.map