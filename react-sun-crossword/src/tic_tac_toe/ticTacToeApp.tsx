import * as React from "react";
import { Style, StyleRoot } from "Radium";
import { ConfiguredRadium } from './configuredRadium'
import { connect } from "react-redux"
import { ConnectedTicTacToeLoader } from "./ticTacToeLoader";
import { ConnectedTicTacToeScreen } from "./ticTacToeScreen";
import { ConnectedTicTacToeCursor } from "./ticTacToeCursor";
import { VerticallyCenteredContainer, HorizontalCenter } from "./layoutComponents";
import { TicTacToeState, FontLoadingState } from './reducer'
import { backgroundColor, style } from './style'
import { animationSupported } from './animationSupported'

const animationIsSupported = animationSupported();

const RadiumHorizontalCenter = ConfiguredRadium(HorizontalCenter)

interface TicTacToeAppProps {
    fontLoadingState: FontLoadingState,
    minimumLoadingIndicator?: number,
    oColour: string,
    xColour: string
}
interface TicTacToeAppState {
    showLoadingIndicator: boolean
}
//refactor to a loader ?


class TicTacToeApp extends React.Component<TicTacToeAppProps, TicTacToeAppState>{

    constructor(props) {
        super(props);
        this.state = { showLoadingIndicator: true }
    }
    componentWillReceiveProps(props: TicTacToeAppProps) {
        var self = this;
        if (this.props.fontLoadingState !== props.fontLoadingState && props.fontLoadingState === FontLoadingState.Loading) {
            if (this.props.minimumLoadingIndicator) {
                window.setTimeout(() => {
                    self.setState({ showLoadingIndicator: false });
                }, this.props.minimumLoadingIndicator)
            } else {
                self.setState({ showLoadingIndicator: false });
            }
        }
    }
    hasLoaded = false;

    render() {

        var showLoading = this.props.fontLoadingState === FontLoadingState.NotStarted || this.props.fontLoadingState === FontLoadingState.Loading;
        if (!showLoading) {
            showLoading = this.state.showLoadingIndicator;
        }
        return <StyleRoot radiumConfig={{ userAgent: "all" }}>
            <Style
                rules={{
                    body: {
                        margin: 0
                    },
                    ":focus": {
                        outlineStyle: animationIsSupported ? "none" : "solid",
                        outlineColor: backgroundColor
                    }
                }}
            />
            <ConnectedTicTacToeCursor />
            <VerticallyCenteredContainer backgroundColor={backgroundColor}>
                <RadiumHorizontalCenter>
                    <div style={{ backgroundColor: "gray", padding: 10, borderRadius: style.borderRadius, boxShadow: " 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)" }}>
                        {
                            showLoading ? <ConnectedTicTacToeLoader /> : <ConnectedTicTacToeScreen />
                        }
                    </div>


                </RadiumHorizontalCenter>
            </VerticallyCenteredContainer>
        </StyleRoot>

    }
}
export const ConnectedTicTacToeApp: any = connect((state: TicTacToeState) => {
    return {
        fontLoadingState: state.fontLoadingState,
        oColour: state.playerColours.oColour,
        xColour: state.playerColours.xColour
    }
})(TicTacToeApp);

