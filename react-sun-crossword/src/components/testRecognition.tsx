/// <reference path="../definition_files/index.d.ts" />
import * as React from "react";
import annyang = require("../helpers/annyang")

export interface RecognitionProps {

}
export interface RecognitionState {
    events: EventDetails[]
}
export interface EventDetails {
    eventName: string
    eventType:EventType
}
export interface ErrorEventDetails extends EventDetails {
    error: string,
    message:string
}
export interface ResultEventDetails extends EventDetails {
    resultIndex: number,
    results:Result[]//corresponds to SpeechRecognitionResult
}
enum EventType {Basic,Error,Result }
export interface Result {
    isFinal: boolean,
    alternatives:Alternative[]
}
export interface Alternative {
    transcript: string,
    confidence
}
interface RuleDefinition {
    name: string,
    ruleExpansion:string
}
export class Recognition extends React.Component<RecognitionProps, RecognitionState>{
    private SpeechRecognition: SpeechRecognitionStatic
    private SpeechGrammarList: SpeechGrammarListStatic
    private speechRecognition: SpeechRecognition
    private selfIdentifyingHeader = "#JSGF V1.0; "
    private grammarNameDeclaration = "grammar myTestGrammar; ";
    private grammar:string
    constructor(props) {
        super(props);
        
        
        this.state = { events: [] };
        

    }
    componentWillMount() {
        if (!('webkitSpeechRecognition' in window)) {
            //need similar here
            //this.SpeechRecognition = SpeechRecognition
            //this.SpeechGrammarList = SpeechGrammarList
        } else {
            this.SpeechRecognition = webkitSpeechRecognition;
            this.SpeechGrammarList = webkitSpeechGrammarList
            console.log(webkitSpeechGrammarList);
        }
        this.setUp();
    }
    setTestGrammar() {
        var ruleDefinitions: RuleDefinition[] = [
            {
                name: "singular",
                ruleExpansion:"single"
            }, {
                name: "sequence",
                ruleExpansion:"this is a sequence"
            },
            {
                name: "alternatives",
                ruleExpansion:"me|myself|I"
            },
            {
                name: "optionalEnding",
                ruleExpansion:"this [and that]"
            }, {
                name: "zeroOrMore",
                ruleExpansion:"star* and the rest"
            }, {
                name: "oneOrMore",
                ruleExpansion:"plus+ and the rest"
            }, {
                name: "tags",
                ruleExpansion:"this{this} has{has} tags{tag1}{tag2}"
            }
        ]
        var grammarHeader = this.selfIdentifyingHeader + this.grammarNameDeclaration;
        this.grammar = grammarHeader + this.getBody(ruleDefinitions);
    }
    getBody(ruleDefinitions: RuleDefinition[]): string {
        var body = "";
        for (var i = 0; i < ruleDefinitions.length; i++) {
            var ruleDefinition = ruleDefinitions[i];
            body += "<" + ruleDefinition.name + ">=" + ruleDefinition.ruleExpansion + ";"
        }
        return body;
    }
    setUp = () => {
        this.setTestGrammar();
        var speechRecognition = new this.SpeechRecognition();
        var speechRecognitionList = new this.SpeechGrammarList();
        console.log(this.grammar);
        speechRecognitionList.addFromString(this.grammar, 1);
        speechRecognition.grammars = speechRecognitionList;
        speechRecognition.lang = 'en-GB';
        speechRecognition.interimResults = false;//to be taken from state
        speechRecognition.maxAlternatives = 1;//to be taken from state

        this.speechRecognition = speechRecognition;
        this.handleEvents();

    }
    addEvent(eventDetails: EventDetails) {
        this.setState((prevState: RecognitionState) => {
            var newEvents = prevState.events.slice();
            newEvents.push(eventDetails);
            return { events: newEvents };
        });
    }
    plainEvent(eventName: string) {
        this.addEvent({ eventName: eventName, eventType: EventType.Basic })
    }
    handleEvents() {
        //plain events
        this.speechRecognition.onaudiostart = () => {
            this.plainEvent("onaudiostart");
        }
        this.speechRecognition.onaudioend = () => {
            this.plainEvent("onaudioend");
        }
        this.speechRecognition.onstart = () => {
            this.plainEvent("onstart");
        }
        this.speechRecognition.onend = () => {
            this.plainEvent("onend");
        }
        this.speechRecognition.onsoundstart = () => {
            this.plainEvent("onsoundstart");
        }
        this.speechRecognition.onsoundend = ()=>{
            this.plainEvent("onsoundend");
        }
        this.speechRecognition.onspeechstart = () => {
            this.plainEvent("onspeechstart");
        }
        this.speechRecognition.onspeechend = () => {
            this.plainEvent("onspeechend");
        }
        /*
        https://developer.mozilla.org/en-US/docs/Web/Events/nomatch
        The nomatch event of the Web Speech API is fired when the speech recognition service returns a final result
        with no significant recognition.

        This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
        */
        this.speechRecognition.onnomatch = (evt: SpeechRecognitionEvent) => {
            this.plainEvent("nomatch");
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.speechRecognition.onerror = (evt: SpeechRecognitionError) => {
            var errorDetails: ErrorEventDetails = { eventName: "onerror", error: evt.error, message: evt.message, eventType: EventType.Error }
            //evt.error is a string https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionError/error
            //that can rely upon to be the same across browsers
        }
        
        this.speechRecognition.onresult = (evt: SpeechRecognitionEvent) => {
            console.log("emma");
            console.log(evt.emma);
            console.log("interpretation: " + evt.interpretation);
            var resultEventDetails: ResultEventDetails = {
                eventName: "onresult",
                resultIndex: evt.resultIndex,
                eventType: EventType.Result,
                results: []
            }
            var evtResults = evt.results;
            for (var i = 0; i < evtResults.length; i++) {
                var evtResult = evtResults.item(0);//should be an indexer ? does it matter ?
                
                var result: Result = {
                    isFinal: evtResult.isFinal,
                    alternatives:[]
                }
                for (var j = 0; j < evtResult.length; j++) {
                    var evtAlternative = evtResult.item(j);
                    result.alternatives.push({ confidence: evtAlternative.confidence, transcript: evtAlternative.transcript });
                }
                resultEventDetails.results.push(result);
            }
            this.addEvent(resultEventDetails);
        }
        
    }
    start = () => {
        this.speechRecognition.start();
    }
    stop = () => {
        this.speechRecognition.stop();
    }
    abort = () => {
        this.speechRecognition.abort();
    }
    render() {

        return <div>
            
            <button onClick={this.start}>Start</button>
            <button onClick={this.stop}>Stop</button>
            <button onClick={this.abort}>Abort</button>
            {
                //colour them differently
                this.state.events.map(function (evt,eventKey) {
                    switch (evt.eventType) {
                        case EventType.Basic:
                            return <ErrorDetailsComponent key={eventKey} eventName={evt.eventName}/>
                        case EventType.Error:
                            return <ErrorDetailsComponent key={eventKey} eventName={evt.eventName}>
                                
                                <div>{
                                    "Error: " + (evt as ErrorEventDetails).error
                                }</div>
                                <div>{
                                    "Message: " + (evt as ErrorEventDetails).message
                                }</div>
                            </ErrorDetailsComponent>
                        case EventType.Result:
                            var resultEventDetails = evt as ResultEventDetails;
                            
                            return <ErrorDetailsComponent key={eventKey} eventName={evt.eventName}>

                                <div>{"Result index: " + resultEventDetails.resultIndex}</div>
                                {
                                    resultEventDetails.results.map(function (result,resultKey) {
                                        return <div key={resultKey} style={{ marginBottom: "5px", backgroundColor:"yellow" }}>
                                            <div>{"Is final: " + result.isFinal}</div>
                                            {result.alternatives.map(function (alternative,alternativeKey) {
                                                return <div key={alternativeKey}>
                                                    <div>{"Transcript: " + alternative.transcript}</div>
                                                    <div>{"Confidence: " + alternative.confidence}</div>
                                                    </div>
                                            })}
                                            </div>
                                    })
                                }
                            </ErrorDetailsComponent>
                    }
                    //remember to key
                    return null;
                })
            }
        </div>
    }
}
export interface ErrorDetailsComponentProps {
    eventName:string
}
export interface ErrorDetailsComponentState {
    hidden:boolean
}
export class ErrorDetailsComponent extends React.Component<ErrorDetailsComponentProps, ErrorDetailsComponentState>{
    constructor(props) {
        super(props);
        this.state = { hidden:true }
    }
    switchHide = () => {
        this.setState(function (prevState: ErrorDetailsComponentState) {
            return { hidden: !prevState.hidden }
        })
    }
    render() {
        return <div>
            <span>{this.props.eventName}</span><span style={{ display: this.props.children?"inline":"none" }} onClick={this.switchHide}>    X</span>
            <div style={{ display: this.state.hidden?"none":"block" }}>
                {this.props.children}
                </div>
            </div>
    }
}


//--------------------------------------------------------------------------------------------------------------------------
export interface AnnyangProps {

}
export interface ListeningStateLookup {
    start: string,
    audiostart: string,
    soundstart: string,
    speechstart: string,
    speechend: string,
    soundend: string,
    audioend: string
    end:string

}
export interface AnnyangState {
    regExpr: string,
    key: string,
    matches: AnnyangMatch[],
    listeningState: string,
    eventMessages: EventMessageSeverity[],
    commandDetails: CommandDetail[],
    synthesisText:string
}
enum Severity { Normal,Warning, Error}
export interface EventMessageSeverity {
    message: string,
    severity:Severity
}
export interface AnnyangMatch{
    phrase: string,
    confidence: number,
    parameters:string[]
}
export interface CommandDetail {
    key:string,
    regExp:string
}
var listeningStateLookup: ListeningStateLookup = {
    audioend: "audio end",
    audiostart: "audio start",
    end: "end",
    soundend: "sound end",
    soundstart: "sound start",
    speechend: "speech end",
    speechstart: "speech start",
    start:"start"
}

declare var speechSynthesis;
declare var SpeechSynthesisUtterance: {
    prototype: any;
    new (text?: string): any;
}


export class Annyang extends React.Component<AnnyangProps, AnnyangState>{
    constructor(props) {
        super(props);
        this.state = {synthesisText:"", commandDetails:[],eventMessages:[], listeningState:"none", key: "example param matching", matches: [], regExpr: "^and on that farm he had a (pig|cow|cat|dog)$" };
    }
    setListenState(listenState: string) {
        this.setState({ listeningState: listeningStateLookup[listenState] });
    }
    addCommandDetail(command: CommandDetail) {
        this.setState(function (prevState: AnnyangState) {
            var currentCommands = prevState.commandDetails;
            var newCommands = currentCommands.slice();
            newCommands.push(command);
            return {
                commandDetails: newCommands
            };
        });
    }
    addEventMessage(eventMessage: EventMessageSeverity) {
        this.setState(function (prevState: AnnyangState) {
            var currentEventMessages = prevState.eventMessages;
            var newEventMessages = currentEventMessages.slice();
            newEventMessages.push(eventMessage);
            return {
                eventMessages: newEventMessages
            };
        });
    }

