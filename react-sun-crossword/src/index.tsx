import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect, Store } from "react-redux"
import { createStore, combineReducers, applyMiddleware, AnyAction } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import * as Modal from 'react-modal';
import { isStorageAvailable, stringifySetStorageItem, parseGetStorageItem, createLocalStorageStore} from "./helpers/storage"
import * as $ from 'jquery';
import { Style, StyleRoot } from "Radium";
import Transition from 'react-transition-group/Transition';
import { TransitionProps, EndHandler, EnterHandler, ExitHandler } from 'react-transition-group/Transition';
import * as Color from 'Color'

var componentBackgroundColor = "lightgray";
//#region redux
//#region redux state
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
//#endregion
//#region action types
const Finished_Confirmed="FINISHED_CONFIRMED"
const Play_Again = "PLAY_AGAIN";
const Take_Go = "TAKE_GO"
//#endregion
//#region action creators
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
//#endregion
//#region state defaults
var numRowsAndColumns = 4;
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
//#endregion
//#region reducer 
//#region check winner
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
//#endregion
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
//#endregion
//#endregion

//#region Layout Components
class HorizontalCenter extends React.Component<undefined, undefined>{
    render() {
        return <div style={{ display: "table", margin: "0 auto" }}>
            {this.props.children}
        </div>
    }
}
//do as css properties and merged the two
interface VerticallyCenteredContainerProps {
    backgroundColor?: string
}
class VerticallyCenteredContainer extends React.Component<VerticallyCenteredContainerProps, undefined>{
    render() {
        var containerStyle: React.CSSProperties = {
            display: "table",
            position: "absolute",
            height: "100%",
            width: " 100%"
        }
        if (this.props.backgroundColor) {
            containerStyle.backgroundColor = this.props.backgroundColor;
        }
        return <div style={containerStyle}>
            <div style={{
                display: "table-cell",
                verticalAlign: "middle"
            }}>
                {this.props.children}
            </div>
        </div>
    }
}
//#endregion
//#region Modal
enum ElementDimensionsChoice { Content, PaddingAndBorder, Padding, PaddingBorderMargin }
//to consider box sizing - another day !
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
type ElementLengthType = "padding-left" | "border-left" | "margin-left" | "padding-top" | "border-top" | "margin-top";
function getElementEdgeLength(element: HTMLElement, lengthType: ElementLengthType) {
    var $el = $(element);
    return parseFloat($el.css(lengthType));
}
function getOverlay(element: HTMLElement, dimensionsChoice = ElementDimensionsChoice.PaddingAndBorder) {
    var $element = $(element);
    var offset = $element.offset();//border-box
    var left = offset.left;
    var top = offset.top;

    switch (dimensionsChoice) {
        case ElementDimensionsChoice.Content:
            var paddingLeft = getElementEdgeLength(element, "padding-left");
            var borderLeft = getElementEdgeLength(element, "border-left");
            var paddingTop = getElementEdgeLength(element, "padding-top");
            var borderTop = getElementEdgeLength(element, "border-top");
            top = top + paddingTop + borderTop;
            left = left + paddingLeft + borderLeft;
            break;
        case ElementDimensionsChoice.Padding:
            var borderLeft = getElementEdgeLength(element, "border-left");
            var borderTop = getElementEdgeLength(element, "border-top");
            top = top + borderTop;
            left = left + borderLeft;
            break;
        case ElementDimensionsChoice.PaddingAndBorder:
            //no change
            break;
        case ElementDimensionsChoice.PaddingBorderMargin:
            var marginLeft = getElementEdgeLength(element, "margin-left");
            var marginTop = getElementEdgeLength(element, "margin-top");
            top = top - marginTop;
            left = left - marginLeft;
            break;

    }
    return {
        left: left,
        top: top,
        width: getElementWidth(element, dimensionsChoice),
        height: getElementHeight(element, dimensionsChoice)
    };
}

