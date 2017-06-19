import * as React from "react";
import * as Color from "Color";

export interface MuiButtonProps {
    disabled:boolean
    rippleColour?: string,
    disabledOpacity?: number,
    boxShadowRaised?: string,
    boxShadowActive?: string,
    buttonStyle?: React.CSSProperties,
    onMouseDown?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>
    onMouseUp?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>,
    onMouseLeave?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>,
    onTouchStart?: React.EventHandler<React.TouchEvent<HTMLButtonElement>>,
    onTouchEnd?: React.EventHandler<React.TouchEvent<HTMLButtonElement>>
    rippleContainerStyle?: React.CSSProperties,
    //rippleVisibleOpacity?:number
}
interface MuiButtonState {
    ripple:MuiRipple
}
interface MuiRipple {
    top: string,
    left: string,
    diameter: string,
    isAnimating:boolean
}
export class MuiButton extends React.Component<MuiButtonProps, MuiButtonState> {
    public static idCount = 0
    public static readonly idName = "muiButton"
    private id: string
    public static defaultProps: Partial<MuiButtonProps> = {
        rippleColour: "white",
        disabledOpacity: 0.6,
        boxShadowRaised: "0 0px 2px rgba(0,0,0, 0.12),0 2px 2px rgba(0,0,0, 0.20);",
        boxShadowActive: "0 0px 4px rgba(0,0,0, 0.12), 1px 3px 4px rgba(0,0,0, 0.20);",
        buttonStyle: {},
        rippleContainerStyle: { position: "absolute",top: 0,left: 0,display: "block",height: "100%",width: "100%",overflow: "hidden",zIndex:0,pointerEvents:"none"},
    };
    private static defaultButtonStyle: React.CSSProperties = {
        outline: "none",
        transition: "all 0.2s ease-in-out",
        borderRadius: "2px",
        border: "none",
        backgroundColor: "yellow",
        padding:"5px"
    }
    private rippleEl: HTMLSpanElement
    private buttonEl: HTMLButtonElement
    private backgroundColor:string
    constructor(props) {
        super(props);
        this.id = MuiButton.idName + (MuiButton.idCount++).toString();
        var mergedStyle = this.objectAssign(MuiButton.defaultButtonStyle, this.props.buttonStyle);
        var dynamicStylePropertyNames = ["backgroundColor"];

        dynamicStylePropertyNames.forEach(function (pName) {
            var styleValue = mergedStyle[pName];
            this[pName] = styleValue;
            delete mergedStyle[pName];
        }.bind(this))
        this.buttonStyle = mergedStyle;
        this.state = { ripple: null };
    }
    //note that their componentDidMount sets props on the HTMLButtonElement but does not use them elsewhere
    componentDidUpdate(prevProps, prevState) {
        var _this2 = this;

        var ripple = this.state.ripple;

        // trigger ripple animation
        if (ripple && !prevState.ripple) {
            this.requestAnimationFrame(function () {
                ripple.isAnimating = true;
                _this2.setState({ ripple: ripple });
            });
        }
    }
    requestAnimationFrame(callback) {
        var fn = window.requestAnimationFrame;
        if (fn) fn(callback);
        else setTimeout(callback, 0);
    }
    offset(element) {
        var win = window,
        rect = element.getBoundingClientRect(),
        scrollTop = this.scrollTop(win),
        scrollLeft = this.scrollLeft(win);

        return {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft,
            height: rect.height,
            width: rect.width
        };
    }
    scrollLeft(element, value?) {
        var win = window;

        // get
        if (value === undefined) {
            if (element === win) {
                var docEl = document.documentElement;
                return (win.pageXOffset || docEl.scrollLeft) - (docEl.clientLeft || 0);
            } else {
                return element.scrollLeft;
            }
        }

        // set
        if (element === win) win.scrollTo(value, this.scrollTop(win));
        else element.scrollLeft = value;
    }
    scrollTop(element, value?) {
        var win = window;

        // get
        if (value === undefined) {
            if (element === win) {
                var docEl = document.documentElement;
                return (win.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0);
            } else {
                return element.scrollTop;
            }
        }

        // set
        if (element === win) win.scrollTo(this.scrollLeft(win), value);
        else element.scrollTop = value;
    }
    isTouchEvent(ev: React.TouchEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>): ev is React.TouchEvent<HTMLButtonElement>{
        return ev.type === 'touchstart' || ev.type === 'touchend';
    }
    showRipple(ev: React.TouchEvent<HTMLButtonElement>|React.MouseEvent<HTMLButtonElement>) {
        var buttonEl = this.buttonEl;

        // de-dupe touch events
        if ('ontouchstart' in buttonEl && ev.type === 'mousedown') return;

        // get (x, y) position of click
        var offset = this.offset(this.buttonEl);
            

        //looks like their code is incorrect-ish
        //s/b var clickEv: Touch | React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement> = void 0
        //but pageY does not exist on TouchEvent - lets hope that touch event always has touches
        var clickEv: Touch | React.MouseEvent<HTMLButtonElement>= void 0
        if (this.isTouchEvent(ev)) {
            clickEv=ev.touches[0]
        } else {
            clickEv = ev;
        }
        //if (ev.type === 'touchstart' && ev.touches) clickEv = ev.touches[0]; else clickEv = ev;

        // calculate radius
        var radius = Math.sqrt(offset.width * offset.width + offset.height * offset.height);

        // add ripple to state
        console.log("**************** Setting ripple")
        var ripple: MuiRipple= {
            top: Math.round(clickEv.pageY - offset.top - radius) + 'px',
            left: Math.round(clickEv.pageX - offset.left - radius) + 'px',
            diameter: radius * 2 + 'px',
            isAnimating:false
        }
        this.setState({ ripple: ripple });
    }
    hideRipple(ev: React.TouchEvent<HTMLButtonElement> |React.MouseEvent<HTMLButtonElement>) {
        this.setState({
            ripple: null
        });
    }
    onMouseDownCB = (ev: React.MouseEvent<HTMLButtonElement>) => {
        console.log("onMouseDown");
        this.showRipple(ev);

        // execute callback
        var fn = this.props.onMouseDown;
        fn && fn(ev);
    }
    onMouseUpCB = (ev: React.MouseEvent<HTMLButtonElement>) => {
        console.log("onMouseUp");
        this.hideRipple(ev);

        // execute callback
        var fn = this.props.onMouseUp;
        fn && fn(ev);
    }
    onMouseLeaveCB = (ev: React.MouseEvent<HTMLButtonElement>) => {
        console.log("onMouseLeave");
        this.hideRipple(ev);

        // execute callback
        var fn = this.props.onMouseLeave;
        fn && fn(ev);
    }
    onTouchStartCB=(ev: React.TouchEvent<HTMLButtonElement>)=> {
        console.log("onTouchStart");
        this.showRipple(ev);

        // execute callback
        var fn = this.props.onTouchStart;
        fn && fn(ev);
    }
    onTouchEndCB=(ev: React.TouchEvent<HTMLButtonElement>)=> {
        console.log("onTouchEnd");
        this.hideRipple(ev);

        // execute callback
        var fn = this.props.onTouchEnd;
        fn && fn(ev);

    }
    private buttonStyle: React.CSSProperties
    
