import * as React from "react";
//need react snippet etc


//later could provide all sorts of other formatting
export interface IDuration {
    seconds: number,
    minutes: number,
    hours: number,
    milliseconds: number
    days: number,
    //years: number,

    totalMilliseconds: number
    totalSeconds: number
    totalMinutes: number
    totalHours: number
    totalDays: number
}
export class Duration implements IDuration {
    milliseconds: number
    seconds: number
    minutes: number
    hours: number
    days: number//todo
    //years: number
    totalSeconds: number
    totalMinutes: number
    totalHours: number
    totalDays:number

    
    

    totalMilliseconds: number
    constructor(ms: number) {
        this.totalMilliseconds = ms;  
        this.milliseconds = (ms % 1000);

        this.seconds = Math.floor((ms / 1000) % 60);
        this.totalSeconds = Math.floor(ms / 1000);

        this.minutes = Math.floor((ms / (1000 * 60)) % 60);
        this.totalMinutes = Math.floor(ms / (1000 * 60));

        this.hours = Math.floor((ms / (1000 * 60 * 60))) % 24;
        this.totalHours = Math.floor(ms / (1000 * 60 * 60));

        this.days = Math.floor((ms / (1000 * 60 * 60 * 24)));
    }
    static increment(duration: IDuration, ms: number): Duration {
        var totalMs = duration.totalMilliseconds + ms;
        return new Duration(totalMs);
    }
    static decrement(duration: IDuration, ms: number): Duration {
        var totalMs = duration.totalMilliseconds - ms;
        return new Duration(totalMs);
    }
}

export interface StopwatchProps {
    //ms
    startDuration?: number,
    autoStart?:boolean,
    reportTickInterval?: ReportTickInterval
    countdown?:boolean
}
export interface StopwatchState {
    duration: IDuration,
    tickState:TickState
}

export enum ReportTickInterval { millisecond, hundredthSecond, tenthSecond, second, minute, hour }

enum TickState {
    running,paused,stopped
}
export interface StopwatchProps2 {
    //ms
    startDuration?: number,
    autoStart?: boolean,
    countdown?: boolean
}
export class StopwatchController2 extends React.Component<StopwatchProps2, StopwatchState> {
    public static defaultProps: Partial<StopwatchProps2> = {
        autoStart: true,
        startDuration: 0,
    }
    private startDuration: Duration
    private currentDuration: Duration
    private cancelIntervalId: number
    private startTime: any
    private hasStopped = false
    private hasStarted = false;
    constructor(props) {
        super(props);
        this.currentDuration = new Duration(this.props.startDuration);
        this.startDuration = this.currentDuration;
        this.state = { tickState: TickState.stopped, duration: this.currentDuration }
    }

    componentWillMount() {
        if (this.props.autoStart) {
            this.start();
        }
    }
    componentWillReceiveProps(nextProps: StopwatchProps) {
        var self = this;

        this.currentDuration = new Duration(nextProps.startDuration);
        this.stop();
        this.hasStopped = false;
        this.startDelay = 0;
        this.startDuration = this.currentDuration;

        window.setTimeout(function () {
            self.setState({ duration: self.currentDuration });
            if (self.props.autoStart) {
                //necessary for state change !
                window.setTimeout(function () {
                    self.start();
                }, 1);
            }
        }, 1);


    }
    getDuration() {
        if (this.props.countdown || !this.hasStarted) {
            return this.currentDuration;
        } else {
            return Duration.decrement(this.currentDuration, 1000);
        }

    }

    componentWillUnmount() {
        this.stopTimer(true);
    }
    updateSecond() {
        this.updateDuration(1000);
    }
    updateDuration(ms: number) {
        if (this.props.countdown) {
            this.currentDuration = Duration.decrement(this.currentDuration, ms);
            if (this.currentDuration.totalMilliseconds < 0) {
                this.stop();
                return;
            }
        } else {
            

            this.currentDuration = Duration.increment(this.currentDuration, ms);
        }
        
        this.setState({ duration: this.currentDuration });
    }

    startTimer() {
        var self = this;
        
        if (this.startDelay === 0) {
            this.startSecondTimer();
        } else {
            window.setTimeout(function () {
                self.updateSecond.bind(self)();
                self.startSecondTimer.bind(self)();
            },this.startDelay)
        
        }
    }
    
