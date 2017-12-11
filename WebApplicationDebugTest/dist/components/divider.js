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
var javascriptPolyfills_1 = require("../helpers/javascriptPolyfills");
var Divider = (function (_super) {
    __extends(Divider, _super);
    function Divider(props) {
        return _super.call(this, props) || this;
    }
    Divider.prototype.render = function () {
        var style = {
            display: "block",
            height: this.props.pixelHeight + "px",
            backgroundColor: this.props.color
        };
        style = javascriptPolyfills_1.objectAssign({}, style, this.props.additionalStyle);
        return React.createElement("div", { style: style });
    };
    return Divider;
}(React.Component));
Divider.defaultProps = {
    color: "rgba(0,0,0,.12)",
    pixelHeight: 1
};
exports.Divider = Divider;
//# sourceMappingURL=divider.js.map