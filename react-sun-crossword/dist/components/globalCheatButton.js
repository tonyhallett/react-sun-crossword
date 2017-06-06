"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var GlobalCheatButton = (function (_super) {
    __extends(GlobalCheatButton, _super);
    function GlobalCheatButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GlobalCheatButton.prototype.render = function () {
        var _this = this;
        var text = "Cheat";
        if (this.props.isCheating) {
            text = "Uncheat";
        }
        //will add styling later
        return React.createElement("button", { onClick: function () { _this.props.clicked(); } }, text);
    };
    return GlobalCheatButton;
}(React.Component));
exports.GlobalCheatButton = GlobalCheatButton;
//# sourceMappingURL=globalCheatButton.js.map