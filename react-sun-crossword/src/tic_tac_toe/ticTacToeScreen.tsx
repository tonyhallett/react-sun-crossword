import * as React from "react";
import * as Radium from "Radium";
import { connect } from "react-redux"
import { GameState, ArrowDirection, RowColumnIndices, SquareGo, TicTacToeState, playAgain, finishedConfirmed, arrowPressed, takeGo } from "./reducer";
import { style, buttonHoverShadowStyle, thButtonFontWeight, fontSize, buttonBackgroundColor, componentBackgroundColor, shakeAnimationStyle, buttonHoverFocusBrightnessAnimationStyle } from "./style";
import * as fontFamilies from './fontFamilies'
import * as textStrings from './textStrings'
import * as idsAndClassNames from './idsAndClassNames'
import { ModalCover } from "./modalEnhanced";
import { ConfiguredRadium } from "./configuredRadium";
import { ConnectedScoreboard } from "./scoreboard";
import { ConnectedTicTacToeBoard } from "./ticTacToeBoard";
import { mergeAnimations } from "./mergeAnimations";
import { flipInX, flipOutX } from 'react-animations';

interface TicTacToeScreenProps {
    gameState: GameState,
    playAgain: () => void,
    finishedConfirmed: () => void,
    arrowPressed: (direction: ArrowDirection) => void,
    takeGo: (row: number, column: number) => void,
    xColour: string,
    oColour: string,
    selectedSquare: RowColumnIndices,
    board: SquareGo[][]
}
interface TicTacToeScreenState {
    winDrawElement: any
}

class TicTacToeScreen extends React.Component<TicTacToeScreenProps, TicTacToeScreenState>{
    keyframesFlipInX: any
    keyframesFlipOutX: any
    flipInXAnimationName: string
    flipOutXAnimationName: string
    flipDuration = 1000

    constructor(props) {
        super(props);
        this.state = { winDrawElement: this.getWinDrawElement(props) }
        this.keyframesFlipInX = Radium.keyframes(flipInX) as any;
        this.flipInXAnimationName = this.keyframesFlipInX.__process("all").animationName;
        this.keyframesFlipOutX = Radium.keyframes(flipOutX) as any;
        this.flipOutXAnimationName = this.keyframesFlipOutX.__process("all").animationName;

    }
    getWinDrawElement(props: TicTacToeScreenProps) {
        function getWinner(playerId: string, playerColour: string) {
            return <div style={style.winDrawContainerStyle}><span style={{ fontFamily: fontFamilies.textFontFamilyWithDefault }}>{textStrings.player + " "}</span><span style={{ fontFamily: fontFamilies.noughtCrossFontFamily, color: playerColour }}>{playerId + " "}</span><span style={{ fontFamily: fontFamilies.textFontFamilyWithDefault }}>{textStrings.wonMessage}</span></div>
        }

        var messageElement = <div />

        switch (props.gameState) {
            case GameState.X:
                messageElement = getWinner(textStrings.cross, this.props.xColour);
                break;
            case GameState.O:
                messageElement = getWinner(textStrings.nought, this.props.oColour);
                break;
            case GameState.Draw:
                messageElement = <div style={{ ...style.winDrawContainerStyle, fontFamily: fontFamilies.textFontFamilyWithDefault }}>{textStrings.gameDrawn}</div>;
                break;
        }
        return messageElement;

    }
    componentWillReceiveProps(props: TicTacToeScreenProps) {
        if (props.gameState !== this.props.gameState && this.props.gameState === GameState.Playing) {
            this.setState({ winDrawElement: this.getWinDrawElement(props) })
        }
    }
    modalShouldOpen = () => {
        var gameState = this.props.gameState;
        return gameState === GameState.Draw || gameState === GameState.O || gameState === GameState.X;
    }

