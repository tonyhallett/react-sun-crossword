"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Duration = (function () {
    function Duration(ms) {
        this.totalMs = ms;
        this.milliseconds = (ms % 1000);
        this.seconds = Math.floor((ms / 1000)) % 60;
        this.minutes = Math.floor((ms / (1000 * 60))) % 60;
        this.hours = Math.floor((ms / (1000 * 60 * 60))) % 24;
        this.days = Math.floor((ms / (1000 * 60 * 60 * 24)));
    }
    Duration.increment = function (duration, ms) {
        var totalMs = duration.totalMs + ms;
        return new Duration(totalMs);
    };
    return Duration;
}());
exports.Duration = Duration;
var ReportTickInterval;
(function (ReportTickInterval) {
    ReportTickInterval[ReportTickInterval["milliseconds"] = 0] = "milliseconds";
    ReportTickInterval[ReportTickInterval["seconds"] = 1] = "seconds";
    ReportTickInterval[ReportTickInterval["minutes"] = 2] = "minutes";
    ReportTickInterval[ReportTickInterval["hours"] = 3] = "hours";
})(ReportTickInterval = exports.ReportTickInterval || (exports.ReportTickInterval = {}));
var StopwatchController = (function (_super) {
    __extends(StopwatchController, _super);
    function StopwatchController(props) {
        var _this = _super.call(this, props) || this;
        _this.start = function () {
            if (!_this.state.started) {
                _this.startTimer();
                _this.setState({ started: true });
            }
        };
        _this.stop = function () {
            if (_this.state.started) {
                _this.stopTimer();
                _this.startDuration = _this.currentDuration;
                _this.setState({ started: false });
            }
        };
        //LP
        _this.clear = function () {
        };
        _this.currentDuration = new Duration(_this.props.startDuration);
        _this.startDuration = _this.currentDuration;
        _this.setTimerInterval();
        _this.state = { started: false, duration: _this.currentDuration };
        return _this;
    }
    StopwatchController.prototype.componentWillMount = function () {
        if (this.props.autoStart) {
            this.startTimer();
        }
    };
    StopwatchController.prototype.componentWillReceiveProps = function (nextProps) {
        this.stopTimer();
        this.currentDuration = new Duration(nextProps.startDuration);
        this.startDuration = this.currentDuration;
        this.setTimerInterval();
        if (this.props.autoStart) {
            this.startTimer();
        }
    };
    StopwatchController.prototype.getDuration = function () {
        return this.currentDuration;
    };
    StopwatchController.prototype.setTimerInterval = function () {
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
    };
    StopwatchController.prototype.componentWillUnmount = function () {
        this.stopTimer();
    };
    StopwatchController.prototype.updateDuration = function (ms) {
        this.currentDuration = Duration.increment(this.startDuration, ms);
        this.setState({ duration: this.currentDuration });
    };
    StopwatchController.prototype.startTimer = function () {
        var self = this;
        this.startTime = new Date();
        this.cancelIntervalId = window.setInterval(function () {
            var now = new Date();
            var elapsed = now - self.startTime;
            self.updateDuration(elapsed);
        }, this.timerInterval);
        this.setState({ started: true });
    };
    StopwatchController.prototype.stopTimer = function () {
        window.clearInterval(this.cancelIntervalId);
    };
    StopwatchController.prototype.render = function () {
        return React.createElement("div", null, React.cloneElement(this.props.children, { started: this.state.started, duration: this.state.duration, stop: this.stop, clear: this.clear, start: this.start }));
    };
    return StopwatchController;
}(React.Component));
StopwatchController.defaultProps = {
    autoStart: true,
    startDuration: 0,
    reportTickInterval: ReportTickInterval.seconds
};
exports.StopwatchController = StopwatchController;
var DemoStopwatchDisplay = (function (_super) {
    __extends(DemoStopwatchDisplay, _super);
    function DemoStopwatchDisplay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DemoStopwatchDisplay.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("span", null, this.props.duration.days),
            React.createElement("span", null, ":"),
            React.createElement("span", null, this.props.duration.hours),
            React.createElement("span", null, ":"),
            React.createElement("span", null, this.props.duration.minutes),
            React.createElement("span", null, ":"),
            React.createElement("span", null, this.props.duration.seconds),
            this.props.started ?
                React.createElement("button", { onClick: function () { _this.props.stop(); } }, "Stop") :
                React.createElement("button", { onClick: function () { _this.props.start(); } }, "Start"));
    };
    return DemoStopwatchDisplay;
}(React.Component));
exports.DemoStopwatchDisplay = DemoStopwatchDisplay;
//# sourceMappingURL=stopwatchController.js.map