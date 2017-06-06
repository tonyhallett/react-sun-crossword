"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var AutoSolveButton = (function (_super) {
    __extends(AutoSolveButton, _super);
    function AutoSolveButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AutoSolveButton.prototype.render = function () {
        var _this = this;
        var text = "Auto Solve";
        if (this.props.isAutoSolving) {
            text = "Stop Auto Solving";
        }
        //will add styling later
        return React.createElement("button", { onClick: function () { _this.props.clicked(); } }, text);
    };
    return AutoSolveButton;
}(React.Component));
exports.AutoSolveButton = AutoSolveButton;
//# sourceMappingURL=autoSolveButton.js.map