//not entirely sure that this typing is correct - https://github.com/reactjs/react-modal
interface ModalClassNameProps {
    base?: string,
    afterOpen?: string,
    beforeClose?: string
}
type classNameProps = string | ModalClassNameProps
interface ModalStyle {
    overlay?: React.CSSProperties,
    content?: React.CSSProperties
}
interface ModalProps {
    isOpen: boolean,
    onAfterOpen?: () => any,
    onRequestClose?: () => any,
    closeTimeoutMS?: number,
    contentLabel?: string,
    aria?: {
        [x: string]: string
    },
    style?: ModalStyle
    className?: classNameProps,
    overlayClassName?: classNameProps,
    portalClassName?: string


}
interface ModalReadyProps extends ModalProps {
    getStyle: () => ModalStyle
}
interface ModalReadyState {
    ready: boolean
}
//if this works then will want a Modal class that will overlay an element
class ModalReady extends React.Component<ModalReadyProps, ModalReadyState>{
    constructor(props) {
        super(props)
        this.state = { ready: false }
    }
    componentDidMount() {
        this.setState({ ready: true })
    }
    render() {
        if (!this.state.ready) {
            return null;
        }

        return <Modal style={this.props.getStyle()} {...this.props} />
    }
}
interface ModalCoverProps extends ModalProps {
    elementSelector: string,
    coverType?: ElementDimensionsChoice
    contentStyle?: React.CSSProperties
}
class ModalCover extends React.Component<ModalCoverProps, undefined>{
    static defaultProps = {
        coverType: ElementDimensionsChoice.PaddingAndBorder
    }
    getStyle = () => {
        return {
            overlay: getOverlay(document.querySelector(this.props.elementSelector) as HTMLElement, this.props.coverType),
            content: this.props.contentStyle
        }
    }
    render() {
        return <ModalReady {...this.props} getStyle={this.getStyle} />
    }
}
//#endregion
//#region Transitions
//#region additional typing
type TransitionState = "exited" | "exiting" | "entered" | "entering";
//#endregion
//#region hocs
interface InOnMountState {
    in: boolean
}
//*********************************************************************************   should change the callbacks to provide appear value
function withInOnMount(Component: React.ComponentClass<TransitionProps>) {
    var inOnMount = class InOnMount extends React.Component<TransitionProps, InOnMountState>{
        inOnMount = false
        constructor(props) {
            super(props);
            var isIn = false;
            if (props.in) {
                if (props.appear) {
                    this.inOnMount = true;
                } else {
                    isIn = true;//not sure ....
                }

            }
            this.state = { in: isIn }
        }
        
        onEnter(node: HTMLElement) {
            if (this.props.onEnter) {
                this.props.onEnter(node, this.inOnMount);
            }
        }
        onEntering(node: HTMLElement) {
            if (this.props.onEntering) {
                this.props.onEnter(node, this.inOnMount);
            }
        }
        onEntered(node: HTMLElement) {
            if (this.props.onEntered) {
                this.props.onEntered(node, this.inOnMount);
            }
            this.inOnMount = false;
        }
        componentDidMount() {
            var self = this;
            if (this.inOnMount) {
                this.requestAnimationStart(() => self.setState({ in: true }))
            }
        }
        requestAnimationStart(callback) {
            // Feature detect rAF, fallback to setTimeout
            if (window.requestAnimationFrame) {
                // Chrome and Safari have a bug where calling rAF once returns the current
                // frame instead of the next frame, so we need to call a double rAF here.
                // See https://crbug.com/675795 for more.
                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(callback);
                });
            } else {
                setTimeout(callback, 0);
            }
        }
        render() {
            const { "in": inn, onEnter, onEntering, onExiting, appear, ...passThroughProps } = this.props;
            var transitionProps = { ...passThroughProps, in: this.state.in,onEnter:this.onEnter,onEntering:this.onEntering,onEntered:this.onEntered };
            return <Component {...transitionProps} />
        }
        componentWillReceiveProps(newProps) {
            this.setState({ in: newProps.in });
        }
    }
    return inOnMount;
}
interface AutoOutTransitionState {
    in: boolean
}
interface AutoOutTransitionProps {
    inSignal: any
}
function withAutoOut(Component: React.ComponentClass<TransitionProps>) {
    var autoOut = class AutoOutTransition extends React.Component<AutoOutTransitionProps & TransitionProps, AutoOutTransitionState>{
        constructor(props) {
            super(props);
            this.state = { in: props.inSignal !== null }
        }
        onEntered = (node: HTMLElement, isAppearing: boolean) => {
            this.props.onEntered ? this.props.onEntered(node, isAppearing) : void 0
            this.setState({ in: false });
        }

        componentWillReceiveProps(newProps: AutoOutTransitionProps & TransitionProps) {
            if (newProps.inSignal !== null) {
                if (newProps.inSignal !== this.props.inSignal) {
                    this.setState({ in: true });
                }
            } else {
                this.setState({ in: false });
            }
        }
        render() {
            const { onEntered, "in": inn, inSignal, ...passThroughProps } = this.props;
            var transitionProps = {
                ...passThroughProps,
                onEntered: this.onEntered,
                in:this.state.in
            }
            return <Component {...transitionProps}/>
        }
    }
    return autoOut;
}
//#endregion