    objectAssign(target, varArgs) { // .length of function is 2
        'use strict';
        if (target == null) { // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) { // Skip over if undefined or null
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

    render() {
        var rippleStyle = {};
        var rippleMainClass = 'mui-ripple'
        var rippleActiveClass = 'mui--is-visible'
        var rippleIsAnimatingClass ='mui--is-animating'
        var rippleCls = rippleMainClass;
        var ripple = this.state.ripple;
        if (ripple) {
            rippleCls += (' ' + rippleActiveClass);
            if (ripple.isAnimating) rippleCls += (' ' + rippleIsAnimatingClass);
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
        var lightenColour: Color.Color = bgColourColour.lighten(0.5);
        var lightenRBGArray = lightenColour.rgb().array();
        var lightenColorRGB = "rgb(" + lightenRBGArray[0] + "," + lightenRBGArray[1] + "," + lightenRBGArray[2] + ")";
        var thisButtonHoverOrFocusSelector = buttonSelector + ":hover," + buttonSelector + ":focus";
        var thisButtonHoverOrFocusOrActiveSelector = thisButtonHoverOrFocusSelector + "," + buttonSelector+":active";
        var hoverFocusBoxShadowRaisedCss = thisButtonHoverOrFocusSelector + "{ box-shadow:" + this.props.boxShadowRaised + "}";
        var thisButtonActiveHoverSelector = buttonSelector + ":active:hover";
        var activeHoverBoxShadowActiveCss = thisButtonActiveHoverSelector + "{ box-shadow:" + this.props.boxShadowActive + "}";
        var hoverFocusActiveLighterBackgroundCss = thisButtonHoverOrFocusOrActiveSelector + "{ background-color:" + lightenColorRGB + "}";
        var thisButtonDisabledSelector = buttonSelector + ":disabled";
        //could have this as a prop
        //need to look up the cursor in the scss
        var disabledCss = thisButtonDisabledSelector + "{ box-shadow:none;pointer-events:none;cursor:not-allowed;" + "opacity:" + this.props.disabledOpacity + "}";
        var backgroundColorCss = buttonSelector + "{background-color:" + this.backgroundColor + "}";
        var rippleSelector = buttonSelector + "." + rippleMainClass;
        var rippleNormalCss = rippleSelector + "{position: absolute, top: 0, left: 0, borderRadius: 50%, pointer-events: none, transform: scale(.0001, .0001), background-color: white}";
        var rippleActiveSelector = rippleSelector + "." + rippleActiveClass;
        var rippleAnimatingSelector = rippleSelector + "." + rippleIsAnimatingClass;
        var rippleActiveCss = rippleActiveSelector + "{opacity:0.3}"
        var rippleAnimatingCss = rippleAnimatingSelector + "{transform:none;transition:transform .3s cubic-bezier(0,0,.2,1),width .3s cubic-bezier(0,0,.2,1),height .3s cubic-bezier(0,0,.2,1),opacity .3s cubic-bezier(0,0,.2,1)}"

        var muiCss = hoverFocusBoxShadowRaisedCss + activeHoverBoxShadowActiveCss + hoverFocusActiveLighterBackgroundCss + disabledCss + backgroundColorCss + rippleActiveCss + rippleAnimatingCss + rippleNormalCss;

        return <button disabled={this.props.disabled} style={this.buttonStyle} id={this.id} ref={(btn) => this.buttonEl = btn} onTouchStart={this.onTouchStartCB} onTouchEnd={this.onTouchEndCB} onMouseDown={this.onMouseDownCB} onMouseUp={this.onMouseUpCB} onMouseLeave={this.onMouseLeaveCB}>
            <style dangerouslySetInnerHTML={{
                __html: muiCss
            }} />

            {this.props.children}
            <span style={this.props.rippleContainerStyle} className="mui-btn__ripple-container">
                <span style={rippleStyle} className={rippleCls} ref={(span) => { this.rippleEl = span }}></span>
            </span>
        </button>

    }
}