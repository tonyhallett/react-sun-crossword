"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var index_1 = require("../models/index");
var crosswordPuzzle_1 = require("./crosswordPuzzle");
var Select = require("react-select");
var twoCol_1 = require("./twoCol");
var emailLogOn_1 = require("./emailLogOn");
var firebaseApp_1 = require("../helpers/firebaseApp");
var Button = require("muicss/lib/react/button");
var connectedDatabase_1 = require("../helpers/connectedDatabase");
require("firebase/database");
var crosswordPuzzleChooser_1 = require("./crosswordPuzzleChooser");
var muiButton_1 = require("./muiButton");
var MuiButtonWrapper = (function (_super) {
    __extends(MuiButtonWrapper, _super);
    function MuiButtonWrapper(props) {
        var _this = _super.call(this, props) || this;
        _this.muiMouseDown = function () {
            _this.props.onClick();
        };
        return _this;
    }
    MuiButtonWrapper.prototype.render = function () {
        return React.createElement(Button, { disabled: this.props.disabled, color: this.props.color, onMouseDown: this.muiMouseDown }, this.props.text);
    };
    return MuiButtonWrapper;
}(React.Component));
var CrosswordPuzzleApp = (function (_super) {
    __extends(CrosswordPuzzleApp, _super);
    function CrosswordPuzzleApp(props) {
        var _this = _super.call(this, props) || this;
        _this.crosswordSelected = function (selectedCrossword) {
            var crosswordModel = index_1.ConvertCrosswordJsonToModel(selectedCrossword);
            _this.setState({ crosswordModel: crosswordModel });
        };
        _this.saveUserCrossword = function () {
            var modelJson = index_1.ConvertCrosswordModelToJson(_this.state.crosswordModel);
            connectedDatabase_1.connectedDatabase.saveUserCrossword(_this.state.userLoggedIn, modelJson.id, modelJson, { id: modelJson.id, datePublished: modelJson.datePublished, title: modelJson.title }).then(function (userSaveDetails) {
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
    //going to have to deal with saving of old one here
    CrosswordPuzzleApp.prototype.render = function () {
        //explicit height allows room for the Select 
        var leftContent = React.createElement("div", { style: { minHeight: "1000px" } },
            React.createElement(crosswordPuzzleChooser_1.CrosswordPuzzleChooser, { userLoggedIn: this.state.userLoggedIn, crosswordSelected: this.crosswordSelected }));
        var rightContent = React.createElement(crosswordPuzzle_1.CrosswordPuzzleKeyEvents, { crosswordModel: this.state.crosswordModel });
        if (this.state.crosswordModel === null) {
            rightContent = React.createElement("div", null);
        }
        return React.createElement("div", null,
            React.createElement(Button, { variant: "fab", color: "primary" }, "fab Mui button"),
            React.createElement(Button, { variant: "flat", color: "primary" }, "flat Mui button"),
            React.createElement(Button, { variant: "raised", color: "primary" }, "raised Mui button"),
            React.createElement(muiButton_1.MuiButton, { buttonStyle: { backgroundColor: "green", color: "white" } }, "My Mui"),
            React.createElement(MuiButtonWrapper, { color: "accent", disabled: false, text: "wrapped mui button", onClick: function () { } }),
            React.createElement("button", { disabled: !this.state.userLoggedIn, onClick: this.saveUserCrossword }, "Click to save"),
            React.createElement(twoCol_1.TwoCol, { leftContent: leftContent, rightContent: rightContent }));
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
var CrosswordPuzzleChooserOld = (function (_super) {
    __extends(CrosswordPuzzleChooserOld, _super);
    function CrosswordPuzzleChooserOld(props) {
        var _this = _super.call(this, props) || this;
        _this.jsonOptionChange = function (option) {
            _this.props.jsonCrosswordSelected(_this.optionToDetail(option));
        };
        _this.storeOptionChange = function (option) {
            _this.props.storeCrosswordSelected(_this.optionToDetail(option));
        };
        _this.savedOnFocus = function () {
            _this.setState({ savedSelectFocused: true });
        };
        _this.savedOnBlur = function () {
            _this.setState({ savedSelectFocused: false });
        };
        _this.publicOnFocus = function () {
            _this.setState({ publicSelectFocused: true });
        };
        _this.publicOnBlur = function () {
            _this.setState({ publicSelectFocused: false });
        };
        _this.state = { publicSelectFocused: false, savedSelectFocused: false };
        return _this;
    }
    CrosswordPuzzleChooserOld.prototype.mapToOptions = function (chooseDetails) {
        if (chooseDetails) {
            return chooseDetails.map(function (chooseDetail) {
                return { label: chooseDetail.title, value: chooseDetail.id, _chooseDetail: chooseDetail };
            });
        }
        else {
            return [];
        }
    };
    CrosswordPuzzleChooserOld.prototype.optionToDetail = function (option) {
        var selectedDetail;
        if (option) {
            selectedDetail = option._chooseDetail;
        }
        else {
            selectedDetail = null;
        }
        return selectedDetail;
    };
    CrosswordPuzzleChooserOld.prototype.render = function () {
        var jsonOptions = this.mapToOptions(this.props.chooseDetailsJson);
        var storeOptions = this.mapToOptions(this.props.chooseDetailsStore);
        var displayWhenLoggedOut = this.props.userLoggedIn ? "none" : "block";
        var displayWhenLoggedIn = this.props.userLoggedIn ? "block" : "none";
        var borderColor = "grey";
        var unfocusedBorderColor = borderColor;
        var focusedBorderColor = "blue";
        var fieldsetBorder = "1px " + borderColor + " solid";
        var placeholderTextColour = "rgb(51,51,51)";
        var placeholderDisabledTextColour = "grey";
        var signInTitle = "Sign in";
        var savedSelectPlaceholderText = this.props.userLoggedIn ? "Select saved crosswords:" : signInTitle + " to access saved crosswords:";
        var savedSelectPlaceholder = React.createElement("div", { style: { color: this.props.userLoggedIn ? placeholderTextColour : placeholderDisabledTextColour } }, savedSelectPlaceholderText);
        var publicSelectPlaceholder = React.createElement("div", { style: { color: placeholderTextColour } }, "Select public crossword:");
        return React.createElement("div", { style: { height: "700px" } },
            React.createElement("h2", null, "Select a crossword"),
            React.createElement("fieldset", { style: { borderRadius: "8px", border: fieldsetBorder } },
                React.createElement("legend", null, "Saved crosswords:"),
                React.createElement("div", { style: { borderRadius: "8px", marginBottom: "10px", border: fieldsetBorder } },
                    React.createElement(emailLogOn_1.EmailLogOnComp, { signInButtonProps: { style: { color: "red", outlineWidth: "0px" } }, focusColor: focusedBorderColor, signInTitle: signInTitle, signOutTitle: "Sign out", reLoginWait: 1000, auth: firebaseApp_1.auth })),
                React.createElement(Select, { isLoading: this.props.storeCrosswordsLoading, placeholder: savedSelectPlaceholder, onFocus: this.savedOnFocus, onBlur: this.savedOnBlur, style: { borderColor: this.state.savedSelectFocused ? focusedBorderColor : unfocusedBorderColor }, disabled: !this.props.userLoggedIn, options: storeOptions, value: this.props.storeSelectedCrossword !== null ? this.props.storeSelectedCrossword.id : null, onChange: this.storeOptionChange }),
                React.createElement(Button, { color: "accent", disabled: this.props.storeSelectedCrossword === null, onMouseUp: this.props.storeCrosswordChosen }, "Play crossword")),
            React.createElement("fieldset", { style: { borderRadius: "8px", border: fieldsetBorder } },
                React.createElement("legend", null, "Public crosswords:"),
                React.createElement(Select, { isLoading: this.props.jsonCrosswordsLoading, placeholder: publicSelectPlaceholder, onFocus: this.publicOnFocus, onBlur: this.publicOnBlur, style: { borderColor: this.state.publicSelectFocused ? focusedBorderColor : unfocusedBorderColor }, options: jsonOptions, value: this.props.jsonSelectedCrossword !== null ? this.props.jsonSelectedCrossword.id : null, onChange: this.jsonOptionChange }),
                React.createElement(Button, { color: "accent", disabled: this.props.jsonSelectedCrossword === null, onMouseUp: this.props.jsonCrosswordChosen }, "Play crossword")));
    };
    return CrosswordPuzzleChooserOld;
}(React.Component));
exports.CrosswordPuzzleChooserOld = CrosswordPuzzleChooserOld;
//# sourceMappingURL=crosswordPuzzleApp.js.map