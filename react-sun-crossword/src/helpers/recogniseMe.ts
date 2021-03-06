﻿//var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
declare var speechSynthesis;
declare var SpeechSynthesisUtterance: {
    prototype: any;
    new (text?: string): any;
}


export interface CallbackUnknown {
    (...args:any[]):void
}
interface CallbackWithContext {
    callback: CallbackUnknown
    context:any
}
export interface StartOptions {
    paused?: boolean,
    autoRestart?: boolean
    continuous?: boolean
    
}
export interface StartStopCommands {
    defaultStartStopPhrases?: boolean
    defaultStartStopSynthesis?: boolean
    startPhrase?: RegExp
    stopPhrase?: RegExp
    startSound?: SoundResponse
    stopSound?: SoundResponse

}
export interface CommandCallbackContext {
    command: Command,
    parameters: string[],
    confidence:number
}
export interface Command {
    callback: (context: CommandCallbackContext)=>void
    description: string,
    regExpr:RegExp
}


var optionalParam = /\s*\((.*?)\)\s*/g;
var optionalRegex = /(\(\?:[^)]+\))\?/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#]/g;

export function simpleCommandToRegExp(command: string):RegExp {
    command = command.replace(escapeRegExp, '\\$&').replace(optionalParam, '(?:$1)?').replace(namedParam, function (match, optional) {
        return optional ? match : '([^\\s]+)';
    }).replace(splatParam, '(.*?)').replace(optionalRegex, '\\s*$1?\\s*');
    return new RegExp('^' + command + '$', 'i');
}

export var sentenceRegExp = /^((?:[a-z]+\s?)+)$/i;
export type CommandOrCommands = Command | Command[]


//export interface RecogniseMe {
//    start: (startOptions?: StartOptions) => void
//    abort: () => void
//    pause: () => void
//    resume: () => void

//    isListening: () => boolean

//    init: (commands?: CommandOrCommands, resetCommands?: boolean) => void
//    addCommands: (commands: CommandOrCommands) => void
//    removeCommands: (commands?: string|string[]) => void

//    setMaxAlternatives: (maxAlternatives: number)=>void
//    setLanguage: (language: string) => void//think that language can only be a string
//    getSpeechRecognizer: () => SpeechRecognition



//    addCallback: (type: string, callback: string|CallbackUnknown, context?: any) => void
//    removeCallback: (type: string, callback: CallbackUnknown) => void
    
//    trigger: (sentences: string[], confidences: number[]) => void

//    debug: (debugState?: boolean) => void
//}
export interface SoundResponse {
    sound?: string
    synthesisMessage?: string
    canInterrupt?:boolean
}
export interface CommandState {
    name: string,
    isDefault?: boolean
    enter?: (context:any) => SoundResponse
    exit?: () => SoundResponse
    stateTimeout?: number
    disabled?: boolean
    canInterrupt?: boolean
    noMatch?: (results:string[],confidences:number[]) => SoundResponse
    commands: StateCommand[],
    catchCommand?:StateCommand
}

//requiresConfirmation: boolean
//confirmationTimeout: number
export interface CommandCallbackResponse extends SoundResponse{
    allowFurther?: boolean
    nextStateContext?: any
    matches?:boolean//default true
}
export interface StateCommandCallbackContext {
    command: StateCommand,
    parameters: string[],
    confidence: number,
    results: string[],
    confidences: number[],
    stateContext:any
}
export interface StateCommand {
    disabled?: boolean,
    minConfidence?: number
    regExp: RegExp
    canInterrupt?: boolean,
    keepState?:boolean,
    nextState?: string,
    name: string,
    maxAlternatives?:number,
    callback: (context: StateCommandCallbackContext) => CommandCallbackResponse
}

export interface RecogniseMe {
    allStatesNoMatchSoundResponse: SoundResponse

    setSkipSpeakingCommand:(command:string)=>void

    //these to become private
    currentState: CommandState
    currentStateContext: any

    setState: (name:string, context:any) => void

    start: (startOptions?: StartOptions) => void
    abort: () => void
    pause: () => void
    resume: () => void

    isListening: () => boolean



    //LP may want to remove a command from State
    init: (commandStates: CommandState[], resetStates?: boolean) => void
    addStates: (commandStates: CommandState[]) => void
    removeStates:(stateNames?:string[])=>void

    setMaxAlternatives: (maxAlternatives: number)=>void
    setLanguage: (language: string) => void//think that language can only be a string
    getSpeechRecognizer: () => SpeechRecognition

    setStartStopCommands:  (startStopCommands:StartStopCommands)=>void

    addCallback: (type: string, callback: string|CallbackUnknown, context?: any) => void
    removeCallback: (type: string, callback: CallbackUnknown) => void

    trigger: (sentences: string[], confidences: number[]) => void

    debug: (debugState?: boolean) => void
}
export var recogniseMe: RecogniseMe;


// Get the SpeechRecognition object, while handling browser prefixes
var anyWindow: any = window;
var SpeechRecognition: SpeechRecognitionStatic = anyWindow.SpeechRecognition || anyWindow.webkitSpeechRecognition || anyWindow.mozSpeechRecognition || anyWindow.msSpeechRecognition || anyWindow.oSpeechRecognition;
interface Callbacks {
    [key: string]: CallbackWithContext[]
    start: CallbackWithContext[],
    error: CallbackWithContext[],
    end: CallbackWithContext[],
    soundstart: CallbackWithContext[],
    enteredState: CallbackWithContext[],
    result: CallbackWithContext[], resultMatch: CallbackWithContext[], resultNoMatch: CallbackWithContext[], errorNetwork: CallbackWithContext[], errorPermissionBlocked: CallbackWithContext[], errorPermissionDenied: CallbackWithContext[], soundend: CallbackWithContext[], audiostart: CallbackWithContext[], audioend: CallbackWithContext[], speechstart: CallbackWithContext[], speechend: CallbackWithContext[], nomatch: CallbackWithContext[], originalResult: CallbackWithContext[] 
}
// Check browser support
// This is done as early as possible, to make it as fast as possible for unsupported browsers
//if (SpeechRecognition) {
    

//    var commandsList: Command[] = [];
//    var recognition: SpeechRecognition;
//    var callbacks: Callbacks= { start: [], error: [], end: [], soundstart: [], result: [], resultMatch: [], resultNoMatch: [], errorNetwork: [], errorPermissionBlocked: [], errorPermissionDenied: [], soundend: [], audiostart: [], audioend: [], speechstart: [], speechend: [], nomatch: [], originalResult: [] };
//    var autoRestart;
//    var lastStartedAt = 0;
//    var autoRestartCount = 0;
//    var debugState = false;
//    var debugStyle = 'font-weight: bold; color: #00f;';
//    var pauseListening = false;
//    var _isListening = false;


//    // This method receives an array of callbacks to iterate over, and invokes each of them
//    var invokeCallbacks = function invokeCallbacks(callbacks, ...args: any[]) {
//        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
//            args[_key - 1] = arguments[_key];
//        }

