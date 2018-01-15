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
var Color = require("Color");
var transitionHelper_1 = require("./transitionHelper");
var ColourChangeType;
(function (ColourChangeType) {
    ColourChangeType[ColourChangeType["lighten"] = 0] = "lighten";
    ColourChangeType[ColourChangeType["darken"] = 1] = "darken";
    ColourChangeType[ColourChangeType["saturate"] = 2] = "saturate";
    ColourChangeType[ColourChangeType["desaturate"] = 3] = "desaturate";
    ColourChangeType[ColourChangeType["fade"] = 4] = "fade";
    ColourChangeType[ColourChangeType["opaquer"] = 5] = "opaquer";
})(ColourChangeType = exports.ColourChangeType || (exports.ColourChangeType = {}));
function withColourChangeTransitionFn(Component) {
    var TransitionHelper = transitionHelper_1.withTransitionHelperFn(Component);
    var colourChangeTransition = (function (_super) {
        __extends(ColourChangeTransition, _super);
        function ColourChangeTransition() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ColourChangeTransition.prototype.render = function () {
            var enterStyle = {};
            var exitColor = Color(this.props.exitColour);
            var enterColor;
            var changeAmount = this.props.change;
            //note that whiten/blacken is not css3!
            switch (this.props.colourChangeType) {
                case ColourChangeType.darken:
                    enterColor = exitColor.darken(changeAmount);
                    break;
                case ColourChangeType.desaturate:
                    enterColor = exitColor.desaturate(changeAmount);
                    break;
                case ColourChangeType.fade:
                    enterColor = exitColor.fade(changeAmount);
                    break;
                case ColourChangeType.lighten:
                    enterColor = exitColor.lighten(changeAmount);
                    break;
                case ColourChangeType.opaquer:
                    enterColor = exitColor.opaquer(changeAmount);
                    break;
                case ColourChangeType.saturate:
                    enterColor = exitColor.saturate(changeAmount);
                    break;
            }
            var colorString = enterColor.toString();
            enterStyle[this.props.propName] = colorString; //seems that once change to different model cannot go back
            var exitStyle = {};
            var exitColourString = exitColor.toString();
            exitStyle[this.props.propName] = exitColourString;
            var _a = this.props, change = _a.change, exitColour = _a.exitColour, colourChangeType = _a.colourChangeType, propName = _a.propName, passThroughProps = __rest(_a, ["change", "exitColour", "colourChangeType", "propName"]);
            return React.createElement(TransitionHelper, __assign({ enterStyle: enterStyle, exitStyle: exitStyle }, this.props));
        };
        return ColourChangeTransition;
    }(React.Component));
    return colourChangeTransition;
}
exports.withColourChangeTransitionFn = withColourChangeTransitionFn;
function withColourChangeTransition(Component) {
    var TransitionHelper = transitionHelper_1.withTransitionHelper(Component);
    var colourChangeTransition = (function (_super) {
        __extends(ColourChangeTransition, _super);
        function ColourChangeTransition() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ColourChangeTransition.prototype.render = function () {
            var enterStyle = {};
            var exitColor = Color(this.props.exitColour);
            var enterColor;
            var changeAmount = this.props.change;
            //note that whiten/blacken is not css3!
            switch (this.props.colourChangeType) {
                case ColourChangeType.darken:
                    enterColor = exitColor.darken(changeAmount);
                    break;
                case ColourChangeType.desaturate:
                    enterColor = exitColor.desaturate(changeAmount);
                    break;
                case ColourChangeType.fade:
                    enterColor = exitColor.fade(changeAmount);
                    break;
                case ColourChangeType.lighten:
                    enterColor = exitColor.lighten(changeAmount);
                    break;
                case ColourChangeType.opaquer:
                    enterColor = exitColor.opaquer(changeAmount);
                    break;
                case ColourChangeType.saturate:
                    enterColor = exitColor.saturate(changeAmount);
                    break;
            }
            var colorString = enterColor.toString();
            enterStyle[this.props.propName] = colorString; //seems that once change to different model cannot go back
            var exitStyle = {};
            var exitColourString = exitColor.toString();
            exitStyle[this.props.propName] = exitColourString;
            var _a = this.props, change = _a.change, exitColour = _a.exitColour, colourChangeType = _a.colourChangeType, propName = _a.propName, passThroughProps = __rest(_a, ["change", "exitColour", "colourChangeType", "propName"]);
            return React.createElement(TransitionHelper, __assign({ enterStyle: enterStyle, exitStyle: exitStyle }, this.props));
        };
        return ColourChangeTransition;
    }(React.Component));
    return colourChangeTransition;
}
exports.withColourChangeTransition = withColourChangeTransition;
//# sourceMappingURL=colourChangeTransition.js.map