//#region TransitionHelper
interface TransitionHelperProps extends TransitionProps {
    enterTransition: string,
    exitTransition?: string,
    enterStyle: React.CSSProperties,
    exitStyle: React.CSSProperties
}
interface TransitionHelperState {
    in: boolean
}
class TransitionHelper extends React.Component<TransitionHelperProps, TransitionHelperState>{
    render() {
        var transition = <Transition {...this.props}>
            {(state: TransitionState) => {
                var style: React.CSSProperties = {};
                switch (state) {
                    case "entering":
                    case "entered":
                        style = { ...this.props.enterStyle }
                        style.transition = this.props.enterTransition;
                        break;
                    case "exiting":
                    case "exited"://this is the state before in:true 
                        style = { ...this.props.exitStyle };
                        style.transition = this.props.exitTransition ? this.props.exitTransition : this.props.enterTransition;
                        break;
                }
                //should use the isValidElement guard https://stackoverflow.com/questions/42261783/how-to-assign-the-correct-typing-to-react-cloneelement-when-giving-properties-to
                var childElement = this.props.children as React.ReactElement<any>;

                var childStyle = childElement.props.style;
                var newStyle = { ...childStyle, ...style };
                var newProps = {
                    style: newStyle
                }
                var clonedElement = React.cloneElement(childElement, newProps);
                return clonedElement;
            }}
        </Transition>
        return transition;
    }
}
class TransitionHelperOld extends React.Component<TransitionHelperProps, TransitionHelperState>{
    inOnMount = false
    constructor(props) {
        super(props);
        var isIn = false;
        if (props.in) {
            if (props.appear) {
                this.inOnMount = true;
            } else {
                isIn = true;//not sure ....
            }

        }
        this.state = { in: isIn }
    }
    componentWillReceiveProps(newProps) {
        this.setState({ in: newProps.in });
    }

    componentDidMount() {
        var self = this;
        if (this.inOnMount) {
            this.requestAnimationStart(() => self.setState({ in: true }))
        }
    }
    requestAnimationStart(callback) {
        // Feature detect rAF, fallback to setTimeout
        if (window.requestAnimationFrame) {
            // Chrome and Safari have a bug where calling rAF once returns the current
            // frame instead of the next frame, so we need to call a double rAF here.
            // See https://crbug.com/675795 for more.
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(callback);
            });
        } else {
            setTimeout(callback, 0);
        }
    }

    render() {
        const { "in": inn, appear, ...passThroughProps } = this.props;
        var transition = <Transition in={this.state.in}  {...passThroughProps}>
            {(state: TransitionState) => {
                var style: React.CSSProperties = {};
                switch (state) {
                    case "entering":
                    case "entered":
                        style = { ...this.props.enterStyle }
                        style.transition = this.props.enterTransition;
                        break;
                    case "exiting":
                    case "exited"://this is the state before in:true 
                        style = { ...this.props.exitStyle };
                        style.transition = this.props.exitTransition ? this.props.exitTransition : this.props.enterTransition;
                        break;
                }
                //should use the isValidElement guard https://stackoverflow.com/questions/42261783/how-to-assign-the-correct-typing-to-react-cloneelement-when-giving-properties-to
                var childElement = this.props.children as React.ReactElement<any>;

                var childStyle = childElement.props.style;
                var newStyle = { ...childStyle, ...style };
                var newProps = {
                    style: newStyle
                }
                var clonedElement = React.cloneElement(childElement, newProps);
                return clonedElement;
            }}
        </Transition>
        return transition;
    }
}
//#endregion
//#region ColourChangeTransition
enum ColourChangeType { lighten, darken, saturate, desaturate, fade, opaquer }
//need to refactor the props interfaces - needs TransitionHelperProps with couple of omits
interface ColourChangeTransitionProps {
    change: number,
    exitColour: string,
    colourChangeType: ColourChangeType,
    propName: string,

