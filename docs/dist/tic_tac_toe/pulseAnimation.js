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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Radium = require("radium");
function scale3d(a, b, c) {
    return 'scale3d(' + a + ', ' + b + ', ' + c + ')';
}
;
function createPulseKeyframes(pulseAmount) {
    var fromTo = scale3d(1, 1, 1);
    return {
        from: {
            transform: fromTo
        },
        '50%': {
            transform: scale3d(pulseAmount, pulseAmount, pulseAmount)
        },
        to: {
            transform: fromTo
        }
    };
}
exports.createPulseKeyframes = createPulseKeyframes;
function withPulse(Component) {
    var pulse = (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.render = function () {
            var _this = this;
            var pulse = createPulseKeyframes(this.props.pulseAmount);
            //passthrough to do
            return React.createElement(Component, __assign({}, this.props), function (state, additionalProps) {
                var transitionStyle = {};
                switch (state) {
                    case "entering":
                    case "entered":
                        transitionStyle = {
                            animationDuration: _this.props.timeout + "ms",
                            animationName: Radium.keyframes(pulse)
                        };
                        break;
                }
                return _this.props.children(state, additionalProps, transitionStyle);
            });
        };
        return class_1;
    }(React.Component));
    return pulse;
}
exports.withPulse = withPulse;
//# sourceMappingURL=pulseAnimation.js.map