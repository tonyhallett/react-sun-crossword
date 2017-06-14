"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Divider = (function (_super) {
    __extends(Divider, _super);
    function Divider(props) {
        return _super.call(this, props) || this;
    }
    Divider.prototype.render = function () {
        return React.createElement("div", { style: { display: "block", height: "1px", backgroundColor: this.props.color } });
    };
    return Divider;
}(React.Component));
Divider.defaultProps = {
    color: "rgba(0,0,0,.12)"
};
exports.Divider = Divider;
//# sourceMappingURL=divider.js.map