    startSecondTimer() {
        var self = this;
        this.startTime = new Date();
        this.cancelIntervalId = window.setInterval(function () {
            self.updateSecond();
        }, 1000);
    }
    start = () => {
        var self = this;
        if (this.state.tickState === TickState.stopped || this.state.tickState === TickState.paused) {
            this.hasStarted = true;
            this.startTimer();
            this.setState({ tickState: TickState.running, duration: this.currentDuration });
            if (!self.hasStopped) {
                window.setTimeout(function () {
                    self.updateDuration(1000);
                }, 0);
            }
            
        }
    }
    stopTimer(paused: boolean) {
        var now = new Date() as any;

        var self = this;
        var newState: Partial<StopwatchState>;
        if (paused) {
            newState = {
                tickState: TickState.paused
            }
        } else {
            newState = {
                tickState: TickState.stopped,
                duration: this.currentDuration
            }
        }
        
        var difference = (now - this.startTime ) % 1000;
        this.startDelay = 1000 - difference;


        window.clearInterval(this.cancelIntervalId);
        this.setState(newState as StopwatchState)

    }
    pause = () => {
        this.pauseOrStop(true);
    }
    startDelay=0
    pauseOrStop(paused: boolean) {
        
        this.hasStopped = true;
        this.stopTimer(paused);
        this.startDuration = this.currentDuration;

    }
    stop = () => {
        this.hasStarted = false;
        this.pauseOrStop(false)
    }
    //LP
    clear = () => {

    }

    render() {
        return <div>
            {React.cloneElement(this.props.children as React.ReactElement<any>, { tickState: this.state.tickState, duration: this.state.duration, stop: this.stop, clear: this.clear, start: this.start })}
        </div>
    }
}

export class StopwatchController extends React.Component<StopwatchProps, StopwatchState> {
    public static defaultProps: Partial<StopwatchProps> = {
        autoStart: true,
        startDuration: 0,
        reportTickInterval: ReportTickInterval.second
    }
    private timerInterval:number
    private startDuration:Duration
    private currentDuration: Duration
    private cancelIntervalId: number
    private startTime: any
    private hasStopped = false
    private hasStarted = false;
    constructor(props) {
        super(props);
        this.currentDuration = new Duration(this.props.startDuration);
        this.startDuration = this.currentDuration;
        this.setTimerInterval();
        this.state = { tickState: TickState.stopped, duration: this.currentDuration}
    }

    componentWillMount() {
        if (this.props.autoStart) {
            this.start();
        }
    }
    componentWillReceiveProps(nextProps: StopwatchProps) {
        var self = this;
        
        this.currentDuration = new Duration(nextProps.startDuration);
        this.stop();
        this.hasStopped = false;
        this.startDuration = this.currentDuration;
        this.setTimerInterval();
        window.setTimeout(function () {
            self.setState({ duration: self.currentDuration });
            if (self.props.autoStart) {
                //necessary for state change !
                window.setTimeout(function () {
                    self.start();
                }, 1);
            }
        }, 1);
        
        
    }
    getDuration() {
        if (this.props.countdown||!this.hasStarted) {
            return this.currentDuration;
        } else {
            return Duration.decrement(this.currentDuration, 1000);
        }
        
    }
    setTimerInterval() {
        switch (this.props.reportTickInterval) {
            case ReportTickInterval.millisecond:
                this.timerInterval = 1;
                break;
            case ReportTickInterval.hundredthSecond:
                this.timerInterval = 10;
                break;
            case ReportTickInterval.tenthSecond:
                this.timerInterval = 100;
                break;
            case ReportTickInterval.second:
                this.timerInterval = 1000;
                break;
            case ReportTickInterval.minute:
                this.timerInterval = 60000;
                break;
            case ReportTickInterval.hour:
                this.timerInterval = 60000 * 24;
                break;

        }
    }
    componentWillUnmount() {
        this.stopTimer(true);
    }
    
