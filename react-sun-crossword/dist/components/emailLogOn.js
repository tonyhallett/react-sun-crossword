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
var divider_1 = require("./divider");
var link_1 = require("./link");
var autoComplete_1 = require("./autoComplete");
var WrappedButton = (function (_super) {
    __extends(WrappedButton, _super);
    function WrappedButton(props) {
        return _super.call(this, props) || this;
    }
    WrappedButton.prototype.render = function () {
        return React.createElement("button", { disabled: this.props.disabled, style: this.props.style, onClick: this.props.onClick }, this.props.text);
    };
    return WrappedButton;
}(React.Component));
WrappedButton.defaultProps = {
    style: {
        borderRadius: "8px", padding: "5px"
    }
};
exports.WrappedButton = WrappedButton;
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
        if (_this.props.reLoginWait > 0) {
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
        }, this.props.reLoginWait);
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
        var renderScreen;
        switch (this.state.logInState) {
            case LogInState.waitingForAuto:
                renderScreen = React.createElement("div", { style: { padding: "10px" } },
                    React.createElement("div", null, this.props.waitingAutoLogOnMessage));
                break;
            case LogInState.loggedIn:
                renderScreen = React.createElement(EmailScreenWithError, null,
                    React.createElement(EmailLoggedInScreen, { signOutTitle: this.props.signOutTitle, auth: this.props.auth }));
                break;
            case LogInState.loggedOut:
                renderScreen = React.createElement(EmailLoggedOutScreen, { signInButtonProps: this.props.signInButtonProps, signInButtonType: this.props.signInButtonType, focusColor: this.props.focusColor, isSignIn: true, validatePassword: this.props.validatePassword, validateEmail: this.props.validateEmail, auth: this.props.auth });
                break;
        }
        return React.createElement("div", null,
            " ",
            renderScreen);
    };
    return EmailLogOnComp;
}(React.Component));
EmailLogOnComp.defaultProps = {
    waitingAutoLogOnMessage: "Attempting auto login....."
};
exports.EmailLogOnComp = EmailLogOnComp;
var EmailLoggedInScreen = (function (_super) {
    __extends(EmailLoggedInScreen, _super);
    function EmailLoggedInScreen(props) {
        var _this = _super.call(this, props) || this;
        _this.logOut = function () {
            var self = _this;
            _this.props.auth.signOut().catch(function (err) {
                var firebaseError = err;
                self.props.errored(firebaseError);
            });
        };
        return _this;
    }
    EmailLoggedInScreen.prototype.render = function () {
        return React.createElement("div", { style: { fontWeight: "bold", padding: "10px" } },
            React.createElement("span", { style: { marginRight: "5px" } },
                React.createElement(link_1.NonNavigatableLink, { text: this.props.signOutTitle, clicked: this.logOut })),
            React.createElement("span", null, this.props.auth.currentUser.email));
    };
    return EmailLoggedInScreen;
}(React.Component));
EmailLoggedInScreen.defaultProps = {
    signOutTitle: "Sign out:"
};
var EmailLoggedOutScreen = (function (_super) {
    __extends(EmailLoggedOutScreen, _super);
    function EmailLoggedOutScreen(props) {
        return _super.call(this, props) || this;
    }
    EmailLoggedOutScreen.prototype.render = function () {
        return React.createElement(EmailScreenWithError, null,
            React.createElement(EmailSignInScreen, __assign({}, this.props)));
    };
    return EmailLoggedOutScreen;
}(React.Component));
var EmailScreenWithError = (function (_super) {
    __extends(EmailScreenWithError, _super);
    function EmailScreenWithError(props) {
        var _this = _super.call(this, props) || this;
        _this.errored = function (error) {
            _this.setState({ error: _this.getErrorMessage(error) });
        };
        _this.state = { error: "" };
        return _this;
    }
    EmailScreenWithError.prototype.getErrorMessage = function (error) {
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
    EmailScreenWithError.prototype.render = function () {
        return React.createElement("div", { style: { margin: "0px 0px 10px 0px" } },
            React.cloneElement(this.props.children, { errored: this.errored }),
            React.createElement("div", { style: { paddingLeft: "10px", paddingRight: "10px" } },
                React.createElement("div", { style: { display: this.state.error.length > 0 ? "initial" : "none" } },
                    React.createElement(divider_1.Divider, null),
                    React.createElement("br", null),
                    React.createElement("div", { className: "logonErrorBox", style: { width: "100%", color: "red" } }, this.state.error))));
    };
    return EmailScreenWithError;
}(React.Component));
var EmailSignInScreen = (function (_super) {
    __extends(EmailSignInScreen, _super);
    function EmailSignInScreen(props) {
        var _this = _super.call(this, props) || this;
        //this does not get done on auto complete
        _this.passwordChange = function (event) {
            var password = event.target.value;
            _this.props.errored(null);
            _this.setState({ password: password, passwordValid: _this.props.validatePassword(password), passwordSet: true });
        };
        _this.emailChange = function (event) {
            _this.props.errored(null);
            var emailValue = event.target.value;
            var emailValid = _this.props.validateEmail(emailValue);
            _this.setState({ email: emailValue, emailValid: emailValid, emailSet: true });
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
            _this.props.errored(null);
            _this.setState(function (prevState) {
                return { isSignIn: !prevState.isSignIn };
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
        _this.state = { passwordSet: false, emailSet: false, emailValid: true, email: "", password: "", passwordValid: true, isSignIn: _this.props.isSignIn, emailIsFocused: false, passwordIsFocused: false };
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
        this.props.errored(firebaseError);
        this.setState({ emailValid: !emailInError, passwordValid: !passwordInError });
    };
    EmailSignInScreen.prototype.render = function () {
        var _this = this;
        var title = this.state.isSignIn ? this.props.signInTitle : this.props.createNewAccountTitle;
        var emailBorderColor = this.props.errorColor;
        var emailBoxShadow = "";
        var passwordBorderColor = this.props.errorColor;
        var focusBoxShadow = "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px rgba(0, 126, 255, 0.1)";
        if (this.state.emailIsFocused) {
            emailBoxShadow = focusBoxShadow;
        }
        if (this.state.emailValid) {
            if (this.state.emailIsFocused) {
                emailBorderColor = this.props.focusColor;
            }
            else {
                emailBorderColor = this.props.emailPasswordBorderColor;
            }
        }
        if (this.state.passwordValid) {
            if (this.state.passwordIsFocused) {
                passwordBorderColor = this.props.focusColor;
            }
            else {
                passwordBorderColor = this.props.emailPasswordBorderColor;
            }
        }
        var ButtonType = this.props.signInButtonType;
        var labelStyle = { marginBottom: "7px" };
        //could create AutoCompleteLabelInput for consistency
        return React.createElement("div", { style: { padding: "10px" } },
            React.createElement("div", { style: { fontWeight: "bold", marginBottom: "5px" } },
                React.createElement("span", null, title + " / "),
                React.createElement(link_1.NonNavigatableLink, { clicked: this.switch, removeUnderline: true, text: this.state.isSignIn ? this.props.createNewAccountTitle : this.props.signInTitle })),
            React.createElement(divider_1.Divider, null),
            React.createElement("br", null),
            React.createElement("label", { style: labelStyle }, this.props.emailHeader),
            React.createElement(autoComplete_1.AutoComplete, { autoCompletedWait: 500, containerStyle: { marginBottom: "10px" } },
                React.createElement("input", { onBlur: this.emailBlurred, onFocus: this.emailFocused, ref: function (input) { return _this.emailElement = input; }, spellCheck: false, style: { borderRadius: "2px", padding: "5px", borderColor: emailBorderColor }, type: "email", name: "emailLogon", value: this.state.email, autoComplete: "on", onChange: this.emailChange })),
            React.createElement("label", { style: labelStyle }, this.props.passwordHeader),
            React.createElement(autoComplete_1.AutoComplete, { containerStyle: { marginBottom: "10px" } },
                React.createElement("input", { onBlur: this.passwordBlurred, onFocus: this.passwordFocused, ref: function (input) { return _this.passwordElement = input; }, style: { outline: "none", borderRadius: "2px", padding: "5px", borderColor: passwordBorderColor }, type: "password", name: "password", autoComplete: "password", value: this.state.password, onChange: this.passwordChange })),
            React.createElement(ButtonType, __assign({}, this.props.signInButtonProps, { disabled: !(this.state.emailSet && this.state.emailValid && this.state.passwordValid), onClick: this.signInOrCreateAccount, text: this.state.isSignIn ? this.props.signInTitle : this.props.createNewAccountTitle })));
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
    signInTitle: "Sign in:",
    createNewAccountTitle: "Create new account",
    isSignIn: true,
    focusColor: "blue",
    errorColor: "red",
    emailPasswordBorderColor: "initial",
    emailHeader: "Email",
    passwordHeader: "Password ( 6+ )",
    signInButtonType: WrappedButton
};
//# sourceMappingURL=emailLogOn.js.map