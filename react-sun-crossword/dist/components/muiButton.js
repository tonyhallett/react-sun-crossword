"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Color = require("Color");
var javascriptPolyfills_1 = require("../helpers/javascriptPolyfills");
var MuiButton = (function (_super) {
    __extends(MuiButton, _super);
    function MuiButton(props) {
        var _this = _super.call(this, props) || this;
        _this.ignoreMouseRippleDueToTouch = false;
        _this.onMouseDownCB = function (ev) {
            _this.showRipple(ev);
            // execute callback
            var fn = _this.props.onMouseDown;
            fn && fn(ev);
        };
        _this.onMouseUpCB = function (ev) {
            _this.ignoreMouseRippleDueToTouch = false;
            _this.hideRipple(ev);
            // execute callback
            var fn = _this.props.onMouseUp;
            fn && fn(ev);
        };
        _this.onMouseLeaveCB = function (ev) {
            _this.ignoreMouseRippleDueToTouch = false;
            _this.hideRipple(ev);
            // execute callback
            var fn = _this.props.onMouseLeave;
            fn && fn(ev);
        };
        _this.onTouchStartCB = function (ev) {
            _this.showRipple(ev);
            // execute callback
            var fn = _this.props.onTouchStart;
            fn && fn(ev);
        };
        _this.onTouchEndCB = function (ev) {
            _this.ignoreMouseRippleDueToTouch = true;
            _this.hideRipple(ev);
            // execute callback
            var fn = _this.props.onTouchEnd;
            fn && fn(ev);
        };
        _this.id = MuiButton.idName + (MuiButton.idCount++).toString();
        _this.state = { ripple: null };
        return _this;
    }
    //note that their componentDidMount sets props on the HTMLButtonElement but does not use them elsewhere
    MuiButton.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _this2 = this;
        var ripple = this.state.ripple;
        // trigger ripple animation
        if (ripple && !prevState.ripple) {
            this.requestAnimationFrame(function () {
                ripple.isAnimating = true;
                _this2.setState({ ripple: ripple });
            });
        }
    };
    MuiButton.prototype.requestAnimationFrame = function (callback) {
        var fn = window.requestAnimationFrame;
        if (fn)
            fn(callback);
        else
            setTimeout(callback, 0);
    };
    MuiButton.prototype.offset = function (element) {
        var win = window, rect = element.getBoundingClientRect(), scrollTop = this.scrollTop(win), scrollLeft = this.scrollLeft(win);
        return {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft,
            height: rect.height,
            width: rect.width
        };
    };
    MuiButton.prototype.scrollLeft = function (element, value) {
        var win = window;
        // get
        if (value === undefined) {
            if (element === win) {
                var docEl = document.documentElement;
                return (win.pageXOffset || docEl.scrollLeft) - (docEl.clientLeft || 0);
            }
            else {
                return element.scrollLeft;
            }
        }
        // set
        if (element === win)
            win.scrollTo(value, this.scrollTop(win));
        else
            element.scrollLeft = value;
    };
    MuiButton.prototype.scrollTop = function (element, value) {
        var win = window;
        // get
        if (value === undefined) {
            if (element === win) {
                var docEl = document.documentElement;
                return (win.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0);
            }
            else {
                return element.scrollTop;
            }
        }
        // set
        if (element === win)
            win.scrollTo(this.scrollLeft(win), value);
        else
            element.scrollTop = value;
    };
    MuiButton.prototype.isTouchEvent = function (ev) {
        return ev.type === 'touchstart' || ev.type === 'touchend';
    };
    MuiButton.prototype.showRipple = function (ev) {
        if (this.ignoreMouseRippleDueToTouch)
            return;
        // de-dupe touch events
        //if ('ontouchstart' in buttonEl && ev.type === 'mousedown') return;
        // get (x, y) position of click
        var buttonEl = this.buttonEl;
        var offset = this.offset(this.buttonEl);
        //looks like their code is incorrect-ish
        //s/b var clickEv: Touch | React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement> = void 0
        //but pageY does not exist on TouchEvent - lets hope that touch event always has touches
        var clickEv = void 0;
        if (this.isTouchEvent(ev)) {
            clickEv = ev.touches[0];
        }
        else {
            clickEv = ev;
        }
        //if (ev.type === 'touchstart' && ev.touches) clickEv = ev.touches[0]; else clickEv = ev;
        // calculate radius
        var radius = Math.sqrt(offset.width * offset.width + offset.height * offset.height);
        // add ripple to state
        //console.log("**************** Setting ripple")
        var ripple = {
            top: Math.round(clickEv.pageY - offset.top - radius) + 'px',
            left: Math.round(clickEv.pageX - offset.left - radius) + 'px',
            diameter: radius * 2 + 'px',
            isAnimating: false
        };
        //console.log(ripple);
        this.setState({ ripple: ripple });
    };
    MuiButton.prototype.hideRipple = function (ev) {
        this.setState({
            ripple: null
        });
    };
    MuiButton.prototype.getRGBString = function (colour) {
        var rgbArray = colour.rgb().array().map(function (num) {
            return Math.round(num);
        });
        return "rgb(" + rgbArray[0] + "," + rgbArray[1] + "," + rgbArray[2] + ")";
    };
    MuiButton.prototype.render = function () {
        var _this = this;
        var mergedStyle = javascriptPolyfills_1.objectAssign({}, MuiButton.defaultButtonStyle, this.props.buttonStyle);
        var dynamicStylePropertyNames = ["backgroundColor", "cursor", "color"];
        dynamicStylePropertyNames.forEach(function (pName) {
            var styleValue = mergedStyle[pName];
            this[pName] = styleValue;
            delete mergedStyle[pName];
        }.bind(this));
        this.buttonStyle = mergedStyle;
        var rippleStyle = {};
        var rippleMainClass = 'mui-ripple';
        var rippleActiveClass = 'mui--is-visible';
        var rippleIsAnimatingClass = 'mui--is-animating';
        var rippleCls = rippleMainClass;
        var ripple = this.state.ripple;
        if (ripple) {
            rippleCls += (' ' + rippleActiveClass);
            if (ripple.isAnimating)
                rippleCls += (' ' + rippleIsAnimatingClass);
            rippleStyle = {
                width: ripple.diameter,
                height: ripple.diameter,
                top: ripple.top,
                left: ripple.left
            };
        }
        var buttonSelector = "#" + this.id;
        var backgroundColor = this.backgroundColor;
        var bgColourColour = Color(backgroundColor);
        var lightenColour = bgColourColour.lighten(this.props.lightenPercentage);
        var lightenColorRGB = this.getRGBString(lightenColour);
        var thisButtonHoverOrFocusSelector = buttonSelector + ":hover," + buttonSelector + ":focus";
        var thisButtonHoverOrFocusOrActiveSelector = thisButtonHoverOrFocusSelector + "," + buttonSelector + ":active";
        var hoverFocusBoxShadowRaisedCss = thisButtonHoverOrFocusSelector + "{ box-shadow:" + this.props.boxShadowRaised + "}";
        var thisButtonActiveHoverSelector = buttonSelector + ":active:hover";
        var activeHoverBoxShadowActiveCss = thisButtonActiveHoverSelector + "{ box-shadow:" + this.props.boxShadowActive + "}";
        var hoverFocusActiveLighterBackgroundCss = thisButtonHoverOrFocusOrActiveSelector + "{ background-color:" + lightenColorRGB + "}";
        var thisButtonDisabledSelector = buttonSelector + ":disabled";
        //later allow passing in the disabled css but that will mean no style={}
        //this is a change to mui - have removed pointer-events:none as effects the cursor:not allowed
        var disabledCssFixed = "box-shadow:none;cursor:" + this.props.disabledCursor + ";";
        var disabledVisualCss = "";
        var colourSpecified = false;
        var disabledBackgroundColor = Color(backgroundColor);
        if (this.props.disabledBackgroundColor) {
            disabledBackgroundColor = Color(this.props.disabledBackgroundColor);
            colourSpecified = true;
        }
        if (this.props.disabledDesaturatePercentage !== 0) {
            colourSpecified = true;
            disabledBackgroundColor = disabledBackgroundColor.desaturate(this.props.disabledDesaturatePercentage);
        }
        if (this.props.disabledLightenPercentage) {
            colourSpecified = true;
            disabledBackgroundColor = disabledBackgroundColor.lighten(this.props.disabledLightenPercentage);
        }
        disabledVisualCss += "background-color:" + this.getRGBString(disabledBackgroundColor) + ";";
        if (this.props.disabledColor) {
            disabledVisualCss += "color:" + this.props.disabledColor + ";";
        }
        if (!colourSpecified || this.props.disabledOpacity !== MuiButton.defaultProps.disabledOpacity) {
            disabledVisualCss += "opacity:" + this.props.disabledOpacity + ";";
        }
        var disabledCss = thisButtonDisabledSelector + "{" + disabledCssFixed + disabledVisualCss + "}";
        var buttonCss = buttonSelector + "{background-color:" + this.backgroundColor + ";cursor:" + this.cursor + ";color:" + this.color + "}";
        var rippleSelector = buttonSelector + " ." + rippleMainClass;
        var rippleNormalCss = rippleSelector + "{position: absolute; top: 0; left: 0; border-radius: 50%; pointer-events: none; transform: scale(.0001, .0001); background-color:" + this.props.rippleColour + "}";
        var rippleActiveSelector = buttonSelector + " ." + rippleActiveClass;
        var rippleAnimatingSelector = rippleSelector + "." + rippleIsAnimatingClass;
        var rippleActiveCss = rippleActiveSelector + "{opacity:" + this.props.rippleOpacity + "}";
        var rippleAnimatingCss = rippleAnimatingSelector + "{transform:none;transition:transform .3s cubic-bezier(0,0,.2,1),width .3s cubic-bezier(0,0,.2,1),height .3s cubic-bezier(0,0,.2,1),opacity .3s cubic-bezier(0,0,.2,1)}";
        var rippleContainerStyle = this.props.rippleContainerStyle;
        if (this.props.buttonStyle.borderRadius && !rippleContainerStyle.borderRadius) {
            rippleContainerStyle.borderRadius = this.props.buttonStyle.borderRadius;
        }
        var muiCss = hoverFocusBoxShadowRaisedCss + activeHoverBoxShadowActiveCss + (this.props.touchOnly ? "" : hoverFocusActiveLighterBackgroundCss) + disabledCss + buttonCss + rippleActiveCss + rippleAnimatingCss + rippleNormalCss;
        return React.createElement("button", { onContextMenu: function (evt) { if (_this.props.preventContextMenu)
                evt.preventDefault(); }, disabled: this.props.disabled, style: this.buttonStyle, id: this.id, ref: function (btn) { return _this.buttonEl = btn; }, onTouchStart: this.onTouchStartCB, onTouchEnd: this.onTouchEndCB, onMouseDown: this.onMouseDownCB, onMouseUp: this.onMouseUpCB, onMouseLeave: this.onMouseLeaveCB },
            this.props.children,
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: muiCss
                } }),
            React.createElement("span", { style: rippleContainerStyle, className: "mui-btn__ripple-container" },
                React.createElement("span", { style: rippleStyle, className: rippleCls, ref: function (span) { _this.rippleEl = span; } })));
    };
    return MuiButton;
}(React.Component));
MuiButton.idCount = 0;
MuiButton.idName = "muiButton";
MuiButton.defaultProps = {
    touchOnly: false,
    disabled: false,
    disabledCursor: "not-allowed",
    rippleColour: "white",
    rippleOpacity: 0.3,
    disabledOpacity: 0.6,
    disabledDesaturatePercentage: 0,
    disabledLightenPercentage: 0,
    lightenPercentage: 0.5,
    boxShadowRaised: "0 0px 2px rgba(0,0,0, 0.12),0 2px 2px rgba(0,0,0, 0.20);",
    boxShadowActive: "0 0px 4px rgba(0,0,0, 0.12), 1px 3px 4px rgba(0,0,0, 0.20);",
    buttonStyle: {},
    rippleContainerStyle: { WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none", userSelect: "none", position: "absolute", top: 0, left: 0, display: "block", height: "100%", width: "100%", overflow: "hidden", zIndex: 0, pointerEvents: "none" },
};
MuiButton.defaultButtonStyle = {
    outline: "none",
    transition: "all 0.2s ease-in-out",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "white",
    color: "black",
    padding: "10px",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    position: "relative",
    cursor: "pointer"
};
exports.MuiButton = MuiButton;
//# sourceMappingURL=muiButton.js.map