    updateDuration(ms: number) {
        if (this.props.countdown) {
            this.currentDuration = Duration.decrement(this.startDuration, ms);
            if (this.currentDuration.totalMilliseconds <= 0) {
                this.stop();
                return;
            }
        } else {
            if (!this.hasStopped) {
                ms = ms + 1000;
            }
            
            this.currentDuration = Duration.increment(this.startDuration, ms);
        }
        
        this.setState({ duration: this.currentDuration });
    }

    startTimer() {
        var self = this;
        this.startTime = new Date();
        this.cancelIntervalId=window.setInterval(function () {
            var now:any = new Date();
            var elapsed = now - self.startTime;
            self.updateDuration(elapsed);
        }, this.timerInterval);
    }
    start = () => {
        if (this.state.tickState === TickState.stopped || this.state.tickState === TickState.paused) {
            this.hasStarted = true;
            this.startTimer();
            this.setState({ tickState: TickState.running, duration: this.currentDuration })
        }
    }
    stopTimer(paused: boolean) {
        var self = this;
        var newState: Partial<StopwatchState>;
        if (paused) {
            newState = {
                tickState: TickState.paused
            }
        } else {
            newState = {
                tickState: TickState.stopped,
                duration: this.currentDuration
            }
        }
        window.clearInterval(this.cancelIntervalId);
        this.setState(newState as StopwatchState)
        
    }
    pause = () => {
        this.pauseOrStop(true);
    }
    pauseOrStop(paused:boolean) {
        this.hasStopped = true;
        this.stopTimer(paused);
        this.startDuration = this.currentDuration;
    }
    stop = () => {
        this.hasStarted = false;
        this.pauseOrStop(false)
    }
    //LP
    clear = () => {

    }

    render() {
        return <div>
            {React.cloneElement(this.props.children as React.ReactElement<any>, {tickState: this.state.tickState, duration: this.state.duration, stop: this.stop, clear: this.clear, start: this.start })}
        </div>
    }
}


export interface DemoStopwatchProps {
    duration?: IDuration,
    started?: boolean,
    stop?: () => void;
    clear?: () => void,
    start?:()=>void
}
export class DemoStopwatchDisplay extends React.Component<DemoStopwatchProps, undefined> {

    render() {
        return <div>
            <span>{this.props.duration.days}</span><span>:</span>
            <span>{this.props.duration.hours}</span><span>:</span>
            <span>{this.props.duration.minutes}</span><span>:</span>
            <span>{this.props.duration.seconds}</span>
            {this.props.started ?
                <button onClick={() => { this.props.stop() }}>Stop</button> :
                <button onClick={() => { this.props.start() }}>Start</button>
            }
        </div>
    }
}

export interface FlipCounterProps {
    duration?: IDuration,
    hoursTitle?: string,
    minutesTitle?: string,
    secondsTitle?: string,
    tickState?:TickState

}

function getTickStateString(tickState: TickState) {
    switch (tickState) {
        case TickState.paused:
            return "pausd";
        case TickState.running:
            return "running";
        case TickState.stopped:
            return "stopped";
    }
}

export class FlipCounter extends React.Component<FlipCounterProps, undefined>{
    public static defaultProps: Partial<FlipCounterProps> = {
        hoursTitle: "",
        minutesTitle: "",
        secondsTitle: ""
    }
    //this will eventually become part of the duration
    getDoubleDigits(num: number): string {
        var numString = num.toString();
        if (numString.length === 1) {
            numString = "0" + numString;
        }
        return numString;
    }
    getDoubleDigitsArray(num: number): Digit[] {
        return this.getDigitArray(this.getDoubleDigits(num).split(""));
    }
    getDigitArray(numStrings: string[]): Digit[] {
        return numStrings.map(function (numString) {
            return parseInt(numString) as Digit;
        })
    }
    getHourDigits(hours: number): Digit[] {
        var hoursString = hours.toString();
        //could change this based upon options
        if (hoursString.length === 1) {
            return this.getDoubleDigitsArray(hours);
        }
        return this.getDigitArray(hoursString.split(""));
    }

