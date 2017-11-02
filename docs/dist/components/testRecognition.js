"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../definition_files/index.d.ts" />
var React = require("react");
var annyang = require("../helpers/annyang");
var EventType;
(function (EventType) {
    EventType[EventType["Basic"] = 0] = "Basic";
    EventType[EventType["Error"] = 1] = "Error";
    EventType[EventType["Result"] = 2] = "Result";
})(EventType || (EventType = {}));
var Recognition = (function (_super) {
    __extends(Recognition, _super);
    function Recognition(props) {
        var _this = _super.call(this, props) || this;
        _this.selfIdentifyingHeader = "#JSGF V1.0; ";
        _this.grammarNameDeclaration = "grammar myTestGrammar; ";
        _this.setUp = function () {
            _this.setTestGrammar();
            var speechRecognition = new _this.SpeechRecognition();
            var speechRecognitionList = new _this.SpeechGrammarList();
            console.log(_this.grammar);
            speechRecognitionList.addFromString(_this.grammar, 1);
            speechRecognition.grammars = speechRecognitionList;
            speechRecognition.lang = 'en-GB';
            speechRecognition.interimResults = false; //to be taken from state
            speechRecognition.maxAlternatives = 1; //to be taken from state
            _this.speechRecognition = speechRecognition;
            _this.handleEvents();
        };
        _this.start = function () {
            _this.speechRecognition.start();
        };
        _this.stop = function () {
            _this.speechRecognition.stop();
        };
        _this.abort = function () {
            _this.speechRecognition.abort();
        };
        _this.state = { events: [] };
        return _this;
    }
    Recognition.prototype.componentWillMount = function () {
        if (!('webkitSpeechRecognition' in window)) {
            //need similar here
            //this.SpeechRecognition = SpeechRecognition
            //this.SpeechGrammarList = SpeechGrammarList
        }
        else {
            this.SpeechRecognition = webkitSpeechRecognition;
            this.SpeechGrammarList = webkitSpeechGrammarList;
            console.log(webkitSpeechGrammarList);
        }
        this.setUp();
    };
    Recognition.prototype.setTestGrammar = function () {
        var ruleDefinitions = [
            {
                name: "singular",
                ruleExpansion: "single"
            }, {
                name: "sequence",
                ruleExpansion: "this is a sequence"
            },
            {
                name: "alternatives",
                ruleExpansion: "me|myself|I"
            },
            {
                name: "optionalEnding",
                ruleExpansion: "this [and that]"
            }, {
                name: "zeroOrMore",
                ruleExpansion: "star* and the rest"
            }, {
                name: "oneOrMore",
                ruleExpansion: "plus+ and the rest"
            }, {
                name: "tags",
                ruleExpansion: "this{this} has{has} tags{tag1}{tag2}"
            }
        ];
        var grammarHeader = this.selfIdentifyingHeader + this.grammarNameDeclaration;
        this.grammar = grammarHeader + this.getBody(ruleDefinitions);
    };
    Recognition.prototype.getBody = function (ruleDefinitions) {
        var body = "";
        for (var i = 0; i < ruleDefinitions.length; i++) {
            var ruleDefinition = ruleDefinitions[i];
            body += "<" + ruleDefinition.name + ">=" + ruleDefinition.ruleExpansion + ";";
        }
        return body;
    };
    Recognition.prototype.addEvent = function (eventDetails) {
        this.setState(function (prevState) {
            var newEvents = prevState.events.slice();
            newEvents.push(eventDetails);
            return { events: newEvents };
        });
    };
    Recognition.prototype.plainEvent = function (eventName) {
        this.addEvent({ eventName: eventName, eventType: EventType.Basic });
    };
    Recognition.prototype.handleEvents = function () {
        var _this = this;
        //plain events
        this.speechRecognition.onaudiostart = function () {
            _this.plainEvent("onaudiostart");
        };
        this.speechRecognition.onaudioend = function () {
            _this.plainEvent("onaudioend");
        };
        this.speechRecognition.onstart = function () {
            _this.plainEvent("onstart");
        };
        this.speechRecognition.onend = function () {
            _this.plainEvent("onend");
        };
        this.speechRecognition.onsoundstart = function () {
            _this.plainEvent("onsoundstart");
        };
        this.speechRecognition.onsoundend = function () {
            _this.plainEvent("onsoundend");
        };
        this.speechRecognition.onspeechstart = function () {
            _this.plainEvent("onspeechstart");
        };
        this.speechRecognition.onspeechend = function () {
            _this.plainEvent("onspeechend");
        };
        /*
        https://developer.mozilla.org/en-US/docs/Web/Events/nomatch
        The nomatch event of the Web Speech API is fired when the speech recognition service returns a final result
        with no significant recognition.

        This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
        */
        this.speechRecognition.onnomatch = function (evt) {
            _this.plainEvent("nomatch");
        };
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.speechRecognition.onerror = function (evt) {
            var errorDetails = { eventName: "onerror", error: evt.error, message: evt.message, eventType: EventType.Error };
            //evt.error is a string https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionError/error
            //that can rely upon to be the same across browsers
        };
        this.speechRecognition.onresult = function (evt) {
            console.log("emma");
            console.log(evt.emma);
            console.log("interpretation: " + evt.interpretation);
            var resultEventDetails = {
                eventName: "onresult",
                resultIndex: evt.resultIndex,
                eventType: EventType.Result,
                results: []
            };
            var evtResults = evt.results;
            for (var i = 0; i < evtResults.length; i++) {
                var evtResult = evtResults.item(0); //should be an indexer ? does it matter ?
                var result = {
                    isFinal: evtResult.isFinal,
                    alternatives: []
                };
                for (var j = 0; j < evtResult.length; j++) {
                    var evtAlternative = evtResult.item(j);
                    result.alternatives.push({ confidence: evtAlternative.confidence, transcript: evtAlternative.transcript });
                }
                resultEventDetails.results.push(result);
            }
            _this.addEvent(resultEventDetails);
        };
    };
    Recognition.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("button", { onClick: this.start }, "Start"),
            React.createElement("button", { onClick: this.stop }, "Stop"),
            React.createElement("button", { onClick: this.abort }, "Abort"),
            //colour them differently
            this.state.events.map(function (evt, eventKey) {
                switch (evt.eventType) {
                    case EventType.Basic:
                        return React.createElement(ErrorDetailsComponent, { key: eventKey, eventName: evt.eventName });
                    case EventType.Error:
                        return React.createElement(ErrorDetailsComponent, { key: eventKey, eventName: evt.eventName },
                            React.createElement("div", null, "Error: " + evt.error),
                            React.createElement("div", null, "Message: " + evt.message));
                    case EventType.Result:
                        var resultEventDetails = evt;
                        return React.createElement(ErrorDetailsComponent, { key: eventKey, eventName: evt.eventName },
                            React.createElement("div", null, "Result index: " + resultEventDetails.resultIndex),
                            resultEventDetails.results.map(function (result, resultKey) {
                                return React.createElement("div", { key: resultKey, style: { marginBottom: "5px", backgroundColor: "yellow" } },
                                    React.createElement("div", null, "Is final: " + result.isFinal),
                                    result.alternatives.map(function (alternative, alternativeKey) {
                                        return React.createElement("div", { key: alternativeKey },
                                            React.createElement("div", null, "Transcript: " + alternative.transcript),
                                            React.createElement("div", null, "Confidence: " + alternative.confidence));
                                    }));
                            }));
                }
                //remember to key
                return null;
            }));
    };
    return Recognition;
}(React.Component));
exports.Recognition = Recognition;
var ErrorDetailsComponent = (function (_super) {
    __extends(ErrorDetailsComponent, _super);
    function ErrorDetailsComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.switchHide = function () {
            _this.setState(function (prevState) {
                return { hidden: !prevState.hidden };
            });
        };
        _this.state = { hidden: true };
        return _this;
    }
    ErrorDetailsComponent.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("span", null, this.props.eventName),
            React.createElement("span", { style: { display: this.props.children ? "inline" : "none" }, onClick: this.switchHide }, "    X"),
            React.createElement("div", { style: { display: this.state.hidden ? "none" : "block" } }, this.props.children));
    };
    return ErrorDetailsComponent;
}(React.Component));
exports.ErrorDetailsComponent = ErrorDetailsComponent;
var Severity;
(function (Severity) {
    Severity[Severity["Normal"] = 0] = "Normal";
    Severity[Severity["Warning"] = 1] = "Warning";
    Severity[Severity["Error"] = 2] = "Error";
})(Severity || (Severity = {}));
var listeningStateLookup = {
    audioend: "audio end",
    audiostart: "audio start",
    end: "end",
    soundend: "sound end",
    soundstart: "sound start",
    speechend: "speech end",
    speechstart: "speech start",
    start: "start"
};
var Annyang = (function (_super) {
    __extends(Annyang, _super);
    function Annyang(props) {
        var _this = _super.call(this, props) || this;
        _this.commandCallback = function (phrase, confidence) {
            var matchArgs = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                matchArgs[_i - 2] = arguments[_i];
            }
            _this.setState(function (prevState) {
                var currentMatches = prevState.matches;
                var newMatches = currentMatches.slice();
                newMatches.push({
                    phrase: phrase,
                    confidence: confidence,
                    parameters: matchArgs
                });
                return {
                    matches: newMatches
                };
            });
        };
        //could display the commands that are present
        _this.addCommand = function () {
            var command = {};
            var value = _this.state.regExpr === "" ? _this.commandCallback : {
                callback: _this.commandCallback,
                regexp: new RegExp(_this.state.regExpr)
            };
            command[_this.state.key] = value;
            annyang.addCommands(command);
            _this.addCommandDetail({ key: _this.state.key, regExp: _this.state.regExpr });
            _this.setState({ regExpr: "", key: "" });
        };
        _this.synthesisTextChanged = function (text) {
            _this.setState({ synthesisText: text });
        };
        _this.sythesisSpeak = function () {
            speechSynthesis.speak(new SpeechSynthesisUtterance(_this.state.synthesisText));
        };
        _this.state = { synthesisText: "", commandDetails: [], eventMessages: [], listeningState: "none", key: "example param matching", matches: [], regExpr: "^and on that farm he had a (pig|cow|cat|dog)$" };
        return _this;
    }
    Annyang.prototype.setListenState = function (listenState) {
        this.setState({ listeningState: listeningStateLookup[listenState] });
    };
    Annyang.prototype.addCommandDetail = function (command) {
        this.setState(function (prevState) {
            var currentCommands = prevState.commandDetails;
            var newCommands = currentCommands.slice();
            newCommands.push(command);
            return {
                commandDetails: newCommands
            };
        });
    };
    Annyang.prototype.addEventMessage = function (eventMessage) {
        this.setState(function (prevState) {
            var currentEventMessages = prevState.eventMessages;
            var newEventMessages = currentEventMessages.slice();
            newEventMessages.push(eventMessage);
            return {
                eventMessages: newEventMessages
            };
        });
    };
    Annyang.prototype.doRegExprTests = function () {
        console.log("****************");
        //should there be a space after ?
        var moveWithOptionalRegExprNonGlobal = /^(Move|Navigate) (Left|Right|Up|Down)?/i;
        var moveWithOptionalRegExprNonGlobalCtor = new RegExp("^(Move|Navigate) (Left|Right|Up|Down)?", "i");
        var moveWithOptionalRegExprGlobal = /^(Move|Navigate) (Left|Right|Up|Down)?/gi;
        var moveWithOptionalRegExprGlobalCtor = new RegExp("^(Move|Navigate) (Left|Right|Up|Down)?", "gi");
        var globalMoveOnlyMatch = moveWithOptionalRegExprGlobal.exec("move ");
        console.log(globalMoveOnlyMatch);
        console.log(moveWithOptionalRegExprGlobalCtor.exec("move "));
        var nonGlobalMoveOnlyMatch = moveWithOptionalRegExprNonGlobal.exec("move ");
        console.log(nonGlobalMoveOnlyMatch);
        console.log(moveWithOptionalRegExprNonGlobalCtor.exec("move "));
        var globalMoveLeftMatch = moveWithOptionalRegExprGlobal.exec("move left");
        console.log(globalMoveLeftMatch);
        console.log(moveWithOptionalRegExprGlobalCtor.exec("move left"));
        var nonGlobalMoveLeftMatch = moveWithOptionalRegExprNonGlobal.exec("move left");
        console.log(nonGlobalMoveLeftMatch);
        console.log(moveWithOptionalRegExprNonGlobalCtor.exec("move left"));
        var globalMoveLeftSpaceMatch = moveWithOptionalRegExprGlobal.exec("move left ");
        console.log(globalMoveLeftSpaceMatch);
        console.log(moveWithOptionalRegExprGlobalCtor.exec("move left "));
        var nonGlobalMoveLeftSpaceMatch = moveWithOptionalRegExprNonGlobal.exec("move left ");
        console.log(nonGlobalMoveLeftSpaceMatch);
        console.log(moveWithOptionalRegExprNonGlobalCtor.exec("move left "));
        console.log("****************");
    };
    Annyang.prototype.componentWillMount = function () {
        this.doRegExprTests();
        var self = this;
        annyang.init({});
        annyang.addCallback("nomatch", function () {
            self.addEventMessage({ message: "no match ( recognizer )", severity: Severity.Warning });
        });
        //if listening
        annyang.addCallback("originalResult", function () {
            self.addEventMessage({ message: "result ( recognizer )", severity: Severity.Normal });
        });
        //after above - in parse - before commands are matched
        annyang.addCallback("result", function (results, confidences) {
            self.addEventMessage({ message: "result ( annyang )", severity: Severity.Normal });
            //for (var i = 0; i < results.length; i++) {
            //    console.log(results[i])
            //    console.log(confidences[i])
            //    console.log("")
            //}
        });
        //the text ( possible alternative ) has matched against a command - this is after the comamnd
        annyang.addCallback("resultMatch", function (commandText, key) {
            self.addEventMessage({ message: '"' + commandText + '"' + " matched command: " + key, severity: Severity.Normal });
        });
        //if not above
        annyang.addCallback("resultNoMatch", function (results, confidences) {
            console.log("Result no match");
            for (var i = 0; i < results.length; i++) {
                console.log(results[i] + " : " + confidences[i]);
            }
            self.addEventMessage({ message: "not matched command ( annyang )", severity: Severity.Warning });
        });
        annyang.addCallback("error", function (err) {
            self.addEventMessage({ message: "error: " + err.error, severity: Severity.Error });
        });
        //////////////////////////////////////////////////////////////////
        annyang.addCallback("start", function () {
            self.setListenState("start");
        });
        annyang.addCallback("end", function () {
            self.setListenState("end");
        });
        annyang.addCallback("soundstart", function () {
            self.setListenState("soundstart");
        });
        annyang.addCallback("soundend", function () {
            self.setListenState("soundend");
        });
        annyang.addCallback("audiostart", function () {
            self.setListenState("audiostart");
        });
        annyang.addCallback("audioend", function () {
            self.setListenState("audioend");
        });
        annyang.addCallback("speechstart", function () {
            self.setListenState("speechstart");
        });
        annyang.addCallback("speechend", function () {
            self.setListenState("speechend");
        });
    };
    Annyang.prototype.render = function () {
        var _this = this;
        var labelWidth = "80px";
        var textWidth = "100%";
        return React.createElement("div", null,
            React.createElement("div", { style: { borderRadius: "5px", borderStyle: "solid", borderWidth: "1px", borderColor: "gray", padding: "5px", margin: "5px" } },
                React.createElement("div", null, "Listening state: " + this.state.listeningState),
                React.createElement("br", null),
                React.createElement("button", { style: { marginRight: "5px" }, onClick: function () { annyang.start(); } }, "Start listening"),
                React.createElement("button", { style: { marginRight: "5px" }, onClick: function () { annyang.pause(); } }, "Pause listening"),
                React.createElement("button", { style: { marginRight: "5px" }, onClick: function () { annyang.abort(); } }, "Abort listening"),
                React.createElement("button", { style: { marginRight: "5px" }, onClick: function () { annyang.resume(); } }, "Resume listening")),
            React.createElement("div", { style: { borderRadius: "5px", borderStyle: "solid", borderWidth: "1px", borderColor: "gray", padding: "5px", margin: "5px" } },
                React.createElement("div", null, "Commands: "),
                React.createElement("div", null, this.state.commandDetails.map(function (command, ci) {
                    return React.createElement("div", { key: ci, style: { marginBottom: "5px" } },
                        React.createElement("div", null, "Key: " + command.key),
                        React.createElement("div", null, "RegExpr: " + command.regExp));
                })),
                React.createElement("br", null),
                React.createElement("div", { style: { borderRadius: "5px", borderStyle: "solid", borderWidth: "1px", borderColor: "gray", padding: "5px", margin: "5px" } },
                    React.createElement("div", { style: { marginBottom: "5px" } },
                        React.createElement("label", { style: { width: labelWidth, display: "inline-block" } }, "Key: "),
                        React.createElement("input", { style: { width: textWidth }, type: "text", value: this.state.key, onChange: function (evt) { _this.setState({ key: evt.target.value }); } })),
                    React.createElement("br", null),
                    React.createElement("div", { style: { marginBottom: "5px" } },
                        React.createElement("label", { style: { width: labelWidth, display: "inline-block" } }, "RegExp ( or just key for built-in ): "),
                        React.createElement("input", { style: { width: textWidth }, type: "text", value: this.state.regExpr, onChange: function (evt) { _this.setState({ regExpr: evt.target.value }); } })),
                    React.createElement("br", null),
                    React.createElement("button", { onClick: this.addCommand }, "Add command"))),
            React.createElement("div", null,
                React.createElement("div", { style: { width: "500px", float: "left", marginRight: "5px" } },
                    React.createElement("div", null, "Command matches:"),
                    React.createElement("div", null, this.state.matches.map(function (match, mi) {
                        //could colour the confidence
                        return React.createElement("div", { key: mi, style: { marginBottom: "10px", backgroundColor: "gray" } },
                            React.createElement("div", null, "Command key: " + match.phrase),
                            React.createElement("div", null, "Confidence: " + match.confidence),
                            React.createElement("div", { style: { paddingLeft: "20px", backgroundColor: "orange" } }, match.parameters.map(function (p, pi) {
                                return React.createElement("div", { key: pi }, p);
                            })));
                    }))),
                React.createElement("div", { style: { width: "500px", marginLeft: "505px" } },
                    React.createElement("div", null, "Other events of interest:"),
                    React.createElement("div", null, this.state.eventMessages.map(function (eventMessage, ei) {
                        var colour = "green";
                        switch (eventMessage.severity) {
                            case Severity.Normal:
                                break;
                            case Severity.Warning:
                                colour = "yellow";
                                break;
                            case Severity.Error:
                                colour = "red";
                                break;
                        }
                        return React.createElement("div", { key: ei, style: { backgroundColor: colour } },
                            " ",
                            eventMessage.message);
                    }))),
                React.createElement("div", { style: { clear: "both" } })),
            React.createElement("div", null,
                React.createElement("input", { onChange: function (evt) { _this.synthesisTextChanged(evt.target.value); }, type: "text" }),
                React.createElement("button", { onClick: this.sythesisSpeak }, "Speak")));
    };
    return Annyang;
}(React.Component));
exports.Annyang = Annyang;
//# sourceMappingURL=testRecognition.js.map