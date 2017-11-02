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
            _this.flipClock24.start();
            _this.flipClockSeconds1.start();
            _this.flipClockSeconds2.start();
            _this.flipClockSeconds3.start();
            _this.flipClockSecondsCountdown1.start();
            _this.flipClockSecondsCountdown2.start();
            _this.flipClockSecondsCountdown3.start();
            _this.flipClockMinutesSeconds.start();
            _this.flipClockMinutes.start();
            _this.flipClockMinutesSecondsCountdown.start();
            _this.flipClockMinutesCountdown.start();
            _this.flipClock12.start();
            _this.flipClock12Style2.start();
            _this.flipClockYear.start();
        };
        _this.stop = function () {
            _this.flipClock24Countdown.stop();
            _this.flipClock24.stop();
            _this.flipClockSeconds1.stop();
            _this.flipClockSeconds2.stop();
            _this.flipClockSeconds3.stop();
            _this.flipClockSecondsCountdown1.stop();
            _this.flipClockSecondsCountdown2.stop();
            _this.flipClockSecondsCountdown3.stop();
            _this.flipClockMinutesSeconds.stop();
            _this.flipClockMinutes.stop();
            _this.flipClockMinutesSecondsCountdown.stop();
            _this.flipClockMinutesCountdown.stop();
            _this.flipClock12.stop();
            _this.flipClock12Style2.stop();
            _this.flipClockYear.stop();
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
        var flipClock24HourSettings = {
            minDigits: 2,
            hourPart: stopwatchController_1.HourPart.part24
        };
        var flipClockClockMinuteSettings = {
            minDigits: 2,
            minutePart: stopwatchController_1.MinutePart.partHour
        };
        var flipClockClockSecondSettings = {
            minDigits: 2,
            secondPart: stopwatchController_1.SecondPart.partMinute
        };
        var flipClockDaySettings = {
            minDigits: 3,
            dayPart: stopwatchController_1.DayPart.partYear
        };
        var flipClockYearSettings = {
            minDigits: 1
        };
        var minutesStartDuration = 55 * second;
        var minutesCountdownStartDuration = (10 * minute) + (10 * second);
        /*
        
        */
        return React.createElement("div", null,
            React.createElement("button", { onClick: this.stop }, "Stop"),
            React.createElement("button", { onClick: this.start }, "Start"),
            React.createElement("div", null, "The five clocks below will pause animation when stopped"),
            React.createElement("div", null, "12 hour clock"),
            React.createElement(stopwatchController_1.FlipClock12, { pauseStoppedAnimation: true, ref: function (fc) { _this.flipClock12 = fc; }, startDuration: (11 * hour) + (59 * minute) + (50 * second) }),
            React.createElement("div", null, "12 hour clock, different css styling applied"),
            React.createElement(stopwatchController_1.FlipClock12, { pauseStoppedAnimation: true, ref: function (fc) { _this.flipClock12Style2 = fc; }, additionalClassName: "style2", startDuration: (11 * hour) + (59 * minute) + (50 * second) }),
            React.createElement("div", null, "24 hour clock countdown"),
            React.createElement(stopwatchController_1.FlipClock24Countdown, { pauseStoppedAnimation: true, ref: function (fc) { _this.flipClock24Countdown = fc; }, startDuration: (23 * hour) + (minute) + (2 * second) }),
            React.createElement("div", null, "24 hour clock"),
            React.createElement(stopwatchController_1.FlipClock24, { pauseStoppedAnimation: true, ref: function (fc) { _this.flipClock24 = fc; }, startDuration: (23 * hour) + (59 * minute) + (50 * second) }),
            React.createElement("div", null, "Years, days, hours, minutes, seconds ( without helper )"),
            React.createElement(stopwatchController_1.FlipClock, { ref: function (fc) { _this.flipClockYear = fc; }, pauseStoppedAnimation: true, countdown: false, secondSettings: flipClockClockSecondSettings, minuteSettings: flipClockClockMinuteSettings, hourSettings: flipClock24HourSettings, daySettings: flipClockDaySettings, yearSettings: flipClockYearSettings, startDuration: (364 * day) + (23 * hour) + (59 * minute) + (50 * second) }),
            React.createElement("div", null, "The flip clocks below do not have animation stopped."),
            React.createElement("div", null, "Total seconds, will always show 3 digits"),
            React.createElement(stopwatchController_1.FlipClockSeconds, { ref: function (fc) { _this.flipClockSeconds1 = fc; }, startDuration: 90 * second, minDigits: 3 }),
            React.createElement("div", null, "Total seconds, will only show the required number of digits"),
            React.createElement(stopwatchController_1.FlipClockSeconds, { ref: function (fc) { _this.flipClockSeconds3 = fc; }, startDuration: 90 * second }),
            React.createElement("div", null, "Total seconds, will only show the last 2 digits"),
            React.createElement(stopwatchController_1.FlipClockSeconds, { ref: function (fc) { _this.flipClockSeconds2 = fc; }, startDuration: 90 * second, maxDigits: 2 }),
            React.createElement("div", null, "Total seconds countdown, defaults to always showing the start number of digits"),
            React.createElement(stopwatchController_1.FlipClockSecondsCountdown, { ref: function (fc) { _this.flipClockSecondsCountdown1 = fc; }, startDuration: 15 * second }),
            React.createElement("div", null, "Total seconds countdown, will only show the required number of digits"),
            React.createElement(stopwatchController_1.FlipClockSecondsCountdown, { minDigits: 0, ref: function (fc) { _this.flipClockSecondsCountdown3 = fc; }, startDuration: 15 * second }),
            React.createElement("div", null, "Total seconds countdown, always shows 3 digits"),
            React.createElement(stopwatchController_1.FlipClockSecondsCountdown, { ref: function (fc) { _this.flipClockSecondsCountdown2 = fc; }, startDuration: 15 * second, minDigits: 3 }),
            React.createElement("div", null, "Minutes and seconds, always shows 2 minute digits"),
            React.createElement(stopwatchController_1.FlipClockMinutesSeconds, { ref: function (fc) { _this.flipClockMinutesSeconds = fc; }, minMinuteDigits: 2, startDuration: minutesStartDuration }),
            React.createElement("div", null, "Minutes only, always shows 2 minute digits"),
            React.createElement(stopwatchController_1.FlipClockMinutes, { ref: function (fc) { _this.flipClockMinutes = fc; }, minDigits: 2, startDuration: minutesStartDuration }),
            React.createElement("div", null, "Minutes and seconds countdown, defaults to always showing the start number of digits"),
            React.createElement(stopwatchController_1.FlipClockMinutesSecondsCountdown, { ref: function (fc) { _this.flipClockMinutesSecondsCountdown = fc; }, startDuration: minutesCountdownStartDuration }),
            React.createElement("div", null, "Minutes countdown, defaults to always showing the start number of digits"),
            React.createElement(stopwatchController_1.FlipClockMinutesCountdown, { ref: function (fc) { _this.flipClockMinutesCountdown = fc; }, startDuration: minutesCountdownStartDuration }));
    };
    return DemoFlipClocks;
}(React.Component));
exports.DemoFlipClocks = DemoFlipClocks;
//# sourceMappingURL=demoFlipClocks.js.map