    render() {
        var self = this;
        return <div className="flip-clock-wrapper">
            <DigitsDivider dividerTitle={this.props.hoursTitle} />
            {
                this.getHourDigits(this.props.duration.totalHours).map(function (hourDigit, i) {
                    return <FlipDigit2 pauseStoppedAnimation={true} tickState={self.props.tickState} debugIdentifier={"hour" + i.toString()} maxDigit={9} digit={hourDigit} key={i} />
                })
            }
            
            <DigitsDivider dividerTitle={this.props.minutesTitle} />
            {
                this.getDoubleDigitsArray(this.props.duration.minutes).map(function (minuteDigit, i) {
                    return <FlipDigit2 pauseStoppedAnimation={true} tickState={self.props.tickState} debugIdentifier={"minute" + i.toString()} maxDigit={i===0?5:9}  digit={minuteDigit} key={i} />
                })
            }

            <DigitsDivider dividerTitle={this.props.secondsTitle} />
            {
                this.getDoubleDigitsArray(this.props.duration.seconds).map(function (secondDigit, i) {
                    return <FlipDigit2 pauseStoppedAnimation={true} tickState={self.props.tickState} debug={i === 1} debugIdentifier={"second" + i.toString()} maxDigit={i === 0 ? 5 : 9}  digit={secondDigit} key={i} />
                })
            }
            
        </div>
    }
}
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export interface FlipDigitsProps {
    maxDigit: Digit,

    digit: Digit,
    
    running: boolean,

    playClass?:string,
    flipClass?: string,
    beforeClass?: string,
    activeClass?: string,

    countdown?: boolean,

    debugIdentifier?: string
    debug?: boolean,
}

export class FlipDigits extends React.Component<FlipDigitsProps, undefined>{
    public static defaultProps: Partial<FlipDigitsProps> = {
        activeClass: "flip-clock-active",
        beforeClass: "flip-clock-before",
        flipClass: "flip",
        playClass:"play"
    }
    listElement: HTMLUListElement;
    initialDigit:Digit
    isInitial:boolean=true
    lastDigit: Digit
    previousDigit:Digit
    getListClassName(props: FlipDigitsProps) {
        var listClassName = this.props.flipClass + this.props.running && !this.isInitial ? " " + this.props.playClass : "";
        return listClassName;
    }
    getListClassNameRunning(running: boolean) {
        return this.props.flipClass + running? (" " + this.props.playClass) : "";
    }
    applyRunning(running: boolean) {
        this.listElement.className = this.getListClassNameRunning(running);
    }
    getLiClass(digit: Digit) {
        
        var className = "";
        if (digit === this.previousDigit) {
            className = this.props.beforeClass;
        } else if (digit === this.lastDigit) {
            className = this.props.activeClass;
        }
        
        return className;
    }
    setDigits(props: FlipDigitsProps) {
        if (this.initialDigit == null) {
            this.initialDigit = props.digit;
            this.lastDigit = props.digit;
        } else {
            if ((this.isInitial && this.initialDigit !== this.props.digit) || !this.isInitial) {
                this.lastDigit = props.digit;
                this.previousDigit = this.getPreviousDigit(props.digit);
                this.isInitial = false;
            }
        }
    }

