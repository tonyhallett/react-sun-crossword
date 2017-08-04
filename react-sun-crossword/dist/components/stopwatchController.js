"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
//can go on duration .....
//#region calculations
var second = 1000;
var minute = 60000;
var hour = 3600000;
var day = 86400000;
var year = 31536000000;
function calculateDays(dayPart, ms) {
    switch (dayPart) {
        case DayPart.total:
            return Math.floor((ms / (1000 * 60 * 60 * 24)));
        case DayPart.partYear:
            return Math.floor((ms / (1000 * 60 * 60 * 24))) % 365; //?
    }
}
function calculateHours(hourPart, ms) {
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
function calculateMinutes(minutePart, ms) {
    switch (minutePart) {
        case MinutePart.total:
            return Math.floor(ms / (1000 * 60));
        case MinutePart.partYear:
            break;
        case MinutePart.partHour:
            return Math.floor((ms / (1000 * 60)) % 60);
    }
}
function calculateSeconds(secondPart, ms) {
    var seconds;
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
var Duration = (function () {
    function Duration(ms) {
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
    Duration.increment = function (duration, ms) {
        var totalMs = duration.totalMilliseconds + ms;
        return new Duration(totalMs);
    };
    Duration.decrement = function (duration, ms) {
        var totalMs = duration.totalMilliseconds - ms;
        return new Duration(totalMs);
    };
    return Duration;
}());
exports.Duration = Duration;
var TickState;
(function (TickState) {
    TickState[TickState["running"] = 0] = "running";
    TickState[TickState["paused"] = 1] = "paused";
    TickState[TickState["stopped"] = 2] = "stopped";
})(TickState || (TickState = {}));
var StopwatchController = (function (_super) {
    __extends(StopwatchController, _super);
    function StopwatchController(props) {
        var _this = _super.call(this, props) || this;
        _this.actualDuration = 0;
        _this.startDelay = 0;
        _this.delayedTimer = null;
        _this.hasStopped = false;
        _this.neverStarted = true;
        _this.countdownCompleted = false;
        _this.shouldUpdate = true;
        _this.start = function () {
            _this.actualStartTime = new Date();
            var self = _this;
            if (_this.state.tickState === TickState.stopped || _this.state.tickState === TickState.paused) {
                _this.neverStarted = false;
                _this.setState({ tickState: TickState.running, duration: self.currentDuration });
                if (!_this.hasStopped) {
                    window.setTimeout(function () {
                        self.currentDuration = self.changeDuration(1000);
                        self.setState({ tickState: TickState.running, duration: self.currentDuration }, function () {
                            self.startTimer();
                        });
                    }, 1);
                }
                else {
                    _this.setState({ tickState: TickState.running, duration: self.currentDuration });
                    self.startTimer();
                }
            }
        };
        _this.stop = function () {
            if (_this.state.tickState === TickState.running) {
                _this.pauseOrStop(false);
            }
        };
        _this.pause = function () {
            _this.pauseOrStop(true);
        };
        //LP
        _this.clear = function () {
        };
        _this.setStartDuration(_this.props.startDuration);
        _this.state = { tickState: TickState.stopped, duration: _this.currentDuration };
        return _this;
    }
    StopwatchController.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        var shouldUpdate = this.shouldUpdate;
        this.shouldUpdate = true;
        return shouldUpdate;
    };
    StopwatchController.prototype.componentWillMount = function () {
        if (this.props.autoStart) {
            this.start();
        }
    };
    StopwatchController.prototype.componentWillReceiveProps = function (nextProps) {
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
            window.setTimeout(function () {
                self.setState({ duration: self.currentDuration });
                if (self.props.autoStart) {
                    //necessary for state change !
                    window.setTimeout(function () {
                        self.start();
                    }, 1);
                }
            }, 1);
        }
    };
    StopwatchController.prototype.componentWillUnmount = function () {
        this.stopTimers();
    };
    StopwatchController.prototype.setStartDuration = function (durationMs) {
        var duration = new Duration(this.props.startDuration);
        this.currentDuration = duration;
        this.startDuration = duration;
    };
    StopwatchController.prototype.getDuration = function () {
        var actualDuration;
        if (this.state.tickState === TickState.running) {
            var now = new Date();
            actualDuration = this.actualDuration + (now - this.actualStartTime);
        }
        else {
            actualDuration = this.actualDuration;
        }
        if (this.props.countdown) {
            var duration = Duration.decrement(this.startDuration, actualDuration);
            if (duration.totalMilliseconds < 0) {
                duration = this.currentDuration;
            }
            return duration;
        }
        else {
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
    };
    StopwatchController.prototype.updateSecond = function () {
        this.updateDuration(1000);
    };
    StopwatchController.prototype.changeDuration = function (ms) {
        var newDuration;
        if (this.props.countdown) {
            newDuration = Duration.decrement(this.currentDuration, ms);
            if (newDuration.totalMilliseconds < 0) {
                this.completeCountdown();
                newDuration = this.currentDuration;
            }
        }
        else {
            newDuration = Duration.increment(this.currentDuration, ms);
        }
        return newDuration;
    };
    StopwatchController.prototype.updateDuration = function (ms) {
        this.currentDuration = this.changeDuration(ms);
        this.setState({ duration: this.currentDuration });
    };
    StopwatchController.prototype.startTimer = function () {
        if (this.startDelay === 0) {
            this.startSecondTimer();
        }
        else {
            this.startDelayedTimer();
        }
    };
    StopwatchController.prototype.startSecondTimer = function () {
        var self = this;
        this.startTime = new Date();
        this.startDelay = 0;
        this.cancelIntervalId = window.setInterval(function () {
            self.updateSecond();
        }, 1000);
    };
    StopwatchController.prototype.startDelayedTimer = function () {
        var self = this;
        this.delayedTimer = window.setTimeout(function () {
            self.startSecondTimer.bind(self)();
            self.updateSecond.bind(self)();
        }, this.startDelay);
    };
    StopwatchController.prototype.stopDelayedTimer = function () {
        if (this.delayedTimer !== null) {
            window.clearTimeout(this.delayedTimer);
            this.delayedTimer = null;
        }
    };
    StopwatchController.prototype.stopTimers = function () {
        this.stopDelayedTimer();
        window.clearInterval(this.cancelIntervalId);
    };
    StopwatchController.prototype.getDelay = function (nowDate) {
        var delay;
        var now = nowDate;
        if (this.startDelay === 0) {
            var difference = (now - this.startTime) % 1000;
            delay = 1000 - difference;
        }
        else {
            var difference = (now - this.actualStartTime) % 1000;
            delay = 1000 - ((1000 - this.startDelay) + difference);
        }
        return delay;
    };
    StopwatchController.prototype.pauseOrStop = function (paused) {
        this.stopTimers();
        var now = new Date();
        this.actualDuration = this.actualDuration + (now - this.actualStartTime);
        this.hasStopped = true;
        this.startDelay = this.getDelay(now);
        var newState;
        if (paused) {
            newState = {
                tickState: TickState.paused
            };
        }
        else {
            newState = {
                tickState: TickState.stopped,
                duration: this.currentDuration
            };
        }
        this.setState(newState);
    };
    StopwatchController.prototype.completeCountdown = function () {
        this.stop();
        this.countdownCompleted = true;
    };
    StopwatchController.prototype.render = function () {
        return React.createElement("div", null, React.cloneElement(this.props.children, { tickState: this.state.tickState, duration: this.state.duration, stop: this.stop, clear: this.clear, start: this.start }));
    };
    return StopwatchController;
}(React.Component));
StopwatchController.defaultProps = {
    autoStart: true,
    startDuration: 0,
    shouldUpdateSameDuration: false
};
exports.StopwatchController = StopwatchController;
var DayPart;
(function (DayPart) {
    DayPart[DayPart["total"] = 0] = "total";
    DayPart[DayPart["partYear"] = 1] = "partYear";
})(DayPart = exports.DayPart || (exports.DayPart = {}));
var HourPart;
(function (HourPart) {
    HourPart[HourPart["total"] = 0] = "total";
    HourPart[HourPart["part24"] = 1] = "part24";
    HourPart[HourPart["part12"] = 2] = "part12";
})(HourPart = exports.HourPart || (exports.HourPart = {}));
var MinutePart;
(function (MinutePart) {
    MinutePart[MinutePart["total"] = 0] = "total";
    MinutePart[MinutePart["partYear"] = 1] = "partYear";
    MinutePart[MinutePart["partHour"] = 2] = "partHour";
})(MinutePart = exports.MinutePart || (exports.MinutePart = {}));
var SecondPart;
(function (SecondPart) {
    SecondPart[SecondPart["total"] = 0] = "total";
    SecondPart[SecondPart["partYear"] = 1] = "partYear";
    SecondPart[SecondPart["partHour"] = 2] = "partHour";
    SecondPart[SecondPart["partMinute"] = 3] = "partMinute";
})(SecondPart = exports.SecondPart || (exports.SecondPart = {}));
//#endregion
var FlipClockPrivate = (function (_super) {
    __extends(FlipClockPrivate, _super);
    function FlipClockPrivate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlipClockPrivate.prototype.getDigits = function (num, maxDigits, minDigits) {
        var digitString = num.toString();
        var numDigits = digitString.length;
        if (maxDigits > 0 && numDigits > maxDigits) {
            digitString = digitString.substring(numDigits - maxDigits);
        }
        numDigits = digitString.length; //not necessary ?
        if (minDigits > 0 && numDigits < minDigits) {
            var numExtraDigits = minDigits - numDigits;
            var prefix = "";
            for (var i = 0; i < numExtraDigits; i++) {
                prefix += "0";
            }
            digitString = prefix + digitString;
        }
        var digitsArray = digitString.split("").map(function (d) {
            return parseInt(d);
        });
        return digitsArray;
    };
    FlipClockPrivate.prototype.render = function () {
        //days and years to return to 
        var self = this;
        var partDetails = [];
        var hourSettings = this.props.hourSettings;
        if (hourSettings) {
            partDetails.push({ calculateFunction: calculateHours, minDigits: hourSettings.minDigits, maxDigits: hourSettings.maxDigits, part: hourSettings.hourPart });
        }
        var minuteSettings = this.props.minuteSettings;
        if (minuteSettings) {
            partDetails.push({ calculateFunction: calculateMinutes, minDigits: minuteSettings.minDigits, maxDigits: minuteSettings.maxDigits, part: minuteSettings.minutePart });
        }
        var secondSettings = this.props.secondSettings;
        if (secondSettings) {
            partDetails.push({ calculateFunction: calculateSeconds, minDigits: secondSettings.minDigits, maxDigits: secondSettings.maxDigits, part: secondSettings.secondPart });
        }
        var elements = [];
        var numParts = partDetails.length;
        var counter = 0;
        for (var i = 0; i < numParts; i++) {
            if (i !== 0) {
                elements.push(React.createElement(DigitsDivider, { key: counter, dividerTitle: "" }));
                counter++;
            }
            var pd = partDetails[i];
            var num = pd.calculateFunction(pd.part, self.props.duration.totalMilliseconds);
            var digits = self.getDigits(num, pd.maxDigits, pd.minDigits);
            elements = elements.concat(digits.map(function (digit) {
                var flipDigit = React.createElement(FlipDigit, { pauseStoppedAnimation: true, tickState: self.props.tickState, digit: digit, key: counter });
                counter++;
                return flipDigit;
            }));
        }
        return React.createElement("span", { className: "flip-clock-wrapper" },
            elements,
            this.props.children);
    };
    return FlipClockPrivate;
}(React.Component));
exports.FlipClockPrivate = FlipClockPrivate;
var FlipClock = (function (_super) {
    __extends(FlipClock, _super);
    function FlipClock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlipClock.prototype.start = function () {
        this.stopwatchController.start();
    };
    FlipClock.prototype.stop = function () {
        this.stopwatchController.stop();
    };
    FlipClock.prototype.pause = function () {
        this.stopwatchController.pause();
    };
    FlipClock.prototype.render = function () {
        var _this = this;
        return React.createElement(StopwatchController, { ref: function (sc) { _this.stopwatchController = sc; }, countdown: this.props.countdown, autoStart: this.props.autoStart, shouldUpdateSameDuration: this.props.shouldUpdateSameDuration, startDuration: this.props.startDuration },
            React.createElement(FlipClockPrivate, { daySettings: this.props.daySettings, hourSettings: this.props.hourSettings, minuteSettings: this.props.minuteSettings, secondSettings: this.props.secondSettings }));
    };
    return FlipClock;
}(React.Component));
exports.FlipClock = FlipClock;
var FlipDigit = (function (_super) {
    __extends(FlipDigit, _super);
    function FlipDigit() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.runningState = TickState.stopped;
        _this.previousDigit = null;
        _this.lastDigit = null;
        _this.firstRender = true;
        //#region animations
        _this.animationPaused = false;
        return _this;
        //#endregion
    }
    FlipDigit.prototype.getRunningClassName = function (running) {
        return this.props.flipClass + (running ? (" " + this.props.playClass) : "");
    };
    FlipDigit.prototype.getDigitClass = function (digit) {
        var className = "";
        if (digit === this.previousDigit) {
            className = this.props.beforeClass;
        }
        else if (digit === this.lastDigit) {
            className = this.props.activeClass;
        }
        return className;
    };
    FlipDigit.prototype.render = function () {
        var _this = this;
        var self = this;
        var newTickState = this.props.tickState;
        var isRunning = newTickState === TickState.running && !this.firstRender;
        var digits = [];
        if (this.previousDigit !== null) {
            digits.push(this.previousDigit);
        }
        this.lastDigit = this.props.digit;
        digits.push(this.lastDigit);
        this.runningState = newTickState;
        this.firstRender = false;
        return React.createElement("ul", { ref: function (ul) { _this.listElement = ul; }, className: this.getRunningClassName(isRunning) }, digits.map(function (digit, i) {
            return React.createElement("li", { key: digit, className: self.getDigitClass(digit) },
                React.createElement("a", { href: "#" },
                    React.createElement("div", { className: "up" },
                        React.createElement("div", { className: "shadow" }),
                        React.createElement("div", { className: "inn" }, digit)),
                    React.createElement("div", { className: "down" },
                        React.createElement("div", { className: "shadow" }),
                        React.createElement("div", { className: "inn" }, digit))));
        }));
    };
    FlipDigit.prototype.componentWillReceiveProps = function (nextProps) {
        this.nextProps = nextProps;
    };
    FlipDigit.prototype.shouldComponentUpdate = function () {
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
                        }
                        else {
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
                        }
                        else {
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
    };
    FlipDigit.prototype.pauseAnimations = function (stopped) {
        var shouldPause = stopped ? this.props.pauseStoppedAnimation : this.props.pausePausedAnimation;
        if (shouldPause) {
            this.applyAnimationState(true);
        }
    };
    FlipDigit.prototype.resumeAnimations = function () {
        if (this.animationPaused) {
            this.applyAnimationState(false);
        }
    };
    FlipDigit.prototype.applyAnimationState = function (paused) {
        var descendants = this.listElement.querySelectorAll("*");
        for (var i = 0; i < descendants.length; i++) {
            var descendant = descendants[i];
            var style = window.getComputedStyle(descendant);
            if (style.animation) {
                var newState = paused ? 'paused' : 'running';
                descendant.style.webkitAnimationPlayState = newState;
            }
        }
        this.animationPaused = paused;
    };
    return FlipDigit;
}(React.Component));
FlipDigit.defaultProps = {
    activeClass: "flip-clock-active",
    beforeClass: "flip-clock-before",
    flipClass: "flip",
    playClass: "play",
    tickState: TickState.stopped,
    pausePausedAnimation: false,
    pauseStoppedAnimation: false
};
exports.FlipDigit = FlipDigit;
var DigitsDivider = (function (_super) {
    __extends(DigitsDivider, _super);
    function DigitsDivider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DigitsDivider.prototype.render = function () {
        return React.createElement("span", { className: this.props.dividerClass },
            React.createElement("span", { className: this.props.labelClass }, this.props.dividerTitle),
            React.createElement("span", { className: this.props.dotClass + " top" }),
            React.createElement("span", { className: this.props.dotClass + " bottom" }));
    };
    return DigitsDivider;
}(React.Component));
DigitsDivider.defaultProps = {
    labelClass: 'flip-clock-label',
    dotClass: 'flip-clock-dot',
    dividerClass: 'flip-clock-divider'
};
exports.DigitsDivider = DigitsDivider;
//will probably be able to have a Flippable component that cycles through whatever - string
//#endregion
//#endregion
//#region helper components
//#region common settings
var flipClock24HourSettings = {
    minDigits: 2,
    hourPart: HourPart.part24
};
var flipClock12HourSettings = {
    minDigits: 2,
    hourPart: HourPart.part12
};
var flipClockClockMinuteSettings = {
    minDigits: 2,
    minutePart: MinutePart.partHour
};
var flipClockClockSecondSettings = {
    minDigits: 2,
    secondPart: SecondPart.partMinute
};
var FlipClock12 = (function (_super) {
    __extends(FlipClock12, _super);
    function FlipClock12() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlipClock12.prototype.start = function () {
        this.stopwatchController.start();
    };
    FlipClock12.prototype.stop = function () {
        this.stopwatchController.stop();
    };
    FlipClock12.prototype.pause = function () {
        this.stopwatchController.pause();
    };
    FlipClock12.prototype.render = function () {
        var _this = this;
        return React.createElement(StopwatchController, { ref: function (sc) { _this.stopwatchController = sc; }, countdown: false, autoStart: this.props.autoStart, shouldUpdateSameDuration: this.props.shouldUpdateSameDuration, startDuration: this.props.startDuration },
            React.createElement(FlipClock12Private, null));
    };
    return FlipClock12;
}(React.Component));
exports.FlipClock12 = FlipClock12;
//pausing animations needs to be the same - how did the FlipClockPrivate deal with this 
var FlipClock12Private = (function (_super) {
    __extends(FlipClock12Private, _super);
    function FlipClock12Private() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlipClock12Private.prototype.getAmPm = function () {
        var ampm = calculateHours(HourPart.part24, this.props.duration.totalMilliseconds) < 12 ? "am" : "pm";
        return ampm;
    };
    FlipClock12Private.prototype.render = function () {
        return React.createElement(FlipClockPrivate, { duration: this.props.duration, hourSettings: flipClock12HourSettings, minuteSettings: flipClockClockMinuteSettings, secondSettings: flipClockClockSecondSettings, tickState: this.props.tickState },
            React.createElement(FlipDigit, { tickState: this.props.tickState, digit: this.getAmPm() }));
    };
    return FlipClock12Private;
}(React.Component));
exports.FlipClock12Private = FlipClock12Private;
exports.FlipClock24 = flipClockWrapper(function (ownProps) {
    return {
        countdown: false,
        shouldUpdateSameDuration: ownProps.shouldUpdateSameDuration,
        startDuration: ownProps.startDuration,
        autoStart: ownProps.autoStart,
        hourSettings: flipClock24HourSettings,
        minuteSettings: flipClockClockMinuteSettings,
        secondSettings: flipClockClockSecondSettings
    };
}, {
    autoStart: true,
    shouldUpdateSameDuration: false,
    startDuration: 0
});
exports.FlipClock24Countdown = flipClockWrapper(function (ownProps) {
    return {
        countdown: true,
        shouldUpdateSameDuration: ownProps.shouldUpdateSameDuration,
        startDuration: ownProps.startDuration,
        autoStart: ownProps.autoStart,
        hourSettings: flipClock24HourSettings,
        minuteSettings: flipClockClockMinuteSettings,
        secondSettings: flipClockClockSecondSettings
    };
}, {
    autoStart: true,
    shouldUpdateSameDuration: false,
});
exports.FlipClockSeconds = flipClockWrapper(function (ownProps) {
    return {
        countdown: false,
        shouldUpdateSameDuration: ownProps.shouldUpdateSameDuration,
        startDuration: ownProps.startDuration,
        autoStart: ownProps.autoStart,
        secondSettings: { secondPart: SecondPart.total, maxDigits: ownProps.maxDigits, minDigits: ownProps.minDigits }
    };
}, {
    autoStart: true,
    shouldUpdateSameDuration: false,
    startDuration: 0,
    minDigits: 0,
    maxDigits: 0
});
exports.FlipClockSecondsCountdown = flipClockWrapper(function (ownProps) {
    var minDigits = ownProps.minDigits === undefined ? calculateSeconds(SecondPart.total, ownProps.startDuration).toString().length : ownProps.minDigits;
    return {
        countdown: true,
        shouldUpdateSameDuration: ownProps.shouldUpdateSameDuration,
        startDuration: ownProps.startDuration,
        autoStart: ownProps.autoStart,
        secondSettings: { secondPart: SecondPart.total, maxDigits: 0, minDigits: minDigits }
    };
}, {
    autoStart: true,
    shouldUpdateSameDuration: false
});
exports.FlipClockMinutes = flipClockWrapper(function (ownProps) {
    return {
        countdown: false,
        shouldUpdateSameDuration: ownProps.shouldUpdateSameDuration,
        startDuration: ownProps.startDuration,
        autoStart: ownProps.autoStart,
        minuteSettings: { minutePart: MinutePart.total, maxDigits: ownProps.maxDigits, minDigits: ownProps.minDigits }
    };
}, {
    autoStart: true,
    shouldUpdateSameDuration: false,
    startDuration: 0,
    minDigits: 0,
    maxDigits: 0
});
exports.FlipClockMinutesCountdown = flipClockWrapper(function (ownProps) {
    var minDigits = ownProps.minDigits === undefined ? calculateMinutes(MinutePart.total, ownProps.startDuration).toString().length : ownProps.minDigits;
    return {
        countdown: true,
        shouldUpdateSameDuration: ownProps.shouldUpdateSameDuration,
        startDuration: ownProps.startDuration,
        autoStart: ownProps.autoStart,
        minuteSettings: { minutePart: MinutePart.total, maxDigits: 0, minDigits: minDigits }
    };
}, {
    autoStart: true,
    shouldUpdateSameDuration: false
});
exports.FlipClockMinutesSeconds = flipClockWrapper(function (ownProps) {
    return {
        countdown: false,
        shouldUpdateSameDuration: ownProps.shouldUpdateSameDuration,
        startDuration: ownProps.startDuration,
        autoStart: ownProps.autoStart,
        minuteSettings: { minDigits: ownProps.minMinuteDigits, maxDigits: ownProps.maxMinutesDigits, minutePart: MinutePart.total },
        secondSettings: flipClockClockSecondSettings
    };
}, {
    autoStart: true,
    shouldUpdateSameDuration: false,
    startDuration: 0,
    minMinuteDigits: 0,
    maxMinutesDigits: 0
});
function flipClockWrapper(getFlipClockProps, defaultProps) {
    return _a = (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.start = function () {
                this.flipClock.start();
            };
            class_1.prototype.stop = function () {
                this.flipClock.stop();
            };
            class_1.prototype.pause = function () {
                this.flipClock.pause();
            };
            class_1.prototype.render = function () {
                var _this = this;
                var clockProps = getFlipClockProps(this.props);
                return React.createElement(FlipClock, __assign({}, clockProps, { ref: function (fc) { return _this.flipClock = fc; } }));
            };
            return class_1;
        }(React.Component)),
        _a.defaultProps = defaultProps,
        _a;
    var _a;
}
exports.flipClockWrapper = flipClockWrapper;
exports.FlipClockMinutesSecondsCountdown = flipClockWrapper(function (ownProps) {
    var minDigits = ownProps.minMinuteDigits === undefined ? calculateMinutes(MinutePart.total, ownProps.startDuration).toString().length : ownProps.minMinuteDigits;
    return {
        countdown: true,
        shouldUpdateSameDuration: ownProps.shouldUpdateSameDuration,
        startDuration: ownProps.startDuration,
        autoStart: ownProps.autoStart,
        minuteSettings: { minDigits: minDigits, maxDigits: ownProps.maxMinutesDigits, minutePart: MinutePart.total },
        secondSettings: flipClockClockSecondSettings
    };
}, {
    autoStart: true,
    shouldUpdateSameDuration: false,
    startDuration: 0,
    maxMinutesDigits: 0
});
var FlipCounter = (function (_super) {
    __extends(FlipCounter, _super);
    function FlipCounter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //this will eventually become part of the duration
    FlipCounter.prototype.getDoubleDigits = function (num) {
        var numString = num.toString();
        if (numString.length === 1) {
            numString = "0" + numString;
        }
        return numString;
    };
    FlipCounter.prototype.getDoubleDigitsArray = function (num) {
        return this.getDigitArray(this.getDoubleDigits(num).split(""));
    };
    FlipCounter.prototype.getDigitArray = function (numStrings) {
        return numStrings.map(function (numString) {
            return parseInt(numString);
        });
    };
    FlipCounter.prototype.getHourDigits = function (hours) {
        var hoursString = hours.toString();
        //could change this based upon options
        if (hoursString.length === 1) {
            return this.getDoubleDigitsArray(hours);
        }
        return this.getDigitArray(hoursString.split(""));
    };
    FlipCounter.prototype.render = function () {
        var self = this;
        return React.createElement("div", { className: "flip-clock-wrapper" },
            React.createElement(DigitsDivider, { dividerTitle: this.props.hoursTitle }),
            this.getHourDigits(this.props.duration.totalHours).map(function (hourDigit, i) {
                return React.createElement(FlipDigit, { pauseStoppedAnimation: true, tickState: self.props.tickState, digit: hourDigit, key: i });
            }),
            React.createElement(DigitsDivider, { dividerTitle: this.props.minutesTitle }),
            this.getDoubleDigitsArray(this.props.duration.minutes).map(function (minuteDigit, i) {
                return React.createElement(FlipDigit, { pauseStoppedAnimation: true, tickState: self.props.tickState, digit: minuteDigit, key: i });
            }),
            React.createElement(DigitsDivider, { dividerTitle: this.props.secondsTitle }),
            this.getDoubleDigitsArray(this.props.duration.seconds).map(function (secondDigit, i) {
                return React.createElement(FlipDigit, { pauseStoppedAnimation: true, tickState: self.props.tickState, digit: secondDigit, key: i });
            }));
    };
    return FlipCounter;
}(React.Component));
FlipCounter.defaultProps = {
    hoursTitle: "",
    minutesTitle: "",
    secondsTitle: ""
};
exports.FlipCounter = FlipCounter;
//#endregion
//# sourceMappingURL=stopwatchController.js.map