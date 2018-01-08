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
var configuredRadium_1 = require("./configuredRadium");
var react_transition_group_1 = require("react-transition-group");
var Color = require("Color");
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
//only used by withColourChangeTransitionFn
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
//#endregion
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
    var TransitionHelper = withTransitionHelperFn(Component);
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
function withColourChangeTransition(Component) {
    var TransitionHelper = withTransitionHelper(Component);
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
var colourTransitionProvider = function (state, props) {
    var enterStyle = {};
    var exitColor = Color(props.exitColour);
    var enterColor;
    var changeAmount = props.change;
    //note that whiten/blacken is not css3!
    switch (props.colourChangeType) {
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
    enterStyle[props.propName] = colorString; //seems that once change to different model cannot go back
    var exitStyle = {};
    var exitColourString = exitColor.toString();
    exitStyle[props.propName] = exitColourString;
    return {
        enterStyle: enterStyle,
        exitStyle: exitStyle,
        enterTransition: props.enterTransition,
        exitTransition: props.exitTransition
    };
};
//#endregion
//these will not be in here
var RadiumTransition = configuredRadium_1.ConfiguredRadium(react_transition_group_1.Transition);
exports.AutoOutInOnMount = withAutoOut(withInOnMount(RadiumTransition));
exports.AutoOutInOnMountColourChangeRadiumTransition = withColourChangeTransitionFn(exports.AutoOutInOnMount);
//# sourceMappingURL=transitions.js.map