    render() {
        this.setDigits(this.props);
        var digits: Digit[] = [];
        for (var i = 0; i < this.props.maxDigit+1; i++) {
            digits.push(i as Digit);
        }
        var self = this;
        return <ul ref={(ul) => { this.listElement = ul }} className={this.getListClassName(this.props)}>
            {
               
                digits.map(function (digit: Digit) {
                    return <li key={digit} className={self.getLiClass(digit)}>
                    <a href="#">
                        <div className="up">
                            <div className="shadow"></div>
                            <div className="inn">{digit}</div>
                        </div>
                        <div className="down">
                            <div className="shadow"></div>
                            <div className="inn">{digit}</div>
                        </div>
                        
                    </a>
                </li>
            })}
        </ul>
    }
    applyDigitClasses() {
        var lis = this.listElement.children;
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            var newClassName = this.getLiClass(i as Digit);
            if (li.className !== newClassName) {
                li.className = newClassName
            }
        }
    }

    //looks like need a boolean for not running reset
    componentWillReceiveProps(nextProps: FlipDigitsProps) {
        if (!nextProps.running) {
            this.debug("not running: " + nextProps.digit);

            this.initialDigit = null;
        } else {
            this.setDigits(nextProps);
        }

        this.applyDigitClasses();
        
        
        this.listElement.className = this.getListClassName(nextProps);
    }
    shouldComponentUpdate() {
        return false;
    }
    debug(msg: string) {
        if (this.props.debug) {
            console.log(this.props.debugIdentifier + ": " + msg);
        }
    }
    getPreviousDigit(digit: Digit): Digit {
        var prevDigit: number;
        if (this.props.countdown) {
            prevDigit = this.getNextDigit(digit);
        } else {
            prevDigit = digit === 0 ? this.props.maxDigit : digit - 1;
        }
        
        return prevDigit as Digit;
    }
    getNextDigit(digit: Digit) {
        var nextDigit = digit === this.props.maxDigit ? 0 : digit + 1;
        return nextDigit as Digit;
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////
interface DemoFlipDigitState {
    tickState: TickState,
    digit:Digit
}
export class DemoFlipDigit extends React.Component<undefined, DemoFlipDigitState>{
    constructor(props) {
        super(props);
        this.state = { digit: 2, tickState: TickState.stopped };
    }
    getNextDigit():Digit {
        var currentDigit = this.state.digit;
        return (currentDigit === 9 ? 0 : currentDigit + 1) as Digit;
    }
    render() {

        return <div className="flip-clock-wrapper">
            <FlipDigit pausePausedAnimation={true} pauseStoppedAnimation={true} digit={this.state.digit} tickState={this.state.tickState} maxDigit={9} />

            <button onClick={() => { this.setState({ digit: 5, tickState: TickState.stopped }) }}>Stop 5</button>
            <button onClick={() => { this.setState({ digit: 9, tickState: TickState.paused }) }}>Pause</button>
            <button onClick={() => { this.setState({ digit: this.getNextDigit(), tickState: TickState.running }) }}>Run next</button>
            <button onClick={() => { this.setState({ tickState: TickState.running }) }}>Run</button>
            </div>
    }
}
/////////
export interface FlipDigitProps {
    maxDigit: Digit,

    digit: Digit,

    tickState: TickState,

    playClass?: string,
    flipClass?: string,
    beforeClass?: string,
    activeClass?: string,

    debugIdentifier?: string
    debug?: boolean,

    pauseStoppedAnimation?: boolean
    pausePausedAnimation?:boolean
}
//export enum FlipState { Stopped, Paused, Running }
interface FlipDigitState {
    setChange(flipDigit: FlipDigit, nextState: TickState, digit: Digit);
}
//to return to - using the paused state for css 
class FlipDigitBaseState implements FlipDigitState {
    setChange(flipDigit: FlipDigit, nextState: TickState, digit: Digit) {
        var newState: FlipDigitState;
        switch (nextState) {
            case TickState.paused:
                newState = new FlipDigitPausedState();
                break;
            case TickState.running:
                newState = new FlipDigitRunningState();
                break;
            case TickState.stopped:
                newState = new FlipDigitStoppedState();
                break;
        }
        flipDigit.flipDigitState = newState;
    }
    isRunning() { return false; }
    shouldComponentUpdate(nextProps: FlipDigitProps,flipDigit:FlipDigit) { return true; }
    
}

class FlipDigitRunningState extends FlipDigitBaseState {
    setChange(flipDigit: FlipDigit, nextState: TickState, digit: Digit) {
        switch (nextState) {
            case TickState.stopped:
                flipDigit.pauseAnimations(true);
                break;
            case TickState.paused:
                flipDigit.pauseAnimations(false);
                break;
            case TickState.running:
                
                if (flipDigit.lastDigit !== digit) {
                    flipDigit.previousDigit = flipDigit.lastDigit;
                    flipDigit.lastDigit = digit;
                    flipDigit.updateAll(true)
                }
        }
        super.setChange(flipDigit, nextState, digit);
    }
}
class FlipDigitPausedState extends FlipDigitBaseState {
    setChange(flipDigit: FlipDigit, nextState: TickState, digit: Digit) {
        switch (nextState) {
            case TickState.stopped:
                flipDigit.lastDigit = digit;
                flipDigit.previousDigit = null;
                flipDigit.updateDigits();
                break;
            case TickState.running:
                if (digit !== flipDigit.lastDigit) {
                    flipDigit.previousDigit = flipDigit.lastDigit;
                    flipDigit.lastDigit = digit;
                    flipDigit.updateDigits();
                } else {
                    flipDigit.resumeAnimations();
                }
                break;
        }
        super.setChange(flipDigit, nextState, digit);
    }

}

//can be running when stopped
class FlipDigitStoppedState extends FlipDigitBaseState {
    setChange(flipDigit: FlipDigit, nextState: TickState, digit: Digit) {
        switch (nextState) {
            case TickState.stopped:
                flipDigit.applyRunning(false)
                flipDigit.lastDigit = digit;
                flipDigit.previousDigit = null;
                flipDigit.updateDigits();
                break;
            case TickState.running:
                if (digit !== flipDigit.lastDigit) {
                    flipDigit.previousDigit = flipDigit.lastDigit;
                    flipDigit.lastDigit = digit;
                    flipDigit.updateAll(true);
                    
                } else {
                    flipDigit.resumeAnimations();
                }
                break;
        }
        super.setChange(flipDigit, nextState, digit);
    }
}


//will want to applyRunning
//set previousDigit and lastDigit
//updateDigits

//be consistent with order
interface FlipDigitClassTestState {
    digitsText: string,
    applyRunning: boolean
    updateDigits:boolean
}
export class FlipDigitClassTest extends React.Component<undefined, FlipDigitClassTestState>{
    //will consider the effect of animations as well
    constructor() {
        super();
        this.state = { digitsText: "", applyRunning: false, updateDigits: false }

    }
    flipDigit: FlipDigit
    setDigits = () => {
        var self = this;
        var digitsText = this.state.digitsText;
        var parts = digitsText.split(" ");
        parts.forEach(function (part) {
            var previousOrLast = part.substring(0, 1);
            var nullOrDigit = part.substring(1);
            var isPrevious = previousOrLast === "p";
            var digit: Digit= null;
            if (nullOrDigit.length === 1) {
                digit = parseInt(nullOrDigit) as Digit;
            }
            if (isPrevious) {
                self.flipDigit.previousDigit = digit;
            } else {
                self.flipDigit.lastDigit = digit;
            }
        })
        if (this.state.updateDigits) {
            self.flipDigit.updateDigits();
        }
    }
    applyRunning = () => {
        this.flipDigit.applyRunning(this.state.applyRunning);
    }
    render() {
        return <div className="flip-clock-wrapper">

            <FlipDigit ref={(digit) => { this.flipDigit = digit; }} digit={0} tickState={TickState.stopped} maxDigit={9} />
            <input onChange={(evt) => this.setState({ applyRunning: evt.target.checked })} checked={this.state.applyRunning} type="checkbox" />
            <button onClick={() => { this.applyRunning() }}>Set running</button>
            <input onChange={(evt) => this.setState({ updateDigits: evt.target.checked as boolean })} checked={this.state.updateDigits} type="checkbox" />
            <button onClick={() => { this.setDigits() }}>Set digits</button>
            <input onChange={(evt) => this.setState({ digitsText: evt.target.value })} value={this.state.digitsText} type="text" />
        </div>
    }
}

export class FlipDigit extends React.Component<FlipDigitProps, undefined>{

    public static defaultProps: Partial<FlipDigitProps> = {
        activeClass: "flip-clock-active",
        beforeClass: "flip-clock-before",
        flipClass: "flip",
        playClass: "play",

        tickState: TickState.stopped,
        pausePausedAnimation: false,
        pauseStoppedAnimation:false
    }
    flipDigitState: FlipDigitState = new FlipDigitStoppedState();

    listElement: HTMLUListElement;
    previousDigit: Digit
    lastDigit:Digit
    getRunningClassName(running: boolean) {
        return this.props.flipClass + (running ? (" " + this.props.playClass) : "");
    }
    
    applyRunning(running: boolean) {
        this.listElement.className = this.getRunningClassName(running);
    }
    getDigitClass(digit: Digit) {

        var className = "";
        if (digit === this.previousDigit) {
            className = this.props.beforeClass;
        } else if (digit === this.lastDigit) {
            className = this.props.activeClass;
        }

        return className;
    }
    updateAll(running:boolean) {
        this.updateDigits();
        this.applyRunning(running)
    }
    updateDigits() {
        var lis = this.listElement.children;
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            var newClassName = this.getDigitClass(i as Digit);
            
            //if (li.className !== newClassName) {
            //    li.className = newClassName
            //}
            li.className = newClassName;
        }
    }
    debugProps(props: FlipDigitProps) {
        this.debug(getTickStateString(props.tickState) + " " + props.digit);
    }
    render() {

        this.previousDigit = null;
        this.lastDigit = this.props.digit;

        var digits: Digit[] = [];
        for (var i = 0; i < this.props.maxDigit + 1; i++) {
            digits.push(i as Digit);
        }
        var self = this;
        return <ul ref={(ul) => { this.listElement = ul }} className={this.getRunningClassName(false)}>
            {

                digits.map(function (digit: Digit) {
                    return <li key={digit} className={self.getDigitClass(digit)}>
                        <a href="#">
                            <div className="up">
                                <div className="shadow"></div>
                                <div className="inn">{digit}</div>
                            </div>
                            <div className="down">
                                <div className="shadow"></div>
                                <div className="inn">{digit}</div>
                            </div>

                        </a>
                    </li>
                })}
        </ul>
    }
    componentWillReceiveProps(nextProps: FlipDigitProps) { 
        this.flipDigitState.setChange(this, nextProps.tickState, nextProps.digit);
    }
    shouldComponentUpdate() {
        return false;
    }
    debug(msg: string) {
        if (this.props.debug) {
            console.log(this.props.debugIdentifier + ": " + msg);
        }
    }
    animationPaused = false;
    pauseAnimations(stopped:boolean) {
        var shouldPause = stopped ? this.props.pauseStoppedAnimation : this.props.pausePausedAnimation;
        if (shouldPause) {
            this.applyAnimationState(true);
        }
    }
    resumeAnimations() {       
        if (this.animationPaused) {
            this.applyAnimationState(false);
        }
    }
    applyAnimationState(paused: boolean) {
        var descendants = this.listElement.querySelectorAll("*");
        for (var i = 0; i < descendants.length; i++) {
            var descendant = descendants[i] as HTMLElement
            var style = window.getComputedStyle(descendant);
            if (style.animation) {
                var newState = paused ? 'paused' : 'running';
                descendant.style.webkitAnimationPlayState = newState;
            }
        }
        this.animationPaused = paused;
    }
}


