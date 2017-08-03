import * as React from "react";

//can go on duration .....
//#region calculations
var second = 1000;
var minute = 60000;
var hour = 3600000;
var day = 86400000;
var year = 31536000000;

function calculateDays(dayPart: DayPart,ms:number) {
    switch (dayPart) {
        case DayPart.total:
            return Math.floor((ms / (1000 * 60 * 60 * 24)));
        case DayPart.partYear:
            return Math.floor((ms / (1000 * 60 * 60 * 24))) % 365;//?
    }
}
function calculateHours(hourPart: HourPart, ms: number) {
    switch (hourPart) {
        case HourPart.total:
            return Math.floor(ms / (1000 * 60 * 60));
        case HourPart.part24:
            return Math.floor((ms / (1000 * 60 * 60))) % 24;
        case HourPart.part12:
            var part12 = Math.floor((ms / (1000 * 60 * 60))) % 12;
            part12 = part12 === 0 ? 12 : part12;
            return part12;
    }
}
function calculateMinutes(minutePart: MinutePart, ms: number) {
    switch (minutePart) {
        case MinutePart.total:
            return Math.floor(ms / (1000 * 60));
        case MinutePart.partYear:

            break;
        case MinutePart.partHour:
            return Math.floor((ms / (1000 * 60)) % 60);
    }
}
function calculateSeconds(secondPart: SecondPart, ms: number) {
    var seconds: number;
    switch (secondPart) {
        case SecondPart.total:
            seconds = Math.floor(ms / 1000);
            break;
        case SecondPart.partYear:

            break;
        case SecondPart.partHour:

            break;
        case SecondPart.partMinute:
            seconds = Math.floor((ms / 1000) % 60);
            break;
    }
    return seconds;
}
//#endregion

//#region FlipClock

//#region Stopwatch
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
    totalDays: number




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

enum TickState {
    running, paused, stopped
}
export interface StopwatchProps {
    //ms
    startDuration?: number,
    autoStart?: boolean,
    countdown?: boolean,
    shouldUpdateSameDuration?: boolean
}
export interface StopwatchState {
    duration: IDuration,
    tickState: TickState
}
export class StopwatchController extends React.Component<StopwatchProps, StopwatchState> {
    public static defaultProps: Partial<StopwatchProps> = {
        autoStart: true,
        startDuration: 0,
        shouldUpdateSameDuration: false
    }
    private currentDuration: Duration
    private startDuration: Duration
    private actualDuration = 0;
    private startTime: any
    private actualStartTime: any;
    private startDelay = 0

    private cancelIntervalId: number
    private delayedTimer: number = null;

    private hasStopped = false
    private neverStarted = true;

    private countdownCompleted = false;

    private shouldUpdate = true;

    constructor(props) {
        super(props);
        this.setStartDuration(this.props.startDuration);
        this.state = { tickState: TickState.stopped, duration: this.currentDuration }
    }


    shouldComponentUpdate(nextProps: StopwatchProps, nextState: StopwatchState) {
        var shouldUpdate = this.shouldUpdate;
        this.shouldUpdate = true;
        return shouldUpdate;
    }
    componentWillMount() {
        if (this.props.autoStart) {
            this.start();
        }
    }
    componentWillReceiveProps(nextProps: StopwatchProps) {
        var self = this;
        var shouldUpdate = true;
        if (nextProps.startDuration === this.props.startDuration && !this.props.shouldUpdateSameDuration) {
            shouldUpdate = false;
        }
        this.shouldUpdate = shouldUpdate;
        if (shouldUpdate) {

            this.stop();
            this.hasStopped = false;
            this.neverStarted = true;
            this.countdownCompleted = false;
            this.actualDuration = 0;
            this.startDelay = 0;

            this.setStartDuration(nextProps.startDuration);

            window.setTimeout(function() {
                self.setState({ duration: self.currentDuration });
                if (self.props.autoStart) {
                    //necessary for state change !
                    window.setTimeout(function() {
                        self.start();
                    }, 1);
                }
            }, 1);
        }



    }
    componentWillUnmount() {
        this.stopTimers();
    }

