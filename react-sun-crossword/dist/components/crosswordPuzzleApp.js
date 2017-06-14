"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var index_1 = require("../models/index");
var crosswordPuzzle_1 = require("./crosswordPuzzle");
var es6_promise_1 = require("es6-promise");
var Select = require("react-select");
var twoCol_1 = require("./twoCol");
var crosswordPuzzleDataStore_1 = require("../helpers/crosswordPuzzleDataStore");
var crosswordPuzzleJsonStore_1 = require("../helpers/crosswordPuzzleJsonStore");
var emailLogOn_1 = require("./emailLogOn");
var firebaseApp_1 = require("../helpers/firebaseApp");
var Button = require("muicss/lib/react/button");
var firebaseApp_2 = require("../helpers/firebaseApp");
require("firebase/database");
var MuiButton = (function (_super) {
    __extends(MuiButton, _super);
    function MuiButton(props) {
        var _this = _super.call(this, props) || this;
        _this.muiMouseDown = function () {
            _this.props.onClick();
        };
        return _this;
    }
    MuiButton.prototype.render = function () {
        return React.createElement(Button, { disabled: this.props.disabled, color: this.props.color, onMouseDown: this.muiMouseDown }, this.props.text);
    };
    return MuiButton;
}(React.Component));
var CrosswordPuzzleApp = (function (_super) {
    __extends(CrosswordPuzzleApp, _super);
    function CrosswordPuzzleApp(props) {
        var _this = _super.call(this, props) || this;
        _this.currentCrosswordInStore = false;
        //going to have to deal with saving of old one here
        _this.jsonCrosswordSelected = function (crossword) {
            _this.setState({ jsonSelectedCrossword: crossword });
        };
        _this.storeCrosswordSelected = function (crossword) {
            _this.setState({ storeSelectedCrossword: crossword });
        };
        _this.jsonCrosswordChosen = function () {
            _this.crosswordChosen(_this.state.jsonSelectedCrossword);
        };
        _this.storeCrosswordChosen = function () {
            _this.crosswordChosen(_this.state.storeSelectedCrossword);
        };
        _this.crosswordChosen = function (crosswordDetail) {
            var self = _this;
            crosswordDetail.getAsync().then(function (chosenCrossword) {
                //do saving here - if necessary - will then need dirty management
                var crosswordModel = index_1.ConvertCrosswordJsonToModel(chosenCrossword);
                self.currentCrosswordInStore = crosswordDetail.inStore;
                console.log("current crossword in store: " + self.currentCrosswordInStore);
                var jsonSelectedCrossword = null;
                var storeSelectedCrossword = null;
                if (self.currentCrosswordInStore) {
                    storeSelectedCrossword = crosswordDetail;
                }
                else {
                    jsonSelectedCrossword = crosswordDetail;
                }
                self.setState({ crosswordModel: crosswordModel, jsonSelectedCrossword: jsonSelectedCrossword, storeSelectedCrossword: storeSelectedCrossword });
            });
        };
        //this will only be visible if signed in
        _this.saveUserCrossword = function () {
            //will be done by the store
            console.log("trying to save crossword for : " + firebaseApp_1.auth.currentUser.displayName);
            var modelJson = index_1.ConvertCrosswordModelToJson(_this.state.crosswordModel);
            var rerender = !_this.currentCrosswordInStore;
            var self = _this;
            _this.crosswordPuzzleDataStore.saveCrosswordAsync(modelJson).then(function () {
                self.currentCrosswordInStore = true;
                if (rerender) {
                    console.log("re-rendering");
                    self.setChoices(null, self.state.jsonSelectedCrossword);
                }
            }).catch(function () {
                //to do
                console.log("!!!! error saving crossword to store");
            });
        };
        _this.crosswordPuzzleJsonStore = crosswordPuzzleJsonStore_1.crosswordPuzzleJsonStore;
        _this.crosswordPuzzleDataStore = crosswordPuzzleDataStore_1.crosswordPuzzleDataStore;
        _this.state = { firebaseConnected: false, jsonCrosswordsLoading: false, storeCrosswordsLoading: false, crosswordModel: null, userLoggedIn: false, chooseDetailsJson: [], chooseDetailsStore: [], storeSelectedCrossword: null, jsonSelectedCrossword: null };
        return _this;
    }
    CrosswordPuzzleApp.prototype.componentDidMount = function () {
        var connectedRef = firebaseApp_2.database.ref(".info/connected");
        connectedRef.on("value", function (snap) {
            this.setState({ firebaseConnected: snap.val() });
        });
        firebaseApp_1.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
        this.setChoices();
    };
    CrosswordPuzzleApp.prototype.filterDetails = function (storeDetails, jsonDetails) {
        return jsonDetails.filter(function (jsDetail) {
            var match = true;
            for (var j = 0; j < storeDetails.length; j++) {
                if (storeDetails[j].id === jsDetail.id) {
                    match = false;
                    break;
                }
            }
            return match;
        });
    };
    CrosswordPuzzleApp.prototype.setChoices = function (jsonSelectedCrossword, storeSelectedCrossword) {
        if (jsonSelectedCrossword === void 0) { jsonSelectedCrossword = null; }
        if (storeSelectedCrossword === void 0) { storeSelectedCrossword = null; }
        var self = this;
        if (this.state.userLoggedIn) {
            this.setState({ jsonCrosswordsLoading: true, storeCrosswordsLoading: true });
            es6_promise_1.Promise.all([crosswordPuzzleJsonStore_1.crosswordPuzzleJsonStore.getDetailsAsync(), crosswordPuzzleDataStore_1.crosswordPuzzleDataStore.getDetailsAsync()]).then(function (combinedDetails) {
                var publicDetails = combinedDetails[0];
                var userDetails = combinedDetails[1];
                var publicOnlyDetails = self.filterDetails(userDetails, publicDetails);
                self.setState({ chooseDetailsJson: publicOnlyDetails, chooseDetailsStore: userDetails, jsonSelectedCrossword: jsonSelectedCrossword, storeSelectedCrossword: storeSelectedCrossword });
            }).catch(function (err) {
                //to do - a ui for this
                console.log("Error getting public and saved crosswords: " + err.message);
                window.setTimeout(function () {
                    //clear the error message then
                    console.log("trying again for public and saved");
                    self.setChoices();
                }, 1000);
            }).then(function () {
                self.setState({ jsonCrosswordsLoading: false, storeCrosswordsLoading: false });
            });
        }
        else {
            this.setState({ jsonCrosswordsLoading: true });
            crosswordPuzzleJsonStore_1.crosswordPuzzleJsonStore.getDetailsAsync().then(function (details) {
                console.log("Have received the public details");
                self.setState({ chooseDetailsJson: details, chooseDetailsStore: null, jsonSelectedCrossword: jsonSelectedCrossword, storeSelectedCrossword: storeSelectedCrossword });
            }).catch(function (err) {
                //to do 
                console.log("Error getting public crosswords: " + err.message);
                //conditionally on the error message - 
                window.setTimeout(function () {
                    //clear the error message then
                    console.log("trying again for public");
                    self.setChoices();
                }, 1000);
            }).then(function () {
                self.setState({ jsonCrosswordsLoading: false });
            });
        }
    };
    CrosswordPuzzleApp.prototype.onAuthStateChanged = function (user) {
        var loggedIn = user !== null;
        this.setState({ userLoggedIn: loggedIn });
        this.setChoices();
    };
    CrosswordPuzzleApp.prototype.render = function () {
        var leftContent = React.createElement("div", null,
            React.createElement("div", null, "Datebase connected: " + (this.state.firebaseConnected ? "true" : "false")),
            React.createElement("button", { disabled: !this.state.userLoggedIn, onClick: this.saveUserCrossword }, "Click to save"),
            React.createElement(CrosswordPuzzleChooser, { storeCrosswordsLoading: this.state.storeCrosswordsLoading, jsonCrosswordsLoading: this.state.jsonCrosswordsLoading, userLoggedIn: this.state.userLoggedIn, jsonCrosswordSelected: this.jsonCrosswordSelected, storeCrosswordSelected: this.storeCrosswordSelected, storeCrosswordChosen: this.storeCrosswordChosen, jsonCrosswordChosen: this.jsonCrosswordChosen, jsonSelectedCrossword: this.state.jsonSelectedCrossword, storeSelectedCrossword: this.state.storeSelectedCrossword, chooseDetailsJson: this.state.chooseDetailsJson, chooseDetailsStore: this.state.chooseDetailsStore }));
        var rightContent = React.createElement(crosswordPuzzle_1.CrosswordPuzzleKeyEvents, { crosswordModel: this.state.crosswordModel });
        if (this.state.crosswordModel === null) {
            rightContent = React.createElement("div", null);
        }
        return React.createElement(twoCol_1.TwoCol, { leftContent: leftContent, rightContent: rightContent });
    };
    return CrosswordPuzzleApp;
}(React.Component));
exports.CrosswordPuzzleApp = CrosswordPuzzleApp;
var CrosswordPuzzleChooserContainer = (function (_super) {
    __extends(CrosswordPuzzleChooserContainer, _super);
    function CrosswordPuzzleChooserContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.crosswordChosen = function (chosen) {
            var self = _this;
            console.log("Crossword chosen: " + chosen.title);
            chosen.getAsync().then(function (chosenCrossword) {
                self.props.crosswordChosen(chosenCrossword, chosen.inStore);
            });
        };
        _this.state = { chooseDetailsJson: [], chooseDetailsStore: [] };
        return _this;
    }
    CrosswordPuzzleChooserContainer.prototype.filterDetails = function (storeDetails, jsonDetails) {
        return jsonDetails.filter(function (jsDetail) {
            var match = true;
            for (var j = 0; j < storeDetails.length; j++) {
                if (storeDetails[j].id === jsDetail.id) {
                    match = false;
                    break;
                }
            }
            return match;
        });
    };
    CrosswordPuzzleChooserContainer.prototype.componentDidMount = function () {
        var self = this;
        if (this.props.userLoggedIn) {
            es6_promise_1.Promise.all([this.props.crosswordPuzzleJsonStore.getDetailsAsync(), this.props.crosswordPuzzleDataStore.getDetailsAsync()]).then(function (combinedDetails) {
                var publicDetails = combinedDetails[0];
                var userDetails = combinedDetails[1];
                var publicOnlyDetails = self.filterDetails(userDetails, publicDetails);
                self.setState({ chooseDetailsJson: publicOnlyDetails, chooseDetailsStore: userDetails });
            });
        }
        else {
            this.props.crosswordPuzzleJsonStore.getDetailsAsync().then(function (details) {
                self.setState({ chooseDetailsJson: details });
            });
        }
    };
    //removed 
    //<CrosswordPuzzleChooser chooseDetailsJson={this.state.chooseDetailsJson} chooseDetailsStore={this.state.chooseDetailsStore} crosswordChosen={this.crosswordChosen} />
    CrosswordPuzzleChooserContainer.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(emailLogOn_1.EmailLogOn, null)));
    };
    return CrosswordPuzzleChooserContainer;
}(React.Component));
exports.CrosswordPuzzleChooserContainer = CrosswordPuzzleChooserContainer;
var CrosswordPuzzleChooser = (function (_super) {
    __extends(CrosswordPuzzleChooser, _super);
    function CrosswordPuzzleChooser(props) {
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
    CrosswordPuzzleChooser.prototype.mapToOptions = function (chooseDetails) {
        if (chooseDetails) {
            return chooseDetails.map(function (chooseDetail) {
                return { label: chooseDetail.title, value: chooseDetail.id, _chooseDetail: chooseDetail };
            });
        }
        else {
            return [];
        }
    };
    CrosswordPuzzleChooser.prototype.optionToDetail = function (option) {
        var selectedDetail;
        if (option) {
            selectedDetail = option._chooseDetail;
        }
        else {
            selectedDetail = null;
        }
        return selectedDetail;
    };
    CrosswordPuzzleChooser.prototype.render = function () {
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
        //<button style={{ marginTop: "10px" }} disabled={this.props.storeSelectedCrossword === null} onClick={this.props.storeCrosswordChosen}>Play crossword</button>
        // <button style={{ marginTop: "10px" }} disabled={this.props.jsonSelectedCrossword === null} onClick={this.props.jsonCrosswordChosen}>Play crossword</button>
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
    return CrosswordPuzzleChooser;
}(React.Component));
exports.CrosswordPuzzleChooser = CrosswordPuzzleChooser;
//# sourceMappingURL=crosswordPuzzleApp.js.map