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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function withAutoOut(Component) {
    var autoOut = (function (_super) {
        __extends(AutoOutTransition, _super);
        function AutoOutTransition(props) {
            var _this = _super.call(this, props) || this;
            _this.onEntered = function (node, isAppearing) {
                _this.props.onEntered ? _this.props.onEntered(node, isAppearing) : void 0;
                _this.setState({ in: false });
            };
            _this.state = { in: props.inSignal !== null };
            return _this;
        }
        AutoOutTransition.prototype.componentWillReceiveProps = function (newProps) {
            if (newProps.inSignal !== null) {
                if (newProps.inSignal !== this.props.inSignal) {
                    this.setState({ in: true });
                }
            }
            else {
                this.setState({ in: false });
            }
        };
        AutoOutTransition.prototype.render = function () {
            var _a = this.props, onEntered = _a.onEntered, inn = _a["in"], inSignal = _a.inSignal, passThroughProps = __rest(_a, ["onEntered", "in", "inSignal"]);
            var transitionProps = __assign({}, passThroughProps, { onEntered: this.onEntered, in: this.state.in });
            return React.createElement(Component, __assign({}, transitionProps));
        };
        return AutoOutTransition;
    }(React.Component));
    return autoOut;
}
exports.withAutoOut = withAutoOut;
//# sourceMappingURL=withAutoOut.js.map