    setStartDuration(durationMs: number) {
        var duration = new Duration(this.props.startDuration);
        this.currentDuration = duration;
        this.startDuration = duration;
    }
    getDuration() {
        var actualDuration: number;

        if (this.state.tickState === TickState.running) {
            var now = new Date() as any;
            actualDuration = this.actualDuration + (now - this.actualStartTime);
        } else {
            actualDuration = this.actualDuration;

        }

        if (this.props.countdown) {
            var duration = Duration.decrement(this.startDuration, actualDuration);
            if (duration.totalMilliseconds < 0) {
                duration = this.currentDuration;
            }
            return duration;
        } else {
            return Duration.increment(this.startDuration, actualDuration);
        }


        //var difference = 1000 - this.getDelay(new Date());
        //if (this.state.tickState === TickState.running) {

        //} else {
        //    if (this.startDelay === 0) {
        //        difference = 0;
        //    } else {
        //        difference = 1000 - this.startDelay;
        //    }
        //}
        //if (this.neverStarted) {
        //    return this.currentDuration;
        //} else {
        //    if (this.props.countdown) {
        //        if (this.countdownCompleted) {
        //            return this.currentDuration;
        //        }
        //        return Duration.increment(this.currentDuration, 1000+difference);
        //    } else {
        //        return Duration.decrement(this.currentDuration, 1000-difference);
        //    }
        //}

    }

    updateSecond() {
        this.updateDuration(1000);
    }
    changeDuration(ms: number) {
        var newDuration: Duration;
        if (this.props.countdown) {
            newDuration = Duration.decrement(this.currentDuration, ms);
            if (newDuration.totalMilliseconds < 0) {
                this.completeCountdown();
                newDuration = this.currentDuration;
            }
        } else {
            newDuration = Duration.increment(this.currentDuration, ms);
        }
        return newDuration;
    }
    updateDuration(ms: number) {
        this.currentDuration = this.changeDuration(ms);
        this.setState({ duration: this.currentDuration })
    }

    start = () => {
        this.actualStartTime = new Date();
        var self = this;
        if (this.state.tickState === TickState.stopped || this.state.tickState === TickState.paused) {
            this.neverStarted = false;

            this.setState({ tickState: TickState.running, duration: self.currentDuration });
            if (!this.hasStopped) {
                window.setTimeout(function() {
                    self.currentDuration = self.changeDuration(1000);
                    self.setState({ tickState: TickState.running, duration: self.currentDuration }, function() {
                        self.startTimer();
                    });
                }, 1);

            } else {
                this.setState({ tickState: TickState.running, duration: self.currentDuration });
                self.startTimer();
            }
        }
    }
    startTimer() {
        if (this.startDelay === 0) {
            this.startSecondTimer();
        } else {
            this.startDelayedTimer();
        }
    }
    startSecondTimer() {
        var self = this;
        this.startTime = new Date();
        this.startDelay = 0;
        this.cancelIntervalId = window.setInterval(function() {
            self.updateSecond();
        }, 1000);
    }
    startDelayedTimer() {
        var self = this;
        this.delayedTimer = window.setTimeout(function() {
            self.startSecondTimer.bind(self)();
            self.updateSecond.bind(self)();
        }, this.startDelay)

    }
    stopDelayedTimer() {
        if (this.delayedTimer !== null) {
            window.clearTimeout(this.delayedTimer);
            this.delayedTimer = null;
        }
    }
    stopTimers() {
        this.stopDelayedTimer();

        window.clearInterval(this.cancelIntervalId);
    }


    getDelay(nowDate: Date) {
        var delay: number;
        var now = nowDate as any;
        if (this.startDelay === 0) {
            var difference = (now - this.startTime) % 1000;
            delay = 1000 - difference;
        } else {
            var difference = (now - this.actualStartTime) % 1000;
            delay = 1000 - ((1000 - this.startDelay) + difference);
        }
        return delay;
    }
    
    stop = () => {
        if (this.state.tickState === TickState.running) {
            this.pauseOrStop(false)
        }
    }
    pause = () => {
        this.pauseOrStop(true);
    }
    pauseOrStop(paused: boolean) {
        this.stopTimers();
        var now = new Date() as any;
        this.actualDuration = this.actualDuration + (now - this.actualStartTime);

        this.hasStopped = true;
        this.startDelay = this.getDelay(now);


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

        this.setState(newState as StopwatchState)
    }