//        callbacks.forEach(function (callback) {
//            callback.callback.apply(callback.context, args);
//        });
//    };

//    var isInitialized = function isInitialized() {
//        return recognition !== undefined;
//    };

//    // method for logging in developer console when debug mode is on
//    var logMessage = function logMessage(text, extraParameters?) {
//        if (text.indexOf('%c') === -1 && !extraParameters) {
//            console.log(text);
//        } else {
//            console.log(text, extraParameters || debugStyle);
//        }
//    };

//    var initIfNeeded = function initIfNeeded() {
//        if (!isInitialized()) {
//            recogniseMe.init([], false);
//        }
//    };

//    var registerCommand = function registerCommand(command:Command) {
//        commandsList.push(command);
//        if (debugState) {
//            logMessage('Command successfully loaded: %c' + command.description, debugStyle);
//        }
//    };

//    //confidences new arg
//    var parseResults = function parseResults(results:string[], confidences:number[]) {
//        invokeCallbacks(callbacks.result, results, confidences);
//        var commandText;
//        // go over each of the 5 results and alternative results received (we've set maxAlternatives to 5 above)
//        for (var i = 0; i < results.length; i++) {
//            // the text recognized
//            commandText = results[i].trim();
//            if (debugState) {
//                logMessage('Speech recognized: %c' + commandText, debugStyle);
//            }
//            // try and match recognized text to one of the commands on the list
//            for (var j = 0, l = commandsList.length; j < l; j++) {
//                var currentCommand = commandsList[j];
//                var result = currentCommand.regExpr.exec(commandText);
//                if (result) {
//                    var parameters = result.slice(1);
//                    if (debugState) {
//                        logMessage('command matched: %c' + currentCommand.description, debugStyle);
//                        if (parameters.length) {
//                            logMessage('with parameters', parameters);
//                        }
//                    }
                    
//                    currentCommand.callback({
//                        command: currentCommand,
//                        confidence: confidences[i],
//                        parameters:parameters
//                    })

//                    //state change will go here - ignore and global option for matchMultiple


//                    invokeCallbacks(callbacks.resultMatch, commandText, currentCommand.description, results, confidences);
//                    return;
//                }
//            }
//        }
//        invokeCallbacks(callbacks.resultNoMatch, results, confidences);
//    };

//    recogniseMe = {

//        /**
//            * Initialize annyang with a list of commands to recognize.
//            *
//            * #### Examples:
//            * ````javascript
//            * var commands = {'hello :name': helloFunction};
//            * var commands2 = {'hi': helloFunction};
//            *
//            * // initialize annyang, overwriting any previously added commands
//            * annyang.init(commands, true);
//            * // adds an additional command without removing the previous commands
//            * annyang.init(commands2, false);
//            * ````
//            * As of v1.1.0 it is no longer required to call init(). Just start() listening whenever you want, and addCommands() whenever, and as often as you like.
//            *
//            * @param {Object} commands - Commands that annyang should listen to
//            * @param {boolean} [resetCommands=true] - Remove all commands before initializing?
//            * @method init
//            * @deprecated
//            * @see [Commands Object](#commands-object)
//            */
//        //need to type commands 
//        init: function init(commands,resetCommands=true) {
                

//            // Abort previous instances of recognition already running
//            if (recognition && recognition.abort) {
//                recognition.abort();
//            }

//            // initiate SpeechRecognition
//            recognition = new SpeechRecognition();

//            // Set the max number of alternative transcripts to try and match with a command
//            recognition.maxAlternatives = 20;

//            // In HTTPS, turn off continuous mode for faster results.
//            // In HTTP,  turn on  continuous mode for much slower results, but no repeating security notices
//            recognition.continuous = window.location.protocol === 'http:';

//            // Sets the language to the default 'en-US'. This can be changed with annyang.setLanguage()
//            recognition.lang = 'en-US';

//            recognition.onstart = function () {
//                _isListening = true;
//                invokeCallbacks(callbacks.start);
//            };

//            recognition.onsoundstart = function () {
//                invokeCallbacks(callbacks.soundstart);
//            };
//            //missing event handlers for annyang - will get booleans later
//            recognition.onsoundend = function () {
//                invokeCallbacks(callbacks.soundend);
//            }
//            recognition.onaudiostart = function () {
//                invokeCallbacks(callbacks.audiostart);
//            }
//            recognition.onaudioend = function () {
//                invokeCallbacks(callbacks.audioend);
//            }
//            recognition.onspeechstart = function () {
//                invokeCallbacks(callbacks.speechstart);
//            }
//            recognition.onspeechend = function () {
//                invokeCallbacks(callbacks.speechend);
//            }
//            recognition.onnomatch = function (event) {
//                invokeCallbacks(callbacks.nomatch, event);
//            }
//            ///////////////////////////


//            recognition.onerror = function (event) {
//                invokeCallbacks(callbacks.error, event);
//                switch (event.error) {
//                    case 'network':
//                        invokeCallbacks(callbacks.errorNetwork, event);
//                        break;
//                    case 'not-allowed':
//                    case 'service-not-allowed':
//                        // if permission to use the mic is denied, turn off auto-restart
//                        autoRestart = false;
//                        // determine if permission was denied by user or automatically.
//                        if (new Date().getTime() - lastStartedAt < 200) {
//                            invokeCallbacks(callbacks.errorPermissionBlocked, event);
//                        } else {
//                            invokeCallbacks(callbacks.errorPermissionDenied, event);
//                        }
//                        break;
//                }
//            };

//            recognition.onend = function () {
//                _isListening = false;
//                invokeCallbacks(callbacks.end);
//                // annyang will auto restart if it is closed automatically and not by user action.
//                if (autoRestart) {
//                    // play nicely with the browser, and never restart annyang automatically more than once per second
//                    var timeSinceLastStart = new Date().getTime() - lastStartedAt;
//                    autoRestartCount += 1;
//                    if (autoRestartCount % 10 === 0) {
//                        if (debugState) {
//                            logMessage('Speech Recognition is repeatedly stopping and starting. See http://is.gd/annyang_restarts for tips.');
//                        }
//                    }
//                    if (timeSinceLastStart < 1000) {
//                        setTimeout(function () {
//                            recogniseMe.start({ paused: pauseListening });
//                        }, 1000 - timeSinceLastStart);
//                    } else {
//                        recogniseMe.start({ paused: pauseListening });
//                    }
//                }
//            };

//            recognition.onresult = function (event) {
//                if (pauseListening) {
//                    if (debugState) {
//                        logMessage('Speech heard, but annyang is paused');
//                    }
//                    return false;
//                }
//                //new line to annyang
//                invokeCallbacks(callbacks.originalResult, event);
//                // Map the results to an array
//                var SpeechRecognitionResult = event.results[event.resultIndex];
//                var results = [];
//                var confidences = [];//this is new
//                for (var k = 0; k < SpeechRecognitionResult.length; k++) {
//                    results[k] = SpeechRecognitionResult[k].transcript;
//                    confidences[k] = SpeechRecognitionResult[k].confidence;
//                }
//                //confidences argument is new
//                parseResults(results, confidences);
//            };

