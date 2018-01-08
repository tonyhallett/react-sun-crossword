import * as React from "react";
import { ScoreboardCountState, PlayerColourState, Player, TicTacToeState } from "./reducer";
import { connect } from "react-redux"
import { style, thButtonFontWeight } from "./style";
import * as textStrings from './textStrings'
import { RadiumScoreboardPlayer } from "./scoreboardPlayer";

interface ScoreboardStateProps extends ScoreboardCountState, PlayerColourState {
    currentPlayer: Player
}
interface ScoreboardProps { }
class Scoreboard extends React.Component<ScoreboardProps & ScoreboardStateProps, undefined>{
    render() {
        var totalWins = this.props.playCount - this.props.drawCount;
        var playerXLossCount = totalWins - this.props.playerXWinCount;
        var playerOWinCount = playerXLossCount;
        var playerOLossCount = this.props.playerXWinCount;

        return <table style={{ width: "100%", borderSpacing: 0, borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    <th style={{ fontWeight: thButtonFontWeight, borderTopLeftRadius: style.borderRadius, ...style.scoreboard.cellStyle }}>{textStrings.player}</th>
                    <th style={{ ...style.scoreboard.cellStyle, fontWeight: thButtonFontWeight }}>{textStrings.won}</th>
                    <th style={{ ...style.scoreboard.cellStyle, fontWeight: thButtonFontWeight }}>{textStrings.lost}</th>
                    <th style={{ fontWeight: thButtonFontWeight, borderTopRightRadius: style.borderRadius, ...style.scoreboard.cellStyle }}>{textStrings.drawn}</th>
                </tr>
            </thead>
            <tbody>
                <RadiumScoreboardPlayer isCurrent={this.props.currentPlayer === Player.X} playerColour={this.props.xColour} playerId={textStrings.cross} playerBoldStyle={this.props.currentPlayer === Player.X ? "bolder" : "normal"} drawn={this.props.drawCount} won={this.props.playerXWinCount} lost={playerXLossCount} />
                <RadiumScoreboardPlayer isCurrent={this.props.currentPlayer === Player.O} borderRadius={style.borderRadius} playerColour={this.props.oColour} playerId={textStrings.nought} playerBoldStyle={this.props.currentPlayer === Player.O ? "bolder" : "normal"} drawn={this.props.drawCount} won={playerOWinCount} lost={playerOLossCount} />
            </tbody>
        </table>
    }
}
export const ConnectedScoreboard: any = connect((state: TicTacToeState) => {
    var gameState = state.gameState;
    var scoreboardState: ScoreboardStateProps = {
        currentPlayer: gameState.currentPlayer,
        drawCount: gameState.drawCount,
        playCount: gameState.playCount,
        playerXWinCount: gameState.playerXWinCount,
        oColour: state.playerColours.oColour,
        xColour: state.playerColours.xColour
    }
    return scoreboardState;
})(Scoreboard);