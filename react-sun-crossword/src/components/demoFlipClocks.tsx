import * as React from "react";
import { StopwatchController, FlipCounter, ReportTickInterval } from "./stopwatchController";

interface DemoFlipClocksState {
    countdownDuration: number,
    countUpDuration:number
}
export class DemoFlipClocks extends React.Component<undefined, DemoFlipClocksState> {
    autoStartCountdownStopwatch: StopwatchController
    countdownStopwatch: StopwatchController
    autoStartCountUpStopwatch: StopwatchController
    countUpStopwatch: StopwatchController

    constructor(props) {
        super(props);
        this.state = {
            countdownDuration: 120000,
            countUpDuration:5000
        }
    }
    render() {
        /*
        <StopwatchController countdown={true} autoStart={false} ref={(sw) => { this.countdownStopwatch = sw }} reportTickInterval={ReportTickInterval.hundredthSecond} startDuration={this.state.countdownDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController>
            <button onClick={() => { this.countdownStopwatch.start() }}>Start</button>

        <StopwatchController countdown={true} autoStart={true} ref={(sw) => { this.autoStartCountdownStopwatch = sw }} reportTickInterval={ReportTickInterval.hundredthSecond} startDuration={this.state.countdownDuration}>
                <FlipCounter  hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController>

            <StopwatchController countdown={false} autoStart={false} ref={(sw) => { this.countUpStopwatch = sw }} reportTickInterval={ReportTickInterval.hundredthSecond} startDuration={this.state.countUpDuration}>
                <FlipCounter  hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController>
            <button onClick={() => { this.countUpStopwatch.start() }}>Start</button>
            <StopwatchController countdown={false} autoStart={true} ref={(sw) => { this.autoStartCountUpStopwatch = sw }} reportTickInterval={ReportTickInterval.hundredthSecond} startDuration={this.state.countUpDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController>
        */
        return <div>
            <StopwatchController countdown={true} autoStart={false} ref={(sw) => { this.countdownStopwatch = sw }} reportTickInterval={ReportTickInterval.hundredthSecond} startDuration={this.state.countdownDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController>
            <button onClick={() => { this.countdownStopwatch.start() }}>Start</button>
            <button onClick={() => { this.countdownStopwatch.stop() }}>Stop</button>

            <StopwatchController countdown={true} autoStart={true} ref={(sw) => { this.autoStartCountdownStopwatch = sw }} reportTickInterval={ReportTickInterval.hundredthSecond} startDuration={this.state.countdownDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController>
            <button onClick={() => { this.autoStartCountdownStopwatch.start() }}>Start</button>
            <button onClick={() => { this.autoStartCountdownStopwatch.stop() }}>Stop</button>

            <StopwatchController countdown={false} autoStart={false} ref={(sw) => { this.countUpStopwatch = sw }} reportTickInterval={ReportTickInterval.hundredthSecond} startDuration={this.state.countUpDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController>
            <button onClick={() => { this.countUpStopwatch.start() }}>Start</button>
            <button onClick={() => { this.countUpStopwatch.stop() }}>Stop</button>

            <StopwatchController countdown={false} autoStart={true} ref={(sw) => { this.autoStartCountUpStopwatch = sw }} reportTickInterval={ReportTickInterval.hundredthSecond} startDuration={this.state.countUpDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController>
            <button onClick={() => { this.autoStartCountUpStopwatch.start() }}>Start</button>
            <button onClick={() => { this.autoStartCountUpStopwatch.stop() }}>Stop</button>

            <button onClick={() => this.setState({
                countdownDuration: 211000,
                countUpDuration: 91000})}>Switch durations</button>
        </div>
    }

}
