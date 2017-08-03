import * as React from "react";
import { StopwatchController, FlipCounter, FlipClock, HourSettings, HourPart, MinuteSettings, SecondSettings, MinutePart, SecondPart, FlipClock24Countdown, FlipClock24, FlipClockSeconds, FlipClockSecondsCountdown, FlipClockMinutesSeconds, FlipClockMinutesSecondsCountdown, FlipClockMinutes, FlipClockMinutesCountdown, FlipClock12 } from "./stopwatchController";

interface DemoFlipClocksState {
    countdownDuration: number,
    countUpDuration: number
    someOther:number
}
export class DemoFlipClocks extends React.Component<undefined, DemoFlipClocksState> {
    autoStartCountdownStopwatch: StopwatchController
    countdownStopwatch: StopwatchController
    autoStartCountUpStopwatch: StopwatchController
    countUpStopwatch: StopwatchController

    autoStartCountdownStopwatchDuration: HTMLDivElement
    countdownStopwatchDuration: HTMLDivElement
    autoStartCountUpStopwatchDuration: HTMLDivElement
    countUpStopwatchDuration: HTMLDivElement

    constructor(props) {
        super(props);
        this.state = {
            countdownDuration: 10000,
            countUpDuration: 5000,
            someOther:0
        }
    }
    checkDurations() {
        var autoStartCountdownStopwatchD = this.autoStartCountdownStopwatch.getDuration();
        this.autoStartCountdownStopwatchDuration.innerHTML = autoStartCountdownStopwatchD.totalSeconds.toString() + " " + autoStartCountdownStopwatchD.milliseconds.toString();

        //var countdownStopwatchD = this.countdownStopwatch.getDuration();
        //this.countdownStopwatchDuration.innerHTML = countdownStopwatchD.totalSeconds.toString() + " " + countdownStopwatchD.milliseconds.toString();

//        var autoStartCountUpStopwatchD = this.autoStartCountUpStopwatch.getDuration();
  //      this.autoStartCountUpStopwatchDuration.innerHTML = autoStartCountUpStopwatchD.totalSeconds.toString() + " " + autoStartCountUpStopwatchD.milliseconds.toString();

    //    var countUpStopwatchD = this.countUpStopwatch.getDuration();
      //  this.countUpStopwatchDuration.innerHTML = countUpStopwatchD.totalSeconds.toString() + " " + countUpStopwatchD.milliseconds.toString();
    }
    render() {
        /*

            <StopwatchController countdown={true} autoStart={true} ref={(sw) => { this.autoStartCountdownStopwatch = sw }} startDuration={this.state.countdownDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController>
            <div ref={(d) => this.autoStartCountdownStopwatchDuration = d}></div>


            <button onClick={() => { this.checkDurations() }}>Check durations</button>


            <button onClick={() => { this.setState({ someOther: this.state.someOther + 1 }) }}>Affect state</button>

            <button onClick={() => { this.autoStartCountdownStopwatch.start() }}>Start</button>
            <button onClick={() => { this.autoStartCountdownStopwatch.stop() }}>Stop</button>
            <div ref={(d) => this.autoStartCountdownStopwatchDuration = d}></div>

            <StopwatchController2 countdown={true} autoStart={false} ref={(sw) => { this.countdownStopwatch = sw }} startDuration={this.state.countdownDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController2>
            <button onClick={() => { this.countdownStopwatch.start() }}>Start</button>
            <button onClick={() => { this.countdownStopwatch.stop() }}>Stop</button>
            <div ref={(d) => this.countdownStopwatchDuration = d}></div>

            <StopwatchController2 countdown={false} autoStart={false} ref={(sw) => { this.countUpStopwatch = sw }} startDuration={this.state.countUpDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController2>
            <button onClick={() => { this.countUpStopwatch.start() }}>Start</button>
            <button onClick={() => { this.countUpStopwatch.stop() }}>Stop</button>
            <div ref={(d) => this.countUpStopwatchDuration = d}></div>

            <StopwatchController2 shouldUpdateSameDuration={true} countdown={false} autoStart={true} ref={(sw) => { this.autoStartCountUpStopwatch = sw }} startDuration={this.state.countUpDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController2>
            <button onClick={() => { this.autoStartCountUpStopwatch.start() }}>Start</button>
            <button onClick={() => { this.autoStartCountUpStopwatch.stop() }}>Stop</button>
            <div ref={(d) => this.autoStartCountUpStopwatchDuration = d}></div>

            <button onClick={() => this.setState({
                countdownDuration: 211000,
                countUpDuration: 91000
            })}>Switch durations</button>
        */
        var hourSettings: HourSettings = {
            minDigits: 2,
            hourPart: HourPart.part24
        }
        var minuteSettings: MinuteSettings = {
            minDigits: 2,
            minutePart: MinutePart.partHour
        }
        var secondSettings: SecondSettings = {
            minDigits: 2,
            secondPart: SecondPart.partMinute
        }
        //<FlipClock hourSettings={hourSettings} minuteSettings={minuteSettings} secondSettings={secondSettings} countdown={true} startDuration={76000} />

        var second = 1000;
        var minute = 60000;
        var hour = 3600000;
        var day = 86400000;
        var year = 31536000000;
        //then 12 hour soley as an am pm clock - with AM /PM to also flip
        //the css
        //labels
        //additional - countdown warning, ( although callback so can add class whenever), pausing to flash dividers etc

        var minutesStartDuration = 61 * second;
        var minutesCountdownStartDuration = (10 * minute) + (10 * second);

        return <div>
            <FlipClock24Countdown startDuration={(23 * hour) + (minute) + (2 * second)} />
            <FlipClock24 startDuration={(11 * hour) + (59 * minute) + (50 * second)} />

            <FlipClockSeconds startDuration={90 * second} minDigits={3} />
            <FlipClockSeconds startDuration={90 * second} maxDigits={2} />

            <FlipClockSecondsCountdown startDuration={65 * second} />
            <FlipClockSecondsCountdown startDuration={65 * second} minDigits={3} />

            <FlipClockMinutesSeconds minMinuteDigits={2} startDuration={minutesStartDuration} />
            <FlipClockMinutesSecondsCountdown startDuration={minutesCountdownStartDuration} />

            <FlipClockMinutes minDigits={2} startDuration={minutesStartDuration} />
            <FlipClockMinutesCountdown startDuration={minutesCountdownStartDuration} />
            
            <FlipClock12 startDuration={(11*hour)+(59*minute)+ (50*second)} />
        </div>
    }

}
