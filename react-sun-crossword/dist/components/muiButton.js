"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Color = require("Color");
var MuiButton = (function (_super) {
    __extends(MuiButton, _super);
    function MuiButton(props) {
        var _this = _super.call(this, props) || this;
        _this.onMouseDownCB = function (ev) {
            _this.showRipple(ev);
            // execute callback
            var fn = _this.props.onMouseDown;
            fn && fn(ev);
        };
        _this.onMouseUpCB = function (ev) {
            _this.hideRipple(ev);
            // execute callback
            var fn = _this.props.onMouseUp;
            fn && fn(ev);
        };
        _this.onMouseLeaveCB = function (ev) {
            _this.hideRipple(ev);
            // execute callback
            var fn = _this.props.onMouseLeave;
            fn && fn(ev);
        };
        _this.id = MuiButton.idName + (MuiButton.idCount++).toString();
        //check that the default is overridden
        var mergedStyle = _this.objectAssign(MuiButton.defaultButtonStyle, _this.props.buttonStyle);
        var dynamicStylePropertyNames = ["backgroundColor"];
        dynamicStylePropertyNames.forEach(function (pName) {
            var styleValue = mergedStyle[pName];
            this[pName] = styleValue;
            delete mergedStyle[pName];
        });
        _this.buttonStyle = mergedStyle;
        //then will extract what do not want to be set in style
        //will want to remove backgroundColor !
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
        var buttonEl = this.buttonEl;
        // de-dupe touch events
        if ('ontouchstart' in buttonEl && ev.type === 'mousedown')
            return;
        // get (x, y) position of click
        var offset = this.offset(this.refs.buttonEl);
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
        this.setState({
            ripple: {
                top: Math.round(clickEv.pageY - offset.top - radius) + 'px',
                left: Math.round(clickEv.pageX - offset.left - radius) + 'px',
                diameter: radius * 2 + 'px',
                isAnimating: false
            }
        });
    };
    MuiButton.prototype.hideRipple = function (ev) {
        this.setState({
            ripple: null
        });
    };
    MuiButton.prototype.onTouchStartCB = function (ev) {
        this.showRipple(ev);
        // execute callback
        var fn = this.props.onTouchStart;
        fn && fn(ev);
    };
    MuiButton.prototype.onTouchEndCB = function (ev) {
        this.hideRipple(ev);
        // execute callback
        var fn = this.props.onTouchEnd;
        fn && fn(ev);
    };
    MuiButton.prototype.objectAssign = function (target, varArgs) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
    ;
    MuiButton.prototype.render = function () {
        var _this = this;
        var rippleStyle = void 0;
        var rippleCls = 'mui-ripple';
        var ripple = this.state.ripple;
        if (ripple) {
            rippleCls += ' mui--is-visible';
            if (ripple.isAnimating)
                rippleCls += ' mui--is-animating';
            rippleStyle = {
                width: ripple.diameter,
                height: ripple.diameter,
                top: ripple.top,
                left: ripple.left
            };
        }
        var buttonSelector = "#" + this.id;
        var backgroundColor = this.buttonStyle.backgroundColor;
        var bgColourColour = Color(backgroundColor);
        //need to check if it is 5 or 0.05
        var lightenColour = bgColourColour.lighten(5); //need to turn to rgba......
        var lightenRBGArray = lightenColour.rgb().array();
        var lightenColorRGB = "rgba(" + lightenRBGArray[0] + "," + lightenRBGArray[1] + "," + lightenRBGArray[2] + ")";
        var thisButtonHoverOrFocusSelector = buttonSelector + ":hover," + buttonSelector + ":focus";
        var thisButtonHoverOrFocusOrActiveSelector = thisButtonHoverOrFocusSelector + ",active";
        var hoverFocusBoxShadowRaisedCss = thisButtonHoverOrFocusSelector + "{ box-shadow:" + this.props.boxShadowRaised + "}";
        var thisButtonActiveHoverSelector = buttonSelector + ":active:hover";
        var activeHoverBoxShadowActiveCss = thisButtonActiveHoverSelector + "{ box-shadow:" + this.props.boxShadowActive + "}";
        var hoverFocusActiveLighterBackgroundCss = thisButtonHoverOrFocusOrActiveSelector + "{ background-color:" + lightenColorRGB + "}";
        var thisButtonDisabledSelector = buttonSelector + ":disabled";
        //could have this as a prop
        //need to look up the cursor in the scss
        var disabledCss = thisButtonDisabledSelector + "{ box-shadow:none;pointer-events:none;cursor:not-allowed" + "opacity:" + this.props.disabledOpacity + "}";
        var muiCss = hoverFocusBoxShadowRaisedCss + activeHoverBoxShadowActiveCss + hoverFocusActiveLighterBackgroundCss + disabledCss;
        return React.createElement("button", { style: this.buttonStyle, id: this.id, ref: function (btn) { return _this.buttonEl = btn; }, onTouchStart: this.onTouchStartCB, onTouchEnd: this.onTouchEndCB, onMouseDown: this.onMouseDownCB, onMouseUp: this.onMouseUpCB, onMouseLeave: this.onMouseLeaveCB },
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: muiCss
                } }),
            this.props.children,
            React.createElement("span", { className: "mui-btn__ripple-container" },
                React.createElement("span", { style: rippleStyle, className: rippleCls, ref: function (span) { _this.rippleEl = span; } })));
    };
    return MuiButton;
}(React.Component));
MuiButton.idCount = 0;
MuiButton.idName = "muiButton";
MuiButton.defaultProps = {
    rippleColour: "white",
    disabledOpacity: 0.6,
    boxShadowRaised: "box-shadow: 0 0px 2px rgba(0,0,0, 0.12),0 2px 2px rgba(0,0,0, 0.20);",
    boxShadowActive: "0 0px 4px rgba(0,0,0, 0.12), 1px 3px 4px rgba(0,0,0, 0.20);",
    buttonStyle: {}
};
MuiButton.defaultButtonStyle = {
    outline: "none",
    transition: "all 0.2s ease-in-out",
    borderRadius: "2px",
    border: "none",
    backgroundColor: "yellow"
};
exports.MuiButton = MuiButton;
//# sourceMappingURL=muiButton.js.map