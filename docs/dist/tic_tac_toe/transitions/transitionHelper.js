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
function withTransitionHelper(Component) {
    var transitionHelper = (function (_super) {
        __extends(TransitionHelper, _super);
        function TransitionHelper() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TransitionHelper.prototype.render = function () {
            var _this = this;
            var _a = this.props, enterStyle = _a.enterStyle, exitStyle = _a.exitStyle, enterTransition = _a.enterTransition, exitTransition = _a.exitTransition, passThroughProps = __rest(_a, ["enterStyle", "exitStyle", "enterTransition", "exitTransition"]);
            var transition = React.createElement(Component, __assign({}, passThroughProps), function (state) {
                var style = {};
                switch (state) {
                    case "entering":
                    case "entered":
                        style = __assign({}, _this.props.enterStyle);
                        style.transition = _this.props.enterTransition;
                        break;
                    case "exiting":
                    case "exited":
                        style = __assign({}, _this.props.exitStyle);
                        style.transition = _this.props.exitTransition ? _this.props.exitTransition : _this.props.enterTransition;
                        break;
                }
                //should use the isValidElement guard https://stackoverflow.com/questions/42261783/how-to-assign-the-correct-typing-to-react-cloneelement-when-giving-properties-to
                var childElement = _this.props.children;
                var childStyle = childElement.props.style;
                var newStyle = __assign({}, childStyle, style);
                var newProps = {
                    style: newStyle
                };
                var clonedElement = React.cloneElement(childElement, newProps);
                return clonedElement;
            });
            return transition;
        };
        return TransitionHelper;
    }(React.Component));
    return transitionHelper;
}
exports.withTransitionHelper = withTransitionHelper;
function withTransitionHelperFn(Component) {
    var transitionHelper = (function (_super) {
        __extends(TransitionHelper, _super);
        function TransitionHelper() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TransitionHelper.prototype.render = function () {
            var _this = this;
            var _a = this.props, enterStyle = _a.enterStyle, exitStyle = _a.exitStyle, enterTransition = _a.enterTransition, exitTransition = _a.exitTransition, passThroughProps = __rest(_a, ["enterStyle", "exitStyle", "enterTransition", "exitTransition"]);
            var transition = React.createElement(Component, __assign({}, passThroughProps), function (state) {
                var stateStyle = {};
                var stateTransition = "";
                switch (state) {
                    case "entering":
                    case "entered":
                        stateTransition = _this.props.enterTransition;
                        stateStyle = __assign({}, _this.props.enterStyle);
                        break;
                    case "exiting":
                    case "exited":
                        stateTransition = _this.props.exitTransition ? _this.props.exitTransition : _this.props.enterTransition;
                        stateStyle = __assign({}, _this.props.exitStyle);
                        break;
                }
                if (typeof _this.props.children === 'function') {
                    return _this.props.children(state, passThroughProps, stateStyle, stateTransition);
                }
                else {
                    throw new Error("withTransitionHelperFn requires child function");
                }
            });
            return transition;
        };
        return TransitionHelper;
    }(React.Component));
    return transitionHelper;
}
exports.withTransitionHelperFn = withTransitionHelperFn;
function transitionHelperFn(cb, provider) {
    var transitionHelper = function (state, props) {
        var res = provider(state, props);
        var stateStyle;
        var stateTransition;
        switch (state) {
            case "entering":
            case "entered":
                stateStyle = res.enterStyle;
                stateTransition = res.enterTransition;
                break;
            case "exiting":
            case "exited":
                stateStyle = res.exitStyle;
                stateTransition = res.exitTransition ? res.exitTransition : res.enterTransition;
                break;
        }
        return cb(state, props, stateStyle, stateTransition);
    };
    return transitionHelper;
}
//var colourTransitionProvider: TransitionProvider<ColourChangeProps> = function (state: TransitionState, props: ColourChangeProps) {
//    var enterStyle = {};
//    var exitColor = Color(props.exitColour);
//    var enterColor;
//    var changeAmount = props.change;
//    //note that whiten/blacken is not css3!
//    switch (props.colourChangeType) {
//        case ColourChangeType.darken:
//            enterColor = exitColor.darken(changeAmount)
//            break;
//        case ColourChangeType.desaturate:
//            enterColor = exitColor.desaturate(changeAmount);
//            break;
//        case ColourChangeType.fade:
//            enterColor = exitColor.fade(changeAmount);
//            break;
//        case ColourChangeType.lighten:
//            enterColor = exitColor.lighten(changeAmount);
//            break;
//        case ColourChangeType.opaquer:
//            enterColor = exitColor.opaquer(changeAmount);
//            break;
//        case ColourChangeType.saturate:
//            enterColor = exitColor.saturate(changeAmount);
//            break;
//    }
//    var colorString = enterColor.toString();
//    enterStyle[props.propName] = colorString;//seems that once change to different model cannot go back
//    var exitStyle = {};
//    var exitColourString = exitColor.toString();
//    exitStyle[props.propName] = exitColourString;
//    return {
//        enterStyle: enterStyle,
//        exitStyle: exitStyle,
//        enterTransition: props.enterTransition,
//        exitTransition: props.exitTransition
//    }
//}
//#endregion
//# sourceMappingURL=transitionHelper.js.map