    completeCountdown() {
        this.stop();
        this.countdownCompleted = true;
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
//#endregion



interface FlipClockPrivateStopwatchProps {
    duration?: IDuration,
    tickState?: TickState

}
//may be better to instead have an array so could have multiple of same....
interface FlipClockPrivatePublicProps {
    yearSettings?: YearSettings
    daySettings?: DaySettings,
    hourSettings?: HourSettings,
    minuteSettings?: MinuteSettings,
    secondSettings?: SecondSettings
}
interface FlipClockPrivateProps extends FlipClockPrivatePublicProps, FlipClockPrivateStopwatchProps {

}

interface PartDetail {
    part: number,
    calculateFunction: (part: number, ms: number)=>number
    maxDigits:number
    minDigits:number
}
//this will also deal with the css

//#region display settings
//need label as well
export interface CommonTimeSettings {
    minDigits?: number,
    maxDigits?: number
}
export interface YearSettings extends CommonTimeSettings {

}

export enum DayPart { total, partYear }
export interface DaySettings extends CommonTimeSettings {
    dayPart: DayPart
}
export enum HourPart { total, part24, part12 }
export interface HourSettings extends CommonTimeSettings {
    hourPart: HourPart
}
export enum MinutePart { total, partYear, partHour }
export interface MinuteSettings extends CommonTimeSettings {
    minutePart: MinutePart
}
export enum SecondPart { total, partYear, partHour, partMinute }
export interface SecondSettings extends CommonTimeSettings {
    secondPart: SecondPart
}
//#endregion
export class FlipClockPrivate extends React.Component<FlipClockPrivateProps, undefined>{
    getDigits(num: number, maxDigits: number, minDigits: number) {
        var digitString = num.toString();
        var numDigits = digitString.length;
        if (maxDigits > 0 && numDigits > maxDigits) {
            digitString = digitString.substring(numDigits - maxDigits);
        }
        numDigits = digitString.length;//not necessary ?


        if (minDigits > 0 && numDigits < minDigits) {
            var numExtraDigits = minDigits - numDigits;
            var prefix = "";
            for (var i = 0; i < numExtraDigits; i++) {
                prefix += "0";
            }
            digitString = prefix + digitString;
        }

        var digitsArray = digitString.split("").map(function (d) {
            return parseInt(d) as Digit;
        })
        return digitsArray;
    }
    render() {
        //days and years to return to 
        var self = this;
        var partDetails: PartDetail[] = [];
        var hourSettings = this.props.hourSettings;
        if (hourSettings) {
            partDetails.push({ calculateFunction: calculateHours, minDigits: hourSettings.minDigits, maxDigits: hourSettings.maxDigits, part: hourSettings.hourPart })
        }
        var minuteSettings = this.props.minuteSettings;
        if (minuteSettings) {
            partDetails.push({ calculateFunction: calculateMinutes, minDigits: minuteSettings.minDigits, maxDigits: minuteSettings.maxDigits, part: minuteSettings.minutePart })
        }
        var secondSettings = this.props.secondSettings;
        if (secondSettings) {
            partDetails.push({ calculateFunction: calculateSeconds, minDigits: secondSettings.minDigits, maxDigits: secondSettings.maxDigits, part: secondSettings.secondPart })
        }

        var elements: JSX.Element[] = [];
        var numParts = partDetails.length;
        var counter = 0;
        for (var i = 0; i < numParts; i++) {
            if (i !== 0) {
                elements.push(<DigitsDivider key={counter} dividerTitle="" />);
                counter++;
            }
            var pd = partDetails[i];
            var num = pd.calculateFunction(pd.part, self.props.duration.totalMilliseconds);
            var digits = self.getDigits(num, pd.maxDigits, pd.minDigits);
            elements = elements.concat(digits.map(function (digit) {
                var flipDigit = <FlipDigit pauseStoppedAnimation={true} tickState={self.props.tickState} digit={digit} key={counter} />
                counter++;
                return flipDigit;
            }))
        }
        return <span className="flip-clock-wrapper">
            {elements}
            {this.props.children}
            </span>
    }
}

export interface FlipClockProps extends StopwatchProps, FlipClockPrivatePublicProps {
    
}
export class FlipClock extends React.Component<FlipClockProps, undefined>{
    render() {
        return <StopwatchController countdown={this.props.countdown} autoStart={this.props.autoStart} shouldUpdateSameDuration={this.props.shouldUpdateSameDuration} startDuration={this.props.startDuration}>
            <FlipClockPrivate daySettings={this.props.daySettings} hourSettings={this.props.hourSettings} minuteSettings={this.props.minuteSettings} secondSettings={this.props.secondSettings} />
        </StopwatchController>
    }
}


//#region FlipDigit
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface FlipDigitProps {
    digit: Digit,

    tickState: TickState,

    playClass?: string,
    flipClass?: string,
    beforeClass?: string,
    activeClass?: string,
    
    pauseStoppedAnimation?: boolean
    pausePausedAnimation?: boolean
}
export class FlipDigit extends React.Component<FlipDigitProps, undefined>{
    public static defaultProps: Partial<FlipDigitProps> = {
        activeClass: "flip-clock-active",
        beforeClass: "flip-clock-before",
        flipClass: "flip",
        playClass: "play",

        tickState: TickState.stopped,
        pausePausedAnimation: false,
        pauseStoppedAnimation: false
    }
    runningState: TickState = TickState.stopped;
    listElement: HTMLUListElement;
    previousDigit: Digit = null
    lastDigit: Digit = null

    getRunningClassName(running: boolean) {
        return this.props.flipClass + (running ? (" " + this.props.playClass) : "");
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

    firstRender = true;
    render() {

        var self = this;
        var newTickState = this.props.tickState;
        var isRunning = newTickState === TickState.running && !this.firstRender;
        var digits: Digit[] = [];
        if (this.previousDigit !== null) {
            digits.push(this.previousDigit);
        }
        this.lastDigit = this.props.digit;
        digits.push(this.lastDigit);
        this.runningState = newTickState;

        this.firstRender = false;
        return <ul ref={(ul) => { this.listElement = ul }} className={this.getRunningClassName(isRunning)}>
            {

                digits.map(function(digit: Digit, i: number) {
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
    nextProps: FlipDigitProps
    componentWillReceiveProps(nextProps: FlipDigitProps) {
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
    //#endregion
}
//#endregion

//#region DigitsDivider
export interface DigitsDividerProps {
    dividerTitle: string,
    dividerClass?: string
    labelClass?: string,
    dotClass?: string

}
export class DigitsDivider extends React.Component<DigitsDividerProps, undefined>{
    public static defaultProps: Partial<DigitsDividerProps> = {
        labelClass: 'flip-clock-label',
        dotClass: 'flip-clock-dot',
        dividerClass: 'flip-clock-divider'
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
//#endregion

//#endregion

//#region helper components
//#region common settings
var flipClock24HourSettings: HourSettings = {
    minDigits: 2,
    hourPart: HourPart.part24
}
var flipClock12HourSettings: HourSettings = {
    minDigits: 2,
    hourPart: HourPart.part12
}
var flipClockClockMinuteSettings: MinuteSettings = {
    minDigits: 2,
    minutePart: MinutePart.partHour
}
var flipClockClockSecondSettings: SecondSettings = {
    minDigits: 2,
    secondPart: SecondPart.partMinute
}
//#endregion

//will look at how have surfaced props for FlipClock
export interface FlipClock12Props {
    autoStart?: boolean
    shouldUpdateSameDuration?: boolean
    startDuration?:number

} 

export class FlipClock12 extends React.Component<FlipClock12Props, undefined>{
    render() {
        return <StopwatchController countdown={false} autoStart={this.props.autoStart} shouldUpdateSameDuration={this.props.shouldUpdateSameDuration} startDuration={this.props.startDuration}>
            <FlipClock12Private/>
        </StopwatchController>
    }

}
export interface FlipClock12PrivateProps {
    duration?: IDuration,
    tickState?: TickState
}
//pausing animations needs to be the same - how did the FlipClockPrivate deal with this 
export class FlipClock12Private extends React.Component<FlipClock12PrivateProps, undefined>{
    getAmPm() {
        
        var ampm = calculateHours(HourPart.part24, this.props.duration.totalMilliseconds) < 12 ? "am" : "pm";
        return ampm as any;
    }
    render() {
        return <FlipClockPrivate duration={this.props.duration} hourSettings={flipClock12HourSettings} minuteSettings={flipClockClockMinuteSettings} secondSettings={flipClockClockSecondSettings} tickState={this.props.tickState}>
                <FlipDigit tickState={this.props.tickState} digit={this.getAmPm()} />
            </FlipClockPrivate>
    }

}

export interface FlipClock24Props {
    autoStart?: boolean,
    startDuration?: number
    shouldUpdateSameDuration?: boolean
}
export class FlipClock24 extends React.Component<FlipClock24Props, undefined>{
    public static defaultProps: Partial<FlipClock24Props> = {
        autoStart: true,
        shouldUpdateSameDuration: false,
        startDuration:0
    }
    render() {
        return <FlipClock shouldUpdateSameDuration={this.props.shouldUpdateSameDuration} startDuration={this.props.startDuration} autoStart={this.props.autoStart} countdown={false} hourSettings={flipClock24HourSettings} minuteSettings={flipClockClockMinuteSettings} secondSettings={flipClockClockSecondSettings} />
    }
}
export interface FlipClock24CountdownProps {
    autoStart?: boolean,
    startDuration: number
    shouldUpdateSameDuration?: boolean
}
export class FlipClock24Countdown extends React.Component<FlipClock24CountdownProps, undefined>{
    public static defaultProps: Partial<FlipClock24CountdownProps> = {
        autoStart: true,
        shouldUpdateSameDuration: false,
    }
    render() {
        return <FlipClock shouldUpdateSameDuration={this.props.shouldUpdateSameDuration} startDuration={this.props.startDuration} autoStart={this.props.autoStart} countdown={true} hourSettings={flipClock12HourSettings} minuteSettings={flipClockClockMinuteSettings} secondSettings={flipClockClockSecondSettings} />
    }
}


//#region seconds
export interface FlipClockSecondsProps {
    shouldUpdateSameDuration?: boolean
    startDuration?: number
    autoStart?: boolean
    maxDigits?: number
    minDigits?:number
}
export class FlipClockSeconds extends React.Component<FlipClockSecondsProps, undefined>{
    public static defaultProps: Partial<FlipClockSecondsProps> = {
        autoStart: true,
        shouldUpdateSameDuration: false,
        startDuration: 0,
        minDigits: 0,
        maxDigits:0
    }
    render() {
        return <FlipClock shouldUpdateSameDuration={this.props.shouldUpdateSameDuration} startDuration={this.props.startDuration} autoStart={this.props.autoStart} countdown={false} secondSettings={{ secondPart: SecondPart.total, maxDigits: this.props.maxDigits, minDigits: this.props.minDigits }} />
    }
}
export interface FlipClockSecondsCountdownProps {
    shouldUpdateSameDuration?: boolean
    startDuration: number
    autoStart?: boolean
    minDigits?: number
}
export class FlipClockSecondsCountdown extends React.Component<FlipClockSecondsCountdownProps, undefined>{
    public static defaultProps: Partial<FlipClockSecondsCountdownProps> = {
        autoStart: true,
        shouldUpdateSameDuration: false
    }
    render() {
        var minDigits = this.props.minDigits === undefined ? calculateSeconds(SecondPart.total, this.props.startDuration).toString().length : this.props.minDigits;
        return <FlipClock shouldUpdateSameDuration={this.props.shouldUpdateSameDuration} startDuration={this.props.startDuration} autoStart={this.props.autoStart} countdown={true} secondSettings={{ secondPart: SecondPart.total, maxDigits: 0, minDigits: minDigits }} />
    }
}
//#endregion
//#region minutes
export interface FlipClockMinutesProps {
    shouldUpdateSameDuration?: boolean
    startDuration?: number
    autoStart?: boolean
    maxDigits?: number
    minDigits?: number
}
export class FlipClockMinutes extends React.Component<FlipClockMinutesProps, undefined>{
    public static defaultProps: Partial<FlipClockSecondsProps> = {
        autoStart: true,
        shouldUpdateSameDuration: false,
        startDuration: 0,
        minDigits: 0,
        maxDigits: 0
    }
    render() {
        return <FlipClock shouldUpdateSameDuration={this.props.shouldUpdateSameDuration} startDuration={this.props.startDuration} autoStart={this.props.autoStart} countdown={false} minuteSettings={{ minutePart: MinutePart.total, maxDigits: this.props.maxDigits, minDigits: this.props.minDigits }} />
    }
}

export interface FlipClockMinutesCountdownProps {
    shouldUpdateSameDuration?: boolean
    startDuration: number
    autoStart?: boolean
    minDigits?: number
}
export class FlipClockMinutesCountdown extends React.Component<FlipClockMinutesCountdownProps, undefined>{
    public static defaultProps: Partial<FlipClockMinutesCountdownProps> = {
        autoStart: true,
        shouldUpdateSameDuration: false
    }
    render() {
        var minDigits = this.props.minDigits === undefined ? calculateMinutes(MinutePart.total, this.props.startDuration).toString().length : this.props.minDigits;
        return <FlipClock shouldUpdateSameDuration={this.props.shouldUpdateSameDuration} startDuration={this.props.startDuration} autoStart={this.props.autoStart} countdown={true} minuteSettings={{ minutePart: MinutePart.total, maxDigits: 0, minDigits: minDigits }} />
    }
}
//#endregion
//#region minutes seconds
export interface FlipClockMinutesSecondsProps {
    shouldUpdateSameDuration?: boolean
    startDuration?: number
    autoStart?: boolean
    maxMinutesDigits?: number
    minMinuteDigits?: number
}
export class FlipClockMinutesSeconds extends React.Component<FlipClockMinutesSecondsProps, undefined>{
    public static defaultProps: Partial<FlipClockMinutesSecondsProps> = {
        autoStart: true,
        shouldUpdateSameDuration: false,
        startDuration: 0,
        minMinuteDigits: 0,
        maxMinutesDigits: 0
    }
    render() {
        return <FlipClock shouldUpdateSameDuration={this.props.shouldUpdateSameDuration} startDuration={this.props.startDuration} autoStart={this.props.autoStart} countdown={false} minuteSettings={{ minDigits: this.props.minMinuteDigits, maxDigits: this.props.maxMinutesDigits, minutePart: MinutePart.total }} secondSettings={flipClockClockSecondSettings} />
    }
}
export interface FlipClockMinutesSecondsCountdownProps {
    shouldUpdateSameDuration?: boolean
    startDuration: number
    autoStart?: boolean
    maxMinutesDigits?: number
    minMinuteDigits?: number
}
export class FlipClockMinutesSecondsCountdown extends React.Component<FlipClockMinutesSecondsCountdownProps, undefined>{
    public static defaultProps: Partial<FlipClockMinutesSecondsCountdownProps> = {
        autoStart: true,
        shouldUpdateSameDuration: false,
        startDuration: 0,
        maxMinutesDigits: 0
    }
    render() {
        var minDigits = this.props.minMinuteDigits === undefined ? calculateMinutes(MinutePart.total, this.props.startDuration).toString().length : this.props.minMinuteDigits;
        return <FlipClock countdown={true} shouldUpdateSameDuration={this.props.shouldUpdateSameDuration} startDuration={this.props.startDuration} autoStart={this.props.autoStart}  minuteSettings={{ minDigits: minDigits, maxDigits: this.props.maxMinutesDigits, minutePart: MinutePart.total }} secondSettings={flipClockClockSecondSettings} />
    }
}
//#endregion
//#endregion

//#region FlipCounter old - can probably delete now
export interface FlipCounterProps {
    duration?: IDuration,
    hoursTitle?: string,
    minutesTitle?: string,
    secondsTitle?: string,
    tickState?:TickState

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
                    return <FlipDigit pauseStoppedAnimation={true} tickState={self.props.tickState} digit={hourDigit} key={i} />
                })
            }
            
            <DigitsDivider dividerTitle={this.props.minutesTitle} />
            {
                this.getDoubleDigitsArray(this.props.duration.minutes).map(function (minuteDigit, i) {
                    return <FlipDigit pauseStoppedAnimation={true} tickState={self.props.tickState}   digit={minuteDigit} key={i} />
                })
            }

            <DigitsDivider dividerTitle={this.props.secondsTitle} />
            {
                this.getDoubleDigitsArray(this.props.duration.seconds).map(function (secondDigit, i) {
                    return <FlipDigit pauseStoppedAnimation={true} tickState={self.props.tickState}  digit={secondDigit} key={i} />
                })
            }
            
        </div>
    }
}
//#endregion