    enterTransition: string,
    exitTransition?: string,

    inSignal: any

    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
    timeout: number | { enter?: number, exit?: number };
    addEndListener?: EndHandler;
    onEnter?: EnterHandler;
    onEntering?: EnterHandler;
    onEntered?: EnterHandler;
    onExit?: ExitHandler;
    onExiting?: ExitHandler;
    onExited?: ExitHandler;
    [prop: string]: any;

}
class ColourChangeTransition extends React.Component<ColourChangeTransitionProps, undefined> {
    render() {
        var enterStyle = {};

        var exitColor = Color(this.props.exitColour);
        var enterColor;
        var change = this.props.change;
        //note that whiten/blacken is not css3!
        switch (this.props.colourChangeType) {
            case ColourChangeType.darken:
                enterColor = exitColor.darken(change)
                break;
            case ColourChangeType.desaturate:
                enterColor = exitColor.desaturate(change);
                break;
            case ColourChangeType.fade:
                enterColor = exitColor.fade(change);
                break;
            case ColourChangeType.lighten:
                enterColor = exitColor.lighten(change);
                break;
            case ColourChangeType.opaquer:
                enterColor = exitColor.opaquer(change);
                break;
            case ColourChangeType.saturate:
                enterColor = exitColor.saturate(change);
                break;
        }
        var colorString = enterColor.toString();
        enterStyle[this.props.propName] = colorString;//seems that once change to different model cannot go back

        var exitStyle = {};
        var exitColourString = exitColor.toString();
        exitStyle[this.props.propName] = exitColourString;
        return <TransitionHelper enterStyle={enterStyle} exitStyle={exitStyle} {...this.props} />
    }
}
//#endregion

const ColourChangeTransitionInOnMount = withInOnMount(ColourChangeTransition);
const AutoOutColourChangeTransitionInOnMount = withAutoOut(ColourChangeTransitionInOnMount);

//should demonstrate in on mount with regular transition
//same with autoOut - perhaps will be able to do kill and then to put kill in withAutoOut
const InOnMountTransition = withInOnMount(Transition);
const demoDefaultStyle = {
    width: 300,
    height:300
}
const demoTimeout = 1000;
const demoStyle = {
    entering: {
        backgroundColor: "red",
        transition: `background-color ${demoTimeout}ms linear`
    },
    entered: {
        backgroundColor: "red"
    },
    exiting: {
        backgroundColor: "yellow",
        transition: `background-color ${demoTimeout}ms linear`
    },
    exited: {
        backgroundColor:"yellow"
    }
}
class Demo extends React.Component<undefined, undefined>{
    onEntering(node: HTMLElement,appear:boolean) {
        console.log("OnEntering, appear : " + appear);
    }
    render() {
        //will then demo different timeouts
        //then autoOut with kill
        //then change appear in callbacks
        return <div>
            <InOnMountTransition onEntering={this.onEntering} appear={true} in={true} timeout={1000}>
                {(state: TransitionState) => {
                    return <div style={{ ...demoDefaultStyle, ...demoStyle[state] }}/>

                }}
            </InOnMountTransition>
            </div>
    }
}

//#endregion

