import * as React from "react";
import { BodyCursor, MouseBodyPosition } from './bodyCursor'
import * as idsAndClassNames from './idsAndClassNames'
import * as fontFamilies from './fontFamilies'
import * as textStrings from './textStrings'
import { connect } from "react-redux"
import { style } from './style'
import { TicTacToeState, Player, GameState, FontLoadingState, SquareGo } from './reducer'
import { boardHitTest } from './actions'
import { getCurrentPlayerColour } from "./connectHelpers";

interface TicTacToeCursorProps {
    cursorColour: string,
    cursorText: string,
    active: boolean,
    boardHitTestRequest: (x: number, y: number) => void,
    overTakenSquare: boolean
}


class TicTacToeCursor extends React.Component<TicTacToeCursorProps, undefined>{
    positionAdjustment = (x: number, y: number) => {
        return { x: x - 4, y: y - 10 }
    }
    //could have instead used the redux pseudo state for hover 
    render() {
        return <MouseBodyPosition mouseMove={this.props.boardHitTestRequest}>
            <BodyCursor inactiveElementIdentifiers={[{ className: idsAndClassNames.inactiveCursorClassName }]} cursor="pointer" replaceCursor={this.props.active} positionAdjustment={this.positionAdjustment}>
                <span style={{ zIndex: 1000, fontSize: style.cursor.fontSize, fontFamily: fontFamilies.noughtCrossFontFamily, color: this.props.overTakenSquare ? "gray" : this.props.cursorColour }}>{this.props.cursorText}</span>
            </BodyCursor>
        </MouseBodyPosition>
    }
}
export const ConnectedTicTacToeCursor = connect((state: TicTacToeState) => {
    var cursorColour = getCurrentPlayerColour(state);
    var cursorText = state.currentPlayer === Player.X ? textStrings.cross : textStrings.nought;
    var active = state.fontLoadingState === FontLoadingState.Active && state.gameState === GameState.Playing;
    var boardHitTestResult = state.boardHitTest.result;
    var overTakenSquare = false;
    if (boardHitTestResult) {
        if (boardHitTestResult.hit) {
            var squareGo = state.board[boardHitTestResult.row][boardHitTestResult.column];
            overTakenSquare = squareGo !== SquareGo.None
        }
    }
    return {
        cursorColour: cursorColour,
        cursorText: cursorText,
        active: active,
        overTakenSquare: overTakenSquare
    }
}, (dispatch) => {
    return {
        boardHitTestRequest: function (x: number, y: number) {
            dispatch(boardHitTest(x, y));
        }
    }
})(TicTacToeCursor) as any;