//            // build commands list
//            if (resetCommands) {
//                commandsList = [];
//            }

//            //this is rubbish - if pass an array through to addCommands 
//            /*
//            for (var phrase in commands) {
//                if (commands.hasOwnProperty(phrase)) {
//            */
//            //if (commands.length) {
//            //  this.addCommands(commands);
//            //}

//            //therefore changing
//            if (commands) {
//                this.addCommands(commands);
//            }

//        },

//        /**
//            * Start listening.
//            * It's a good idea to call this after adding some commands first, but not mandatory.
//            *
//            * Receives an optional options object which supports the following options:
//            *
//            * - `autoRestart`  (boolean, default: true) Should annyang restart itself if it is closed indirectly, because of silence or window conflicts?
//            * - `continuous`   (boolean) Allow forcing continuous mode on or off. Annyang is pretty smart about this, so only set this if you know what you're doing.
//            * - `paused`       (boolean, default: true) Start annyang in paused mode.
//            *
//            * #### Examples:
//            * ````javascript
//            * // Start listening, don't restart automatically
//            * annyang.start({ autoRestart: false });
//            * // Start listening, don't restart automatically, stop recognition after first phrase recognized
//            * annyang.start({ autoRestart: false, continuous: false });
//            * ````
//            * @param {Object} [options] - Optional options.
//            * @method start
//            */
//        start: function start(options) {
//            initIfNeeded();
//            options = options || {};
//            if (options.paused !== undefined) {
//                pauseListening = !!options.paused;
//            } else {
//                pauseListening = false;
//            }
//            if (options.autoRestart !== undefined) {
//                autoRestart = !!options.autoRestart;
//            } else {
//                autoRestart = true;
//            }
//            if (options.continuous !== undefined) {
//                recognition.continuous = !!options.continuous;
//            }

//            lastStartedAt = new Date().getTime();
//            try {
//                recognition.start();
//            } catch (e) {
//                if (debugState) {
//                    logMessage(e.message);
//                }
//            }
//        },

//        /**
//            * Stop listening, and turn off mic.
//            *
//            * Alternatively, to only temporarily pause annyang responding to commands without stopping the SpeechRecognition engine or closing the mic, use pause() instead.
//            * @see [pause()](#pause)
//            *
//            * @method abort
//            */
//        abort: function abort() {
//            autoRestart = false;
//            autoRestartCount = 0;
//            if (isInitialized()) {
//                recognition.abort();
//            }
//        },

//        /**
//            * Pause listening. annyang will stop responding to commands (until the resume or start methods are called), without turning off the browser's SpeechRecognition engine or the mic.
//            *
//            * Alternatively, to stop the SpeechRecognition engine and close the mic, use abort() instead.
//            * @see [abort()](#abort)
//            *
//            * @method pause
//            */
//        pause: function pause() {
//            pauseListening = true;
//        },

//        /**
//            * Resumes listening and restores command callback execution when a result matches.
//            * If SpeechRecognition was aborted (stopped), start it.
//            *
//            * @method resume
//            */
//        resume: function resume() {
//            recogniseMe.start();
//        },

//        /**
//            * Turn on output of debug messages to the console. Ugly, but super-handy!
//            *
//            * @param {boolean} [newState=true] - Turn on/off debug messages
//            * @method debug
//            */
//        debug: function debug(debugState=true) {
//            debugState = debugState;
//        },

//        /**
//            * Set the language the user will speak in. If this method is not called, defaults to 'en-US'.
//            *
//            * @param {String} language - The language (locale)
//            * @method setLanguage
//            * @see [Languages](https://github.com/TalAter/annyang/blob/master/docs/FAQ.md#what-languages-are-supported)
//            */
//        setLanguage: function setLanguage(language) {
//            initIfNeeded();
//            recognition.lang = language;
//        },
//        setMaxAlternatives: function (maxAlternatives: number) {
//            initIfNeeded();
//            recognition.maxAlternatives = maxAlternatives;
//        },

//        /**
//            * Add commands that annyang will respond to. Similar in syntax to init(), but doesn't remove existing commands.
//            *
//            * #### Examples:
//            * ````javascript
//            * var commands = {'hello :name': helloFunction, 'howdy': helloFunction};
//            * var commands2 = {'hi': helloFunction};
//            *
//            * annyang.addCommands(commands);
//            * annyang.addCommands(commands2);
//            * // annyang will now listen to all three commands
//            * ````
//            *
//            * @param {Object} commands - Commands that annyang should listen to
//            * @method addCommands
//            * @see [Commands Object](#commands-object)
//            */
//        addCommands: function addCommands(commands) {
//            var cb;
//            initIfNeeded();
//            var cmds:Command[]
//            if (commands instanceof Array) {
//                cmds = commands;
//            } else {
//                cmds=[commands]
//            }
//            cmds.forEach(function (cmd) {
//                registerCommand(cmd);
//            })
//        },

//        /**
//            * Remove existing commands. Called with a single phrase, array of phrases, or methodically. Pass no params to remove all commands.
//            *
//            * #### Examples:
//            * ````javascript
//            * var commands = {'hello': helloFunction, 'howdy': helloFunction, 'hi': helloFunction};
//            *
//            * // Remove all existing commands
//            * annyang.removeCommands();
//            *
//            * // Add some commands
//            * annyang.addCommands(commands);
//            *
//            * // Don't respond to hello
//            * annyang.removeCommands('hello');
//            *
//            * // Don't respond to howdy or hi
//            * annyang.removeCommands(['howdy', 'hi']);
//            * ````
//            * @param {String|Array|Undefined} [commandsToRemove] - Commands to remove
//            * @method removeCommands
//            */
//        removeCommands: function removeCommands(commandsToRemove) {
//            if (commandsToRemove === undefined) {
//                commandsList = [];
//            } else {
//                var cmds: string[];
//                cmds = Array.isArray(commandsToRemove) ? commandsToRemove : [commandsToRemove];
//                commandsList = commandsList.filter(function (command) {
//                    for (var i = 0; i < cmds.length; i++) {
//                        if (commandsToRemove[i] === command.description) {
//                            return false;
//                        }
//                    }
//                    return true;
//                });
//            }
//        },

