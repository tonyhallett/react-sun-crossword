import * as React from "react";
import { StopwatchController, FlipCounter, FlipClock, HourSettings, HourPart, MinuteSettings, SecondSettings, MinutePart, SecondPart, FlipClock24Countdown, FlipClock24, FlipClockSeconds, FlipClockSecondsCountdown, FlipClockMinutesSeconds, FlipClockMinutesSecondsCountdown, FlipClockMinutes, FlipClockMinutesCountdown, FlipClock12, FlipClock24CountdownProps, flipClockWrapper, ClockController, FlipClockWrapper } from "./stopwatchController";

interface DemoFlipClocksState {
    countdownDuration: number,
    countUpDuration: number
    someOther:number
}
export class DemoFlipClocks extends React.Component<undefined, DemoFlipClocksState> {
    private flipClock24Countdown: ClockController;
    private flipClock24: ClockController;
    private flipClockSeconds1: ClockController
    private flipClockSeconds2: ClockController
    private flipClockSecondsCountdown1: ClockController
    private flipClockSecondsCountdown2: ClockController
    private flipClockMinutesSeconds: ClockController
    private flipClockMinutes: ClockController
    private flipClockMinutesSecondsCountdown: ClockController
    private flipClockMinutesCountdown: ClockController
    private flipClock12: ClockController
    constructor(props) {
        super(props);
        this.state = {
            countdownDuration: 10000,
            countUpDuration: 5000,
            someOther:0
        }
    }
    checkDurations() {

   }
    start=()=> {
        this.flipClock24Countdown.start();
        this.flipClock24.start();
        this.flipClockSeconds1.start();
        this.flipClockSeconds2.start();
        this.flipClockSecondsCountdown1.start();
        this.flipClockSecondsCountdown2.start();
        this.flipClockMinutesSeconds.start();
        this.flipClockMinutes.start();
        this.flipClockMinutesSecondsCountdown.start();
        this.flipClockMinutesCountdown.start();
        this.flipClock12.start();
    }
    stop=()=> {
        this.flipClock24Countdown.stop();
        this.flipClock24.stop();
        this.flipClockSeconds1.stop();
        this.flipClockSeconds2.stop();
        this.flipClockSecondsCountdown1.stop();
        this.flipClockSecondsCountdown2.stop();
        this.flipClockMinutesSeconds.stop();
        this.flipClockMinutes.stop();
        this.flipClockMinutesSecondsCountdown.stop();
        this.flipClockMinutesCountdown.stop();
        this.flipClock12.stop();
    }
    render() {
        /*
            <button onClick={() => this.setState({
                countdownDuration: 211000,
                countUpDuration: 91000
            })}>Switch durations</button>
        */

        var second = 1000;
        var minute = 60000;
        var hour = 3600000;
        var day = 86400000;
        var year = 31536000000;
        

        var minutesStartDuration = 55 * second;
        var minutesCountdownStartDuration = (10 * minute) + (10 * second);

        return <div>
            <button onClick={this.stop}>Stop</button>
            <button onClick={this.start}>Start</button>
            <FlipClock24Countdown pauseStoppedAnimation={true}  ref={(fc) => { this.flipClock24Countdown = fc }} startDuration={(23 * hour) + (minute) + (2 * second)} />
            <FlipClock24 ref={(fc) => { this.flipClock24 = fc }}  startDuration={(23 * hour) + (59 * minute) + (50 * second)} />

            <FlipClockSeconds ref={(fc) => { this.flipClockSeconds1 = fc }} startDuration={90 * second} minDigits={3} />
            <FlipClockSeconds ref={(fc) => { this.flipClockSeconds2 = fc }} startDuration={90 * second} maxDigits={2} />

            <FlipClockSecondsCountdown ref={(fc) => { this.flipClockSecondsCountdown1 = fc }} startDuration={15 * second} />
            <FlipClockSecondsCountdown ref={(fc) => { this.flipClockSecondsCountdown2 = fc }}  startDuration={15 * second} minDigits={3} />

            <FlipClockMinutesSeconds ref={(fc) => { this.flipClockMinutesSeconds = fc }} minMinuteDigits={2} startDuration={minutesStartDuration} />
            <FlipClockMinutes ref={(fc) => { this.flipClockMinutes = fc }} minDigits={2} startDuration={minutesStartDuration} />

            <FlipClockMinutesSecondsCountdown ref={(fc) => { this.flipClockMinutesSecondsCountdown = fc }} startDuration={minutesCountdownStartDuration} />
            <FlipClockMinutesCountdown ref={(fc) => { this.flipClockMinutesCountdown = fc }} startDuration={minutesCountdownStartDuration} />
            
            <FlipClock12 ref={(fc) => { this.flipClock12 = fc }} startDuration={(11*hour)+(59*minute)+ (50*second)} />
        </div>
    }

}
