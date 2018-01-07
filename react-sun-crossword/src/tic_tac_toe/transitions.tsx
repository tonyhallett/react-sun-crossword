import * as React from "react";

import { ConfiguredRadium } from "./configuredRadium";

import { Transition } from "react-transition-group";
import { TransitionProps } from "react-transition-group/Transition";

import * as Color from 'Color'

type TransitionState = "exited" | "exiting" | "entered" | "entering";

//#region inOnMount
interface InOnMountState {
    in: boolean
}
function withInOnMount(Component: React.ComponentClass<TransitionProps>) {
    var inOnMount = class InOnMount extends React.Component<TransitionProps, InOnMountState>{
        inOnMount = false
        constructor(props) {
            super(props);
            var isIn = false;
            if (props.in) {
                if (props.appear) {
                    this.inOnMount = true;
                } else {
                    isIn = true;//not sure ....
                }

            }
            this.state = { in: isIn }
        }

        onEnter = (node: HTMLElement) => {
            if (this.props.onEnter) {
                this.props.onEnter(node, this.inOnMount);
            }
        }
        onEntering = (node: HTMLElement) => {
            if (this.props.onEntering) {
                this.props.onEntering(node, this.inOnMount);
            }
        }
        onEntered = (node: HTMLElement) => {
            if (this.props.onEntered) {
                this.props.onEntered(node, this.inOnMount);
            }
            this.inOnMount = false;
        }
        componentDidMount() {
            var self = this;
            if (this.inOnMount) {
                this.requestAnimationStart(() => self.setState({ in: true }))
            }
        }
        requestAnimationStart(callback) {
            // Feature detect rAF, fallback to setTimeout
            if (window.requestAnimationFrame) {
                // Chrome and Safari have a bug where calling rAF once returns the current
                // frame instead of the next frame, so we need to call a double rAF here.
                // See https://crbug.com/675795 for more.
                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(callback);
                });
            } else {
                setTimeout(callback, 0);
            }
        }
        render() {
            const { "in": inn, onEnter, onEntering, onExiting, appear, ...passThroughProps } = this.props;
            var transitionProps = { ...passThroughProps, in: this.state.in, onEnter: this.onEnter, onEntering: this.onEntering, onEntered: this.onEntered };
            return <Component {...transitionProps} />
        }
        componentWillReceiveProps(newProps) {
            this.setState({ in: newProps.in });
        }
    }
    return inOnMount;
}
//#endregion
//#region AutoOut
interface AutoOutTransitionState {
    in: boolean
}
interface AutoOutTransitionProps {
    inSignal: any
}
function withAutoOut(Component: React.ComponentClass<TransitionProps>) {
    var autoOut = class AutoOutTransition extends React.Component<AutoOutTransitionProps & TransitionProps, AutoOutTransitionState>{
        constructor(props) {
            super(props);
            this.state = { in: props.inSignal !== null }
        }
        onEntered = (node: HTMLElement, isAppearing: boolean) => {
            this.props.onEntered ? this.props.onEntered(node, isAppearing) : void 0
            this.setState({ in: false });
        }

        componentWillReceiveProps(newProps: AutoOutTransitionProps & TransitionProps) {
            if (newProps.inSignal !== null) {
                if (newProps.inSignal !== this.props.inSignal) {
                    this.setState({ in: true });
                }
            } else {
                this.setState({ in: false });
            }
        }
        render() {
            const { onEntered, "in": inn, inSignal, ...passThroughProps } = this.props;
            var transitionProps = {
                ...passThroughProps,
                onEntered: this.onEntered,
                in: this.state.in
            }
            return <Component {...transitionProps} />
        }
    }
    return autoOut;
}
//#endregion

//#region TransitionHelperFn

