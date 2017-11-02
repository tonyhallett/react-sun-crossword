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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var index_1 = require("../models/index");
var crosswordPuzzle_1 = require("./crosswordPuzzle");
var twoCol_1 = require("./twoCol");
var firebaseApp_1 = require("../helpers/firebaseApp");
var connectedDatabase_1 = require("../helpers/connectedDatabase");
require("firebase/database");
var crosswordPuzzleChooser_1 = require("./crosswordPuzzleChooser");
var muiWrappedButton_1 = require("./muiWrappedButton");
var stopwatchController_1 = require("./stopwatchController");
var CrosswordPuzzleApp = (function (_super) {
    __extends(CrosswordPuzzleApp, _super);
    function CrosswordPuzzleApp(props) {
        var _this = _super.call(this, props) || this;
        _this.crosswordSelected = function (selectedCrossword) {
            var crosswordModel = index_1.ConvertCrosswordJsonToModel(selectedCrossword);
            if (!crosswordModel.dateStarted) {
                crosswordModel.dateStarted = new Date();
            }
            _this.setState({ crosswordModel: crosswordModel, crosswordModelDuration: crosswordModel.duration });
        };
        _this.saveUserCrossword = function () {
            var modelJson = index_1.ConvertCrosswordModelToJson(_this.state.crosswordModel);
            modelJson.duration = _this.stopwatchController.getDuration().totalMilliseconds;
            connectedDatabase_1.connectedDatabase.saveUserCrossword(_this.state.userLoggedIn, modelJson.id, modelJson, { id: modelJson.id, dateStarted: modelJson.dateStarted, duration: modelJson.duration, datePublished: modelJson.datePublished, title: modelJson.title }).then(function (userSaveDetails) {
                //will now know not dirty
            }).catch(function (err) {
                //should be firebase error
                //logic to be done later
            });
        };
        _this.pauseAnimations = function (pauseAnimationsContainer) {
            var descendants = pauseAnimationsContainer.querySelectorAll("*");
            for (var i = 0; i < descendants.length; i++) {
                var descendant = descendants[i];
                var style = window.getComputedStyle(descendant);
                if (style.animation) {
                    descendant.style.webkitAnimationPlayState = 'paused';
                }
            }
        };
        _this.resumeAnimations = function (pauseAnimationsContainer) {
            var descendants = pauseAnimationsContainer.querySelectorAll("*");
            for (var i = 0; i < descendants.length; i++) {
                var descendant = descendants[i];
                var style = window.getComputedStyle(descendant);
                if (style.animation) {
                    descendant.style.webkitAnimationPlayState = 'running';
                }
            }
        };
        _this.state = { crosswordModel: null, userLoggedIn: null, crosswordModelDuration: 0 };
        return _this;
    }
    CrosswordPuzzleApp.prototype.componentDidMount = function () {
        firebaseApp_1.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
    };
    CrosswordPuzzleApp.prototype.onAuthStateChanged = function (user) {
        var loggedIn = user !== null;
        if (loggedIn) {
            this.setState({ userLoggedIn: user.uid });
        }
        else {
            this.setState({ userLoggedIn: null });
        }
    };
    CrosswordPuzzleApp.prototype.render = function () {
        var primaryColour = "gold";
        var buttonStyle = {
            backgroundColor: primaryColour,
            color: "#2F4F4F"
        };
        var buttonProps = {
            buttonStyle: buttonStyle,
            disabledBackgroundColor: "#f9f9f9",
            disabledColor: "#2F4F4F",
            lightenPercentage: 0.1
        };
        var selectChooserProps = {
            ButtonType: muiWrappedButton_1.MuiButtonWrapper,
            buttonProps: buttonProps
        };
        //explicit height allows room for the Select 
        var leftContent = React.createElement("div", { style: { minHeight: "1000px" } },
            React.createElement(crosswordPuzzleChooser_1.CrosswordPuzzleChooser, { emailLogOnStyleProps: { signInButtonProps: buttonProps, dividerColor: primaryColour }, selectChooserProps: selectChooserProps, userLoggedIn: this.state.userLoggedIn, crosswordSelected: this.crosswordSelected }),
            this.state.crosswordModel &&
                React.createElement(stopwatchController_1.FlipClock24, { shouldUpdateSameDuration: true, startDuration: this.state.crosswordModelDuration }),
            React.createElement(muiWrappedButton_1.MuiButtonWrapper, __assign({ disabled: !this.state.userLoggedIn || this.state.crosswordModel === null, text: "Click to save", onClick: this.saveUserCrossword }, buttonProps)));
        var rightContent = React.createElement(crosswordPuzzle_1.CrosswordPuzzleKeyEvents, { crosswordModel: this.state.crosswordModel });
        if (this.state.crosswordModel === null) {
            rightContent = React.createElement("div", null);
        }
        /*
        //{this.state.crosswordModel &&
            //    <StopwatchController ref={(sw) => { this.stopwatchController = sw }} reportTickInterval={ReportTickInterval.tenthSecond} startDuration={this.state.crosswordModel.duration}>
            //        <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds"  />
            //    </StopwatchController>
            //}
            //<MuiButtonWrapper disabled={!this.state.userLoggedIn || this.state.crosswordModel === null} text="Click to save" onClick={this.saveUserCrossword}   {...buttonProps}></MuiButtonWrapper>
        */
        console.log("App render");
        return React.createElement("div", null,
            React.createElement(twoCol_1.TwoCol, { leftContent: leftContent, rightContent: rightContent }));
        //<button onClick={}>Pause</button>
        //<div>
        //<div ref={(div) => { this.pauseAnimationsContainer=div }}>
        //<StopwatchController countdown={true} autoStart={false} ref={(sw) => { this.stopwatchController = sw }} reportTickInterval={ReportTickInterval.hundredthSecond} startDuration={112000}>
        //    <FlipCounter countdown={true} hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
        //</StopwatchController>
        //    </div>
        //<button onClick={() => { this.stopwatchController.stop(); this.pauseAnimations(this.pauseAnimationsContainer)  }}>Stop</button>
        //<button onClick={() => { this.stopwatchController.pause(); this.pauseAnimations(this.pauseAnimationsContainer) }}>Pause</button>
        //<button onClick={() => { this.stopwatchController.start(); this.resumeAnimations(this.pauseAnimationsContainer) }}>Play</button>
        //<div ref={(div) => { this.pauseAnimationsContainer2 = div }}>
        //    <StopwatchController autoStart={false} ref={(sw) => { this.stopwatchController2 = sw }} reportTickInterval={ReportTickInterval.hundredthSecond} startDuration={0}>
        //        <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
        //    </StopwatchController>
        //</div>
        //<button onClick={() => { this.stopwatchController2.stop(); this.pauseAnimations(this.pauseAnimationsContainer2) }}>Stop</button>
        //<button onClick={() => { this.stopwatchController2.pause(); this.pauseAnimations(this.pauseAnimationsContainer2)  }}>Pause</button>
        //<button onClick={() => { this.stopwatchController2.start(); this.resumeAnimations(this.pauseAnimationsContainer2) }}>Play</button>
        //<button onClick={this.pauseAnimations} >Pause animations</button>  
        //<button onClick={() => {
        //    console.log(this.stopwatchController2.getDuration().totalMilliseconds);
        //    var downDuration = this.stopwatchController.getDuration();
        //    console.log(downDuration.totalSeconds)
        //    console.log(downDuration.milliseconds)
        //}}>Check duration</button>
        //</div>
        //{height:"200px"}
        /*
        return <div style={{ minWidth: "500px", maxWidth:"1000px" }}>
            <ExpandableKeyboard keyboardColour="gray" buttonBackgroundColour="orange"  backspacePressed={() => { }} keyPressed={() => { }} />
          
            </div>
       */
        //return <div>
        //    <div style={{width:"500px"}}>
        //        <CrosswordPuzzleChooser userLoggedIn={this.state.userLoggedIn} crosswordSelected={this.crosswordSelected} />
        //    </div>
        //    {this.state.crosswordModel ? <CrosswordPuzzleKeyEvents crosswordModel={this.state.crosswordModel} /> : null}
        //    <button disabled={!this.state.userLoggedIn} onClick={this.saveUserCrossword}>Click to save</button>
        //     </div>
    };
    return CrosswordPuzzleApp;
}(React.Component));
exports.CrosswordPuzzleApp = CrosswordPuzzleApp;
//# sourceMappingURL=crosswordPuzzleApp.js.map