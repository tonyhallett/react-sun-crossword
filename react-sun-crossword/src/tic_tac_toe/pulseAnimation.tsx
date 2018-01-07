import * as React from "react";
import * as Radium from "radium";
import { TransitionProps } from "react-transition-group/Transition";

export type TransitionState = "exited" | "exiting" | "entered" | "entering";
interface PulseProps {
    pulseAmount: number,//need default to 1.05
    children: (state: TransitionState, additionalProps: any, pulseStyle: React.CSSProperties) => void
}
function scale3d(a, b, c) {
    return 'scale3d(' + a + ', ' + b + ', ' + c + ')';
};
export function createPulseKeyframes(pulseAmount: number) {
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
export function withPulse(Component: React.ComponentClass<TransitionProps>) {

    var pulse = class extends React.Component<TransitionProps & PulseProps, undefined>{
        render() {

            var pulse = createPulseKeyframes(this.props.pulseAmount);
            //passthrough to do
            return <Component {...this.props } >
                {
                    (state: TransitionState, additionalProps: any) => {
                        var transitionStyle: React.CSSProperties = {}
                        switch (state) {
                            case "entering":
                            case "entered":
                                transitionStyle = {
                                    animationDuration: this.props.timeout + "ms",
                                    animationName: Radium.keyframes(pulse)
                                }
                                break;

                        }
                        return this.props.children(state, additionalProps, transitionStyle)
                    }
                }
                </Component>
        }
    }
    return pulse;
}
