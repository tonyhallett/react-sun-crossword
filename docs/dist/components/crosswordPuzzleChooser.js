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
var connectedDatabase_1 = require("../helpers/connectedDatabase");
var emailLogOn_1 = require("./emailLogOn");
var firebaseApp_1 = require("../helpers/firebaseApp");
var Select = require("react-select");
exports.Select = require("react-select");
var muiWrappedButton_1 = require("./muiWrappedButton");
function displayNameHOC(Component, displayName) {
    var DisplayNameComponent = (function (_super) {
        __extends(DisplayNameComponent, _super);
        function DisplayNameComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DisplayNameComponent.prototype.render = function () {
            return React.createElement(Component, __assign({}, this.props));
        };
        return DisplayNameComponent;
    }(React.Component));
    var cc = DisplayNameComponent;
    cc.displayName = displayName;
    return cc;
}
var DefaultDatabaseDisconnectedMessageComponent = (function (_super) {
    __extends(DefaultDatabaseDisconnectedMessageComponent, _super);
    function DefaultDatabaseDisconnectedMessageComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultDatabaseDisconnectedMessageComponent.prototype.render = function () {
        return React.createElement("div", null, this.props.disconnectedMessage);
    };
    return DefaultDatabaseDisconnectedMessageComponent;
}(React.Component));
var DefaultSelectChooser = (function (_super) {
    __extends(DefaultSelectChooser, _super);
    function DefaultSelectChooser(props) {
        var _this = _super.call(this, props) || this;
        _this.buttonClicked = function () {
            _this.props.lookupSelected(_this.state.selectedValue);
        };
        _this.optionChange = function (option) {
            _this.setState({ selectedValue: option.value });
        };
        _this.mapOptions = function () {
            var options = [];
            if (_this.props.crosswordLookups) {
                options = _this.props.crosswordLookups.map(function (crosswordLookup) {
                    var mappedOption = {
                        label: crosswordLookup.title,
                        value: crosswordLookup.id
                    };
                    return mappedOption;
                });
            }
            return options;
        };
        _this.state = { selectedValue: null };
        return _this;
    }
    DefaultSelectChooser.prototype.render = function () {
        var Button = displayNameHOC(this.props.ButtonType, "Button");
        return React.createElement("div", null,
            React.createElement(Select, { value: this.state.selectedValue, onChange: this.optionChange, disabled: this.props.disabled, isLoading: this.props.isLoadingLookups, placeholder: this.props.placeholderText, options: this.mapOptions() }),
            React.createElement("div", { style: { paddingTop: "10px" } },
                React.createElement(Button, __assign({}, this.props.buttonProps, { text: "Play Crossword", onClick: this.buttonClicked, disabled: this.props.disabled || !this.state.selectedValue }))));
    };
    return DefaultSelectChooser;
}(React.Component));
DefaultSelectChooser.defaultProps = {
    ButtonType: muiWrappedButton_1.MuiButtonWrapper
};
exports.DefaultSelectChooser = DefaultSelectChooser;
var DefaultSelectChooserContainer = (function (_super) {
    __extends(DefaultSelectChooserContainer, _super);
    function DefaultSelectChooserContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultSelectChooserContainer.prototype.render = function () {
        var content;
        if (this.props.isPublic) {
            content = this.props.children;
        }
        else {
            content = React.createElement("div", null,
                this.props.children[1],
                this.props.children[0]);
        }
        return React.createElement("fieldset", { style: { borderRadius: "5px", borderColor: "#2F4F4F" } },
            React.createElement("legend", null, this.props.header),
            content);
    };
    return DefaultSelectChooserContainer;
}(React.Component));
var CrosswordPuzzleChooser = (function (_super) {
    __extends(CrosswordPuzzleChooser, _super);
    function CrosswordPuzzleChooser(props) {
        var _this = _super.call(this, props) || this;
        //given that public will have new pushed to it - do I need two events
        _this.publicLookups = null;
        _this.userLookups = null;
        _this.publicLookupSelected = function (id) {
            var self = _this;
            connectedDatabase_1.connectedDatabase.getPublicCrossword(id).then(function (crosswordModelJson) {
                self.props.crosswordSelected(crosswordModelJson);
            });
        };
        _this.userLookupSelected = function (id) {
            var self = _this;
            connectedDatabase_1.connectedDatabase.getUserCrossword(_this.props.userLoggedIn, id).then(function (crosswordModelJson) {
                self.props.crosswordSelected(crosswordModelJson);
            });
        };
        _this.state = {
            databaseDisconnected: true, publicLookupsLoading: false, userLookupsLoading: false, publicCrosswordLookups: null, userCrosswordLookups: null
        };
        return _this;
    }
    CrosswordPuzzleChooser.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.userLoggedIn !== this.props.userLoggedIn) {
            this.addRemoveListeners(nextProps.userLoggedIn);
        }
    };
    //should do in ctor ?
    CrosswordPuzzleChooser.prototype.componentDidMount = function () {
        connectedDatabase_1.connectedDatabase.connectionChanged(this.connectionChanged.bind(this));
    };
    CrosswordPuzzleChooser.prototype.manageLookups = function (lookups, isPublic) {
        var lookupsLoadingsFalseProperty = "publicLookupsLoading";
        if (isPublic) {
            this.publicLookups = lookups;
        }
        else {
            this.userLookups = lookups;
            lookupsLoadingsFalseProperty = "userLookupsLoading";
        }
        var filteredPublicLookups = [];
        if (this.publicLookups) {
            for (var i = 0; i < this.publicLookups.length; i++) {
                var inUserCrosswords = false;
                var publicLookup = this.publicLookups[i];
                if (this.userLookups !== null) {
                    for (var j = 0; j < this.userLookups.length; j++) {
                        var userLookup = this.userLookups[j];
                        if (publicLookup.id === userLookup.id) {
                            inUserCrosswords = true;
                            break;
                        }
                    }
                }
                if (!inUserCrosswords) {
                    filteredPublicLookups.push(publicLookup);
                }
            }
        }
        var newState = {
            publicCrosswordLookups: filteredPublicLookups,
            userCrosswordLookups: this.userLookups
        };
        newState[lookupsLoadingsFalseProperty] = false;
        this.setState(newState);
    };
    CrosswordPuzzleChooser.prototype.publicLookupsChanged = function (lookups) {
        this.manageLookups(lookups, true);
    };
    CrosswordPuzzleChooser.prototype.userLookupsChanged = function (lookups) {
        this.manageLookups(lookups, false);
    };
    CrosswordPuzzleChooser.prototype.addRemoveListeners = function (userLoggedIn) {
        //might have asynchronous issues with state.....
        if (!this.state.databaseDisconnected) {
            if (!this.listeningForPublic) {
                connectedDatabase_1.connectedDatabase.listenForPublicCrosswordLookups(this.publicLookupsChanged.bind(this));
                this.listeningForPublic = true;
                this.setState({ publicLookupsLoading: true });
            }
            if (userLoggedIn && !this.listeningForUser) {
                connectedDatabase_1.connectedDatabase.listenForUserCrosswordLookups(userLoggedIn, this.userLookupsChanged.bind(this));
                this.listeningForUser = true;
                this.setState({ userLookupsLoading: true });
            }
        }
    };
    CrosswordPuzzleChooser.prototype.connectionChanged = function (isConnected) {
        this.setState({ databaseDisconnected: !isConnected });
        this.addRemoveListeners(this.props.userLoggedIn);
    };
    CrosswordPuzzleChooser.prototype.render = function () {
        var SelectChooser = displayNameHOC(this.props.SelectChooser, "SelectChooser"); //!important to do this for intellisense even without the displayNameHOC
        var SelectChooserContainer = displayNameHOC(this.props.SelectChooserContainer, "SelectChooserContainer");
        return React.createElement("div", null,
            React.createElement(this.props.DatabaseDisconnectedMessageComponent, __assign({}, this.props.databaseDisconnectedMessageComponentProps, { disconnectedMessage: this.state.databaseDisconnected ? this.props.disconnectedMessage : "\u200B" })),
            React.createElement(SelectChooserContainer, { isPublic: true, header: this.props.publicSelectChooserHeader },
                React.createElement(SelectChooser, __assign({ placeholderText: this.props.placeholderSelectWording + " public crosswords: ", lookupSelected: this.publicLookupSelected, crosswordLookups: this.state.publicCrosswordLookups, isLoadingLookups: this.state.publicLookupsLoading, isPublic: true, disabled: this.state.databaseDisconnected }, this.props.selectChooserProps))),
            React.createElement(SelectChooserContainer, { isPublic: false, header: this.props.userSelectChooserHeader },
                React.createElement(SelectChooser, __assign({ placeholderText: (this.props.placeholderSelectWording + " saved crosswords: ") + (this.props.userLoggedIn ? "" : this.props.emailSignInWording + " " + this.props.userPlaceholderSignedOutWording), lookupSelected: this.userLookupSelected, crosswordLookups: this.state.userCrosswordLookups, isLoadingLookups: this.state.userLookupsLoading, isPublic: false, disabled: this.state.databaseDisconnected || (this.props.userLoggedIn === null) }, this.props.selectChooserProps)),
                React.createElement(emailLogOn_1.EmailLogOnComp, __assign({ signInTitle: this.props.emailSignInWording, signOutTitle: this.props.emailSignOutWording, auth: firebaseApp_1.auth }, this.props.emailLogOnStyleProps))));
    };
    return CrosswordPuzzleChooser;
}(React.Component));
CrosswordPuzzleChooser.defaultProps = {
    disconnectedMessage: "Disconnected",
    DatabaseDisconnectedMessageComponent: DefaultDatabaseDisconnectedMessageComponent,
    SelectChooser: DefaultSelectChooser,
    SelectChooserContainer: DefaultSelectChooserContainer,
    publicSelectChooserHeader: "Public crosswords:",
    userSelectChooserHeader: "User crosswords:",
    placeholderSelectWording: "Select",
    userPlaceholderSignedOutWording: "to access saved crosswords",
    emailSignInWording: "Sign in",
    emailSignOutWording: "Sign out"
};
exports.CrosswordPuzzleChooser = CrosswordPuzzleChooser;
//# sourceMappingURL=crosswordPuzzleChooser.js.map