//        /**
//            * Add a callback function to be called in case one of the following events happens:
//            *
//            * * `start` - Fired as soon as the browser's Speech Recognition engine starts listening
//            * * `soundstart` - Fired as soon as any sound (possibly speech) has been detected.
//            *     This will fire once per Speech Recognition starting. See https://is.gd/annyang_sound_start
//            * * `error` - Fired when the browser's Speech Recogntion engine returns an error, this generic error callback will be followed by more accurate error callbacks (both will fire if both are defined)
//            *     Callback function will be called with the error event as the first argument
//            * * `errorNetwork` - Fired when Speech Recognition fails because of a network error
//            *     Callback function will be called with the error event as the first argument
//            * * `errorPermissionBlocked` - Fired when the browser blocks the permission request to use Speech Recognition.
//            *     Callback function will be called with the error event as the first argument
//            * * `errorPermissionDenied` - Fired when the user blocks the permission request to use Speech Recognition.
//            *     Callback function will be called with the error event as the first argument
//            * * `end` - Fired when the browser's Speech Recognition engine stops
//            * * `result` - Fired as soon as some speech was identified. This generic callback will be followed by either the `resultMatch` or `resultNoMatch` callbacks.
//            *     Callback functions for to this event will be called with an array of possible phrases the user said as the first argument
//            * * `resultMatch` - Fired when annyang was able to match between what the user said and a registered command
//            *     Callback functions for this event will be called with three arguments in the following order:
//            *       * The phrase the user said that matched a command
//            *       * The command that was matched
//            *       * An array of possible alternative phrases the user might have said
//            * * `resultNoMatch` - Fired when what the user said didn't match any of the registered commands.
//            *     Callback functions for this event will be called with an array of possible phrases the user might've said as the first argument
//            *
//            * #### Examples:
//            * ````javascript
//            * annyang.addCallback('error', function() {
//            *   $('.myErrorText').text('There was an error!');
//            * });
//            *
//            * annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
//            *   console.log(userSaid); // sample output: 'hello'
//            *   console.log(commandText); // sample output: 'hello (there)'
//            *   console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
//            * });
//            *
//            * // pass local context to a global function called notConnected
//            * annyang.addCallback('errorNetwork', notConnected, this);
//            * ````
//            * @param {String} type - Name of event that will trigger this callback
//            * @param {Function} callback - The function to call when event is triggered
//            * @param {Object} [context] - Optional context for the callback function
//            * @method addCallback
//            */
//        addCallback: function addCallback(type, callback, context) {
//            var cb: any;
//            if (callback instanceof String){
//                cb=window[callback] 
//            } else {
//                cb = callback;
//            }

//            if (typeof cb === 'function' && callbacks[type] !== undefined) {
//                callbacks[type].push({ callback: cb as CallbackUnknown, context: context || this });
//            }
//        },

//        /**
//            * Remove callbacks from events.
//            *
//            * - Pass an event name and a callback command to remove that callback command from that event type.
//            * - Pass just an event name to remove all callback commands from that event type.
//            * - Pass undefined as event name and a callback command to remove that callback command from all event types.
//            * - Pass no params to remove all callback commands from all event types.
//            *
//            * #### Examples:
//            * ````javascript
//            * annyang.addCallback('start', myFunction1);
//            * annyang.addCallback('start', myFunction2);
//            * annyang.addCallback('end', myFunction1);
//            * annyang.addCallback('end', myFunction2);
//            *
//            * // Remove all callbacks from all events:
//            * annyang.removeCallback();
//            *
//            * // Remove all callbacks attached to end event:
//            * annyang.removeCallback('end');
//            *
//            * // Remove myFunction2 from being called on start:
//            * annyang.removeCallback('start', myFunction2);
//            *
//            * // Remove myFunction1 from being called on all events:
//            * annyang.removeCallback(undefined, myFunction1);
//            * ````
//            *
//            * @param type Name of event type to remove callback from
//            * @param callback The callback function to remove
//            * @returns undefined
//            * @method removeCallback
//            */
//        removeCallback: function removeCallback(type, callback) {
//            var compareWithCallbackParameter = function compareWithCallbackParameter(cb) {
//                return cb.callback !== callback;
//            };
//            // Go over each callback type in callbacks store object
//            for (var callbackType in callbacks) {
//                if (callbacks.hasOwnProperty(callbackType)) {
//                    // if this is the type user asked to delete, or he asked to delete all, go ahead.
//                    if (type === undefined || type === callbackType) {
//                        // If user asked to delete all callbacks in this type or all types
//                        if (callback === undefined) {
//                            callbacks[callbackType] = [];
//                        } else {
//                            // Remove all matching callbacks
//                            callbacks[callbackType] = callbacks[callbackType].filter(compareWithCallbackParameter);
//                        }
//                    }
//                }
//            }
//        },

//        /**
//            * Returns true if speech recognition is currently on.
//            * Returns false if speech recognition is off or annyang is paused.
//            *
//            * @return boolean true = SpeechRecognition is on and annyang is listening
//            * @method isListening
//            */
//        isListening: function isListening() {
//            return _isListening && !pauseListening;
//        },

//        /**
//            * Returns the instance of the browser's SpeechRecognition object used by annyang.
//            * Useful in case you want direct access to the browser's Speech Recognition engine.
//            *
//            * @returns SpeechRecognition The browser's Speech Recognizer currently used by annyang
//            * @method getSpeechRecognizer
//            */
//        getSpeechRecognizer: function getSpeechRecognizer() {
//            return recognition;
//        },

//        /**
//            * Simulate speech being recognized. This will trigger the same events and behavior as when the Speech Recognition
//            * detects speech.
//            *
//            * Can accept either a string containing a single sentence, or an array containing multiple sentences to be checked
//            * in order until one of them matches a command (similar to the way Speech Recognition Alternatives are parsed)
//            *
//            * #### Examples:
//            * ````javascript
//            * annyang.trigger('Time for some thrilling heroics');
//            * annyang.trigger(
//            *     ['Time for some thrilling heroics', 'Time for some thrilling aerobics']
//            *   );
//            * ````
//            *
//            * @param string|array sentences A sentence as a string or an array of strings of possible sentences
//            * @returns undefined
//            * @method trigger
//            */
//        trigger: function trigger(sentences: string[], confidences: number[]) {
//            if (!recogniseMe.isListening()) {
//                if (debugState) {
//                    if (!_isListening) {
//                        logMessage('Cannot trigger while annyang is aborted');
//                    } else {
//                        logMessage('Speech heard, but annyang is paused');
//                    }
//                }
//                return;
//            }

//            if (!Array.isArray(sentences)) {
//                sentences = [sentences];
//            }
//            parseResults(sentences, confidences);
//        }
//    };
//} else {
//    console.log("No speech recognition")
//}

