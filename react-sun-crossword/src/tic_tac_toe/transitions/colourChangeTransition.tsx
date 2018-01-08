import * as React from "react";
import * as Color from 'Color'
import { TransitionProps } from "react-transition-group/Transition";
import { withTransitionHelperFn, TransitionHelperTransitionProps, withTransitionHelper, TransitionHelperFnChildProp } from "./transitionHelper";

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
export function withColourChangeTransitionFn(Component: React.ComponentClass<TransitionProps>) {
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
export function withColourChangeTransition(Component: React.ComponentClass<TransitionProps>) {
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