export class FlipDigit2 extends React.Component<FlipDigitProps, undefined>{

    public static defaultProps: Partial<FlipDigitProps> = {
        activeClass: "flip-clock-active",
        beforeClass: "flip-clock-before",
        flipClass: "flip",
        playClass: "play",

        tickState: TickState.stopped,
        pausePausedAnimation: false,
        pauseStoppedAnimation: false
    }
    //flipDigitState: FlipDigitState = new FlipDigitStoppedState();
    runningState: TickState = TickState.stopped;
    listElement: HTMLUListElement;
    previousDigit: Digit=null
    lastDigit: Digit=null
    getRunningClassName(running: boolean) {
        return this.props.flipClass + (running ? (" " + this.props.playClass) : "");
    }

    applyRunning(running: boolean) {
        this.listElement.className = this.getRunningClassName(running);
    }
    getDigitClass(digit: Digit) {

        var className = "";
        if (digit === this.previousDigit) {
            className = this.props.beforeClass;
        } else if (digit === this.lastDigit) {
            className = this.props.activeClass;
        }

        return className;
    }
    updateAll(running: boolean) {
        this.updateDigits();
        this.applyRunning(running)
    }
    updateDigits() {
        var lis = this.listElement.children;
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            var newClassName = this.getDigitClass(i as Digit);

            //if (li.className !== newClassName) {
            //    li.className = newClassName
            //}
            li.className = newClassName;
        }
    }
    debugProps(props: FlipDigitProps) {
        this.debug(getTickStateString(props.tickState) + " " + props.digit);
    }
    firstRender = true;
    render() {
        
        var self = this;
        var newTickState = this.props.tickState;
        var isRunning = newTickState === TickState.running && !this.firstRender;
        var digits: Digit[] = [];
        if (this.previousDigit!==null) {
            digits.push(this.previousDigit);
        }
        this.lastDigit = this.props.digit;
        digits.push(this.lastDigit);
        this.runningState = newTickState;

        this.firstRender = false;
        return <ul ref={(ul) => { this.listElement = ul }} className={this.getRunningClassName(isRunning)}>
            {

                digits.map(function (digit: Digit, i: number) {
                    return <li key={digit} className={self.getDigitClass(digit)}>
                        <a href="#">
                            <div className="up">
                                <div className="shadow"></div>
                                <div className="inn">{digit}</div>
                            </div>
                            <div className="down">
                                <div className="shadow"></div>
                                <div className="inn">{digit}</div>
                            </div>

                        </a>
                    </li>
                })}
        </ul>
    }
    nextProps:FlipDigitProps
    componentWillReceiveProps(nextProps: FlipDigitProps) {
        //could pass through to state here
        this.nextProps = nextProps;
    }
    shouldComponentUpdate() {
        var shouldUpdate = false;
        var nextState = this.nextProps.tickState;
        var nextDigit = this.nextProps.digit;
        switch (this.runningState) {
            case TickState.stopped:
                switch (nextState) {
                    case TickState.stopped:
                        this.previousDigit = null;
                        shouldUpdate = true;
                        break;
                    case TickState.running:
                        if (nextDigit !== this.lastDigit) {
                            this.previousDigit = this.lastDigit;
                            shouldUpdate = true;

                        } else {
                            this.resumeAnimations();
                        }
                        break;
                }
                break;
            case TickState.paused:
                switch (nextState) {
                    case TickState.stopped:
                        this.previousDigit = null;
                        shouldUpdate = true;
                        break;
                    case TickState.running:
                        if (nextDigit !== this.lastDigit) {
                            this.previousDigit = this.lastDigit;
                            shouldUpdate = true;

                        } else {
                            this.resumeAnimations();
                        }
                        break;
                }
                break;
            case TickState.running:
                switch (nextState) {
                    case TickState.stopped:
                        this.pauseAnimations(true);
                        break;
                    case TickState.paused:
                        this.pauseAnimations(false);
                        break;
                    case TickState.running:
                        
                        if (this.lastDigit !== nextDigit) {
                            this.previousDigit = this.lastDigit;
                            shouldUpdate = true;
                        }
                }
                break;
        }
        this.runningState = nextState;
        return shouldUpdate;
    }
    debug(msg: string) {
        if (this.props.debug) {
            console.log(this.props.debugIdentifier + ": " + msg);
        }
    }

    //#region animations
    animationPaused = false;
    pauseAnimations(stopped: boolean) {
        var shouldPause = stopped ? this.props.pauseStoppedAnimation : this.props.pausePausedAnimation;
        if (shouldPause) {
            this.applyAnimationState(true);
        }
    }
    resumeAnimations() {
        if (this.animationPaused) {
            this.applyAnimationState(false);
        }
    }
    applyAnimationState(paused: boolean) {
        var descendants = this.listElement.querySelectorAll("*");
        for (var i = 0; i < descendants.length; i++) {
            var descendant = descendants[i] as HTMLElement
            var style = window.getComputedStyle(descendant);
            if (style.animation) {
                var newState = paused ? 'paused' : 'running';
                descendant.style.webkitAnimationPlayState = newState;
            }
        }
        this.animationPaused = paused;
    }
    //endregion
}


//////////////////////////////////////////////////////////////////////////////////////////////////


export interface DigitsDividerProps {
    dividerTitle: string,
    dividerClass?: string
    labelClass?: string,
    dotClass?:string
   
}
export class DigitsDivider extends React.Component<DigitsDividerProps, undefined>{
    public static defaultProps: Partial<DigitsDividerProps> = {
        labelClass: 'flip-clock-label',
        dotClass: 'flip-clock-dot',
        dividerClass:'flip-clock-divider'
    }
    render() {
        return <span className={this.props.dividerClass}>
            <span className={this.props.labelClass}>{this.props.dividerTitle}</span>
            <span className={this.props.dotClass + " top"}></span>
            <span className={this.props.dotClass + " bottom"}></span>
            </span>
    }
}
//will probably be able to have a Flippable component that cycles through whatever - string
//startIndex - next() or just the index ?