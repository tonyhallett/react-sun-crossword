import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from "react-redux"
import { createStore, combineReducers, applyMiddleware, AnyAction } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';



enum SquareGo { None, X, O }
enum Player {X,O}
interface TicTacToeState {
    board: SquareGo[][],
    currentPlayer:Player
}
const Take_Go = "TAKE_GO"
function takeGo(row, column) {
    return {
        type: Take_Go,
        row: row,
        column:column
    }
}
var numRowsAndColumns = 3;
function getDefaultBoard(): SquareGo[][] {
    var rows = [];
    for (var i = 0; i < numRowsAndColumns; i++) {
        var squares = [];
        for (var j = 0; j < numRowsAndColumns; j++) {
            squares.push(SquareGo.None);
        }
        rows.push(squares);
    }
    return rows;
}
var firstPlayer = Player.X;
function reducer(state: TicTacToeState = {
    currentPlayer: firstPlayer,
    board: getDefaultBoard()

}, action: AnyAction) {
    switch (action.type) {
        case Take_Go:
            var row = action.row;
            var column = action.column;
            var currentPlayer = state.currentPlayer;
            var nextPlayer = currentPlayer === Player.X ? Player.O : Player.X;
            var newBoard=state.board.map((rowSquares, index) => {
                if (index === row) {
                    return rowSquares.map((sq, colIndex) => {
                        if (colIndex === column) {
                            return currentPlayer;
                        }
                        return sq;
                    })
                }
                return rowSquares;
            });
            return {
                board: newBoard,
                currentPlayer: nextPlayer
            }
        default:
            return state;
    }
}

interface TicTacToeSquareRowColProps {
    rowIndex: number,
    colIndex: number
}
interface TicTacToeSquareConnectStateProps {
    squareGo: SquareGo
}
interface TicTacToeSquareDispatchProps {
    takeGo: () => void
}
interface TicTacToeSquareProps extends TicTacToeSquareRowColProps, TicTacToeSquareConnectStateProps, TicTacToeSquareDispatchProps {

}

class TicTacToeSquare extends React.Component<TicTacToeSquareProps, undefined>{
    render() {
        return <td style={{ width:100,height:100,border:1,borderColor:"black"}} onClick={() => { this.props.squareGo }}>
            {this.props.squareGo === SquareGo.None ? "" : this.props.squareGo}
            </td>
    }
}
const ConnectedTicTacToeSquare: any = connect((state: TicTacToeState, ownProps: TicTacToeSquareRowColProps) => {
    var connectState = {
        squareGo: state.board[ownProps.rowIndex][ownProps.colIndex]
    }
    return connectState;
}, (dispatch, ownProps: TicTacToeSquareRowColProps) => {
    return {
        takeGo: function () {
            dispatch(takeGo(ownProps.rowIndex, ownProps.colIndex))
        }
        }
    })(TicTacToeSquare);

interface TicTacToeBoardProps {
    board: SquareGo[][]
}
export class TicTacToeBoard extends React.Component<TicTacToeBoardProps, undefined>{
    render() {
        return <table style={{ borderCollapse:"collapse",border:1,borderColor:"black" }}>
            <tbody>
            {   this.props.board.map((rowSquares, rowIndex) => {
                return <tr key={rowIndex}>
                    {
                        rowSquares.map((square, colIndex) => {
                            return <ConnectedTicTacToeSquare key={colIndex} rowIndex={rowIndex} colIndex={colIndex}/>

                        })
                    }
                    </tr>
                })
            }
                </tbody>
            </table>
    }
}
const ConnectedTicTacToeBoard:any = connect((state: TicTacToeState) => {
    return {
        board: state.board
    }
})(TicTacToeBoard);

//const store = createStore(
//    combineReducers({
//        hooksAndMounts,
//        router: routerReducer,
//        is404Active,
//        routeErrorDetails,
//        handleRouteError
//    }),
//    composeWithDevTools(applyMiddleware(middleware))

//)
const store = createStore(reducer);
ReactDOM.render(
    <Provider store={store}>
        <ConnectedTicTacToeBoard/>
    </Provider>,

    document.getElementById("example")
);