    keyDown = (event: any) => {
        var key = event.key;
        var modalOpen = this.modalShouldOpen();
        if (modalOpen) {
            switch (key) {
                case "Enter":
                case " ":
                case "Esc":
                    this.props.finishedConfirmed();
                    break;
                case "p":
                case "P":
                    this.props.playAgain();
                    break;
            }
        } else {
            switch (key) {
                case "ArrowDown":
                    this.props.arrowPressed(ArrowDirection.Down);
                    break;
                case "ArrowUp":
                    this.props.arrowPressed(ArrowDirection.Up);
                    break;
                case "ArrowLeft":
                    this.props.arrowPressed(ArrowDirection.Left);
                    break;
                case "ArrowRight":
                    this.props.arrowPressed(ArrowDirection.Right);
                    break;
                case "p":
                case "P":
                    this.props.playAgain();
                    break;
                default:
                    var selectedSquare = this.props.selectedSquare;
                    if (selectedSquare) {
                        var squareGo = this.props.board[selectedSquare.row][selectedSquare.column];
                        this.props.takeGo(selectedSquare.row, selectedSquare.column);
                    }

                    break;
            }
        }
    }
    getModalParent = () => {
        return this.modalParent;
    }
    modalParent
    keyContainerRef = (keyContainer: HTMLDivElement) => {
        keyContainer.focus();
        this.modalParent = keyContainer;
    }
    render() {
        var buttonHasHover = Radium.getState(this.state, 'button', ':hover')
        var buttonAnimation = mergeAnimations([this.props.gameState !== GameState.Playing ? shakeAnimationStyle : null, buttonHasHover ? buttonHoverFocusBrightnessAnimationStyle : null]);

        var playAgainUnderlineLetter = textStrings.playAgainText[0];
        var playAgainRemainder = textStrings.playAgainText.substr(1);
        return <div tabIndex={0} ref={this.keyContainerRef} onKeyDown={this.keyDown}>

            <span style={{ animationName: this.keyframesFlipInX }} />
            <span style={{ animationName: this.keyframesFlipOutX }} />
            <Radium.Style rules={{
                ".ReactModal__Overlay": {
                    animationName: this.flipInXAnimationName,
                    animationDuration: this.flipDuration + "ms"
                },
                ".ReactModal__Overlay--before-close": {
                    animationName: this.flipOutXAnimationName,
                    animationDuration: this.flipDuration + "ms",
                    animationFillMode: "forwards"
                }
            }} />
            <div style={{ display: "inline-block" }}>

                <div style={{ marginBottom: style.componentMargin }}>
                    <ConnectedScoreboard />
                </div>
                <ConnectedTicTacToeBoard />
                <div role="button" key="button" className={idsAndClassNames.inactiveCursorClassName} style={[{ ":focus": {} }, { ":hover": buttonHoverShadowStyle }, { borderRadius: style.borderRadius, marginTop: style.componentMargin, fontWeight: thButtonFontWeight, fontFamily: fontFamilies.textFontFamilyWithDefault, fontSize: fontSize, borderStyle: "none", paddingTop: 10, paddingBottom: 10, backgroundColor: buttonBackgroundColor, width: "100%", cursor: "pointer" } as React.CSSProperties, style.componentBoxShadow, buttonAnimation]} onClick={this.props.playAgain}>
                    <div style={{ marginLeft: "auto", marginRight: "auto", width: "99%", textAlign: "center" }}  >
                        <span style={{ textDecoration: "underline", display: "inlineBlock", userSelect: "none" }}>{playAgainUnderlineLetter}</span><span style={{ display: "inlineBlock", userSelect: "none" }}>{playAgainRemainder}</span>
                    </div>
                </div>
            </div>
            <ModalCover parentSelector={this.getModalParent} contentStyle={{ backgroundColor: componentBackgroundColor }} closeTimeoutMS={this.flipDuration} elementSelector={"#" + idsAndClassNames.ticTacToeBoardId} isOpen={this.modalShouldOpen()} onRequestClose={this.props.finishedConfirmed}>
                {this.state.winDrawElement}
            </ModalCover>
        </div>
    }
}
export const ConnectedTicTacToeScreen: any = connect((state: TicTacToeState) => {
    return {
        gameState: state.gameState,
        oColour: state.oColour,
        xColour: state.xColour,
        selectedSquare: state.selectedSquare,
        board: state.board
    }
}, (dispatch) => {
    return {
        playAgain: function () {
            dispatch(playAgain())
        },
        finishedConfirmed: function () {
            dispatch(finishedConfirmed());
        },
        arrowPressed: function (direction: ArrowDirection) {
            dispatch(arrowPressed(direction));
        },
        takeGo: function (row: number, column: number) {
            dispatch(takeGo(row, column))
        }
    }
})(ConfiguredRadium(TicTacToeScreen));