//#region App components
//#region TicTacToeSquare
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
interface TicTacToeSquareState {
    inSignal:any
}
class TicTacToeSquare extends React.Component<TicTacToeSquareProps, TicTacToeSquareState>{
    constructor(props) {
        super(props);
        this.state = { inSignal: {}}
    }
    squareClicked = () => {
        if (this.props.canGo) {
            this.props.takeGo();
        }
        
    }
    componentWillReceiveProps(newProps: TicTacToeSquareProps) {
        if (newProps.canGo !== this.props.canGo) {
            if (!newProps.canGo) {
                this.signal();
            } else {
                this.setState({ inSignal: null })
            }
            
            
        }
    }
    signal() {
        if (this.state.inSignal !== null) {
            this.setState({ inSignal: this.state.inSignal + 1 })
        } else {
            this.setState({ inSignal: 0 })
        }
    }
    render() {
        var transitionDuration = 1000;
        return <AutoOutColourChangeTransitionInOnMount appear={true} inSignal={this.state.inSignal} propName="backgroundColor" timeout={transitionDuration} enterTransition={`background-color ${transitionDuration}ms linear`} exitColour={componentBackgroundColor} change={0.3} colourChangeType={ColourChangeType.lighten}>
            <td style={{
                color: this.props.squareGoColour,
                textAlign: "center", width: 100, height: 100, borderWidth: "1px", borderColor: "black", borderStyle: "solid", fontSize: "80px"
            }} onClick={this.squareClicked}>
                {this.props.squareText}
            </td>
        </AutoOutColourChangeTransitionInOnMount>
        //return <td style={{
        //    color: this.props.squareGoColour,
        //    textAlign:"center",width: 100, height: 100, borderWidth: "1px", borderColor: "black", borderStyle: "solid", fontSize: "80px"
        //}} onClick={this.squareClicked}>
        //    {this.props.squareText}
        //    </td>
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
//#endregion
//#region TicTacToeBoard
interface TicTacToeBoardProps {
    board: SquareGo[][]
}
const ticTacToeBoardId ="ticTacToeBoard"
export class TicTacToeBoard extends React.Component<TicTacToeBoardProps, undefined>{
    render() {
        return <table id={ticTacToeBoardId} style={{ borderCollapse: "collapse", borderWidth: "1px", borderColor: "black", borderStyle: "solid", backgroundColor: componentBackgroundColor }}>
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
//#endregion
//#region Scoreboard
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
        return <table style={{ borderCollapse: "collapse", borderWidth: "1px",width:"100%", borderColor: "black", borderStyle: "solid", backgroundColor: componentBackgroundColor }}>
            <thead>
                <tr style={{ borderWidth: "1px", borderColor: "black", borderStyle: "solid" }}>
                    <th style={addPaddingToStyle({})}>Player</th>
                    <th style={addPaddingToStyle({})}>Won</th>
                    <th style={addPaddingToStyle({})}>Lost</th>
                    <th style={addPaddingToStyle({})}>Drawn</th>
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
    playerBoldStyle: "bolder"|"normal",
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
//#endregion
//#region TicTacToeApp

interface TicTacToeAppProps {
    gameState: GameState,
    playAgain: () => void,
    finishedConfirmed: () => void,
}
class TicTacToeApp extends React.Component<TicTacToeAppProps, undefined>{
    modalShouldOpen = () => {
        var gameState = this.props.gameState;
        return gameState === GameState.Draw || gameState === GameState.O || gameState === GameState.X;
    }
    getModalStyle = () => {
        var testOverlay = document.querySelector("#" + ticTacToeBoardId) as HTMLElement;
        return {
            overlay: getOverlay(testOverlay)
        }

    }

    render() {
        return <StyleRoot>
            <Style
                rules={{
                    body: {
                        margin: 0,
                        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
                    },
                    mediaQueries: {
                        '(max-width: 600px)': {
                            body: {
                                background: 'gray'
                            }
                        },
                        '(max-width: 500px)': {
                            body: {
                                background: 'blue'
                            },
                            'p, h1': {
                                color: 'white'
                            }
                        }
                    }
                }}
            />
            <VerticallyCenteredContainer backgroundColor="orange">
                <HorizontalCenter>
                    <div style={{ backgroundColor: "gray", padding: 10 }}>
                        <Demo/>
                        <div style={{ display: "inline-block" }}>
                            <div style={{ marginTop: 10, marginBottom: 10 }}>
                                <ConnectedScoreboard />
                            </div>
                            <ConnectedTicTacToeBoard />
                            <button style={{ marginTop: 10, paddingTop: 10, paddingBottom: 10, width: "100%" }} onClick={this.props.playAgain}>Play again</button>
                        </div>
                        <ModalCover elementSelector={"#" + ticTacToeBoardId} isOpen={this.modalShouldOpen()} onRequestClose={this.props.finishedConfirmed}>
                            <div style={{ margin: "0 auto", width: "80%", textAlign: "center" }}>
                                {this.getWinDrawMessage()}
                            </div>
                        </ModalCover>



                    </div>
                </HorizontalCenter>
            </VerticallyCenteredContainer>
        </StyleRoot>
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
//#endregion
//#endregion

var store = createLocalStorageStore(reducer);
ReactDOM.render(
    <Provider store={store}>
        <ConnectedTicTacToeApp />
    </Provider>,

    document.getElementById("example")
);