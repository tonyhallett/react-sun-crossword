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
function withInOnMount(Component) {
    var inOnMount = (function (_super) {
        __extends(InOnMount, _super);
        function InOnMount(props) {
            var _this = _super.call(this, props) || this;
            _this.inOnMount = false;
            _this.onEnter = function (node) {
                if (_this.props.onEnter) {
                    _this.props.onEnter(node, _this.inOnMount);
                }
            };
            _this.onEntering = function (node) {
                if (_this.props.onEntering) {
                    _this.props.onEntering(node, _this.inOnMount);
                }
            };
            _this.onEntered = function (node) {
                if (_this.props.onEntered) {
                    _this.props.onEntered(node, _this.inOnMount);
                }
                _this.inOnMount = false;
            };
            var isIn = false;
            if (props.in) {
                if (props.appear) {
                    _this.inOnMount = true;
                }
                else {
                    isIn = true; //not sure ....
                }
            }
            _this.state = { in: isIn };
            return _this;
        }
        InOnMount.prototype.componentDidMount = function () {
            var self = this;
            if (this.inOnMount) {
                this.requestAnimationStart(function () { return self.setState({ in: true }); });
            }
        };
        InOnMount.prototype.requestAnimationStart = function (callback) {
            // Feature detect rAF, fallback to setTimeout
            if (window.requestAnimationFrame) {
                // Chrome and Safari have a bug where calling rAF once returns the current
                // frame instead of the next frame, so we need to call a double rAF here.
                // See https://crbug.com/675795 for more.
                window.requestAnimationFrame(function () {
                    window.requestAnimationFrame(callback);
                });
            }
            else {
                setTimeout(callback, 0);
            }
        };
        InOnMount.prototype.render = function () {
            var _a = this.props, inn = _a["in"], onEnter = _a.onEnter, onEntering = _a.onEntering, onExiting = _a.onExiting, appear = _a.appear, passThroughProps = __rest(_a, ["in", "onEnter", "onEntering", "onExiting", "appear"]);
            var transitionProps = __assign({}, passThroughProps, { in: this.state.in, onEnter: this.onEnter, onEntering: this.onEntering, onEntered: this.onEntered });
            return React.createElement(Component, __assign({}, transitionProps));
        };
        InOnMount.prototype.componentWillReceiveProps = function (newProps) {
            this.setState({ in: newProps.in });
        };
        return InOnMount;
    }(React.Component));
    return inOnMount;
}
exports.withInOnMount = withInOnMount;
//# sourceMappingURL=withInOnMount.js.map