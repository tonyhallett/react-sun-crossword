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
    started: boolean
    paused:boolean 
}

export enum ReportTickInterval { millisecond,hundredthSecond,tenthSecond,second,minute,hour}
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
        this.state = { started: false, duration: this.currentDuration,paused:false }
    }

    componentWillMount() {
        if (this.props.autoStart) {
            this.start();
        }
    }
    componentWillReceiveProps(nextProps: StopwatchProps) {
        var self = this;
        this.stop();
        this.currentDuration = new Duration(nextProps.startDuration);
        this.hasStopped = false;
        this.hasStarted = false;
        this.startDuration = this.currentDuration;
        this.setTimerInterval();
        if (this.props.autoStart) {
            //necessary for state change !
            window.setTimeout(function () {
                self.start();
            }, 1);
        }
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
        if (!this.state.started || this.state.paused) {
            this.hasStarted = true;
            this.startTimer();
            this.setState({ started: true, paused: false, duration: this.currentDuration })
        }
    }
    stopTimer(paused: boolean) {
        var newState: Partial<StopwatchState> = { started: false };
        if (paused) {
            newState = {
                paused:true
            }
        }
        this.setState(newState as StopwatchState)
        window.clearInterval(this.cancelIntervalId);
    }
    pause = () => {
        this.pauseOrStop(true);
    }
    pauseOrStop(paused:boolean) {
        if (this.state.started) {
            this.hasStopped = true;
            this.stopTimer(paused);
            this.startDuration = this.currentDuration;
        }
    }
    stop = () => {
        this.pauseOrStop(false)
    }
    //LP
    clear = () => {

    }
    render() {
        return <div>
            {React.cloneElement(this.props.children as React.ReactElement<any>, {started: this.state.started, duration: this.state.duration, stop: this.stop, clear: this.clear, start: this.start })}
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
    started?: boolean,
    countdown?:boolean
}
export class FlipCounter extends React.Component<FlipCounterProps, undefined>{
    public static defaultProps: Partial<FlipCounterProps> = {
        hoursTitle: "",
        minutesTitle: "",
        secondsTitle: "",
        started: false
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
                    return <FlipDigits countdown={self.props.countdown} debugIdentifier={"hour" + i.toString()} maxDigit={9} running={self.props.started} digit={hourDigit} key={i} />
                })
            }
            
            <DigitsDivider dividerTitle={this.props.minutesTitle} />
            {
                this.getDoubleDigitsArray(this.props.duration.minutes).map(function (minuteDigit, i) {
                    return <FlipDigits countdown={self.props.countdown} debugIdentifier={"minute" + i.toString()} maxDigit={i===0?5:9} running={self.props.started}  digit={minuteDigit} key={i} />
                })
            }

            <DigitsDivider dividerTitle={this.props.secondsTitle} />
            {
                this.getDoubleDigitsArray(this.props.duration.seconds).map(function (secondDigit, i) {
                    return <FlipDigits isUnitSecond={i===1} countdown={self.props.countdown} debug={i === 1} debugIdentifier={"second" + i.toString()} maxDigit={i === 0 ? 5 : 9} running={self.props.started} digit={secondDigit} key={i} />
                })
            }
            
        </div>
    }
}
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export interface FlipDigitsProps {
    digit: Digit,
    maxDigit:Digit,
    running: boolean,
    playClass?:string,
    flipClass?: string,
    beforeClass?: string,
    activeClass?: string,
    countdown?:boolean,
    debugIdentifier?: string
    debug?: boolean,
    isUnitSecond?:boolean
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
    componentWillReceiveProps(nextProps: FlipDigitsProps) {
        if (!nextProps.running) {
            this.initialDigit = null;
        } else {
            this.setDigits(nextProps);
        }
       

        var lis = this.listElement.children;
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            var newClassName = this.getLiClass(i as Digit);
            if (li.className !== newClassName) {
                li.className = newClassName
            }
        }
        
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