interface TransitionHelperTransitionProps {
    enterTransition: string,
    exitTransition?: string,
}
interface TransitionHelperStyleProps {
    enterStyle: React.CSSProperties,
    exitStyle: React.CSSProperties
}
interface TransitionOwnProps extends TransitionHelperTransitionProps, TransitionHelperStyleProps { }
interface TransitionHelperProps extends TransitionProps, TransitionOwnProps { }

function withTransitionHelper(Component: React.ComponentClass<TransitionProps>) {
    var transitionHelper = class TransitionHelper extends React.Component<TransitionHelperProps, TransitionHelperState>{
        render() {
            const { enterStyle, exitStyle, enterTransition, exitTransition, ...passThroughProps } = this.props
            var transition = <Component {...passThroughProps}>
                {(state: TransitionState) => {
                    var style: React.CSSProperties = {};
                    switch (state) {
                        case "entering":
                        case "entered":
                            style = { ...this.props.enterStyle }
                            style.transition = this.props.enterTransition;
                            break;
                        case "exiting":
                        case "exited"://this is the state before in:true 
                            style = { ...this.props.exitStyle };
                            style.transition = this.props.exitTransition ? this.props.exitTransition : this.props.enterTransition;
                            break;
                    }
                    //should use the isValidElement guard https://stackoverflow.com/questions/42261783/how-to-assign-the-correct-typing-to-react-cloneelement-when-giving-properties-to
                    var childElement = this.props.children as React.ReactElement<any>;

                    var childStyle = childElement.props.style;
                    var newStyle = { ...childStyle, ...style };
                    var newProps = {
                        style: newStyle
                    }

                    var clonedElement = React.cloneElement(childElement, newProps);
                    return clonedElement;
                }}
            </Component>
            return transition;
        }
    }
    return transitionHelper;
}


interface TransitionHelperFnChildProp {
    children: (state: TransitionState, props: any, stateStyle: React.CSSProperties, stateTransition: string) => React.ReactElement<any>
}
interface TransitionHelperFnProps extends TransitionHelperProps, TransitionHelperFnChildProp { }

interface TransitionHelperState {
    in: boolean
}
//only used by withColourChangeTransitionFn
function withTransitionHelperFn(Component: React.ComponentClass<TransitionProps>) {
    var transitionHelper = class TransitionHelper extends React.Component<TransitionHelperFnProps, TransitionHelperState>{
        render() {
            const { enterStyle, exitStyle, enterTransition, exitTransition, ...passThroughProps } = this.props
            var transition = <Component {...passThroughProps}>
                {(state: TransitionState) => {
                    var stateStyle: React.CSSProperties = {};
                    var stateTransition = "";
                    switch (state) {
                        case "entering":
                        case "entered":
                            stateTransition = this.props.enterTransition;
                            stateStyle = { ...this.props.enterStyle }
                            break;

                        case "exiting":
                        case "exited"://this is the state before in:true 
                            stateTransition = this.props.exitTransition ? this.props.exitTransition : this.props.enterTransition;
                            stateStyle = { ...this.props.exitStyle };
                            break;
                    }
                    if (typeof this.props.children === 'function') {
                        return this.props.children(state, passThroughProps, stateStyle, stateTransition);
                    } else {
                        throw new Error("withTransitionHelperFn requires child function");
                    }

                }}
            </Component>
            return transition;
        }
    }
    return transitionHelper;
}
//#endregion
export enum ColourChangeType { lighten, darken, saturate, desaturate, fade, opaquer }
interface ColourChangeOwnProps {
    change: number,
    exitColour: string,
    colourChangeType: ColourChangeType,
    propName: string,
}
interface ColourChangeProps extends ColourChangeOwnProps, TransitionHelperTransitionProps { }
interface ColourChangeTransitionProps extends TransitionProps, ColourChangeProps { }

