"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var stopwatchController_1 = require("./stopwatchController");
var DemoFlipClocks = (function (_super) {
    __extends(DemoFlipClocks, _super);
    function DemoFlipClocks(props) {
        var _this = _super.call(this, props) || this;
        _this.start = function () {
            _this.flipClock24Countdown.start();
        };
        _this.stop = function () {
            _this.flipClock24Countdown.stop();
        };
        _this.state = {
            countdownDuration: 10000,
            countUpDuration: 5000,
            someOther: 0
        };
        return _this;
    }
    DemoFlipClocks.prototype.checkDurations = function () {
    };
    DemoFlipClocks.prototype.render = function () {
        /*
            <button onClick={() => this.setState({
                countdownDuration: 211000,
                countUpDuration: 91000
            })}>Switch durations</button>
        */
        var _this = this;
        var second = 1000;
        var minute = 60000;
        var hour = 3600000;
        var day = 86400000;
        var year = 31536000000;
        var minutesStartDuration = 55 * second;
        var minutesCountdownStartDuration = (10 * minute) + (10 * second);
        return React.createElement("div", null,
            React.createElement("button", { onClick: this.stop }, "Stop"),
            React.createElement("button", { onClick: this.start }, "Start"),
            React.createElement(stopwatchController_1.FlipClock24Countdown, { ref: function (fc) { _this.flipClock24Countdown = fc; }, startDuration: (23 * hour) + (minute) + (2 * second) }),
            React.createElement(stopwatchController_1.FlipClock24, { startDuration: (23 * hour) + (59 * minute) + (50 * second) }),
            React.createElement(stopwatchController_1.FlipClockSeconds, { startDuration: 90 * second, minDigits: 3 }),
            React.createElement(stopwatchController_1.FlipClockSeconds, { startDuration: 90 * second, maxDigits: 2 }),
            React.createElement(stopwatchController_1.FlipClockSecondsCountdown, { startDuration: 15 * second }),
            React.createElement(stopwatchController_1.FlipClockSecondsCountdown, { startDuration: 15 * second, minDigits: 3 }),
            React.createElement(stopwatchController_1.FlipClockMinutesSeconds, { minMinuteDigits: 2, startDuration: minutesStartDuration }),
            React.createElement(stopwatchController_1.FlipClockMinutes, { minDigits: 2, startDuration: minutesStartDuration }),
            React.createElement(stopwatchController_1.FlipClockMinutesSecondsCountdown, { startDuration: minutesCountdownStartDuration }),
            React.createElement(stopwatchController_1.FlipClockMinutesCountdown, { startDuration: minutesCountdownStartDuration }),
            React.createElement(stopwatchController_1.FlipClock12, { startDuration: (11 * hour) + (59 * minute) + (50 * second) }));
    };
    return DemoFlipClocks;
}(React.Component));
exports.DemoFlipClocks = DemoFlipClocks;
//# sourceMappingURL=demoFlipClocks.js.map