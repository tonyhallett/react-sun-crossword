import * as React from "react";
import * as Radium from 'Radium';
import { connect } from "react-redux"
import { style, ticTacToeSquareBorderWidth, focusAnimationStyle } from "./style";
import { TicTacToeState, SquareGo, GameState, takeGo } from "./reducer";
import { AutoOutInOnMountColourChangeRadiumTransition, ColourChangeType } from "./transitions";
import { getCurrentPlayerColour } from "./connectHelpers";


interface TicTacToeSquareRowColProps {
    rowIndex: number,
    colIndex: number
}
interface TicTacToeSquareConnectStateProps {
    squareGoColour: string,
    squareText: string,
    canGo: boolean,
    isSelected: boolean,
    currentPlayerColour:string
}
interface TicTacToeSquareDispatchProps {
    takeGo: () => void
}
interface TicTacToeSquareProps extends TicTacToeSquareRowColProps, TicTacToeSquareConnectStateProps, TicTacToeSquareDispatchProps {
    tabIndex: number
}
interface TicTacToeSquareState {
    inSignal: any,
    kill: boolean
}

class TicTacToeSquare extends React.Component<TicTacToeSquareProps, TicTacToeSquareState>{
    constructor(props) {
        super(props);
        this.state = { inSignal: {}, kill: false }
    }
    squareSelected = () => {
        if (this.props.canGo) {
            this.props.takeGo();
        }
    }
    componentWillReceiveProps(newProps: TicTacToeSquareProps) {
        if (newProps.canGo !== this.props.canGo) {
            if (!newProps.canGo) {
                this.setState({ inSignal: {}, kill: false });
            } else {
                this.setState({ kill: true })
            }
        }
    }
    getFocusAnimationStyle() {
        var startEndBoxShadow = "0 0 5px 2px " + this.props.currentPlayerColour + " inset"
        var focusKeyframes = {
            '0%': {
                boxShadow: startEndBoxShadow
            },
            '50%': {
                boxShadow: "0 0 10px 5px " + this.props.currentPlayerColour + " inset"
            },
            '100%': {
                boxShadow: startEndBoxShadow
            }
        }
        return  {
            animationName: Radium.keyframes(focusKeyframes),
			animationDuration: "2000ms",
            animationIterationCount: "infinite",
            animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)"
        }



    }
    render() {
        var transitionDuration = 1000;
        var exitColour = style.componentBackgroundColor;
        var specificStyle: React.CSSProperties = {
            color: this.props.squareGoColour,
        }
        if (this.props.rowIndex !== 0) {
            specificStyle.borderTopWidth = ticTacToeSquareBorderWidth
        }
        if (this.props.colIndex !== 0) {
            specificStyle.borderLeftWidth = ticTacToeSquareBorderWidth
        }
        return <AutoOutInOnMountColourChangeRadiumTransition appear={true} inSignal={this.state.inSignal} propName="backgroundColor" timeout={transitionDuration} enterTransition={`background-color ${transitionDuration}ms linear`} exitColour={exitColour} change={0.1} colourChangeType={ColourChangeType.lighten}>
            {
                (state, props, stateStyle, stateTransition) => {
                    var transitionStyle: React.CSSProperties;
                    if (this.state.kill) {
                        transitionStyle = { backgroundColor: exitColour };
                    } else {
                        transitionStyle = { ...stateStyle, transition: stateTransition }
                    }
                    return <td style={[style.ticTacToeSquare, specificStyle, transitionStyle]} onMouseDown={(e) => { e.preventDefault() }} onClick={this.squareSelected}>
                        <div style={[{ width: "100%", height: "100%", userSelect: "none" }, this.props.isSelected ? this.getFocusAnimationStyle() : null]}> {this.props.squareText}</div>
                    </td>
                }

            }
        </AutoOutInOnMountColourChangeRadiumTransition>
    }
}

function getSquareTextAndColour(state: TicTacToeState, rowIndex: number, colIndex: number) {
    var squareGo = state.board[rowIndex][colIndex];
    var squareGoColour = "white";
    var squareText = "";
    switch (squareGo) {
        case SquareGo.O:
            squareGoColour = state.oColour;
            squareText = "O";
            break;
        case SquareGo.X:
            squareText = "X"
            squareGoColour = state.xColour;
            break;
        case SquareGo.None:
            break;

    }
    return { colour: squareGoColour, text: squareText }
}
export const ConnectedTicTacToeSquare = connect((state: TicTacToeState, ownProps: TicTacToeSquareRowColProps) => {

    var { colour, text } = getSquareTextAndColour(state, ownProps.rowIndex, ownProps.colIndex);
    var squareGo = state.board[ownProps.rowIndex][ownProps.colIndex];
    var canGo = state.gameState === GameState.Playing && squareGo === SquareGo.None;

    var isSelected = false;
    if (state.selectedSquare) {
        isSelected = state.selectedSquare.column === ownProps.colIndex && state.selectedSquare.row == ownProps.rowIndex
    }
    var connectState = {
        squareGoColour: colour,
        squareText: text,
        canGo: canGo,
        isSelected: isSelected,
        currentPlayerColour: getCurrentPlayerColour(state)
    }
    return connectState;
}, (dispatch, ownProps: TicTacToeSquareRowColProps) => {
    return {
        takeGo: function () {
            dispatch(takeGo(ownProps.rowIndex, ownProps.colIndex))
        }
    }
})(TicTacToeSquare);