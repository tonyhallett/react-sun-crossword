import * as React from "react";

import { Transition } from "react-transition-group";
import { TransitionProps } from "react-transition-group/Transition";


import { TransitionState } from './common';


//#region TransitionHelperFn

export interface TransitionHelperTransitionProps {
    enterTransition: string,
    exitTransition?: string,
}
interface TransitionHelperStyleProps {
    enterStyle: React.CSSProperties,
    exitStyle: React.CSSProperties
}
interface TransitionOwnProps extends TransitionHelperTransitionProps, TransitionHelperStyleProps { }
interface TransitionHelperProps extends TransitionProps, TransitionOwnProps { }

export function withTransitionHelper(Component: React.ComponentClass<TransitionProps>) {
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


export interface TransitionHelperFnChildProp {
    children: (state: TransitionState, props: any, stateStyle: React.CSSProperties, stateTransition: string) => React.ReactElement<any>
}
interface TransitionHelperFnProps extends TransitionHelperProps, TransitionHelperFnChildProp { }

interface TransitionHelperState {
    in: boolean
}
export function withTransitionHelperFn(Component: React.ComponentClass<TransitionProps>) {
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

