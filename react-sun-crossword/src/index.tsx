import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect, Store } from "react-redux"
import { createStore, combineReducers, applyMiddleware, AnyAction } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import * as Modal from 'react-modal';
import { isStorageAvailable, stringifySetStorageItem, parseGetStorageItem, createLocalStorageStore} from "./helpers/storage"
import * as $ from 'jquery';
import { Style, StyleRoot } from "Radium";
import * as Radium from "Radium";
import Transition from 'react-transition-group/Transition';
import { TransitionProps, EndHandler, EnterHandler, ExitHandler } from 'react-transition-group/Transition';
import * as Color from 'Color'
import { flipOutX,flipInX,pulse } from 'react-animations';
import * as WebFont  from "webfontloader";



//#region redux
//#region redux state
//this is not for all circumstances, just for what is appropriate for me - a single font
enum FontLoadingState { NotStarted, Loading, Active, Inactive }
const FONT_LOADING = "FONT_LOADING";
function fontLoading(state: FontLoadingState) {
    return {
        type: FONT_LOADING,
        state: state
    }
}
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
    fontLoadingState: FontLoadingState
    
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
    oColour: "yellow",
    xColour: "rgb(255, 51, 153)",
    gameState: GameState.Playing,
    playCount:0,
    drawCount: 0,
    playerXWinCount: 0,
    fontLoadingState: FontLoadingState.NotStarted
}, action: AnyAction) {
    switch (action.type) {
        case FONT_LOADING:
            return {
                ...state,
                fontLoadingState:action.state
            }
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
//#region inOnMount
interface InOnMountState {
    in: boolean
}
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
        
        onEnter=(node: HTMLElement)=> {
            if (this.props.onEnter) {
                this.props.onEnter(node, this.inOnMount);
            }
        }
        onEntering=(node: HTMLElement)=> {
            if (this.props.onEntering) {
                this.props.onEntering(node, this.inOnMount);
            }
        }
        onEntered=(node: HTMLElement)=> {
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
//#endregion
//#region AutoOut
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
interface TransitionHelperTransitionProps {
    enterTransition: string,
    exitTransition?: string,
}
interface TransitionHelperStyleProps {
    enterStyle: React.CSSProperties,
    exitStyle: React.CSSProperties
}
interface TransitionOwnProps extends  TransitionHelperTransitionProps, TransitionHelperStyleProps { }
interface TransitionHelperProps extends TransitionProps, TransitionOwnProps { }
interface TransitionHelperState {
    in: boolean
}

function withTransitionHelper(Component: React.ComponentClass<TransitionProps>) {
    var transitionHelper = class TransitionHelper extends React.Component<TransitionHelperProps, TransitionHelperState>{
        render() {
            const { enterStyle, exitStyle, enterTransition, exitTransition, ...passThroughProps } = this.props
            var transition = <Component {...passThroughProps}>
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
            </Component>
            return transition;
        }
    }
    return transitionHelper;
}
interface TransitionHelperFnChildProp {
    children: (state: TransitionState, props: any, stateStyle: React.CSSProperties, stateTransition: string) => React.ReactElement<any>
}
interface TransitionHelperFnProps extends TransitionHelperProps, TransitionHelperFnChildProp {
    
}
function withTransitionHelperFn(Component: React.ComponentClass<TransitionProps>) {
    var transitionHelper = class TransitionHelper extends React.Component<TransitionHelperFnProps, TransitionHelperState>{
        render() {
            const { enterStyle, exitStyle, enterTransition, exitTransition, ...passThroughProps } = this.props
            var transition = <Component {...passThroughProps}>
                {(state: TransitionState) => {
                    var stateStyle: React.CSSProperties = {};
                    var stateTransition = "";
                    switch (state) {
                        case "entering":
                            
                        case "entered":
                            stateTransition = this.props.enterTransition;
                            stateStyle = { ...this.props.enterStyle }
                            break;
                        case "exiting":
                            
                        case "exited"://this is the state before in:true 
                            stateTransition = this.props.exitTransition ? this.props.exitTransition : this.props.enterTransition;
                            stateStyle = { ...this.props.exitStyle };
                            break;
                    }
                    if (typeof this.props.children === 'function') {
                        return this.props.children(state, passThroughProps,stateStyle,stateTransition);
                    } else {
                        throw new Error("withTransitionHelperFn requires child function");
                    }
                    
                }}
            </Component>
            return transition;
        }
    }
    return transitionHelper;
}
//#endregion
//#region ColourChangeTransition
enum ColourChangeType { lighten, darken, saturate, desaturate, fade, opaquer }
interface ColourChangeOwnProps {
    change: number,
    exitColour: string,
    colourChangeType: ColourChangeType,
    propName: string,
}
interface ColourChangeProps extends ColourChangeOwnProps, TransitionHelperTransitionProps { }
interface ColourChangeTransitionProps extends TransitionProps, ColourChangeProps { }

interface ColourChangeTransitionFnProps extends ColourChangeTransitionProps, TransitionHelperFnChildProp{ }

function withColourChangeTransitionFn(Component: React.ComponentClass<TransitionProps>) {
    var TransitionHelper = withTransitionHelperFn(Component);
    var colourChangeTransition = class ColourChangeTransition extends React.Component<ColourChangeTransitionFnProps, undefined> {
        render() {
            var enterStyle = {};

            var exitColor = Color(this.props.exitColour);
            var enterColor;
            var changeAmount = this.props.change;
            //note that whiten/blacken is not css3!
            switch (this.props.colourChangeType) {
                case ColourChangeType.darken:
                    enterColor = exitColor.darken(changeAmount)
                    break;
                case ColourChangeType.desaturate:
                    enterColor = exitColor.desaturate(changeAmount);
                    break;
                case ColourChangeType.fade:
                    enterColor = exitColor.fade(changeAmount);
                    break;
                case ColourChangeType.lighten:
                    enterColor = exitColor.lighten(changeAmount);
                    break;
                case ColourChangeType.opaquer:
                    enterColor = exitColor.opaquer(changeAmount);
                    break;
                case ColourChangeType.saturate:
                    enterColor = exitColor.saturate(changeAmount);
                    break;
            }
            var colorString = enterColor.toString();
            enterStyle[this.props.propName] = colorString;//seems that once change to different model cannot go back

            var exitStyle = {};
            var exitColourString = exitColor.toString();
            exitStyle[this.props.propName] = exitColourString;
            const { change, exitColour, colourChangeType, propName, ...passThroughProps } = this.props;
            return <TransitionHelper enterStyle={enterStyle} exitStyle={exitStyle} {...this.props} />
        }
    }
    return colourChangeTransition;
}
function withColourChangeTransition(Component: React.ComponentClass<TransitionProps>) {
    var TransitionHelper = withTransitionHelper(Component);
    var colourChangeTransition = class ColourChangeTransition extends React.Component<ColourChangeTransitionProps, undefined> {
        render() {
            var enterStyle = {};

            var exitColor = Color(this.props.exitColour);
            var enterColor;
            var changeAmount = this.props.change;
            //note that whiten/blacken is not css3!
            switch (this.props.colourChangeType) {
                case ColourChangeType.darken:
                    enterColor = exitColor.darken(changeAmount)
                    break;
                case ColourChangeType.desaturate:
                    enterColor = exitColor.desaturate(changeAmount);
                    break;
                case ColourChangeType.fade:
                    enterColor = exitColor.fade(changeAmount);
                    break;
                case ColourChangeType.lighten:
                    enterColor = exitColor.lighten(changeAmount);
                    break;
                case ColourChangeType.opaquer:
                    enterColor = exitColor.opaquer(changeAmount);
                    break;
                case ColourChangeType.saturate:
                    enterColor = exitColor.saturate(changeAmount);
                    break;
            }
            var colorString = enterColor.toString();
            enterStyle[this.props.propName] = colorString;//seems that once change to different model cannot go back

            var exitStyle = {};
            var exitColourString = exitColor.toString();
            exitStyle[this.props.propName] = exitColourString;
            const { change, exitColour, colourChangeType, propName, ...passThroughProps } = this.props;
            return <TransitionHelper enterStyle={enterStyle} exitStyle={exitStyle} {...this.props} />
        }
    }
    return colourChangeTransition;
}

//#endregion

//immediate
interface WithStyleProps {
    props: {
        style: React.CSSProperties
    }
}
function withSpinAxes(type: string, props: any,children:any) {
   
    var squareSpin={
        '25%': {
            transform: "perspective(100px) rotateX(180deg) rotateY(0)"
        },
        '50%': {
            transform: "perspective(100px) rotateX(180deg) rotateY(180deg)"
        },
        '75%': {
            transform: "perspective(100px) rotateX(0) rotateY(180deg)"
        },
        '100%': {
            transform: "perspective(100px) rotateX(0) rotateY(0)"
        }
    }
    var spinAxes = class extends React.Component<WithStyleProps, undefined>{
        render() {
            var existingStyle = props.style;
            props.style = [existingStyle, { animationName: Radium.keyframes(squareSpin) }]
            return React.createElement(type,props,children)
        }
    }
    return Radium(spinAxes);
}



//#region PulseAnimation
interface PulseProps {
    pulseAmount: number,//need default to 1.05
    children: (state: TransitionState, additionalProps: any, pulseStyle: React.CSSProperties) => void
}
//should change to enable not using function and having component to merge transition style with default Style provided as property
function withPulse(Component: React.ComponentClass<TransitionProps>) {
    function scale3d(a, b, c) {
        return 'scale3d(' + a + ', ' + b + ', ' + c + ')';
    };
    var pulse = class extends React.Component<TransitionProps & PulseProps, undefined>{
        render() {
            var fromTo = scale3d(1, 1, 1);
            var pulse = {
                from: {
                    transform: fromTo
                },
                '50%': {
                    transform: scale3d(this.props.pulseAmount, this.props.pulseAmount, this.props.pulseAmount)
                },
                to: {
                    transform: fromTo
                }
            };

            //passthrough to do
            return <Component {...this.props}>
                {
                    (state: TransitionState, additionalProps: any) => {
                        var transitionStyle: React.CSSProperties = {}
                        switch (state) {
                            case "entering":
                            case "entered":
                                transitionStyle = {
                                    animationDuration: this.props.timeout + "ms",
                                    animationName: Radium.keyframes(pulse)
                                }
                                break;

                        }
                        return this.props.children(state, additionalProps, transitionStyle)
                    }
                }
            </Component>
        }
    }
    return pulse;
}
//#endregion
//#endregion
//#region transition helper as a function
interface TransitionProvider<P> {
    (state: TransitionState, props: P):TransitionOwnProps
}
interface TransitionHelperChildFunction<P> {
    (state: TransitionState, props: P): React.ReactNode
}
interface TransitionHelperCallbackFunction<P> {
    (state: TransitionState, props: P, stateStyle: React.CSSProperties, stateTransition: string): React.ReactNode
}


var defaultProvider: TransitionProvider<TransitionOwnProps> = function (state: TransitionState, props: TransitionOwnProps) {
    return props;
}

function transitionHelperFn<P>(cb: TransitionHelperCallbackFunction<P>, provider: TransitionProvider<P>) {
    
    
    var transitionHelper: TransitionHelperChildFunction<P> = function (state: TransitionState, props: P) {
        var res = provider(state, props);
        var stateStyle: React.CSSProperties;
        var stateTransition: string;
        switch (state) {
            case "entering":
            case "entered":
                stateStyle = res.enterStyle;
                stateTransition = res.enterTransition;
                break;
            case "exiting":
            case "exited":
                stateStyle = res.exitStyle;
                stateTransition = res.exitTransition ? res.exitTransition : res.enterTransition;
                break;
        }
        return cb(state, props, stateStyle, stateTransition);
    }
    return transitionHelper;
        
}

//refactor to method that takes in props ( HOC same code )
var colourTransitionProvider: TransitionProvider<ColourChangeProps> = function (state: TransitionState, props: ColourChangeProps){
    var enterStyle = {};

    var exitColor = Color(props.exitColour);
    var enterColor;
    var changeAmount = props.change;
    //note that whiten/blacken is not css3!
    switch (props.colourChangeType) {
        case ColourChangeType.darken:
            enterColor = exitColor.darken(changeAmount)
            break;
        case ColourChangeType.desaturate:
            enterColor = exitColor.desaturate(changeAmount);
            break;
        case ColourChangeType.fade:
            enterColor = exitColor.fade(changeAmount);
            break;
        case ColourChangeType.lighten:
            enterColor = exitColor.lighten(changeAmount);
            break;
        case ColourChangeType.opaquer:
            enterColor = exitColor.opaquer(changeAmount);
            break;
        case ColourChangeType.saturate:
            enterColor = exitColor.saturate(changeAmount);
            break;
    }
    var colorString = enterColor.toString();
    enterStyle[props.propName] = colorString;//seems that once change to different model cannot go back

    var exitStyle = {};
    var exitColourString = exitColor.toString();
    exitStyle[props.propName] = exitColourString;
    return {
        enterStyle: enterStyle,
        exitStyle: exitStyle,
        enterTransition: props.enterTransition,
        exitTransition: props.exitTransition
    }
}
//#endregion


//#endregion

//#region demo
const demoTimeout = {
    enter: 1000,
    exit:1000
};
const demoStyle = {
    entering: {
        backgroundColor: "red",
        transition: `background-color ${demoTimeout.enter}ms linear`
    },
    entered: {
        backgroundColor: "red"
    },
    exiting: {
        backgroundColor: "yellow",
        transition: `background-color ${demoTimeout.exit}ms linear`
    },
    exited: {
        backgroundColor:"yellow"
    }
}
const demoDefaultStyle = {
    width: 300,
    height:300
}
interface DemoState {
    in: boolean,
    inSignal:object
}



class Demo extends React.Component<undefined, DemoState>{
    constructor(props) {
        super(props);
        this.state = { in: false, inSignal: {} };
        

    }
    onEntering(node: HTMLElement,appear:boolean) {
        console.log("OnEntering, appear : " + appear);
    }
    out = () => {
        this.setState({inSignal:null,in:false})
    }
    in = () => {
        this.setState({ in: true, inSignal: {} })
    }
    /*
    var duration = 3000;//need ms or s qualifier
    <button onClick={this.out}>out</button>
            <button onClick={this.in}>in</button >
    <AutoOutInOnMount appear={true} inSignal={this.state.inSignal} timeout={duration}>
                {
                    (state: TransitionState) => {
                        var style: React.CSSProperties = {}
                        switch (state) {
                            case "entering":
                            case "entered":
                                style= {
                                    animationName: Radium.keyframes(flipOutX),
                                    animationDuration:duration + "ms"

                                }
                                break;
                            case "exited":

                                break;
                            case "exiting":

                                break;
                        }
                        return <div style={style}>Flipped on in </div>
                    }

                }
            </AutoOutInOnMount>
    */
    render() {
        return null;
    }
}
const RadiumDemo = Radium(Demo);
//#endregion
//#region styling

var thButtonFontWeight = "bold" as any;
//these have been taken from https://www.w3schools.com/colors/colors_picker.asp
var scoreboardBackgroundColor = "rgb(226, 220, 207)";
var buttonBackgroundColor = "rgb(226, 220, 207)"
var componentBackgroundColor = "rgb(207, 197, 175)"//75% light

var ticTacToeSquareBorderWidth = 5;
var backgroundColor = "orange";
var ticTacToeSquareFocus = {
    animationName: Radium.keyframes({
        '100%': {
            borderColor: backgroundColor
        },
    }),
    animationDuration: "2000ms",
    animationDirection: "reverse",
    animationIterationCount: "infinite",
    animationTimingFunction:"ease-in-out"
}
var fontSize = 20;
var pulseIncrease = 1.5;
var scoreboardPadding = 5;
var textFontFamily = "Pacifico";
var noughtCrossFontFamily = "Short Stack";
var defaultFontFamily = ",Helvetica Neue, Helvetica, Arial, sans-serif";
var noughtCrossFontFamilyWithDefault = noughtCrossFontFamily + defaultFontFamily;
var textFontFamilyWithDefault = textFontFamily + defaultFontFamily;
//override scoreboard.cellStyle with noughtCrossStyle for the player cells
var style = {
    winDrawContainerStyle: { fontWeight: "bold", margin: "0 auto", width: "80%", textAlign: "center",fontSize:fontSize } as React.CSSProperties,
    componentBackgroundColor: componentBackgroundColor,
    componentMargin:10,
    borderRadius:5,
    scoreboard: {
        cellStyle: {
            paddingTop: scoreboardPadding,
            paddingBottom: scoreboardPadding,
            textAlign: "center",
            fontSize: fontSize,
            backgroundColor: scoreboardBackgroundColor,
            fontFamily: textFontFamilyWithDefault
            
        } as React.CSSProperties,
        
        noughtCrossStyle: {
            fontFamily: noughtCrossFontFamilyWithDefault
        },
        rowStyle: {
            borderTopWidth: 1, borderTopColor: "black", borderTopStyle: "solid",
            height: fontSize * pulseIncrease + 2 * scoreboardPadding
        } as React.CSSProperties,
        winColour: "green",
        loseColour: "red",
        drawColour: "orange",
        thFontWeight: thButtonFontWeight
    },
    ticTacToeSquare: {
        verticalAlign: "center",
        textAlign: "center", width: 100, height: 100,
        borderColor: "white", borderStyle: "solid", borderWidth: 0, fontSize: "80px", fontFamily: noughtCrossFontFamilyWithDefault,
        ":focus": ticTacToeSquareFocus
    } as React.CSSProperties,
    ticTacToeSquareBorderWidth:ticTacToeSquareBorderWidth
}

//#endregion
//#region text strings
//a) ensure that these are all used
const player = "Player";
const won = "Won";
const lost = "Lost";
const drawn = "Drawn";
const playAgainText = "Play again"
const nought = "O";
const cross = "X";
const numbers=["0","1","2","3","4","5","6","7","8","9"]
const gameDrawn = "Game drawn";
const wonMessage = won + " !";


var toOptimise = [player, won, lost, drawn, playAgainText, nought, cross, gameDrawn].concat(numbers);
var letters = "";
toOptimise.forEach(word => {
    for (var i = 0; i < word.length; i++) {
        var letter = word[i];
        if (letter !== " ") {
            if (letters.indexOf(letter) === -1) {
                letters += letter;
            }
        }
        
    }
})

//#endregion
//#region WebFontLoader
interface WebFontLoaderProps {
    config: WebFont.Config
}
class WebFontLoader extends React.Component<WebFontLoaderProps, undefined>{
    loadFonts() {
        WebFont.load(
            this.props.config
        )
    }
    componentDidMount() {
        this.loadFonts();
    }
    shouldComponentUpdate() {
        return false;
    }
    render() {
        return this.props.children;
    }
}
//preloadedState going to be an issue - will need to override or not save 
const ConnectedWebFontLoader = connect(null, (dispatch) => {
    return {
        loading: () => {
            dispatch(fontLoading(FontLoadingState.Loading))
        },
        active: () => {
            dispatch(fontLoading(FontLoadingState.Active))
        },
        inactive: () => {
            dispatch(fontLoading(FontLoadingState.Inactive))
        },
    }
}, (stateProps, dispatchProps, ownProps: WebFontLoaderProps) => {
    //for own use not concerned with overriding callbacks
    var mergedProps: WebFontLoaderProps = {
        ...ownProps,
        config: {
            ...ownProps.config,
            ...dispatchProps
        }
    }
    return mergedProps;
})(WebFontLoader as any) as any;
//#endregion
//#region App components
const RadiumTransition = Radium(Transition);
const AutoOutInOnMount = withAutoOut(withInOnMount(RadiumTransition))
const AutoOutInOnMountColourChangeRadiumTransition = withColourChangeTransitionFn(AutoOutInOnMount);
const RadiumHorizontalCenter = Radium(HorizontalCenter)
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
    tabIndex:number
}
interface TicTacToeSquareState {
    inSignal: any,
    kill:boolean
}
class TicTacToeSquare extends React.Component<TicTacToeSquareProps, TicTacToeSquareState>{
    constructor(props) {
        super(props);
        this.state = { inSignal: {},kill:false}
    }
    squareSelected = () => {
        if (this.props.canGo) {
            this.props.takeGo();
        }
        
    }
    componentWillReceiveProps(newProps: TicTacToeSquareProps) {
        if (newProps.canGo !== this.props.canGo) {
            if (!newProps.canGo) {
                this.setState({ inSignal: {},kill:false });
            } else {
                this.setState({ kill: true })
            }
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
                    var transitionStyle:React.CSSProperties;
                    if (this.state.kill) {
                        transitionStyle = {backgroundColor: exitColour };
                    } else {
                        transitionStyle={...stateStyle, transition: stateTransition }
                    }
                    return <td style={[style.ticTacToeSquare, specificStyle, transitionStyle]} onMouseDown={(e) => { e.preventDefault() }} onKeyPress={this.squareSelected} onClick={this.squareSelected}>
                        <div tabIndex={this.props.tabIndex} key={this.props.tabIndex} style={{ borderColor: style.componentBackgroundColor, borderWidth: 5, ":focus": ticTacToeSquareFocus }} className="ticTacToeSquare">{this.props.squareText}</div>
                    </td>
                }
                
            }
        </AutoOutInOnMountColourChangeRadiumTransition>
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
        var boardDimensions = this.props.board.length;
        return <table id={ticTacToeBoardId} style={[{
            borderCollapse: "collapse", backgroundColor: style.componentBackgroundColor,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
            transition: "all 0.3s cubic-bezier(.25, .8, .25, 1)"
            
        }, { ":hover": { boxShadow:"0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)"}}]}>
            <tbody>
                {   
                    this.props.board.map((rowSquares, rowIndex) => {
                return <tr key={rowIndex}>
                    {
                        rowSquares.map((square, colIndex) => {
                            return <ConnectedTicTacToeSquare tabIndex={(rowIndex * boardDimensions)+colIndex+1} key={colIndex} rowIndex={rowIndex} colIndex={colIndex} />

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
})(Radium(TicTacToeBoard));
//#endregion
//#region Scoreboard
interface ScoreboardStateProps extends ScoreboardCountState, PlayerColourState{
    currentPlayer:Player
}
interface ScoreboardProps { }
class Scoreboard extends React.Component<ScoreboardProps&ScoreboardStateProps, undefined>{
    render() {
        var totalWins = this.props.playCount - this.props.drawCount;
        var playerXLossCount = totalWins - this.props.playerXWinCount;
        var playerOWinCount = playerXLossCount;
        var playerOLossCount = this.props.playerXWinCount;

        return <table style={{ width: "100%",borderSpacing:0,borderCollapse:"collapse" }}>
            <thead>
                <tr>
                    <th style={{ fontWeight: thButtonFontWeight, borderTopLeftRadius: style.borderRadius, ...style.scoreboard.cellStyle }}>{player}</th>
                    <th style={{ ...style.scoreboard.cellStyle, fontWeight: thButtonFontWeight }}>{won}</th>
                    <th style={{ ...style.scoreboard.cellStyle, fontWeight: thButtonFontWeight }}>{lost}</th>
                    <th style={{ fontWeight: thButtonFontWeight, borderTopRightRadius: style.borderRadius, ...style.scoreboard.cellStyle }}>{drawn}</th>
                </tr>
            </thead>
            <tbody>
                <ScoreboardPlayer playerColour={this.props.xColour} playerId={cross} playerBoldStyle={this.props.currentPlayer === Player.X ? "bolder" : "normal"} drawn={this.props.drawCount} won={this.props.playerXWinCount} lost={playerXLossCount} />
                <ScoreboardPlayer borderRadius={style.borderRadius} playerColour={this.props.oColour} playerId={nought} playerBoldStyle={this.props.currentPlayer === Player.O ? "bolder" : "normal"} drawn={this.props.drawCount} won={playerOWinCount} lost={playerOLossCount} />
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
    drawn: number,
    borderRadius?:number
}
interface ScoreboardPlayerState {
    inSignal:object
}

const Pulse = withPulse(AutoOutInOnMount);
class ScoreboardPlayer extends React.Component<ScoreboardPlayerProps, ScoreboardPlayerState>{
    static defaultProps = {
        borderRadius: 0
    }
    constructor(props) {
        super(props);
        this.state = { inSignal:null }
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
            <td style={{ ...style.scoreboard.cellStyle, ...style.scoreboard.noughtCrossStyle, borderBottomLeftRadius: this.props.borderRadius, fontWeight: this.props.playerBoldStyle, color: this.props.playerColour }}>{this.props.playerId}</td>
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
            <td style={{ ...style.scoreboard.cellStyle, color: style.scoreboard.drawColour, borderBottomRightRadius: this.props.borderRadius } } > { this.props.drawn }</td >
            </tr>
    }
}
//#endregion
//#region TicTacToeApp

interface TicTacToeAppProps {
    gameState: GameState,
    playAgain: () => void,
    finishedConfirmed: () => void,
    fontLoadingState: FontLoadingState,
    xColour: string,
    oColour:string
}   

interface TicTacToeAppState {
    winDrawElement:React.ReactElement<any>
}
var spinningDivProps = {
    style:
    {
        width: 100, height: 100, backgroundColor: "white", textAlign: "center", verticalAlign: "center",
        animationDuration: "3000ms",
        fontSize: 90, padding: 5,
        animationTimingFunction: "cubic-bezier(0.09, 0.57, 0.49, 0.9)",
        animationIterationCount: "infinite"
    } as React.CSSProperties
}
const SpinningDivX: any = withSpinAxes("div", spinningDivProps, cross);
const SpinningDivO: any = withSpinAxes("div", spinningDivProps, nought);

class TicTacToeApp extends React.Component<TicTacToeAppProps, TicTacToeAppState>{
    keyframesFlipInX: any
    keyframesFlipOutX:any
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
    componentWillReceiveProps(props: TicTacToeAppProps) {
        if (!(props.gameState === GameState.Playing || props.gameState === GameState.FinishedConfirmed)) {
            this.setState({ winDrawElement: this.getWinDrawElement(props) })
        }
    }
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
        var showLoading = this.props.fontLoadingState === FontLoadingState.NotStarted || this.props.fontLoadingState === FontLoadingState.Loading;
        
        return <StyleRoot radiumConfig={{ userAgent:"all" }}>
            <Style
                rules={{
                    body: {
                        margin: 0   
                    },
                    ":focus": {
                        outlineStyle:"none"
                    }
                }}
            />
            <span style={{ animationName: this.keyframesFlipInX }} />
            <span style={{ animationName: this.keyframesFlipOutX }} />
            <Style rules={{
                ".ReactModal__Overlay": {
                    animationName: this.flipInXAnimationName,
                    animationDuration:this.flipDuration+"ms"
                },
                ".ReactModal__Overlay--before-close": {
                    animationName: this.flipOutXAnimationName,
                    animationDuration: this.flipDuration + "ms",
                    animationFillMode:"forwards"
                }
            }} />
            <VerticallyCenteredContainer backgroundColor={backgroundColor}>
                <RadiumHorizontalCenter>
                    <div style={{ backgroundColor: "gray", padding: 10, borderRadius: style.borderRadius, boxShadow: " 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)" }}>
                        {
                            showLoading ? <table>
                                <tbody>
                                    <tr><td><SpinningDivX /></td><td><SpinningDivO /></td><td><SpinningDivX /></td></tr>
                                    <tr><td><SpinningDivO /></td><td><SpinningDivX /></td><td><SpinningDivO /></td></tr>
                                    <tr><td><SpinningDivO /></td><td><SpinningDivX /></td><td><SpinningDivX /></td></tr>
                                </tbody>
                            </table> : <div>
                                    <div style={{ display: "inline-block" }}>
                                        <div style={{ marginBottom: style.componentMargin }}>
                                            <ConnectedScoreboard />
                                        </div>
                                        <ConnectedTicTacToeBoard />
                                        <button tabIndex={0} style={{ fontWeight: thButtonFontWeight, fontFamily: textFontFamilyWithDefault, fontSize: fontSize, borderStyle: "none", borderRadius: style.borderRadius, marginTop: style.componentMargin, paddingTop: 10, paddingBottom: 10, width: "100%", backgroundColor: buttonBackgroundColor }} onClick={this.props.playAgain}>{playAgainText}</button>
                                    </div>
                                    <ModalCover contentStyle={{ backgroundColor: componentBackgroundColor }} closeTimeoutMS={this.flipDuration} elementSelector={"#" + ticTacToeBoardId} isOpen={this.modalShouldOpen()} onRequestClose={this.props.finishedConfirmed}>
                                        {this.state.winDrawElement}
                                    </ModalCover>
                            </div>
                        }
                    </div>
                    
                    
            </RadiumHorizontalCenter>
        </VerticallyCenteredContainer>
        </StyleRoot>
            
    }
    
    getWinDrawElement(props: TicTacToeAppProps) {
        function getWinner(playerId: string, playerColour: string) {
            return <div style={style.winDrawContainerStyle}><span style={{ fontFamily: textFontFamilyWithDefault }}>{player + " "}</span><span style={{ fontFamily: noughtCrossFontFamily, color: playerColour }}>{playerId + " "}</span><span style={{ fontFamily: textFontFamilyWithDefault }}>{wonMessage}</span></div>
        }
        
        var messageElement=<div/>
        
        switch (props.gameState) {
            case GameState.X:
                messageElement = getWinner(cross, this.props.xColour);
                break;
            case GameState.O:
                messageElement = getWinner(nought,this.props.oColour);
                break;
            case GameState.Draw:
                messageElement = <div style={{ ...style.winDrawContainerStyle, fontFamily: textFontFamilyWithDefault }}>{gameDrawn}</div>;
                break;
        }
        return messageElement;
            
    }
}
const ConnectedTicTacToeApp:any = connect((state: TicTacToeState) => {
    return {
        gameState: state.gameState,
        fontLoadingState: state.fontLoadingState,
        oColour: state.oColour,
        xColour:state.xColour
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
        <ConnectedWebFontLoader config={
            {
                google: {
                    families: [textFontFamily, noughtCrossFontFamily],
                    text:letters
                }
            }

        }>
            <ConnectedTicTacToeApp />
        </ConnectedWebFontLoader>
    </Provider>,

    document.getElementById("example")
);