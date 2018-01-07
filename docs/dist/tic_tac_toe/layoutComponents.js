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
var HorizontalCenter = (function (_super) {
    __extends(HorizontalCenter, _super);
    function HorizontalCenter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HorizontalCenter.prototype.render = function () {
        return React.createElement("div", { style: { display: "table", margin: "0 auto" } }, this.props.children);
    };
    return HorizontalCenter;
}(React.Component));
exports.HorizontalCenter = HorizontalCenter;
var VerticallyCenteredContainer = (function (_super) {
    __extends(VerticallyCenteredContainer, _super);
    function VerticallyCenteredContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VerticallyCenteredContainer.prototype.render = function () {
        var containerStyle = {
            display: "table",
            position: "absolute",
            height: "100%",
            width: " 100%"
        };
        if (this.props.backgroundColor) {
            containerStyle.backgroundColor = this.props.backgroundColor;
        }
        return React.createElement("div", { style: containerStyle },
            React.createElement("div", { style: {
                    display: "table-cell",
                    verticalAlign: "middle"
                } }, this.props.children));
    };
    return VerticallyCenteredContainer;
}(React.Component));
exports.VerticallyCenteredContainer = VerticallyCenteredContainer;
//# sourceMappingURL=layoutComponents.js.map