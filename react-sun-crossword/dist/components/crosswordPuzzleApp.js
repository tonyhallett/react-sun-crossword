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
            _this.setState({ crosswordModel: crosswordModel });
        };
        _this.saveUserCrossword = function () {
            var modelJson = index_1.ConvertCrosswordModelToJson(_this.state.crosswordModel);
            modelJson.duration = _this.stopwatchController.getDuration().totalMs;
            connectedDatabase_1.connectedDatabase.saveUserCrossword(_this.state.userLoggedIn, modelJson.id, modelJson, { id: modelJson.id, dateStarted: modelJson.dateStarted, duration: modelJson.duration, datePublished: modelJson.datePublished, title: modelJson.title }).then(function (userSaveDetails) {
                //will now know not dirty
            }).catch(function (err) {
                //should be firebase error
                //logic to be done later
            });
        };
        _this.state = { crosswordModel: null, userLoggedIn: null };
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
        var _this = this;
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
        return React.createElement("div", null,
            this.state.crosswordModel &&
                React.createElement(stopwatchController_1.StopwatchController, { ref: function (sw) { _this.stopwatchController = sw; }, startDuration: this.state.crosswordModel.duration },
                    React.createElement(stopwatchController_1.DemoStopwatchDisplay, null)),
            React.createElement(muiWrappedButton_1.MuiButtonWrapper, __assign({ disabled: !this.state.userLoggedIn || this.state.crosswordModel === null, text: "Click to save", onClick: this.saveUserCrossword }, buttonProps)),
            React.createElement(twoCol_1.TwoCol, { leftContent: leftContent, rightContent: rightContent }));
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