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
        //this.seconds = Math.floor((ms / 1000)) % 60;
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
}

export interface StopwatchProps {
    //ms
    startDuration?: number,
    autoStart?:boolean,
    reportTickInterval?: ReportTickInterval
    stopped?: () => void;
}
export interface StopwatchState {
    duration: IDuration,
    started:boolean
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
    private startTime:any
    constructor(props) {
        super(props);
        this.currentDuration = new Duration(this.props.startDuration);
        this.startDuration = this.currentDuration;
        this.setTimerInterval();
        this.state = { started: false, duration: this.currentDuration }
    }

    componentWillMount() {
        if (this.props.autoStart) {
            this.startTimer();
        }
    }
    componentWillReceiveProps(nextProps: StopwatchProps) {
        var self = this;
        this.stopTimer();
        this.currentDuration = new Duration(nextProps.startDuration);
        this.startDuration = this.currentDuration;
        this.setTimerInterval();
        if (this.props.autoStart) {
            //necessary for state change !
            window.setTimeout(function () {
                self.startTimer();
            }, 1);
        }

    }
    getDuration() {
        return this.currentDuration;
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
        this.stopTimer();
    }
    updateDuration(ms: number) {
        this.currentDuration = Duration.increment(this.startDuration, ms);
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
        this.setState({ started: true });
    }
    start = () => {
        if (!this.state.started) {
            this.startTimer();
            this.setState({ started:true})
        }
    }
    stopTimer() {
        this.setState({ started: false })
        window.clearInterval(this.cancelIntervalId);
    }
    stop = () => {
        if (this.state.started) {
            this.stopTimer();
            this.startDuration = this.currentDuration;
        }
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
    started?: boolean
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
                    return <FlipDigits debugIdentifier={"hour" + i.toString()} maxDigit={9} running={self.props.started} digit={hourDigit} key={i} />
                })
            }
            
            <DigitsDivider dividerTitle={this.props.minutesTitle} />
            {
                this.getDoubleDigitsArray(this.props.duration.minutes).map(function (minuteDigit, i) {
                    return <FlipDigits debugIdentifier={"minute" + i.toString()} maxDigit={i===0?5:9} running={self.props.started}  digit={minuteDigit} key={i} />
                })
            }

            <DigitsDivider dividerTitle={this.props.secondsTitle} />
            {
                this.getDoubleDigitsArray(this.props.duration.seconds).map(function (secondDigit, i) {
                    return <FlipDigits debugIdentifier={"second" + i.toString()} maxDigit={i === 0 ? 5 : 9} running={self.props.started}  digit={secondDigit} key={i} />
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
    debugIdentifier:string
}

export class FlipDigits extends React.Component<FlipDigitsProps, undefined>{
    public static defaultProps: Partial<FlipDigitsProps> = {
        activeClass: "flip-clock-active",
        beforeClass: "flip-clock-before",
        flipClass: "flip",
        playClass:"play"
    }
    listElement: HTMLUListElement;
    initialDigit: Digit
    initialChanged:boolean=false
    lastDigit: Digit
    previousDigit:Digit
    getListClassName(props: FlipDigitsProps) {
        return this.props.flipClass + this.props.running && this.initialChanged ? " " + this.props.playClass : "";
    }
    getLiClass(digit: Digit,initial:boolean) {
        
        var className = "";
        if (digit === this.previousDigit) {
            className = this.props.beforeClass;
        } else if (digit === this.lastDigit) {
            className += " " + this.props.activeClass;
        }
        if (this.initialChanged) {
            
        }
        return className;
    }
    setDigits(props: FlipDigitsProps) {
        if (this.initialDigit === null) {
            this.setInitial(0);
        } else {
            if (!this.initialChanged && (props.digit !== this.initialDigit)) {
                this.initialChanged = true;
            }

            this.lastDigit = props.digit;
            this.previousDigit = this.getPreviousDigit(props.digit);
        }
    }
    setInitial(initialDigit: Digit) {
        this.initialDigit = initialDigit;
        this.lastDigit = initialDigit;
        this.previousDigit = this.getPreviousDigit(initialDigit);
    }
    render() {
        this.setInitial(this.props.digit);
        var digits: Digit[] = [];
        for (var i = 0; i < this.props.maxDigit+1; i++) {
            digits.push(i as Digit);
        }
        var self = this;
        return <ul ref={(ul) => { this.listElement = ul }} className={this.getListClassName(this.props)}>
            {
               
                digits.map(function (digit: Digit) {
                return <li  key={digit}>
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
            this.initialChanged = false;
            this.initialDigit = null;
            this.lastDigit = null;
            this.previousDigit = null;
        } else {
            this.setDigits(nextProps);
        }
        var lis = this.listElement.children;
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            li.className = this.getLiClass(i as Digit, false);
        }
        
        this.listElement.className = this.getListClassName(nextProps);
    }
    shouldComponentUpdate() {
        return false;
    }
    getPreviousDigit(digit: Digit): Digit {

        var prevDigit = digit === 0 ? this.props.maxDigit : digit - 1;
        return prevDigit as Digit;
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