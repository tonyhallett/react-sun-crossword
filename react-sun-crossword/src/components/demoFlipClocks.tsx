import * as React from "react";
import { StopwatchController, FlipClock, HourSettings, HourPart, MinuteSettings, SecondSettings, MinutePart, SecondPart, FlipClock24Countdown, FlipClock24, FlipClockSeconds, FlipClockSecondsCountdown, FlipClockMinutesSeconds, FlipClockMinutesSecondsCountdown, FlipClockMinutes, FlipClockMinutesCountdown, FlipClock12, FlipClock24CountdownProps, flipClockWrapper, ClockController, FlipClockWrapper, DaySettings, DayPart, YearSettings } from "./stopwatchController";

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
    private flipClockSeconds3: ClockController
    private flipClockSecondsCountdown1: ClockController
    private flipClockSecondsCountdown2: ClockController
    private flipClockSecondsCountdown3: ClockController
    private flipClockMinutesSeconds: ClockController
    private flipClockMinutes: ClockController
    private flipClockMinutesSecondsCountdown: ClockController
    private flipClockMinutesCountdown: ClockController
    private flipClock12: ClockController
    private flipClock12Style2: ClockController
    private flipClockYear: FlipClock
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
        this.flipClockSeconds3.start();
        this.flipClockSecondsCountdown1.start();
        this.flipClockSecondsCountdown2.start();
        this.flipClockSecondsCountdown3.start();
        this.flipClockMinutesSeconds.start();
        this.flipClockMinutes.start();
        this.flipClockMinutesSecondsCountdown.start();
        this.flipClockMinutesCountdown.start();
        this.flipClock12.start();
        this.flipClock12Style2.start();
        this.flipClockYear.start();
    }
    stop=()=> {
        this.flipClock24Countdown.stop();
        this.flipClock24.stop();
        this.flipClockSeconds1.stop();
        this.flipClockSeconds2.stop();
        this.flipClockSeconds3.stop();
        this.flipClockSecondsCountdown1.stop();
        this.flipClockSecondsCountdown2.stop();
        this.flipClockSecondsCountdown3.stop();
        this.flipClockMinutesSeconds.stop();
        this.flipClockMinutes.stop();
        this.flipClockMinutesSecondsCountdown.stop();
        this.flipClockMinutesCountdown.stop();
        this.flipClock12.stop();
        this.flipClock12Style2.stop();
        this.flipClockYear.stop();
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

        var flipClock24HourSettings: HourSettings = {
            minDigits: 2,
            hourPart: HourPart.part24
        }
        var flipClockClockMinuteSettings: MinuteSettings = {
            minDigits: 2,
            minutePart: MinutePart.partHour
        }
        var flipClockClockSecondSettings: SecondSettings = {
            minDigits: 2,
            secondPart: SecondPart.partMinute
        }
        var flipClockDaySettings: DaySettings = {
            minDigits: 3,
            dayPart: DayPart.partYear
        }
        var flipClockYearSettings: YearSettings = {
            minDigits:1
        }


        var minutesStartDuration = 55 * second;
        var minutesCountdownStartDuration = (10 * minute) + (10 * second);
        /*
        
        */
        return <div>
            <button onClick={this.stop}>Stop</button>
            <button onClick={this.start}>Start</button>

            <div>The five clocks below will pause animation when stopped</div>
            <div>12 hour clock</div>
            <FlipClock12 pauseStoppedAnimation={true} ref={(fc) => { this.flipClock12 = fc }} startDuration={(11 * hour) + (59 * minute) + (50 * second)} />
            <div>12 hour clock, different css styling applied</div>
            <FlipClock12 pauseStoppedAnimation={true} ref={(fc) => { this.flipClock12Style2 = fc }} additionalClassName="style2" startDuration={(11 * hour) + (59 * minute) + (50 * second)} />

            <div>24 hour clock countdown</div>
            <FlipClock24Countdown pauseStoppedAnimation={true} ref={(fc) => { this.flipClock24Countdown = fc }} startDuration={(23 * hour) + (minute) + (2 * second)} />
            <div>24 hour clock</div>
            <FlipClock24 pauseStoppedAnimation={true} ref={(fc) => { this.flipClock24 = fc }} startDuration={(23 * hour) + (59 * minute) + (50 * second)} />
            <div>Years, days, hours, minutes, seconds ( without helper )</div>
            <FlipClock ref={(fc) => { this.flipClockYear = fc }} pauseStoppedAnimation={true} countdown={false} secondSettings={flipClockClockSecondSettings} minuteSettings={flipClockClockMinuteSettings} hourSettings={flipClock24HourSettings} daySettings={flipClockDaySettings} yearSettings={flipClockYearSettings} startDuration={(364 * day) + (23 * hour) + (59 * minute) + (50 * second)} />

            <div>The flip clocks below do not have animation stopped.</div>

            <div>Total seconds, will always show 3 digits</div>
            <FlipClockSeconds ref={(fc) => { this.flipClockSeconds1 = fc }} startDuration={90 * second} minDigits={3} />
            <div>Total seconds, will only show the required number of digits</div>
            <FlipClockSeconds ref={(fc) => { this.flipClockSeconds3 = fc }} startDuration={90 * second}/>
            <div>Total seconds, will only show the last 2 digits</div>
            <FlipClockSeconds ref={(fc) => { this.flipClockSeconds2 = fc }} startDuration={90 * second} maxDigits={2} />

            <div>Total seconds countdown, defaults to always showing the start number of digits</div>
            <FlipClockSecondsCountdown ref={(fc) => { this.flipClockSecondsCountdown1 = fc }} startDuration={15 * second} />
            <div>Total seconds countdown, will only show the required number of digits</div>
            <FlipClockSecondsCountdown minDigits={0} ref={(fc) => { this.flipClockSecondsCountdown3 = fc }} startDuration={15 * second} />
            <div>Total seconds countdown, always shows 3 digits</div>
            <FlipClockSecondsCountdown ref={(fc) => { this.flipClockSecondsCountdown2 = fc }} startDuration={15 * second} minDigits={3} />

            <div>Minutes and seconds, always shows 2 minute digits</div>
            <FlipClockMinutesSeconds ref={(fc) => { this.flipClockMinutesSeconds = fc }} minMinuteDigits={2} startDuration={minutesStartDuration} />
            <div>Minutes only, always shows 2 minute digits</div>
            <FlipClockMinutes ref={(fc) => { this.flipClockMinutes = fc }} minDigits={2} startDuration={minutesStartDuration} />

            <div>Minutes and seconds countdown, defaults to always showing the start number of digits</div>
            <FlipClockMinutesSecondsCountdown ref={(fc) => { this.flipClockMinutesSecondsCountdown = fc }} startDuration={minutesCountdownStartDuration} />
            <div>Minutes countdown, defaults to always showing the start number of digits</div>
            <FlipClockMinutesCountdown ref={(fc) => { this.flipClockMinutesCountdown = fc }} startDuration={minutesCountdownStartDuration} />

        </div>
    }

}
