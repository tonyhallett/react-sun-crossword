import * as React from "react";
import { style } from "./style";
import { connect } from "react-redux"

import { TicTacToeState } from "./reducers/reducer";
import { ConfiguredRadium } from "./configuredRadium";

interface TicTacToeLoaderProps {
    oColour: string,
    xColour: string
}
class TicTacToeLoader extends React.Component<TicTacToeLoaderProps, undefined>{
    render() {
        return <table style={{ borderSpacing: 2 }}>
            <tbody>
                <tr>
                    <td style={[style.loadingIndicator.cellStyle, style.loadingIndicator.winningCellStyle, { color: this.props.xColour }]}>X</td>
                    <td style={[style.loadingIndicator.cellStyle, { color: this.props.oColour }]}>O</td>
                    <td style={[style.loadingIndicator.cellStyle, { color: this.props.xColour }]}>X</td>
                </tr>
                <tr>
                    <td style={[style.loadingIndicator.cellStyle, { color: this.props.xColour }]}>X</td>
                    <td style={[style.loadingIndicator.cellStyle, style.loadingIndicator.winningCellStyle, { animationDelay: "0.1s", color: this.props.xColour }]}>X</td>
                    <td style={[style.loadingIndicator.cellStyle, { color: this.props.oColour }]}>O</td>
                </tr>
                <tr>
                    <td style={[style.loadingIndicator.cellStyle, { color: this.props.oColour }]}>O</td>
                    <td style={[style.loadingIndicator.cellStyle, { color: this.props.oColour }]}>O</td>
                    <td style={[style.loadingIndicator.cellStyle, style.loadingIndicator.winningCellStyle, { animationDelay: "0.2s", color: this.props.xColour }]}>X</td>
                </tr>
            </tbody>
        </table>
    }
}
export const ConnectedTicTacToeLoader: any = connect((state: TicTacToeState) => {
    return {
        oColour: state.playerColours.oColour,
        xColour: state.playerColours.xColour
    }
})(ConfiguredRadium(TicTacToeLoader));
