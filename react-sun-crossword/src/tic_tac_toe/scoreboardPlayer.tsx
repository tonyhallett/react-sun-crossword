import * as React from "react";
import { style, pulseIncrease } from "./style";
import * as Radium from 'radium'
import { ConfiguredRadium } from "./configuredRadium";
import { createPulseKeyframes, TransitionState, withPulse } from "./pulseAnimation";
import { AutoOutInOnMount } from "./transitions";

interface ScoreboardPlayerProps {
    playerId: string,
    playerBoldStyle: "bolder" | "normal",
    playerColour: string,
    won: number,
    lost: number,
    drawn: number,
    isCurrent: boolean,
    borderRadius?: number
}
interface ScoreboardPlayerState {
    inSignal: object
}

const Pulse = withPulse(AutoOutInOnMount);
class ScoreboardPlayer extends React.Component<ScoreboardPlayerProps, ScoreboardPlayerState>{
    static defaultProps = {
        borderRadius: 0
    }
    constructor(props) {
        super(props);
        this.state = { inSignal: null }
    }
    componentWillReceiveProps(newProps: ScoreboardPlayerProps) {
        if (newProps.won !== this.props.won) {
            this.setState({ inSignal: {} });
        }
    }
    render() {
        var pulseTimeout = 1000;
        //animation-timing-function obtained from http://easings.net/#easeOutQuint
        var animationTimingFunction = "cubic-bezier(0.23, 1, 0.32, 1)";

        return <tr style={style.scoreboard.rowStyle}>
            <td style={{
                ...style.scoreboard.cellStyle,
                ...style.scoreboard.noughtCrossStyle,
                borderBottomLeftRadius: this.props.borderRadius,
                fontWeight: this.props.playerBoldStyle,
                color: this.props.playerColour
            }} > <div style={this.props.isCurrent ? {
                animationDuration: pulseTimeout + "ms",
                animationTimingFunction: animationTimingFunction,
                animationIterationCount: "infinite",
                animationName: Radium.keyframes(createPulseKeyframes(pulseIncrease))
            } : {}}>{this.props.playerId}</div>
            </td>
            <td style={style.scoreboard.cellStyle}>
                <Pulse inSignal={this.state.inSignal} timeout={pulseTimeout} pulseAmount={pulseIncrease} >
                    {
                        (state: TransitionState, props: any, pulseStyle: React.CSSProperties) => {

                            return <div style={[pulseStyle, { color: style.scoreboard.winColour, animationTimingFunction: animationTimingFunction }]}>{this.props.won}</div>
                        }
                    }
                </Pulse>
            </td>


            <td style={{ ...style.scoreboard.cellStyle, color: style.scoreboard.loseColour }}>{this.props.lost}</td>
            <td style={{ ...style.scoreboard.cellStyle, color: style.scoreboard.drawColour, borderBottomRightRadius: this.props.borderRadius }} > {this.props.drawn}</td >
        </tr>
    }
}
export const RadiumScoreboardPlayer = ConfiguredRadium(ScoreboardPlayer)
