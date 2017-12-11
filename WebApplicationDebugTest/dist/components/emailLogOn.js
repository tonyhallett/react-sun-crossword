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
var divider_1 = require("./divider");
var link_1 = require("./link");
var autoComplete_1 = require("./autoComplete");
var muiWrappedButton_1 = require("./muiWrappedButton");
var javascriptPolyfills_1 = require("../helpers/javascriptPolyfills");
var EmailErrorScreen = (function (_super) {
    __extends(EmailErrorScreen, _super);
    function EmailErrorScreen(props) {
        return _super.call(this, props) || this;
    }
    EmailErrorScreen.prototype.getErrorMessage = function (error) {
        var errorMessage = "";
        if (error) {
            var errorCode = error.code;
            switch (errorCode) {
                case "auth/invalid-email":
                    errorMessage = "Email address is invalid"; //is that firebase database rule against the email field ?
                    break;
                case "auth/user-disabled":
                    errorMessage = "Your account has been disabled";
                    break;
                case "auth/user-not-found":
                    errorMessage = "The email address has not been found.";
                    break;
                case "auth/wrong-password":
                    errorMessage = "Incorrect password";
                    break;
                case "auth/email-already-in-use":
                    errorMessage = "Please create account with different email as it already is in use.";
                    break;
                case "auth/weak-password":
                    //cannot find documentation on what constitutes a weak/strong password
                    errorMessage = "Password weak. Use a stronger password";
                    break;
                case "auth/network-request-failed":
                    errorMessage = "There is an issue with your network connection";
                    break;
                case "auth/too-many-requests":
                    errorMessage = "Unusual activity.........";
                    break;
                case "auth/unauthorized-domain":
                    errorMessage = "I have been an idiot and not authorized the domain";
                    break;
            }
        }
        return errorMessage;
    };
    EmailErrorScreen.prototype.render = function () {
        var defaultStyle = { width: "100%", color: "red" };
        var style = javascriptPolyfills_1.objectAssign({}, defaultStyle, this.props.errorStyle);
        return React.createElement("div", { style: style }, this.getErrorMessage(this.props.error));
    };
    return EmailErrorScreen;
}(React.Component));
EmailErrorScreen.defaultProps = {
    errorStyle: {}
};
var LogInState;
(function (LogInState) {
    LogInState[LogInState["waitingForAuto"] = 0] = "waitingForAuto";
    LogInState[LogInState["loggingIn"] = 1] = "loggingIn";
    LogInState[LogInState["loggedIn"] = 2] = "loggedIn";
    LogInState[LogInState["loggedOut"] = 3] = "loggedOut";
    LogInState[LogInState["creatingAccount"] = 4] = "creatingAccount";
})(LogInState || (LogInState = {}));
var EmailLogOnComp = (function (_super) {
    __extends(EmailLogOnComp, _super);
    function EmailLogOnComp(props) {
        var _this = _super.call(this, props) || this;
        _this.user = null;
        _this.willUnmountCalled = false;
        var initialState = LogInState.loggedOut;
        if (_this.props.autoLoginWait > 0) {
            initialState = LogInState.waitingForAuto;
        }
        _this.state = { logInState: initialState };
        return _this;
    }
    EmailLogOnComp.prototype.componentDidMount = function () {
        var self = this;
        this.timeout = window.setTimeout(function () {
            if (!self.props.auth.currentUser) {
                self.setState({ logInState: LogInState.loggedOut });
            }
        }, this.props.autoLoginWait);
        this.unsubscribe = this.props.auth.onAuthStateChanged(function (user) {
            if (!self.willUnmountCalled) {
                var newState = LogInState.loggedOut;
                if (user) {
                    newState = LogInState.loggedIn;
                }
                self.user = user;
                self.setState({ logInState: newState });
            }
        });
    };
    EmailLogOnComp.prototype.componentWillUnmount = function () {
        this.willUnmountCalled = true;
        this.unsubscribe();
        window.clearTimeout(this.timeout);
    };
    EmailLogOnComp.prototype.render = function () {
        var container = React.createElement(EmailLogOnContainer, { errorStyle: this.props.errorStyle, dividerColour: this.props.dividerColour });
        switch (this.state.logInState) {
            case LogInState.waitingForAuto:
                return React.createElement(EmailWaitingForAuto, { emailLogOnContainer: container, waitingAutoLogOnMessage: this.props.waitingAutoLogOnMessage });
            case LogInState.loggedIn:
                //return <EmailLoggedInScreen emailLogOnContainer={container} auth={this.props.auth} signOutTitle={this.props.signOutTitle} linkProps={this.props.linkProps} />
                return React.createElement(EmailLoggedInScreen, __assign({ emailLogOnContainer: container }, this.props));
            case LogInState.loggedOut:
                //return <EmailSignInScreen emailLogOnContainer={container} auth={this.props.auth} linkProps={this.props.linkProps} signInButtonProps={this.props.signInButtonProps} signInButtonType={this.props.signInButtonType}  signInInputFocusColor={this.props.signInInputFocusColor} isSignIn={true} validatePassword={this.props.validatePassword} validateEmail={this.props.validateEmail} />
                return React.createElement(EmailSignInScreen, __assign({ emailLogOnContainer: container, isSignIn: true }, this.props));
        }
    };
    return EmailLogOnComp;
}(React.Component));
EmailLogOnComp.defaultProps = {
    waitingAutoLogOnMessage: "Attempting auto login.....",
    autoLoginWait: 1000
};
exports.EmailLogOnComp = EmailLogOnComp;
var EmailLogOnContainer = (function (_super) {
    __extends(EmailLogOnContainer, _super);
    function EmailLogOnContainer(props) {
        return _super.call(this, props) || this;
    }
    EmailLogOnContainer.prototype.getDivider = function () {
        return React.createElement(divider_1.Divider, { additionalStyle: { marginTop: "5px", marginBottom: "5px" }, color: this.props.dividerColour });
    };
    EmailLogOnContainer.prototype.render = function () {
        //styling to add
        return React.createElement("div", null,
            this.getDivider(),
            React.createElement("div", { style: this.props.containerHeaderStyle }, this.props.headerContent.header),
            this.props.headerContent.content && this.getDivider(),
            React.createElement("div", { style: this.props.containerContentStyle }, this.props.headerContent.content),
            this.props.error && this.getDivider(),
            React.createElement(EmailErrorScreen, { errorStyle: this.props.errorStyle, error: this.props.error }),
            this.getDivider());
    };
    return EmailLogOnContainer;
}(React.Component));
var EmailWaitingForAuto = (function (_super) {
    __extends(EmailWaitingForAuto, _super);
    function EmailWaitingForAuto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmailWaitingForAuto.prototype.render = function () {
        var logOnContainerProps = {
            headerContent: {
                header: React.createElement("div", null, this.props.waitingAutoLogOnMessage)
            }
        };
        return React.createElement("div", null, React.cloneElement(this.props.emailLogOnContainer, logOnContainerProps));
    };
    return EmailWaitingForAuto;
}(React.Component));
var EmailSignInScreen = (function (_super) {
    __extends(EmailSignInScreen, _super);
    function EmailSignInScreen(props) {
        var _this = _super.call(this, props) || this;
        //this does not get done on auto complete
        _this.passwordChange = function (event) {
            var password = event.target.value;
            _this.setState({ error: null, password: password, passwordValid: _this.props.validatePassword(password), passwordSet: true });
        };
        _this.emailChange = function (event) {
            var emailValue = event.target.value;
            var emailValid = _this.props.validateEmail(emailValue);
            _this.setState({ error: null, email: emailValue, emailValid: emailValid, emailSet: true });
        };
        _this.signInOrCreateAccount = function () {
            //now that the button has been pressed can validate password
            var validPassword = true;
            if (!_this.validatedPassword) {
                validPassword = _this.props.validatePassword(_this.passwordElement.value);
                _this.validatedPassword = true;
                if (!validPassword) {
                    _this.setState({ passwordValid: false }); //not necessary?
                }
            }
            if (validPassword) {
                var self = _this;
                if (self.state.isSignIn) {
                    _this.props.auth.signInWithEmailAndPassword(_this.state.email, _this.state.password).catch(function (err) {
                        var firebaseError = err;
                        self.signInError(firebaseError);
                    });
                }
                else {
                    _this.props.auth.createUserWithEmailAndPassword(_this.state.email, _this.state.password).catch(function (err) {
                        var firebaseError = err;
                        self.signInError(firebaseError);
                    });
                }
            }
        };
        _this.switch = function () {
            _this.setState(function (prevState) {
                return { isSignIn: !prevState.isSignIn, error: null };
            });
        };
        _this.passwordFocused = function () {
            _this.setState({ passwordIsFocused: true });
        };
        _this.passwordBlurred = function () {
            _this.setState({ passwordIsFocused: false });
        };
        _this.emailFocused = function () {
            _this.setState({ emailIsFocused: true });
        };
        _this.emailBlurred = function () {
            _this.setState({ emailIsFocused: false });
        };
        _this.state = { error: null, passwordSet: false, emailSet: false, emailValid: true, email: "", password: "", passwordValid: true, isSignIn: _this.props.isSignIn, emailIsFocused: false, passwordIsFocused: false };
        return _this;
    }
    EmailSignInScreen.prototype.signInError = function (firebaseError) {
        var errorCode = firebaseError.code;
        var errorMessage;
        var errorFocusElement;
        var emailInError = false;
        var passwordInError = false;
        switch (errorCode) {
            case "auth/invalid-email":
                errorFocusElement = this.emailElement;
                emailInError = true;
                break;
            case "auth/user-not-found":
                errorFocusElement = this.emailElement;
                emailInError = true;
                break;
            case "auth/wrong-password":
                errorFocusElement = this.passwordElement;
                passwordInError = true;
                break;
            case "auth/email-already-in-use":
                errorFocusElement = this.passwordElement;
                passwordInError = true;
                break;
            case "auth/weak-password":
                errorFocusElement = this.passwordElement;
                passwordInError = true;
                break;
        }
        if (errorFocusElement) {
            errorFocusElement.focus();
        }
        this.setState({ emailValid: !emailInError, passwordValid: !passwordInError, error: firebaseError });
    };
    EmailSignInScreen.prototype.render = function () {
        var _this = this;
        var title = this.state.isSignIn ? this.props.signInTitle : this.props.createNewAccountTitle;
        var emailBorderColor = this.props.signInInputErrorColor;
        var emailBoxShadow = "";
        var passwordBorderColor = this.props.signInInputErrorColor;
        if (this.state.emailValid) {
            if (this.state.emailIsFocused) {
                emailBorderColor = this.props.signInInputFocusColor;
            }
            else {
                emailBorderColor = this.props.signInInputBorderColor;
            }
        }
        if (this.state.passwordValid) {
            if (this.state.passwordIsFocused) {
                passwordBorderColor = this.props.signInInputFocusColor;
            }
            else {
                passwordBorderColor = this.props.signInInputBorderColor;
            }
        }
        var ButtonType = this.props.signInButtonType;
        var labelStyle = { marginBottom: "7px" };
        var logOnContainerProps = {
            headerContent: {
                header: React.createElement("div", { style: this.props.signInHeaderStyle },
                    React.createElement("span", { style: this.props.signInTitleStyle }, title + " / "),
                    React.createElement(link_1.NonNavigatableLink, __assign({ clicked: this.switch, text: this.state.isSignIn ? this.props.createNewAccountTitle : this.props.signInTitle }, this.props.linkProps))),
                content: React.createElement("div", null,
                    React.createElement("label", { style: labelStyle }, this.props.emailHeader),
                    React.createElement(autoComplete_1.AutoComplete, __assign({ autoCompletedWait: 500, containerStyle: { marginBottom: "10px" } }, this.props.autoCompleteStyle),
                        React.createElement("input", { onBlur: this.emailBlurred, onFocus: this.emailFocused, ref: function (input) { return _this.emailElement = input; }, spellCheck: false, style: { borderRadius: "2px", padding: "5px", borderColor: emailBorderColor }, type: "email", name: "emailLogon", value: this.state.email, autoComplete: "on", onChange: this.emailChange })),
                    React.createElement("label", { style: labelStyle }, this.props.passwordHeader),
                    React.createElement(autoComplete_1.AutoComplete, __assign({ containerStyle: { marginBottom: "10px" } }, this.props.autoCompleteStyle),
                        React.createElement("input", { onBlur: this.passwordBlurred, onFocus: this.passwordFocused, ref: function (input) { return _this.passwordElement = input; }, style: { outline: "none", borderRadius: "2px", padding: "5px", borderColor: passwordBorderColor }, type: "password", name: "password", autoComplete: "password", value: this.state.password, onChange: this.passwordChange })),
                    React.createElement(ButtonType, __assign({}, this.props.signInButtonProps, { disabled: !(this.state.emailSet && this.state.emailValid && this.state.passwordValid), onClick: this.signInOrCreateAccount, text: this.props.signInButtonTextIsSubmit ? "Submit" : this.state.isSignIn ? this.props.signInTitle : this.props.createNewAccountTitle })))
            }, error: this.state.error
        };
        return React.createElement("div", null, React.cloneElement(this.props.emailLogOnContainer, logOnContainerProps));
    };
    return EmailSignInScreen;
}(React.Component));
EmailSignInScreen.defaultProps = {
    validateEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    validatePassword: function (password) {
        return password.length >= 6;
    },
    signInTitle: "Sign in",
    createNewAccountTitle: "Create new account",
    isSignIn: true,
    signInInputFocusColor: "blue",
    signInInputErrorColor: "red",
    signInInputBorderColor: "initial",
    emailHeader: "Email",
    passwordHeader: "Password ( 6+ )",
    signInButtonType: muiWrappedButton_1.MuiButtonWrapper,
    signInButtonTextIsSubmit: true,
};
var EmailLoggedInScreen = (function (_super) {
    __extends(EmailLoggedInScreen, _super);
    function EmailLoggedInScreen(props) {
        var _this = _super.call(this, props) || this;
        _this.logOut = function () {
            var self = _this;
            _this.props.auth.signOut().catch(function (err) {
                var firebaseError = err;
                this.setState({ error: err });
            });
        };
        _this.state = { error: null };
        return _this;
    }
    EmailLoggedInScreen.prototype.render = function () {
        var logOnContainerProps = {
            headerContent: {
                header: React.createElement("div", { style: this.props.loggedInHeaderStyle },
                    React.createElement("span", { style: this.props.signOutStyle },
                        React.createElement(link_1.NonNavigatableLink, __assign({ text: this.props.signOutTitle, clicked: this.logOut }, this.props.linkProps))),
                    React.createElement("span", { style: this.props.loggedInUserEmailStyle }, this.props.auth.currentUser.email))
            }, error: this.state.error
        };
        return React.createElement("div", null, React.cloneElement(this.props.emailLogOnContainer, logOnContainerProps));
    };
    return EmailLoggedInScreen;
}(React.Component));
EmailLoggedInScreen.defaultProps = {
    signOutTitle: "Sign out:",
    signOutStyle: { marginRight: "5px" }
};
//# sourceMappingURL=emailLogOn.js.map