    doRegExprTests() {
        console.log("****************")
        //should there be a space after ?
        var moveWithOptionalRegExprNonGlobal = /^(Move|Navigate) (Left|Right|Up|Down)?/i
        var moveWithOptionalRegExprNonGlobalCtor = new RegExp("^(Move|Navigate) (Left|Right|Up|Down)?", "i");
        var moveWithOptionalRegExprGlobal = /^(Move|Navigate) (Left|Right|Up|Down)?/gi
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
        console.log("****************")
    }
    componentWillMount() {
        this.doRegExprTests();
        var self = this;
        annyang.init({
            
        });
        
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
            console.log("Result no match")
            for (var i = 0; i < results.length; i++) {
                console.log(results[i] + " : " + confidences[i])
            }
            self.addEventMessage({ message: "not matched command ( annyang )", severity: Severity.Warning });
        });
        annyang.addCallback("error", function (err) {
            self.addEventMessage({ message: "error: " + err.error, severity: Severity.Error});
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
    }


    commandCallback=(phrase: string, confidence: number, ...matchArgs: string[])=> {
        this.setState(function (prevState: AnnyangState) {
            var currentMatches = prevState.matches;
            var newMatches = currentMatches.slice();
            newMatches.push({
                phrase: phrase,
                confidence: confidence,
                parameters: matchArgs
            })
            return {
                matches: newMatches
            };
        });
    }
    //could display the commands that are present
    addCommand=()=> {
        var command = {};
        var value: any = this.state.regExpr===""? this.commandCallback : {
            callback: this.commandCallback,
            regexp: new RegExp(this.state.regExpr)
        }
        command[this.state.key] = value;
        annyang.addCommands(command);
        this.addCommandDetail({ key: this.state.key, regExp: this.state.regExpr })
        this.setState({regExpr:"",key:""})
    }

    synthesisTextChanged = (text:string) => {
        this.setState({synthesisText:text})
    }
    sythesisSpeak = () => {
        speechSynthesis.speak(new SpeechSynthesisUtterance(this.state.synthesisText));
    }
    render() {
        var labelWidth = "80px";
        var textWidth ="100%"
        return <div>
            <div style={{ borderRadius: "5px",borderStyle:"solid", borderWidth: "1px", borderColor:"gray",padding:"5px",margin:"5px"}}>
                <div>{"Listening state: " + this.state.listeningState}</div>
                <br/>
                <button style={{marginRight:"5px"}} onClick={() => { annyang.start() }}>Start listening</button>
                <button style={{ marginRight: "5px" }} onClick={() => { annyang.pause() }}>Pause listening</button>
                <button style={{ marginRight: "5px" }} onClick={() => { annyang.abort() }}>Abort listening</button>
                <button style={{ marginRight: "5px" }} onClick={() => { annyang.resume() }}>Resume listening</button>
            </div>

            <div style={{ borderRadius: "5px", borderStyle: "solid", borderWidth: "1px", borderColor: "gray", padding: "5px", margin: "5px" }}>
                <div>Commands: </div>
                <div>
                    {this.state.commandDetails.map(function (command,ci) {
                        return <div key={ci} style={{marginBottom:"5px"}}>
                            <div>{"Key: " + command.key}</div>
                            <div>{"RegExpr: " + command.regExp}</div>
                        </div>
                     })
                    }
                </div>
                <br />
                <div style={{ borderRadius: "5px", borderStyle: "solid", borderWidth: "1px", borderColor: "gray", padding: "5px", margin: "5px" }}>
                    <div style={{marginBottom:"5px"}}>
                        <label style={{ width: labelWidth,display:"inline-block" }}>Key: </label><input style={{width:textWidth}} type="text" value={this.state.key} onChange={(evt) => { this.setState({ key: evt.target.value }) }} />
                    </div>
                    <br />
                    <div style={{ marginBottom: "5px" }}> 
                        <label style={{ width: labelWidth, display: "inline-block"  }}>RegExp ( or just key for built-in ): </label><input style={{ width: textWidth }} type="text" value={this.state.regExpr} onChange={(evt) => { this.setState({ regExpr: evt.target.value }) }} />
                    </div>
                    <br />
                    
                    <button onClick={this.addCommand}>Add command</button>
                </div>
            </div>
            <div>
                <div style={{width: "500px",float:"left", marginRight: "5px" }}>
                    <div>Command matches:</div>
                    <div>
                        {
                             this.state.matches.map(function (match,mi) {
                                //could colour the confidence
                                return <div key={mi} style={{ marginBottom: "10px", backgroundColor:"gray" }}>
                                    <div>{"Command key: " + match.phrase}</div>
                                    <div>{"Confidence: " + match.confidence}</div>
                                    <div style={{ paddingLeft: "20px", backgroundColor:"orange" }}>
                                        {
                                             match.parameters.map(function (p,pi) {
                                                return <div key={pi}>{p}</div>
                                            })
                                    }
                                    </div>
                                    </div>
                            })
                        }
                        </div>
                </div>
                <div style={{  width: "500px",marginLeft:"505px" }}>
                    <div>Other events of interest:</div>
                    <div>
                    {
                        this.state.eventMessages.map(function (eventMessage,ei) {
                            var colour = "green";
                            switch (eventMessage.severity) {
                                case Severity.Normal:

                                    break;
                                case Severity.Warning:
                                    colour = "yellow";
                                    break;
                                case Severity.Error:
                                    colour="red"
                                    break;
                            }
                            return <div key={ei} style={{ backgroundColor: colour } } > { eventMessage.message }</div>
                        })
                    }
                    </div>
                </div>
                <div style={{ clear:"both"}}></div>
            </div>
            <div>
                <input onChange={(evt) => { this.synthesisTextChanged(evt.target.value) }} type="text" />
                <button onClick={this.sythesisSpeak}>Speak</button>
            </div>
        </div>
    }
}