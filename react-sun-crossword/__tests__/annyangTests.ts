/////<reference types="jest"/>

//declare var window: any;
//window.SpeechRecognition = class MockSpeechRecognition {
//    start() {
//        this.onstart();
//    }
//    onstart:()=>void

//}
//import annyang = require("../src/helpers/annyang")
//import { pit, pits, xpit, xbeforeAll } from '../node_modules/jestextensions/index'


//describe('matching', () => {
//    describe('clock', () => {
//        //multiple word matching no variable - could do ( stop|start ) the clock - or have a clock state
//        pit("stop", "stop the clock", "stop the clock", true);
//        pit("start", "start the clock", "start the clock",true);
//        pit("no match", "start the clock","tick the tock", false);
        
//        pits((key: string,trigger:string, shouldMatch: boolean) => {
//            var cb = jest.fn();
//            var commands = {};
//            commands[key] = cb;
//            annyang.init(commands);
//            annyang.start();
//            annyang.trigger(trigger);
//            if (shouldMatch) {
//                expect(cb).toHaveBeenCalled();
//            } else {
//                expect(cb).not.toHaveBeenCalled();
//            }
            
//        });
//    })
//    describe('navigation', () => {
//        //single word matching - no variable
//        describe('next/previous', () => {
//            it('should match next', () => {
//                var cb = jest.fn();
//                annyang.init({
//                    "next":cb
//                });
//                annyang.start();
//                annyang.trigger("next");

//                expect(cb).toHaveBeenCalledWith();
//            })
//            it('should match previous', () => {
//                var cb = jest.fn();
//                annyang.init({
//                    "previous": cb
//                });
//                annyang.start();
//                annyang.trigger("previous");

//                expect(cb).toHaveBeenCalledWith();
//            })
//            it('should not match previous widget', () => {
//                var cb = jest.fn();
//                annyang.init({
//                    "previous": cb
//                });
//                annyang.start();
//                annyang.trigger("previous widget");

//                expect(cb).not.toHaveBeenCalled();
//            })
//        })
//        describe('Navigate', () => {
//            //single alternative -**************************** left/right/up/down better ( perhaps with initial state navigate )
//            describe("alternative matching", () => {
//                pit("left", "left", true);
//                pit("right", "right", true);
//                pit("up", "up", true);
//                pit("down", "down", true);
//                pit("no match", false)
//                pits((direction: string, shouldMatch: boolean) => {
//                    var cb = jest.fn();
//                    var key, trigger = "navigate " + direction;
//                    annyang.init({
//                        key: {
//                            regexp: /^navigate (left|right|up|down)$/,
//                            callback: cb
//                        }
//                    });
//                    annyang.start();
//                    annyang.trigger(trigger);

//                    if (shouldMatch) {
//                        expect(cb).toHaveBeenCalledWith(direction);
//                    } else {
//                        expect(cb).not.toHaveBeenCalled();
//                    }
//                });
//            })
//        });
//        //multiple alternatives
//        describe("go to beginning of word", () => {
//            pit("1 Down", "one", true,true);
//            pit("2 Across", "two", false,true);
//            pit("No match", "hell", true,false);
            
//            pits((number: string,down:boolean, shouldMatch: boolean) => {
//                var cb = jest.fn();
//                var downOrAcrossWord = down ? "down" : "across";
//                var trigger = "go to " + number + " " + downOrAcrossWord;
//                annyang.init({
//                    "goto": {
//                        regexp: /^go to (one|two|three|four|five|six|seven) (down|across)$/,
//                        callback: cb
//                    }
//                });
//                annyang.start();
//                annyang.trigger(trigger);

//                if (shouldMatch) {
//                    expect(cb).toHaveBeenCalledWith(number, downOrAcrossWord);
//                } else {
//                    expect(cb).not.toHaveBeenCalled();
//                }
//            });
//        })

//    });
//    describe('guessing', () => {

//    })
//    describe("synthesis commands", () => {
//        //optional aternative - ***************************need to test the cb args
//        pit("Cryptic", "cryptic","cryptic");
//        pit("Coffee time", "coffee time","coffee time");
//        pit("None", "");
//        pits((clueVar:string,expectedArg:any ) => {
//            var cb = jest.fn();
//            annyang.init({
//                key: {
//                    regexp: /^Give me an unattempted (cryptic|coffee time)? clue$/,
//                    callback: cb
//                }
//            });
//            annyang.start();
//            annyang.trigger("Give me an unattempted " + clueVar + " clue");

//            expect(cb).toHaveBeenCalled();
//            expect(cb.mock.calls[0].length).toBe(1);
//            expect(cb.mock.calls[0][0]).toBe(expectedArg);
//        });
//    });
//});