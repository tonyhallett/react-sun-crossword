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

    totalMs:number
}
export class Duration implements IDuration {
    seconds: number
    minutes: number
    hours: number
    milliseconds:number
    days: number
    //years: number

    totalMs: number
    constructor(ms: number) {
        this.totalMs = ms;  
        this.milliseconds = (ms % 1000);
        this.seconds = Math.floor((ms / 1000)) % 60;
        this.minutes=Math.floor((ms / (1000 * 60))) % 60
        this.hours = Math.floor((ms / (1000 * 60 * 60))) % 24;
        this.days = Math.floor((ms / (1000 * 60 * 60 * 24)));
    }
    static increment(duration: IDuration, ms: number): Duration {
        var totalMs = duration.totalMs + ms;
        return new Duration(totalMs);
    }
}
export interface StopwatchProps {
    //ms
    startDuration?: number,
    autoStart?:boolean,
    reportTickInterval?: ReportTickInterval
}
export interface StopwatchState {
    duration: IDuration,
    started:boolean
}

export enum ReportTickInterval { milliseconds,seconds,minutes,hours}
export class StopwatchController extends React.Component<StopwatchProps, StopwatchState> {
    public static defaultProps: Partial<StopwatchProps> = {
        autoStart: true,
        startDuration: 0,
        reportTickInterval: ReportTickInterval.seconds
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
        this.stopTimer();
        this.currentDuration = new Duration(nextProps.startDuration);
        this.startDuration = this.currentDuration;
        this.setTimerInterval();
        if (this.props.autoStart) {
            this.startTimer();
        }

    }
    getDuration() {
        return this.currentDuration;
    }
    setTimerInterval() {
        switch (this.props.reportTickInterval) {
            case ReportTickInterval.milliseconds:
                this.timerInterval = 1;
                break;
            case ReportTickInterval.seconds:
                this.timerInterval = 1000;
                break;
            case ReportTickInterval.minutes:
                this.timerInterval = 60000;
                break;
            case ReportTickInterval.hours:
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
        window.clearInterval(this.cancelIntervalId);
    }
    stop = () => {
        if (this.state.started) {
            this.stopTimer();
            this.startDuration = this.currentDuration;
            this.setState({ started: false })
        }
    }
    //LP
    clear = () => {

    }
    render() {
        return <div>
            {React.cloneElement(this.props.children as React.ReactElement<any>, { started: this.state.started, duration: this.state.duration, stop: this.stop, clear: this.clear, start: this.start })}
        </div>
    }
}

//will want to child to optional 
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