if (SpeechRecognition) {


    var commandStates:CommandState[]=[]

    var recognition: SpeechRecognition;
    var callbacks: Callbacks = { enteredState:[], start: [], error: [], end: [], soundstart: [], result: [], resultMatch: [], resultNoMatch: [], errorNetwork: [], errorPermissionBlocked: [], errorPermissionDenied: [], soundend: [], audiostart: [], audioend: [], speechstart: [], speechend: [], nomatch: [], originalResult: [] };
    var autoRestart;
    var lastStartedAt = 0;
    var autoRestartCount = 0;
    var debugState = false;
    var debugStyle = 'font-weight: bold; color: #00f;';
    var pauseListening = false;
    var _isListening = false;

    var extractFromSpeechRecognitionEvent = function (event: SpeechRecognitionEvent) {
        var SpeechRecognitionResult = event.results[event.resultIndex];
        var results:string[] = [];
        var confidences:number[] = [];
        for (var k = 0; k < SpeechRecognitionResult.length; k++) {
            results[k] = SpeechRecognitionResult[k].transcript;
            confidences[k] = SpeechRecognitionResult[k].confidence;
        }
        return {
            results: results,
            confidences:confidences
        }
    }

    // This method receives an array of callbacks to iterate over, and invokes each of them
    var invokeCallbacks = function invokeCallbacks(callbacks, ...args: any[]) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        callbacks.forEach(function (callback) {
            callback.callback.apply(callback.context, args);
        });
    };

    var isInitialized = function isInitialized() {
        return recognition !== undefined;
    };

    // method for logging in developer console when debug mode is on
    var logMessage = function logMessage(text, extraParameters?) {
        if (text.indexOf('%c') === -1 && !extraParameters) {
            console.log(text);
        } else {
            console.log(text, extraParameters || debugStyle);
        }
    };

    var initIfNeeded = function initIfNeeded() {
        if (!isInitialized()) {
            recogniseMe.init([], false);
        }
    };

    var defaultState: CommandState;

    var defaultDisabled = function defaultDisabled(testObj: CommandState | StateCommand) {
        testObj.disabled= testObj.disabled === undefined ? false : testObj.disabled;
    }
    var noopNull = function () { return null; }
    var setCommandStateDefaults = function (commandState: CommandState) {
        commandState.isDefault = commandState.isDefault === undefined ? false : commandState.isDefault;
        commandState.enter = commandState.enter === undefined ? noopNull : commandState.enter;
        commandState.exit = commandState.exit === undefined ? noopNull : commandState.exit;
        commandState.stateTimeout = commandState.stateTimeout === undefined ? 0 : commandState.stateTimeout;
        var catchCommand = commandState.catchCommand
        if (catchCommand) {
            setCommandDefaults(catchCommand, commandState);
            catchCommand.canInterrupt = false;
        }
        defaultDisabled(commandState)
        commandState.canInterrupt = commandState.canInterrupt === undefined ? (commandState.isDefault ? false : true) : commandState.canInterrupt;
        commandState.noMatch = commandState.noMatch === undefined ? noopNull : commandState.noMatch;
        commandState.commands.forEach(function (command) {
            setCommandDefaults(command,commandState);
        })
    }
    var setCommandDefaults = function setCommandDefaults(command: StateCommand,commandState:CommandState) {
        defaultDisabled(command);
        command.minConfidence = command.minConfidence === undefined ? 0 : command.minConfidence;
        command.maxAlternatives = command.maxAlternatives === undefined ? 0 : command.maxAlternatives;
        command.canInterrupt = command.canInterrupt === undefined ? (commandState.isDefault ? true : false) : command.canInterrupt;
        command.nextState = command.nextState === undefined ? commandState.name : command.nextState;
        command.keepState = command.keepState === undefined ? false : command.keepState
    }
    var commandStateByName = function commandStateByName(stateName: string):CommandState {
        var state: CommandState;
        for (var i = 0; i < commandStates.length; i++) {
            var commandState = commandStates[i];
            if (commandState.name === stateName) {
                state = commandState;
                break;
            }
        }
        return state;
    }
    var getDefaultCommandCallbackResponse = function getDefaultCommandCallbackResponse(response: CommandCallbackResponse) {
        if (!response) {
            response = {}
        }
        response.matches = response.matches === undefined ? true : response.matches;
        response.allowFurther = response.allowFurther === undefined ? false : response.allowFurther;
        return response;
    }

    var executeCommand = function executeCommand(currentCommand: StateCommand, commandText: string, confidences: number[], results: string[], resultIndex: number) {
        var executeFurther = true;
        var matched = false;
        var confidence = confidences[resultIndex];
        var ignoreResult = currentCommand.maxAlternatives !== 0 && currentCommand.maxAlternatives < resultIndex;
        if (!ignoreResult) {
            var minConfidence = currentCommand.minConfidence;
            if (minConfidence === 0 || minConfidence > confidence) {
                var result = currentCommand.regExp.exec(commandText);
                if (result) {
                    var parameters = result.slice(1);
                    if (debugState) {
                        logMessage('command matched: %c' + currentCommand.name, debugStyle);
                        if (parameters.length) {
                            logMessage('with parameters', parameters);
                        }
                    }

                    var cbResponse = getDefaultCommandCallbackResponse(currentCommand.callback({
                        command: currentCommand,
                        confidence: confidence,
                        parameters: parameters,
                        results: results,
                        confidences: confidences,
                        stateContext: recogniseMe.currentStateContext
                    }));
                    
                    //confirmation to do - will need a confirmation state with all information for proceeding
                    
                    if (cbResponse.matches) {
                        matched = true;
                        doSoundResponse(cbResponse);

                        invokeCallbacks(callbacks.resultMatch, commandText, currentCommand.name, results, confidences);

                        var nextStateContext = cbResponse.nextStateContext;
                        if (currentCommand.keepState || currentCommand.nextState === recogniseMe.currentState.name) {
                            if (nextStateContext) {
                                enterState(recogniseMe.currentState, nextStateContext);
                            } else {
                                clearStateTimeout();
                            }
                        } else {
                            enterAndExitState(commandStateByName(currentCommand.nextState), nextStateContext)
                        }
                        executeFurther = cbResponse.allowFurther;
                    }
                }
            }
        }
        return {
            executeFurther: executeFurther,
            matched: matched
        }
    }
    
    var parseResults = function parseResults(results: string[], confidences: number[]) {
        function commandTransitionsToActiveState(command: StateCommand) {
            return (command.keepState && !recogniseMe.currentState.disabled) ||!commandStateByName(command.nextState).disabled;
        }
        invokeCallbacks(callbacks.result, results, confidences);

        var commandMatched = false;

        var currentState = recogniseMe.currentState;
        if (currentState) {
            var interruptCommands: StateCommand[] = []
            //will want to improve the processing instead of doing this on each recognition

            if (currentState.canInterrupt) {
                commandStates.forEach(function (commandState) {
                    if (!commandState.disabled && commandState !== currentState) {
                        commandState.commands.forEach(function (command) {
                            if (!command.disabled && command.canInterrupt && commandTransitionsToActiveState(command)) {
                                interruptCommands.push(command);
                            }
                        })
                    }
                })
            }
            var currentStateCommands: StateCommand[] = [];
            if (!currentState.disabled) {
                currentStateCommands = currentState.commands.filter(function (cmd) {
                    return !cmd.disabled && commandTransitionsToActiveState(cmd)
                });
            }

            var commands = interruptCommands.concat(currentStateCommands)
            var commandText;
            
            for (var i = 0; i < results.length; i++) {
                commandText=results[i] = results[i].trim();
                if (debugState) {
                    logMessage('Speech recognized: %c' + commandText, debugStyle);
                }
                
                for (var j = 0, l = commands.length; j < l; j++) {
                    var executionDetails = executeCommand(commands[j], commandText, confidences, results, i);
                    if (!commandMatched) {
                        commandMatched = executionDetails.matched;
                    }
                    if (!executionDetails.executeFurther) {
                        return;
                    }
                }
                
            }
            
            if (currentState.catchCommand) {
                for (var i = 0; i < results.length; i++) {
                    commandText = results[i];
                    var executionDetails = executeCommand(currentState.catchCommand, commandText, confidences, results, i);
                    if (!commandMatched) {
                        commandMatched = executionDetails.matched;
                    }
                    if (!executionDetails.executeFurther) {
                        break;
                    }
                }
            }
            if (!commandMatched) {
                var soundResponse = currentState.noMatch(results, confidences);
                soundResponse = soundResponse ? soundResponse : recogniseMe.allStatesNoMatchSoundResponse;
                doSoundResponse(soundResponse);
            }
           
        }
        if (!commandMatched) {
            invokeCallbacks(callbacks.resultNoMatch, results, confidences);
        }
    };

    var doSoundResponse = function (response: SoundResponse) {
        if (response) {
            if (response.sound) {
                playSound(response.sound, response.canInterrupt);
            }
            if (response.synthesisMessage) {
                speak(response.synthesisMessage, response.canInterrupt);
            }
        }
        
    }
    var playingAudio: boolean = false;
    var audioQueue: HTMLAudioElement[] = [];
    var currentAudio: HTMLAudioElement;
    var audioTimeoutId;
    var audioFinished = true;
    var playSound = function (audioSource: string, canInterrupt: boolean) {
        function endOfAudio() {
            currentAudio = null;
            audioFinished = true;
            
            console.log("end of audio");
            console.log("audio queue length: " + audioQueue.length)
            audioTimeoutId=window.setTimeout(() => {
                console.log("in audio timeout");
                canInterruptAudio = false;
                playingAudio = false;
                
            }, 1000);
            if (audioQueue.length > 0) {
                playAudio();
            } 
        }
        function addToQueue(audioSource: string) {
            console.log("adding to queue: " + audioSource);
            var audio = new Audio(audioSource);
            audioQueue.push(audio);
            audio.onplaying = function (evt) {
                console.log("Playing audio ");
                if (audioTimeoutId) {
                    window.clearTimeout(audioTimeoutId);
                    audioTimeoutId = null;
                }

                playingAudio = true;
                canInterruptAudio = canInterrupt;
                currentAudio = audio;
            }

            audio.onpause = endOfAudio;
        }
        function playAudio() {
            if (audioFinished) {
                var audio = audioQueue[0];
                console.log("playing audio: " + audio.src);
                audioQueue = audioQueue.slice(1);
                audioFinished = false;
                audio.play();
            }
            
        }
        addToQueue(audioSource);
        playAudio();
        
        
    }
    var synthesisIsSpeaking = false;
    var canInterruptSynthesis = false;
    var canInterruptAudio = false;
    //may change to always never recognise and have a boolean of interrupt from the command
    var utterances: SpeechSynthesisUtterance[] = [];
    var synthesisTimeoutId;
    var speak = function (speech: string,canInterrupt:boolean) {
        
        var utterance = new SpeechSynthesisUtterance(speech);
        utterances.push(utterance);
        
        utterance.onstart = function () {
            if (synthesisTimeoutId) {
                window.clearTimeout(synthesisTimeoutId);
                synthesisTimeoutId = null;
            }
            canInterruptSynthesis = canInterrupt;
            synthesisIsSpeaking = true;
        }

        utterance.onend = function () {
            var index = utterances.indexOf(utterance);
            if (index > -1) {
                utterances.splice(index, 1);
            }
            console.log("onend");
            
            synthesisTimeoutId=window.setTimeout(() => {
                console.log("synthesis timeout");
                synthesisIsSpeaking = false;
                canInterruptSynthesis = false;
                
            }, 1000);
            
        }
        speechSynthesis.speak(utterance);
    }
    var stateTimeoutIdentifier: number

    var clearStateTimeout = function clearStateTimeout() {
        //can you just clear with a bad interval or undefined/null ? n- have a clear method
        if (stateTimeoutIdentifier) {
            clearTimeout(stateTimeoutIdentifier);
            stateTimeoutIdentifier = null;
        }
    }
    
    var enterAndExitState = function (newState, newStateContext: any) {
        exitState();
        enterState(newState, newStateContext);
    }
    //event ?
    var exitState = function () {
        if (recogniseMe.currentState) {
            clearStateTimeout();
            doSoundResponse(recogniseMe.currentState.exit());
            recogniseMe.currentState = null;
            recogniseMe.currentStateContext = null;
        }
    }
    //lp - could call enterState() and default to the default state
    var enterState = function (state: CommandState, context: any) {
        recogniseMe.currentState = state;//will probably want currentState and currentStateContext vars outside******************
        recogniseMe.currentStateContext = context;
        doSoundResponse(state.enter(context));
        invokeCallbacks(callbacks.enteredState,state.name,context)
        if (!state.isDefault) {
            if (state.stateTimeout) {
                //having to type this due to some strange @type/node behaviour that reappears even after deleting
                stateTimeoutIdentifier = setTimeout(function () {//******************** could have a previous state......
                    enterAndExitState(defaultState, {});
                }, state.stateTimeout) as any;
            }
        }
    }

    var listeningForStartStop: boolean = false;
    var startPhrase: RegExp
    var startSound: SoundResponse
    var stopPhrase: RegExp
    var stopSound: SoundResponse
    var skipSpeakingCommand: RegExp
    recogniseMe = {
        
        setSkipSpeakingCommand: function (skipCommand: string) {
            skipSpeakingCommand = new RegExp(skipCommand,"i");
        },

        allStatesNoMatchSoundResponse:null,
        currentState: null,
        currentStateContext: null,
        setState: function setState(name: string, context: any) {
            var state = commandStateByName(name);
            enterAndExitState(state, context);
        },
        /**
            * Initialize annyang with a list of commands to recognize.
            *
            * #### Examples:
            * ````javascript
            * var commands = {'hello :name': helloFunction};
            * var commands2 = {'hi': helloFunction};
            *
            * // initialize annyang, overwriting any previously added commands
            * annyang.init(commands, true);
            * // adds an additional command without removing the previous commands
            * annyang.init(commands2, false);
            * ````
            * As of v1.1.0 it is no longer required to call init(). Just start() listening whenever you want, and addCommands() whenever, and as often as you like.
            *
            * @param {Object} commands - Commands that annyang should listen to
            * @param {boolean} [resetCommands=true] - Remove all commands before initializing?
            * @method init
            * @deprecated
            * @see [Commands Object](#commands-object)
            */
        //need to type commands 
        init: function init(commandStates, resetStates = true) {
            

            // Abort previous instances of recognition already running
            if (recognition && recognition.abort) {
                recognition.abort();
            }

            // initiate SpeechRecognition
            recognition = new SpeechRecognition();

            // Set the max number of alternative transcripts to try and match with a command
            recognition.maxAlternatives = 20;

            // In HTTPS, turn off continuous mode for faster results.
            // In HTTP,  turn on  continuous mode for much slower results, but no repeating security notices
            recognition.continuous = window.location.protocol === 'http:';

            // Sets the language to the default 'en-US'. This can be changed with annyang.setLanguage()
            recognition.lang = 'en-US';

            recognition.onstart = function () {
                _isListening = true;
                invokeCallbacks(callbacks.start);
            };

            recognition.onsoundstart = function () {
                invokeCallbacks(callbacks.soundstart);
            };
            recognition.onsoundend = function () {
                invokeCallbacks(callbacks.soundend);
            }
            recognition.onaudiostart = function () {
                invokeCallbacks(callbacks.audiostart);
            }
            recognition.onaudioend = function () {
                invokeCallbacks(callbacks.audioend);
            }
            recognition.onspeechstart = function () {
                invokeCallbacks(callbacks.speechstart);
            }
            recognition.onspeechend = function () {
                invokeCallbacks(callbacks.speechend);
            }
            //should this be optional for this 'type' of no match ????
            recognition.onnomatch = function (event) {
                var currentState = recogniseMe.currentState;
                if (currentState && currentState.noMatch) {
                    var response = currentState.noMatch([], []);
                    doSoundResponse(response);
                }
                invokeCallbacks(callbacks.nomatch, event);
            }



            recognition.onerror = function (event) {
                invokeCallbacks(callbacks.error, event);
                switch (event.error) {
                    case 'network':
                        invokeCallbacks(callbacks.errorNetwork, event);
                        break;
                    case 'not-allowed':
                    case 'service-not-allowed':
                        // if permission to use the mic is denied, turn off auto-restart
                        autoRestart = false;
                        // determine if permission was denied by user or automatically.
                        if (new Date().getTime() - lastStartedAt < 200) {
                            invokeCallbacks(callbacks.errorPermissionBlocked, event);
                        } else {
                            invokeCallbacks(callbacks.errorPermissionDenied, event);
                        }
                        break;
                }
            };

            recognition.onend = function () {
                _isListening = false;
                invokeCallbacks(callbacks.end);
                // annyang will auto restart if it is closed automatically and not by user action.
                if (autoRestart) {
                    // play nicely with the browser, and never restart annyang automatically more than once per second
                    var timeSinceLastStart = new Date().getTime() - lastStartedAt;
                    autoRestartCount += 1;
                    if (autoRestartCount % 10 === 0) {
                        if (debugState) {
                            logMessage('Speech Recognition is repeatedly stopping and starting. See http://is.gd/annyang_restarts for tips.');
                        }
                    }
                    if (timeSinceLastStart < 1000) {
                        setTimeout(function () {
                            recogniseMe.start({ paused: pauseListening });
                        }, 1000 - timeSinceLastStart);
                    } else {
                        recogniseMe.start({ paused: pauseListening });
                    }
                }
            };

            recognition.onresult = function (event) {
                invokeCallbacks(callbacks.originalResult, event);

                var resultsAndConfidences: { results: string[], confidences: number[] } = extractFromSpeechRecognitionEvent(event);
                var results = resultsAndConfidences.results;
                
                if (canInterruptSynthesis||canInterruptAudio) {
                    if (skipSpeakingCommand) {
                        
                        var skipSpeaking = false;
                        for (var i = 0; i < results.length; i++) {
                            var result = results[i];
                            if (skipSpeakingCommand.exec(result)) {
                                skipSpeaking = true;
                                break;
                            }
                        }
                        if (skipSpeaking) {
                            if (canInterruptSynthesis) {
                                speechSynthesis.cancel();
                            } else {
                                if (currentAudio) {
                                    currentAudio.pause();
                                }
                            }
                           
                        }
                    }
                    return;
                }
                
                if (listeningForStartStop) {
                    var phrase = stopPhrase;
                    var action = recogniseMe.pause;
                    var sound = stopSound;
                    if (pauseListening) {
                        phrase = startPhrase
                        action = recogniseMe.resume;
                        sound = startSound;
                    }

                    var results = resultsAndConfidences.results;
                    var match = false;
                    for (var i = 0; i < results.length; i++) {
                        if (phrase.exec(results[i])) {
                            match = true;
                            break;
                        }
                    }
                    if (match) {
                        action();
                        doSoundResponse(sound);
                        return false;
                    }
                }
                if (pauseListening || playingAudio || synthesisIsSpeaking) {
                    if (debugState) {
                        logMessage('Speech heard, but annyang is paused or not listening as audio is being played or synthesis is speaking');
                    }
                    return false;
                }
                
                console.log("about to parse results");
                for (var i = 0; i < results.length; i++) {
                    console.log(results[i]);
                }
                parseResults(resultsAndConfidences.results, resultsAndConfidences.confidences);
                
            };

            if (resetStates) {
                commandStates = [];
            }

            if (commandStates) {
                recogniseMe.addStates(commandStates);
            }

        },

        /**
            * Start listening.
            * It's a good idea to call this after adding some commands first, but not mandatory.
            *
            * Receives an optional options object which supports the following options:
            *
            * - `autoRestart`  (boolean, default: true) Should annyang restart itself if it is closed indirectly, because of silence or window conflicts?
            * - `continuous`   (boolean) Allow forcing continuous mode on or off. Annyang is pretty smart about this, so only set this if you know what you're doing.
            * - `paused`       (boolean, default: true) Start annyang in paused mode.
            *
            * #### Examples:
            * ````javascript
            * // Start listening, don't restart automatically
            * annyang.start({ autoRestart: false });
            * // Start listening, don't restart automatically, stop recognition after first phrase recognized
            * annyang.start({ autoRestart: false, continuous: false });
            * ````
            * @param {Object} [options] - Optional options.
            * @method start
            */
        start: function start(options) {
            initIfNeeded();
            
            options = options || {};
            



            if (options.paused !== undefined) {
                pauseListening = !!options.paused;
            } else {
                pauseListening = false;
            }
            if (options.autoRestart !== undefined) {
                autoRestart = !!options.autoRestart;
            } else {
                autoRestart = true;
            }
            if (options.continuous !== undefined) {
                recognition.continuous = !!options.continuous;
            }

            lastStartedAt = new Date().getTime();
            try {
                recognition.start();
            } catch (e) {
                if (debugState) {
                    logMessage(e.message);
                }
            }
        },

        /**
            * Stop listening, and turn off mic.
            *
            * Alternatively, to only temporarily pause annyang responding to commands without stopping the SpeechRecognition engine or closing the mic, use pause() instead.
            * @see [pause()](#pause)
            *
            * @method abort
            */
        abort: function abort() {
            autoRestart = false;
            autoRestartCount = 0;
            if (isInitialized()) {
                recognition.abort();
            }
        },

        /**
            * Pause listening. annyang will stop responding to commands (until the resume or start methods are called), without turning off the browser's SpeechRecognition engine or the mic.
            *
            * Alternatively, to stop the SpeechRecognition engine and close the mic, use abort() instead.
            * @see [abort()](#abort)
            *
            * @method pause
            */
        pause: function pause() {
            pauseListening = true;
        },

        /**
            * Resumes listening and restores command callback execution when a result matches.
            * If SpeechRecognition was aborted (stopped), start it.
            *
            * @method resume
            */
        resume: function resume() {
            recogniseMe.start();
        },

        /**
            * Turn on output of debug messages to the console. Ugly, but super-handy!
            *
            * @param {boolean} [newState=true] - Turn on/off debug messages
            * @method debug
            */
        debug: function debug(debugState = true) {
            debugState = debugState;
        },

        /**
            * Set the language the user will speak in. If this method is not called, defaults to 'en-US'.
            *
            * @param {String} language - The language (locale)
            * @method setLanguage
            * @see [Languages](https://github.com/TalAter/annyang/blob/master/docs/FAQ.md#what-languages-are-supported)
            */
        setLanguage: function setLanguage(language) {
            initIfNeeded();
            recognition.lang = language;
        },
        setMaxAlternatives: function (maxAlternatives: number) {
            initIfNeeded();
            recognition.maxAlternatives = maxAlternatives;
        },
        /*
        

        */
        setStartStopCommands: function (startStopCommands) {
            startPhrase = null;
            stopPhrase = null;
            startSound = null;
            stopSound = null;
            listeningForStartStop = false;
            if (startStopCommands.defaultStartStopPhrases) {
                startPhrase = /^Start$/i
                stopPhrase = /^Stop$/i

                if (startStopCommands.defaultStartStopSynthesis) {
                    startSound = { synthesisMessage: "Resumed listening" };
                    stopSound = { synthesisMessage: "Stopped listening" }
                }
            } else {
                if (startStopCommands.startPhrase && startStopCommands.stopPhrase) {
                    startPhrase = startStopCommands.startPhrase;
                    stopPhrase = startStopCommands.stopPhrase;
                    startSound = startStopCommands.startSound;
                    stopSound = startStopCommands.stopSound;
                }
            }
            if (startPhrase && stopPhrase) {
                listeningForStartStop = true;
            }
            
        },
        

        addStates: function addStates(cmdStates: CommandState[]) {
            initIfNeeded();
            
            cmdStates.forEach(function (commandState) {
                setCommandStateDefaults(commandState)
                commandStates.push(commandState);
                if (commandState.isDefault) {
                    defaultState = commandState;
                }

                if (debugState) {
                    logMessage('CommandState successfully loaded: %c' + commandState.name, debugStyle);
                }
            })
            if (defaultState && !recogniseMe.currentState) {
                enterState(defaultState, { });
            }
        },
        removeStates: function removeStates(statesToRemove) {
            if (statesToRemove === undefined) {
                commandStates = [];
                exitState();
            } else {
                var exitCurrentState = false;
                var stateNames = Array.isArray(statesToRemove) ? statesToRemove : [statesToRemove];

                commandStates = commandStates.filter(function (state) {
                    for (var i = 0; i < stateNames.length; i++) {
                        if (stateNames[i] === state.name) {
                            if (state.name === recogniseMe.currentState.name) {
                                exitCurrentState = true;
                            }
                            return false;
                        }
                    }
                    return true;
                });
                if (exitCurrentState) {
                    exitState();
                    if (defaultState) {
                        enterState(defaultState, { });
                    }
                }
            }
        },

        addCallback: function addCallback(type, callback, context) {
            var cb: any;
            if (callback instanceof String) {
                cb = window[callback]
            } else {
                cb = callback;
            }

            if (typeof cb === 'function' && callbacks[type] !== undefined) {
                callbacks[type].push({ callback: cb as CallbackUnknown, context: context || this });
            }
        },

        /**
            * Remove callbacks from events.
            *
            * - Pass an event name and a callback command to remove that callback command from that event type.
            * - Pass just an event name to remove all callback commands from that event type.
            * - Pass undefined as event name and a callback command to remove that callback command from all event types.
            * - Pass no params to remove all callback commands from all event types.
            *
            * #### Examples:
            * ````javascript
            * annyang.addCallback('start', myFunction1);
            * annyang.addCallback('start', myFunction2);
            * annyang.addCallback('end', myFunction1);
            * annyang.addCallback('end', myFunction2);
            *
            * // Remove all callbacks from all events:
            * annyang.removeCallback();
            *
            * // Remove all callbacks attached to end event:
            * annyang.removeCallback('end');
            *
            * // Remove myFunction2 from being called on start:
            * annyang.removeCallback('start', myFunction2);
            *
            * // Remove myFunction1 from being called on all events:
            * annyang.removeCallback(undefined, myFunction1);
            * ````
            *
            * @param type Name of event type to remove callback from
            * @param callback The callback function to remove
            * @returns undefined
            * @method removeCallback
            */
        removeCallback: function removeCallback(type, callback) {
            var compareWithCallbackParameter = function compareWithCallbackParameter(cb) {
                return cb.callback !== callback;
            };
            // Go over each callback type in callbacks store object
            for (var callbackType in callbacks) {
                if (callbacks.hasOwnProperty(callbackType)) {
                    // if this is the type user asked to delete, or he asked to delete all, go ahead.
                    if (type === undefined || type === callbackType) {
                        // If user asked to delete all callbacks in this type or all types
                        if (callback === undefined) {
                            callbacks[callbackType] = [];
                        } else {
                            // Remove all matching callbacks
                            callbacks[callbackType] = callbacks[callbackType].filter(compareWithCallbackParameter);
                        }
                    }
                }
            }
        },

        /**
            * Returns true if speech recognition is currently on.
            * Returns false if speech recognition is off or annyang is paused.
            *
            * @return boolean true = SpeechRecognition is on and annyang is listening
            * @method isListening
            */
        isListening: function isListening() {
            return _isListening && !pauseListening;
        },

        /**
            * Returns the instance of the browser's SpeechRecognition object used by annyang.
            * Useful in case you want direct access to the browser's Speech Recognition engine.
            *
            * @returns SpeechRecognition The browser's Speech Recognizer currently used by annyang
            * @method getSpeechRecognizer
            */
        getSpeechRecognizer: function getSpeechRecognizer() {
            return recognition;
        },

        /**
            * Simulate speech being recognized. This will trigger the same events and behavior as when the Speech Recognition
            * detects speech.
            *
            * Can accept either a string containing a single sentence, or an array containing multiple sentences to be checked
            * in order until one of them matches a command (similar to the way Speech Recognition Alternatives are parsed)
            *
            * #### Examples:
            * ````javascript
            * annyang.trigger('Time for some thrilling heroics');
            * annyang.trigger(
            *     ['Time for some thrilling heroics', 'Time for some thrilling aerobics']
            *   );
            * ````
            *
            * @param string|array sentences A sentence as a string or an array of strings of possible sentences
            * @returns undefined
            * @method trigger
            */
        trigger: function trigger(sentences: string[], confidences: number[]) {
            if (!recogniseMe.isListening()) {
                if (debugState) {
                    if (!_isListening) {
                        logMessage('Cannot trigger while annyang is aborted');
                    } else {
                        logMessage('Speech heard, but annyang is paused');
                    }
                }
                return;
            }

            if (!Array.isArray(sentences)) {
                sentences = [sentences];
            }
            parseResults(sentences, confidences);
        }
    };
} else {
    console.log("No speech recognition")
}
