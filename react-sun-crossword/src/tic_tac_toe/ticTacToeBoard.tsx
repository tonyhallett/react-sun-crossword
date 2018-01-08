import * as React from "react";
import { connect } from "react-redux"
import { hitTest } from "./hitTest"
import { SquareGo, BoardHitTestReq, BoardHitTestRes, TicTacToeState } from "./reducer";
import { boardHitTestResult } from './actions';
import { style } from "./style";
import * as idsAndClassNames from './idsAndClassNames'
import { ConfiguredRadium } from "./configuredRadium";
import { ConnectedTicTacToeSquare } from "./ticTacToeSquare";

interface TicTacToeBoardProps {
    board: SquareGo[][],
    hitTestRequest: BoardHitTestReq,
    hitTestResult: (res: BoardHitTestRes) => void
}
export class TicTacToeBoard extends React.Component<TicTacToeBoardProps, undefined>{
    tbody: HTMLTableSectionElement
    componentWillReceiveProps(nextProps: TicTacToeBoardProps) {
        if (nextProps.hitTestRequest && nextProps.hitTestRequest !== this.props.hitTestRequest) {
            this.hitTest(nextProps.hitTestRequest)
        }
    }
    hitTest(hitTestRequest: BoardHitTestReq) {
        var numRowColumns = this.props.board.length;
        var rows = this.tbody.rows
        var isHit = false;
        var hitRow;
        var hitColumn;

        for (var i = 0; i < numRowColumns; i++) {
            var row = rows[i];
            //will check the row for hittest
            for (var j = 0; j < numRowColumns; j++) {
                var cell = row.cells[j];
                isHit = hitTest(hitTestRequest.x, hitTestRequest.y, cell) as boolean;
                if (isHit) {
                    hitRow = i;
                    hitColumn = j;
                    break;
                }
            }
            if (isHit) {
                break;
            }
        }
        this.props.hitTestResult({ hit: isHit, row: hitRow, column: hitColumn });
    }
    render() {
        var boardDimensions = this.props.board.length;
        return <table id={idsAndClassNames.ticTacToeBoardId} style={[{
            borderCollapse: "collapse", backgroundColor: style.componentBackgroundColor
        }, style.componentBoxShadow, style.componentBoxShadowHover]}>
            <tbody ref={(b) => this.tbody = b}>
                {
                    this.props.board.map((rowSquares, rowIndex) => {
                        return <tr key={rowIndex}>
                            {
                                rowSquares.map((square, colIndex) => {
                                    return <ConnectedTicTacToeSquare key={colIndex} rowIndex={rowIndex} colIndex={colIndex} />

                                })
                            }
                        </tr>
                    })
                }
            </tbody>
        </table>
    }
}
export const ConnectedTicTacToeBoard: any = connect((state: TicTacToeState) => {
    return {
        board: state.gameState.board,
        hitTestRequest: state.boardHitTest.request
    }
}, (dispatch) => {
    return {
        hitTestResult: function (res: BoardHitTestRes) {
            dispatch(boardHitTestResult(res.hit, res.row, res.column));
        }
    }
})(ConfiguredRadium(TicTacToeBoard));
