import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect, Store } from "react-redux"
import { createStore, combineReducers, applyMiddleware, AnyAction } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import * as Modal from 'react-modal';
import { isStorageAvailable, stringifySetStorageItem, parseGetStorageItem, createLocalStorageStore} from "./helpers/storage"
import * as $ from 'jquery';

enum SquareGo { X, O, None }
enum Player { X, O }
enum GameState {X,O,Playing,Draw,FinishedConfirmed}
//probably is a way to type a colour css property
interface ScoreboardCountState {
    playCount: number,
    drawCount: number,
    playerXWinCount: number
}
interface PlayerColourState {
    xColour: string
    oColour: string
}

interface TicTacToeState extends ScoreboardCountState, PlayerColourState {
    board: SquareGo[][],
    currentPlayer: Player,
    
    gameState: GameState,
    
}
const Finished_Confirmed="FINISHED_CONFIRMED"
const Play_Again = "PLAY_AGAIN";
const Take_Go = "TAKE_GO"
function finishedConfirmed() {
    return {
        type: Finished_Confirmed
    }
}
function playAgain() {
    return {
        type: Play_Again
    }
}
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
function checkWinner(board: SquareGo[][]):SquareGo {
    var winner = checkRowsWinner(board);
    if (winner === SquareGo.None) {
        winner = checkColumnsWinner(board);
        if (winner === SquareGo.None) {
            winner = checkDiagonalWinner(board);
        }
    }
    return winner;
}
function checkRowsWinner(board: SquareGo[][]): SquareGo {
    var checkSquareGo;
    var winner;
    for (var i = 0; i < board.length; i++) {
        winner = true;
        for (var j = 0; j < board.length; j++) {
            var squareGo = board[i][j];
            if (squareGo == SquareGo.None) {
                winner = false;
                break;
            }
            if (j === 0) {
                checkSquareGo = squareGo;
            } else {
                if (checkSquareGo !== squareGo) {
                    winner = false;
                    break;
                }
            }
            
        }
        if (winner) {
            break;
        }
    }
    if (!winner) {
        checkSquareGo = SquareGo.None;
    }
    return checkSquareGo;
}
function checkColumnsWinner(board: SquareGo[][]): SquareGo {
    var checkSquareGo;
    var winner;
    for (var i = 0; i < board.length; i++) {
        winner = true;
        for (var j = 0; j < board.length; j++) {
            var squareGo = board[j][i];
            if (squareGo == SquareGo.None) {
                winner = false;
                break;
            }
            if (j === 0) {
                checkSquareGo = squareGo;
            } else {
                if (checkSquareGo !== squareGo) {
                    winner = false;
                    break;
                }
            }

        }
        if (winner) {
            break;
        }
    }
    if (!winner) {
        checkSquareGo = SquareGo.None;
    }
    return checkSquareGo;
}
function checkDiagonalWinner(board: SquareGo[][]): SquareGo {
    var checkSquareGo;
    var winner = true;
    for (var i = 0; i < board.length; i++) {
        var squareGo = board[i][i];
        if (squareGo == SquareGo.None) {
            winner = false;
            break;
        }
        if (i === 0) {
            checkSquareGo = squareGo;
        } else {
            if (checkSquareGo !== squareGo) {
                winner = false;
                break;
            }
        }
    }
    if (!winner) {
        winner = true;
        for (var i = 0; i < board.length; i++) {
            var squareGo = board[i][board.length-1-i];
            if (squareGo == SquareGo.None) {
                winner = false;
                break;
            }
            if (i === 0) {
                checkSquareGo = squareGo;
            } else {
                if (checkSquareGo !== squareGo) {
                    winner = false;
                    break;
                }
            }
        }
    }
    if (!winner) {
        checkSquareGo = SquareGo.None;
    }
    return checkSquareGo;
}
function checkDraw(board: SquareGo[][]) {
    var isDraw = true;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var square = board[i][j];
            if (square === SquareGo.None) {
                isDraw = false;
                break;
            }
        }
    }
    return isDraw;
}
function reducer(state: TicTacToeState = {
    currentPlayer: firstPlayer,
    board: getDefaultBoard(),
    oColour: "red",
    xColour: "blue",
    gameState: GameState.Playing,
    playCount:0,
    drawCount: 0,
    playerXWinCount: 0
}, action: AnyAction) {
    switch (action.type) {
        case Finished_Confirmed:
            return {
                ...state,
                gameState: GameState.FinishedConfirmed
            }
        case Play_Again:
            var nextPlayer = (currentPlayer === Player.X) ? Player.O : Player.X;
            return {
                board: getDefaultBoard(),
                currentPlayer: nextPlayer,
                oColour: state.oColour,
                xColour: state.xColour,
                gameState: GameState.Playing,
                drawCount: state.drawCount,
                playCount: state.playCount,
                playerXWinCount: state.playerXWinCount
            }
        case Take_Go:
            var row = action.row;
            var column = action.column;
            var currentPlayer = state.currentPlayer;
            var nextPlayer = (currentPlayer === Player.X) ? Player.O : Player.X;
            var newBoard=state.board.map((rowSquares, index) => {
                if (index === row) {
                    return rowSquares.map((sq, colIndex) => {
                        if (colIndex === column) {
                            var squareGo = SquareGo.O;
                            if (currentPlayer === Player.X) {
                                squareGo = SquareGo.X;
                            }
                            return squareGo;
                        }
                        return sq;
                    })
                }
                return rowSquares;
            });
            var winner = checkWinner(newBoard);
            var gameState = GameState.Playing;
            var drawCount = state.drawCount;
            var playCount = state.playCount;
            var playerXWinCount = state.playerXWinCount;
            switch (winner) {
                case SquareGo.None:
                    if (checkDraw(newBoard)) {
                        gameState = GameState.Draw;
                        playCount++;
                        drawCount++;
                    }
                    break;
                case SquareGo.X:
                    gameState = GameState.X;
                    playCount++;
                    playerXWinCount++;
                    break;
                case SquareGo.O:
                    gameState = GameState.O;
                    playCount++;
                    break;
            }
            return {
                board: newBoard,
                currentPlayer: nextPlayer,
                oColour: state.oColour,
                xColour: state.xColour,
                gameState: gameState,
                drawCount: drawCount,
                playCount: playCount,
                playerXWinCount: playerXWinCount
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
    squareGoColour: string,
    squareText: string,
    canGo:boolean
}
interface TicTacToeSquareDispatchProps {
    takeGo: () => void
}
interface TicTacToeSquareProps extends TicTacToeSquareRowColProps, TicTacToeSquareConnectStateProps, TicTacToeSquareDispatchProps {

}

class TicTacToeSquare extends React.Component<TicTacToeSquareProps, undefined>{
    squareClicked = () => {
        if (this.props.canGo) {
            this.props.takeGo();
        }
        
    }
    render() {

        return <td style={{
            color: this.props.squareGoColour,
            textAlign:"center",width: 100, height: 100, borderWidth: "1px", borderColor: "black", borderStyle: "solid", fontSize: "80px"
        }} onClick={this.squareClicked}>
            {this.props.squareText}
            </td>
    }
}
const ConnectedTicTacToeSquare: any = connect((state: TicTacToeState, ownProps: TicTacToeSquareRowColProps) => {
    var squareGo = state.board[ownProps.rowIndex][ownProps.colIndex];
    var squareGoColour = "white";
    var squareText = "";
    var canGo = false;
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
            canGo = true;
            break;

    }
    if (state.gameState !== GameState.Playing) {
        canGo = false;
    }
    var connectState = {
        squareGoColour: squareGoColour,
        squareText: squareText,
        canGo: canGo
    }
    return connectState;
}, (dispatch, ownProps: TicTacToeSquareRowColProps) => {
    return {
        takeGo: function () {
            dispatch(takeGo(ownProps.rowIndex, ownProps.colIndex))
        }
        }
    })(TicTacToeSquare as any);

interface TicTacToeBoardProps {
    board: SquareGo[][]
}
const ticTacToeBoardId ="ticTacToeBoard"
export class TicTacToeBoard extends React.Component<TicTacToeBoardProps, undefined>{
    render() {
        return <table id={ticTacToeBoardId} style={{ borderCollapse: "collapse", borderWidth: "1px", borderColor: "black", borderStyle: "solid" }}>
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

interface PlayerViewOwnProps {
    player: Player,
    
}
interface PlayerViewStateProps {
    isWinner: boolean,
    playerColour: string,
    currentColour: string,
    playerText: string,
    currentFontWeight: fontWeightBolderOrNormal
}
class PlayerView extends React.Component<PlayerViewOwnProps&PlayerViewStateProps, undefined > {
    render() {

        return <div style={{  width: 274, padding: 10, borderWidth: "3px",borderStyle:"solid", borderColor: this.props.currentColour, fontWeight: this.props.currentFontWeight, color: this.props.playerColour }}>
            <div>{this.props.playerText}</div>
            {this.props.isWinner&&<div>Winner !</div>}
            </div>
    }
}
type fontWeightBolderOrNormal = "bolder" | "normal";
var ConnectedPlayerView:any = connect((state: TicTacToeState, ownProps: PlayerViewOwnProps) => {
    var playerColour = state.oColour;
    if (ownProps.player === Player.X) {
        playerColour = state.xColour;
    }
    var isWinner = false;
    switch (state.gameState) {
        case GameState.O:
            isWinner = ownProps.player === Player.O;
            break;
        case GameState.X:
            isWinner = ownProps.player === Player.X;
            break;
    }
    var isCurrent = state.currentPlayer === ownProps.player;
    var playerId = ownProps.player === Player.X ? "X" : "O";
    return {
        playerColour: playerColour,
        isWinner: isWinner,
        currentColour: isCurrent ? "green" : "black",
        currentFontWeight:isCurrent? "bolder":"normal",
        playerText: "Player " + playerId
    }
})(PlayerView);

interface ScoreboardStateProps extends ScoreboardCountState, PlayerColourState{
    currentPlayer:Player
}
interface ScoreboardProps { }
function addPaddingToStyle(style) {
    style.paddingTop = 5;
    style.paddingBottom = 5;
    return style;
}
class Scoreboard extends React.Component<ScoreboardProps&ScoreboardStateProps, undefined>{
    render() {
        var totalWins = this.props.playCount - this.props.drawCount;
        var playerXLossCount = totalWins - this.props.playerXWinCount;
        var playerOWinCount = playerXLossCount;
        var playerOLossCount = this.props.playerXWinCount;
        return <table style={{width:309, borderCollapse: "collapse", borderWidth: "1px", borderColor: "black", borderStyle: "solid" }}>
            <thead>
                <tr style={{ borderWidth: "1px", borderColor: "black", borderStyle: "solid" }}>
                    <th style={addPaddingToStyle({ width: 100 })}>Player</th>
                    <th style={addPaddingToStyle({ width: 66 })}>Won</th>
                    <th style={addPaddingToStyle({ width: 66 })}>Lost</th>
                    <th >Drawn</th>
                </tr>
            </thead>
            <tbody>
                <ScoreboardPlayer playerColour={this.props.xColour} playerId="X" playerBoldStyle={this.props.currentPlayer === Player.X ? "bolder" : "normal"} drawn={this.props.drawCount} won={this.props.playerXWinCount} lost={playerXLossCount} />
                <ScoreboardPlayer playerColour={this.props.oColour} playerId="O" playerBoldStyle={this.props.currentPlayer === Player.O ? "bolder" : "normal"} drawn={this.props.drawCount} won={playerOWinCount} lost={playerOLossCount}/>
            </tbody>
            </table>
    }
}
const ConnectedScoreboard:any = connect((state: TicTacToeState) => {
    var scoreboardState: ScoreboardStateProps = {
        currentPlayer: state.currentPlayer,
        drawCount: state.drawCount,
        playCount: state.playCount,
        playerXWinCount: state.playerXWinCount,
        oColour: state.oColour,
        xColour:state.xColour
    } 
    return scoreboardState;
})(Scoreboard);
interface ScoreboardPlayerProps {
    playerId: string,
    playerBoldStyle: fontWeightBolderOrNormal,
    playerColour: string,
    won: number,
    lost: number,
    drawn:number
}
class ScoreboardPlayer extends React.Component<ScoreboardPlayerProps, undefined>{
    render() {
        return <tr style={{ borderWidth: "1px", borderColor: "black", borderStyle: "solid" }}>
            <td style={addPaddingToStyle({ textAlign: "center", fontWeight: this.props.playerBoldStyle, color: this.props.playerColour })}>{this.props.playerId}</td>
            <td style={addPaddingToStyle({ textAlign: "center" })}>{this.props.won}</td>
            <td style={addPaddingToStyle( {textAlign: "center" })}>{this.props.lost}</td>
            <td style={addPaddingToStyle({ textAlign: "center" })}>{this.props.drawn}</td >
            </tr>
    }
}
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

interface TicTacToeAppProps {
    gameState: GameState,
    playAgain: () => void,
    finishedConfirmed: () => void,
}
enum ElementDimensionsChoice { Content, PaddingAndBorder, Padding, PaddingBorderMargin }
//http://blog.jquery.com/2012/08/16/jquery-1-8-box-sizing-width-csswidth-and-outerwidth/
function getElementWidth(element: HTMLElement, dimensionsChoice: ElementDimensionsChoice) {
    var $el = $(element);
    switch (dimensionsChoice) {
        case ElementDimensionsChoice.PaddingAndBorder:
            return $el.outerWidth(false);
        case ElementDimensionsChoice.Padding:
            return $el.innerWidth();
        case ElementDimensionsChoice.PaddingBorderMargin:
            return $el.outerWidth(true);
        case ElementDimensionsChoice.Content:
            return $el.width()

    }
}
function getElementHeight(element: HTMLElement, dimensionsChoice: ElementDimensionsChoice) {
    var $el = $(element);
    switch (dimensionsChoice) {
        case ElementDimensionsChoice.PaddingAndBorder:
            return $el.outerHeight(false);
        case ElementDimensionsChoice.Padding:
            return $el.innerHeight();
        case ElementDimensionsChoice.PaddingBorderMargin:
            return $el.outerHeight(true);
        case ElementDimensionsChoice.Content:
            return $el.height()

    }
}
function getOverlay(element: HTMLElement, dimensionsChoice: ElementDimensionsChoice) {
    var $element = $(element);
    var offset = $element.offset();//border-box
    var left = offset.left;
    var top = offset.top;
    var width
    var height
    var paddingLeft = $element.css('padding-left')
    var paddingRight = $element.css('padding-right')

    switch (dimensionsChoice) {
        case ElementDimensionsChoice.Content:

            break;
        case ElementDimensionsChoice.Padding:

            break;
        case ElementDimensionsChoice.PaddingAndBorder:

            break;
        case ElementDimensionsChoice.PaddingBorderMargin:

            break;

    }
    return {};
}
//temp
interface TicTacToAppState {
    showModal: boolean,
    modalDimension: ElementDimensionsChoice
}
class TicTacToeApp extends React.Component<TicTacToeAppProps, TicTacToAppState>{
    constructor(props) {
        super(props);
        this.state = { showModal: false, modalDimension:ElementDimensionsChoice.Content }
    }
    modalShouldOpen=()=> {
        var gameState = this.props.gameState;
        return gameState === GameState.Draw || gameState === GameState.O || gameState === GameState.X;
    }
    modalReady: ModalReady
    getModalStyle = () => {
        var testOverlay = document.querySelector("#testOverlay") as HTMLElement;
        return getOverlay(testOverlay, this.state.modalDimension);
        //var table = document.querySelector("#" + ticTacToeBoardId) as HTMLElement;
        //if (table) {

        //    var height = getElementHeight(table, ElementDimensionsChoice.PaddingAndBorder)
        //    var width = getElementWidth(table, ElementDimensionsChoice.PaddingAndBorder)
        //    var offset = $(table).offset();//does this point include the padding,margin ?

        //    var rect = table.getBoundingClientRect();
           
        //    var styles = {
        //        overlay: {
        //            top: rect.top,
        //            left: rect.left,
        //            right:"auto",
        //            bottom: "auto",
        //            width: width,
        //            height:height
        //        }
        //    }
        //    return styles;
        //}
        //return {};
        
    }
    selectChanged = (event) => {
        this.setState({modalDimension:event.target.value})
    }
    render() {
        /*
        <div style={{ marginTop: 10, marginBottom: 10 }}>
                <ConnectedScoreboard />
            </div>
        <ConnectedTicTacToeBoard/>
        <button style={{ margin: 10, padding: 10 }} onClick={this.props.playAgain}>Play again</button>

        <ModalReady getStyle={this.getModalStyle} isOpen={this.modalShouldOpen()} onRequestClose={this.props.finishedConfirmed}>
                <div style={{ margin: "0 auto", width: "80%", textAlign: "center"}}>
                    {this.getWinDrawMessage()}
                </div>
            </ModalReady>
        */
        return <div>
            
            <div style={{ backgroundColor: "orange",overflow:"auto" }}>
                <div id="testOverlay" style={{ margin: 10, paddingLeft: 10,paddingRight:20, borderWidth: 10, borderStyle: "solid", borderColor: "red", backgroundColor: "yellow" }}>
                    <div  style={{ width: 300, height: 300, backgroundColor:"blue" }}></div>
                </div>
            </div>
            
            
            <button onClick={() => { this.setState({ showModal: true }) }}>Show modal</button>
            <select value={this.state.modalDimension} onChange={this.selectChanged}>
                <option value={ElementDimensionsChoice.Content}>Content</option>
                <option value={ElementDimensionsChoice.Padding}>Padding</option>
                <option value={ElementDimensionsChoice.PaddingAndBorder}>PaddingAndBorder</option>
                <option value={ElementDimensionsChoice.PaddingBorderMargin}>PaddingBorderMargin</option>
            </select>
            <ModalReady getStyle={this.getModalStyle} isOpen={this.state.showModal} onRequestClose={() => { this.setState({showModal:false})}}>
                <div style={{ margin: "0 auto", width: "80%", textAlign: "center"}}>
                    {this.getWinDrawMessage()}
                </div>
            </ModalReady>

        </div>
    }
    getWinDrawMessage() {
        var message = "Game drawn";
        switch (this.props.gameState) {
            case GameState.X:
                message = "Player X Won !";
                break;
            case GameState.O:
                message = "Player O Won !";
                break;
        }
        return message;
    }
}
//not entirely sure that this typing is correct - https://github.com/reactjs/react-modal
interface ModalClassNameProps {
    base?: string,
    afterOpen?: string,
    beforeClose?:string
}
type classNameProps = string | ModalClassNameProps
interface ModalStyle {
    overlay ?: React.CSSProperties,
    content ?:React.CSSProperties
}
interface ModalProps {
    isOpen: boolean,
    onAfterOpen?: () => any,
    onRequestClose?: () => any,
    closeTimeoutMS?: number,
    contentLabel?: string,
    aria?: {
        [x:string]:string
    },
    style?: ModalStyle
    className?: classNameProps,
    overlayClassName?: classNameProps,
    portalClassName?:string


}
interface ModalReadyProps extends ModalProps {
    getStyle: () => ModalStyle
}

interface ModalReadyState {
    ready:boolean
}
//if this works then will want a Modal class that will overlay an element
class ModalReady extends React.Component<ModalReadyProps, ModalReadyState>{
    constructor(props) {
        super(props)
        this.state = { ready:false }
    }
    componentDidMount() {
        this.setState({ ready: true })
    }
    //isReady() {
    //    if (!this.state.ready) {
    //        this.setState({ ready: true })
    //    }
        
    //}
    render() {
        if (!this.state.ready) {
            return null;
        }
        //style={this.props.getStyle()} 
        return <Modal style={this.props.getStyle()} {...this.props} />
    }
}

const ConnectedTicTacToeApp:any = connect((state: TicTacToeState) => {
    return {
        gameState:state.gameState
    }
}, (dispatch) => {
    return {
        playAgain: function () {
            dispatch(playAgain())
        },
        finishedConfirmed: function () {
            dispatch(finishedConfirmed());
        }
    }
    })(TicTacToeApp);

var store = createLocalStorageStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedTicTacToeApp/>
    </Provider>,

    document.getElementById("example")
);