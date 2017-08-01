import * as React from "react";
import { StopwatchController, FlipCounter, ReportTickInterval, StopwatchController2 } from "./stopwatchController";

interface DemoFlipClocksState {
    countdownDuration: number,
    countUpDuration: number
    getDuration:number
}
export class DemoFlipClocks extends React.Component<undefined, DemoFlipClocksState> {
    autoStartCountdownStopwatch: StopwatchController2
    countdownStopwatch: StopwatchController2
    autoStartCountUpStopwatch: StopwatchController2
    countUpStopwatch: StopwatchController2

    constructor(props) {
        super(props);
        this.state = {
            countdownDuration: 120000,
            countUpDuration: 5000,
            getDuration:0
        }
    }
    render() {
        /*
        <StopwatchController2 countdown={true} autoStart={false} ref={(sw) => { this.countdownStopwatch = sw }} startDuration={this.state.countdownDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController2>
            <button onClick={() => { this.countdownStopwatch.start() }}>Start</button>
            <button onClick={() => { this.countdownStopwatch.stop() }}>Stop</button>

            <StopwatchController2 countdown={false} autoStart={false} ref={(sw) => { this.countUpStopwatch = sw }} startDuration={this.state.countUpDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController2>
            <button onClick={() => { this.countUpStopwatch.start() }}>Start</button>
            <button onClick={() => { this.countUpStopwatch.stop() }}>Stop</button>

            <StopwatchController2 countdown={false} autoStart={true} ref={(sw) => { this.autoStartCountUpStopwatch = sw }} startDuration={this.state.countUpDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController2>
            <button onClick={() => { this.autoStartCountUpStopwatch.start() }}>Start</button>
            <button onClick={() => { this.autoStartCountUpStopwatch.stop() }}>Stop</button>
        */


        //determine how to do conditional
        return <div>
            

            <StopwatchController2 countdown={true} autoStart={true} ref={(sw) => { this.autoStartCountdownStopwatch = sw }} startDuration={this.state.countdownDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController2>

            
            <button onClick={() => { this.autoStartCountdownStopwatch.start() }}>Start</button>
            <button onClick={() => { this.autoStartCountdownStopwatch.stop() }}>Stop</button>
            <button onClick={() => {
                console.log(this.autoStartCountdownStopwatch.getDuration().totalSeconds)
            }}>Get duration</button>

            <StopwatchController2 countdown={true} autoStart={false} ref={(sw) => { this.countdownStopwatch = sw }} startDuration={this.state.countdownDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController2>
            <button onClick={() => { this.countdownStopwatch.start() }}>Start</button>
            <button onClick={() => { this.countdownStopwatch.stop() }}>Stop</button>
            <button onClick={() => {
                console.log(this.countdownStopwatch.getDuration().totalSeconds)
            }}>Get duration</button>

            <StopwatchController2 countdown={false} autoStart={false} ref={(sw) => { this.countUpStopwatch = sw }} startDuration={this.state.countUpDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController2>
            <button onClick={() => { this.countUpStopwatch.start() }}>Start</button>
            <button onClick={() => { this.countUpStopwatch.stop() }}>Stop</button>
            <button onClick={() => {
                console.log(this.countUpStopwatch.getDuration().totalSeconds)
            }}>Get duration</button>

            <StopwatchController2 countdown={false} autoStart={true} ref={(sw) => { this.autoStartCountUpStopwatch = sw }} startDuration={this.state.countUpDuration}>
                <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            </StopwatchController2>
            <button onClick={() => { this.autoStartCountUpStopwatch.start() }}>Start</button>
            <button onClick={() => { this.autoStartCountUpStopwatch.stop() }}>Stop</button>
            
            <button onClick={() => {
                console.log(this.autoStartCountUpStopwatch.getDuration().totalSeconds)
            }}>Get duration</button>

            <button onClick={() => this.setState({
                countdownDuration: 211000,
                countUpDuration: 91000
            })}>Switch durations</button>
            
            
            
        </div>
    }

}
