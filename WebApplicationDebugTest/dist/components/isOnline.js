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
var IsOnline = (function (_super) {
    __extends(IsOnline, _super);
    function IsOnline(props) {
        var _this = _super.call(this, props) || this;
        _this.onlineChanged = function () {
            _this.setState({ isOnline: navigator.onLine });
        };
        _this.state = { isOnline: false };
        return _this;
    }
    IsOnline.prototype.componentDidMount = function () {
        window.addEventListener("online", this.onlineChanged);
        window.addEventListener("offline", this.onlineChanged);
        this.setState({ isOnline: navigator.onLine });
    };
    IsOnline.prototype.render = function () {
        return React.createElement("div", null, this.state.isOnline ? "Online" : "Offline");
    };
    return IsOnline;
}(React.Component));
exports.IsOnline = IsOnline;
//# sourceMappingURL=isOnline.js.map