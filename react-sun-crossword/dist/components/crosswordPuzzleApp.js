"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var index_1 = require("../models/index");
var crosswordPuzzle_1 = require("./crosswordPuzzle");
var connectedDatabase_1 = require("../helpers/connectedDatabase");
require("firebase/database");
var crosswordPuzzleChooser_1 = require("./crosswordPuzzleChooser");
var muiWrappedButton_1 = require("./muiWrappedButton");
var demoFlipClocks_1 = require("./demoFlipClocks");
var CrosswordPuzzleApp = (function (_super) {
    __extends(CrosswordPuzzleApp, _super);
    function CrosswordPuzzleApp(props) {
        var _this = _super.call(this, props) || this;
        _this.crosswordSelected = function (selectedCrossword) {
            var crosswordModel = index_1.ConvertCrosswordJsonToModel(selectedCrossword);
            if (!crosswordModel.dateStarted) {
                crosswordModel.dateStarted = new Date();
            }
            _this.setState({ crosswordModel: crosswordModel });
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
        _this.state = { crosswordModel: null, userLoggedIn: null };
        return _this;
    }
    CrosswordPuzzleApp.prototype.componentDidMount = function () {
        //auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
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
            React.createElement(crosswordPuzzleChooser_1.CrosswordPuzzleChooser, { emailLogOnStyleProps: { signInButtonProps: buttonProps, dividerColor: primaryColour }, selectChooserProps: selectChooserProps, userLoggedIn: this.state.userLoggedIn, crosswordSelected: this.crosswordSelected }));
        var rightContent = React.createElement(crosswordPuzzle_1.CrosswordPuzzleKeyEvents, { crosswordModel: this.state.crosswordModel });
        if (this.state.crosswordModel === null) {
            rightContent = React.createElement("div", null);
        }
        //return <div >
        //    {this.state.crosswordModel &&
        //        <StopwatchController ref={(sw) => { this.stopwatchController = sw }} reportTickInterval={ReportTickInterval.tenthSecond} startDuration={this.state.crosswordModel.duration}>
        //            <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds"  />
        //        </StopwatchController>
        //    }
        //    <MuiButtonWrapper disabled={!this.state.userLoggedIn || this.state.crosswordModel === null} text="Click to save" onClick={this.saveUserCrossword}   {...buttonProps}></MuiButtonWrapper>
        //    <TwoCol leftContent={leftContent} rightContent={rightContent}>
        //    </TwoCol>
        //    </div>
        //<button onClick={}>Pause</button>
        console.log("App render");
        return React.createElement("div", null,
            React.createElement(demoFlipClocks_1.DemoFlipClocks, null));
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
            Element queries
             <Bounded />
            <ElementQuery queries={{ sm: { maxWidth: 200 }, lg: { minWidth: 201 }, hasHeight: {minHeight:1} }}>
                <Matches sm>Small</Matches>
                <Matches lg>Large</Matches>
                <Matches hasHeight>Has height !</Matches>
            </ElementQuery>
            <ElementQueries/>
        */
        /*
              <ElementQuery queries={{ sm: { maxWidth: 499 }, medium: { minWidth: 500,maxWidth:1000 },large: {minWidth: 1001}}}>
                <Matches sm>
                        <Keyboard width={250} keyPressed={(key) => console.log(key)} backspacePressed={() => { console.log("backspace pressed") }} />
                </Matches>
                <Matches medium>
                    <Keyboard keyboardColour="#F8F8F8" buttonColour="gray" buttonBackgroundColour="yellow" width={500} bottomOfScreen={false} keyPressed={(key) => console.log(key)} backspacePressed={() => { console.log("backspace pressed") }} />
                </Matches>
                <Matches large>
                    <Keyboard keyboardColour="#F8F8F8" buttonBackgroundColour="orange"width={1000} keyPressed={(key) => console.log(key)} backspacePressed={() => { console.log("backspace pressed") }} />
                </Matches>

            </ElementQuery>
        */
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