interface ColourChangeTransitionFnProps extends ColourChangeTransitionProps, TransitionHelperFnChildProp { }
function withColourChangeTransitionFn(Component: React.ComponentClass<TransitionProps>) {
    var TransitionHelper = withTransitionHelperFn(Component);
    var colourChangeTransition = class ColourChangeTransition extends React.Component<ColourChangeTransitionFnProps, undefined> {
        render() {
            var enterStyle = {};

            var exitColor = Color(this.props.exitColour);
            var enterColor;
            var changeAmount = this.props.change;
            //note that whiten/blacken is not css3!
            switch (this.props.colourChangeType) {
                case ColourChangeType.darken:
                    enterColor = exitColor.darken(changeAmount)
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
            enterStyle[this.props.propName] = colorString;//seems that once change to different model cannot go back

            var exitStyle = {};
            var exitColourString = exitColor.toString();
            exitStyle[this.props.propName] = exitColourString;
            const { change, exitColour, colourChangeType, propName, ...passThroughProps } = this.props;
            return <TransitionHelper enterStyle={enterStyle} exitStyle={exitStyle} {...this.props} />
        }
    }
    return colourChangeTransition;
}
function withColourChangeTransition(Component: React.ComponentClass<TransitionProps>) {
    var TransitionHelper = withTransitionHelper(Component);
    var colourChangeTransition = class ColourChangeTransition extends React.Component<ColourChangeTransitionProps, undefined> {
        render() {
            var enterStyle = {};

            var exitColor = Color(this.props.exitColour);
            var enterColor;
            var changeAmount = this.props.change;
            //note that whiten/blacken is not css3!
            switch (this.props.colourChangeType) {
                case ColourChangeType.darken:
                    enterColor = exitColor.darken(changeAmount)
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
            enterStyle[this.props.propName] = colorString;//seems that once change to different model cannot go back

            var exitStyle = {};
            var exitColourString = exitColor.toString();
            exitStyle[this.props.propName] = exitColourString;
            const { change, exitColour, colourChangeType, propName, ...passThroughProps } = this.props;

            return <TransitionHelper enterStyle={enterStyle} exitStyle={exitStyle} {...this.props} />
        }
    }
    return colourChangeTransition;
}

//#region transition helper as a function
interface TransitionProvider<P> {
    (state: TransitionState, props: P): TransitionOwnProps
}
interface TransitionHelperChildFunction<P> {
    (state: TransitionState, props: P): React.ReactNode
}
interface TransitionHelperCallbackFunction<P> {
    (state: TransitionState, props: P, stateStyle: React.CSSProperties, stateTransition: string): React.ReactNode
}


function transitionHelperFn<P>(cb: TransitionHelperCallbackFunction<P>, provider: TransitionProvider<P>) {


    var transitionHelper: TransitionHelperChildFunction<P> = function (state: TransitionState, props: P) {
        var res = provider(state, props);
        var stateStyle: React.CSSProperties;
        var stateTransition: string;
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
    }
    return transitionHelper;

}
var colourTransitionProvider: TransitionProvider<ColourChangeProps> = function (state: TransitionState, props: ColourChangeProps) {
    var enterStyle = {};

    var exitColor = Color(props.exitColour);
    var enterColor;
    var changeAmount = props.change;
    //note that whiten/blacken is not css3!
    switch (props.colourChangeType) {
        case ColourChangeType.darken:
            enterColor = exitColor.darken(changeAmount)
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
    enterStyle[props.propName] = colorString;//seems that once change to different model cannot go back

    var exitStyle = {};
    var exitColourString = exitColor.toString();
    exitStyle[props.propName] = exitColourString;
    return {
        enterStyle: enterStyle,
        exitStyle: exitStyle,
        enterTransition: props.enterTransition,
        exitTransition: props.exitTransition
    }
}
//#endregion

//these will not be in here
const RadiumTransition = ConfiguredRadium(Transition);
export const AutoOutInOnMount = withAutoOut(withInOnMount(RadiumTransition))
export const AutoOutInOnMountColourChangeRadiumTransition = withColourChangeTransitionFn(AutoOutInOnMount);
