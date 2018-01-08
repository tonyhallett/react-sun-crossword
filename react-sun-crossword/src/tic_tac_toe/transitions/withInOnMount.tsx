import * as React from "react";
import { TransitionProps } from "react-transition-group/Transition";

interface InOnMountState {
    in: boolean
}
export function withInOnMount(Component: React.ComponentClass<TransitionProps>) {
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



