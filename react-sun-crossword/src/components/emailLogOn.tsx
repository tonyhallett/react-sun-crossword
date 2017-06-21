import * as React from "react";
import * as ReactDOM from "react-dom";
import { auth } from '../helpers/firebaseApp';

import * as firebase from 'firebase'
import { Divider } from "./divider";
import { NonNavigatableLink } from "./link";
import { AutoComplete } from "./autoComplete";
import { SimpleButtonProps } from "./simpleButtonProps";
import { MuiButtonWrapper } from "./muiWrappedButton";

//this interface should probably go in the component that imports it
//export interface EmailLogOnStyleProps extends EmailSignInScreenStyleProps, EmailLoggedInScreenStyleProps {
//    dividerColor?: string
//}

/* keep - may need the technique at some point

export class EmailHeaderedScreen extends React.Component<any, HeaderContent>{
    clone: any;
    constructor(props) {
        super(props);
        this.state = { header: "", content: "" }
        var self = this;
        this.clone=React.cloneElement(this.props.children, { headerContentCallback: self.cb })
         //var t=   <HeaderContentExample headerContentCallback= { this.cb } />
    }
    cb = (headerContent: HeaderContent) => {
        this.setState(headerContent);
    }
    render() {
        return <div>
            {this.clone}
            <div style={{color:"red"}}>{this.state.header}</div>
            <div style={{ color: "blue" }}>{this.state.content}</div>
        </div>
    }
}
interface HeaderContentCallback {
    headerContentCallback?:(headerContent:HeaderContent)=>void
}
interface HeaderContentProps extends HeaderContent, HeaderContentCallback { }
interface HeaderContentExampleState {
    headerText: string,
    contentText:string
}
export class HeaderContentExample extends React.Component<HeaderContentCallback, HeaderContentExampleState>{
    //will want  to demo that when this updates so too does the container
    //container will probably need to clone
    constructor(props) {
        super(props);
        this.state = { headerText:"",contentText:"" }
    }
    count: number = 0;
    componentWillMount() {
        console.log("component will mount");
        var self = this;
        window.setInterval(() => {
            var newCount = self.count++;
            self.setState({ headerText: "This is the header: " + newCount, contentText: "This is the content: " + newCount });
        },1000)
    }
    //should do unmount


    render() {
        return <div/>
    }
    doCallback() { //could this be a hoc that will add handlers and then callback ?
        //render would have to set the object for the callback
        //and provide the name of the property
        var header = <div>{this.state.headerText}</div>
        var content = <div>{this.state.contentText}</div>
        this.props.headerContentCallback({ header: header, content: content });
    }
    componentDidMount() {
        this.doCallback()
    }
    componentDidUpdate() {
        this.doCallback();
    }
}

*/


interface EmailScreenWithErrorProps {
    error: firebase.auth.Error,
    dividerColour?: string
}
interface EmailScreenWithErrorState {

}
class EmailScreenWithError extends React.Component<EmailScreenWithErrorProps, EmailScreenWithErrorState> {
    constructor(props) {
        super(props);
        this.state = { error: "" };
    }
    getErrorMessage(error: firebase.auth.Error) {
        var errorMessage = "";
        if (error) {
            var errorCode = error.code;

            switch (errorCode) {
                case "auth/invalid-email":
                    errorMessage = "Email address is invalid";//is that firebase database rule against the email field ?
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
    }
    render() {
        return <div style={{ margin: "0px 0px 10px 0px" }}>

            <div>
                <div style={{ display: this.props.error? "initial" : "none" }}>
                    <Divider color={this.props.dividerColour} />
                    <br />
                    <div className="logonErrorBox" style={{ width: "100%", color: "red" }}>{this.getErrorMessage(this.props.error)}</div>
                </div>
            </div>
        </div>
    }
}


enum LogInState {
    waitingForAuto,
    loggingIn,
    loggedIn,
    loggedOut,
    creatingAccount
}
//export interface EmailLogOnCompProps extends EmailSignInScreenProps, EmailLoggedInScreenProps
export interface EmailLogOnCompProps extends EmailSignInScreenProps, EmailLoggedInScreenProps{
    reLoginWait: number,
    waitingAutoLogOnMessage?: string,
    
}
export interface EmailLogOnCompState {
    logInState: LogInState
}
export class EmailLogOnComp extends React.Component<EmailLogOnCompProps, EmailLogOnCompState> {
    public static defaultProps: Partial<EmailLogOnCompProps> = {
        waitingAutoLogOnMessage: "Attempting auto login....."
    };
    user: firebase.User = null;
    unsubscribe: any
    timeout: number
    willUnmountCalled:boolean=false
    constructor(props) {
        super(props);
        var initialState = LogInState.loggedOut;
        if (this.props.reLoginWait > 0) {
            initialState = LogInState.waitingForAuto
        }
        this.state = { logInState: initialState };
    }
    componentDidMount() {
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
                    newState = LogInState.loggedIn
                }
                self.user = user;
                self.setState({ logInState: newState })
            }
            
        })
    }
    componentWillUnmount() {
        this.willUnmountCalled = true;
        this.unsubscribe();
        window.clearTimeout(this.timeout);
    }
    
    render() {
        var container = <EmailLogOnContainer dividerColour={this.props.dividerColour} />
        switch (this.state.logInState) {
            case LogInState.waitingForAuto:
                return <EmailWaitingForAuto emailLogOnContainer={container} waitingAutoLogOnMessage={this.props.waitingAutoLogOnMessage}/>
                //break;
            case LogInState.loggedIn:
                return <EmailLoggedInScreen emailLogOnContainer={container} auth={this.props.auth} signOutTitle={this.props.signOutTitle} linkColor={this.props.linkColor} />
                //break;
            case LogInState.loggedOut:
                //break;
                return <EmailSignInScreen emailLogOnContainer={container} dividerColour={this.props.dividerColour} signInButtonProps={this.props.signInButtonProps} signInButtonType={this.props.signInButtonType} focusColor={this.props.focusColor} isSignIn={true} validatePassword={this.props.validatePassword} validateEmail={this.props.validateEmail} auth={this.props.auth}/>
        }          
    }
}





interface HeaderContent {
    header?: any,
    content?: any,
}
//base interfaces for screens

interface EmailScreenProps{
    emailLogOnContainer: React.ReactElement<EmailLogOnContainerProps>
}



interface EmailWaitingForAutoProps extends EmailScreenProps{
    waitingAutoLogOnMessage:string
}
class EmailWaitingForAuto extends React.Component<EmailWaitingForAutoProps, undefined>{
    render(){
        var logOnContainerProps: EmailLogOnContainerCloneProps = {
            headerContent: {
                header: <div>{this.props.waitingAutoLogOnMessage}</div>
            }
        }
        return <div>
            {React.cloneElement(this.props.emailLogOnContainer, logOnContainerProps)}
            </div>
    }
}

interface EmailLogOnContainerCloneProps {
    //might put all three in a single prop
    headerContent?: HeaderContent,
    error?: firebase.auth.Error
}
interface EmailLogOnContainerProps extends EmailLogOnContainerCloneProps  {
    dividerColour: string,
}

class EmailLogOnContainer extends React.Component<EmailLogOnContainerProps, undefined>{
    constructor(props) {
        super(props);
        //this.state = { error: null };
    }
    render() {
        //styling to add
        return <div>
            <div>{this.props.headerContent.header}</div>
            <div>{this.props.headerContent.content}</div>
            <EmailScreenWithError dividerColour={this.props.dividerColour} error={this.props.error} />
        </div>
    }
}

interface EmailSignInScreenStyleProps {
    focusColor?: string,
    errorColor?: string,
    emailPasswordBorderColor?: string,
    signInButtonType?: React.ComponentClass<SimpleButtonProps>,
    signInButtonProps?: {},

}
interface EmailSignInScreenProps extends EmailScreenProps, EmailSignInScreenStyleProps {
    auth: firebase.auth.Auth
    validateEmail?: (email: string) => boolean,
    validatePassword?: (password: string) => boolean
    isSignIn?: boolean,//should handle prop change if was allowing container to change....
    signInTitle?: string,
    emailHeader?: string,
    passwordHeader?: string,
    createNewAccountTitle?: string,
    dividerColour?: string

}
interface EmailSignInScreenState {
    email: string,
    password: string,
    passwordSet: boolean,
    emailSet: boolean,
    emailValid: boolean,
    passwordValid: boolean,
    isSignIn: boolean,
    passwordIsFocused: boolean,
    emailIsFocused: boolean,
    error: firebase.auth.Error

}
class EmailSignInScreen extends React.Component<EmailSignInScreenProps, EmailSignInScreenState> {
    public static defaultProps: Partial<EmailSignInScreenProps> = {
        validateEmail: function (email: string) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        validatePassword: function (password: string) {
            return password.length >= 6
        },
        signInTitle: "Sign in:",
        createNewAccountTitle: "Create new account",
        isSignIn: true,
        focusColor: "blue",
        errorColor: "red",
        emailPasswordBorderColor: "initial",
        emailHeader: "Email",
        passwordHeader: "Password ( 6+ )",
        signInButtonType: MuiButtonWrapper

    };
    constructor(props) {
        super(props);
        this.state = { error:null, passwordSet: false, emailSet: false, emailValid: true, email: "", password: "", passwordValid: true, isSignIn: this.props.isSignIn, emailIsFocused: false, passwordIsFocused: false }
    }
    emailPasswordPreviousValue: string
    passwordElement: HTMLInputElement;
    emailElement: HTMLInputElement;
    //this does not get done on auto complete
    passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        var password = event.target.value;
        this.setState({error:null, password: password, passwordValid: this.props.validatePassword(password), passwordSet: true })
    }
    emailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        var emailValue = event.target.value;
        var emailValid = this.props.validateEmail(emailValue);
        this.setState({error:null, email: emailValue, emailValid: emailValid, emailSet: true })
    }
    validatedPassword: boolean
    signInOrCreateAccount = () => {
        //now that the button has been pressed can validate password
        var validPassword = true;
        if (!this.validatedPassword) {
            validPassword = this.props.validatePassword(this.passwordElement.value);
            this.validatedPassword = true;
            if (!validPassword) {
                this.setState({ passwordValid: false });//not necessary?
            }
        }
        if (validPassword) {
            var self = this;
            if (self.state.isSignIn) {
                this.props.auth.signInWithEmailAndPassword(this.state.email, this.state.password).catch(function (err) {
                    var firebaseError = (err as any) as firebase.auth.Error;
                    self.signInError(firebaseError);
                });
            } else {
                this.props.auth.createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function (err) {
                    var firebaseError = (err as any) as firebase.auth.Error;
                    self.signInError(firebaseError);
                });
            }

        }

    }
    signInError(firebaseError: firebase.auth.Error) {
        var errorCode = firebaseError.code;
        var errorMessage: string;
        var errorFocusElement: HTMLElement;
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
        this.setState({ emailValid: !emailInError, passwordValid: !passwordInError,error:firebaseError })
    }
    switch = () => {
        this.setState(function (prevState: EmailSignInScreenState) {
            return { isSignIn: !prevState.isSignIn ,error:null}
        });
    }
    passwordFocused = () => {
        this.setState({ passwordIsFocused: true })
    }
    passwordBlurred = () => {
        this.setState({ passwordIsFocused: false })
    }
    emailFocused = () => {
        this.setState({ emailIsFocused: true })
    }
    emailBlurred = () => {
        this.setState({ emailIsFocused: false })
    }

    render() {
        var title = this.state.isSignIn ? this.props.signInTitle : this.props.createNewAccountTitle;
        var emailBorderColor = this.props.errorColor;
        var emailBoxShadow = "";
        var passwordBorderColor = this.props.errorColor;
        var focusBoxShadow = "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px rgba(0, 126, 255, 0.1)"
        if (this.state.emailIsFocused) {
            emailBoxShadow = focusBoxShadow;
        }
        if (this.state.emailValid) {
            if (this.state.emailIsFocused) {
                emailBorderColor = this.props.focusColor;
            } else {
                emailBorderColor = this.props.emailPasswordBorderColor;
            }
        }

        if (this.state.passwordValid) {
            if (this.state.passwordIsFocused) {
                passwordBorderColor = this.props.focusColor;
            } else {
                passwordBorderColor = this.props.emailPasswordBorderColor
            }
        }

        var ButtonType = this.props.signInButtonType;

        var labelStyle = { marginBottom: "7px" }

        var logOnContainerProps: EmailLogOnContainerCloneProps = {
            headerContent: {
                header: <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                    <span>{title + " / "}</span>
                    <NonNavigatableLink clicked={this.switch} removeUnderline={true} text={this.state.isSignIn ? this.props.createNewAccountTitle : this.props.signInTitle} />
                </div>,
                content: <div>
                        <label style={labelStyle}>{this.props.emailHeader}</label>
                        <AutoComplete autoCompletedWait={500} containerStyle={{ marginBottom: "10px" }}>
                            <input onBlur={this.emailBlurred} onFocus={this.emailFocused} ref={(input) => this.emailElement = input} spellCheck={false} style={{ borderRadius: "2px", padding: "5px", borderColor: emailBorderColor }} type="email" name="emailLogon" value={this.state.email} autoComplete="on" onChange={this.emailChange} />
                        </AutoComplete>

                        <label style={labelStyle}>{this.props.passwordHeader}</label>
                        <AutoComplete containerStyle={{ marginBottom: "10px" }}>
                            <input onBlur={this.passwordBlurred} onFocus={this.passwordFocused} ref={(input) => this.passwordElement = input} style={{ outline: "none", borderRadius: "2px", padding: "5px", borderColor: passwordBorderColor }} type="password" name="password" autoComplete="password" value={this.state.password} onChange={this.passwordChange} />
                        </AutoComplete>
                        <ButtonType {...this.props.signInButtonProps} disabled={!(this.state.emailSet && this.state.emailValid && this.state.passwordValid)} onClick={this.signInOrCreateAccount} text={this.state.isSignIn ? this.props.signInTitle : this.props.createNewAccountTitle} />
                </div>
            }, error:this.state.error
        }
        return <div>
            {React.cloneElement(this.props.emailLogOnContainer, logOnContainerProps)}
        </div>
    }
}

interface EmailLoggedInScreenStyleProps {
    linkColor?: string
}
interface EmailLoggedInScreenProps extends EmailScreenProps, EmailLoggedInScreenStyleProps {
    auth: firebase.auth.Auth,
    signOutTitle?: string
}
interface EmailLoggedInScreenState {
    error: firebase.auth.Error
}
class EmailLoggedInScreen extends React.Component<EmailLoggedInScreenProps, EmailLoggedInScreenState> {
    public static defaultProps: Partial<EmailLoggedInScreenProps> = {
        signOutTitle: "Sign out:"
    };
    constructor(props) {
        super(props);
        this.state = { error:null }
    }
    logOut = () => {
        var self = this;
        this.props.auth.signOut().catch(function (err) {
            var firebaseError = (err as any) as firebase.auth.Error;
            this.setState({error:err})
        });
    }
    render() {

        var logOnContainerProps: EmailLogOnContainerCloneProps = {
            headerContent: {
                header: <div>
                    <span style={{ marginRight: "5px" }}>
                        <NonNavigatableLink color={this.props.linkColor} text={this.props.signOutTitle} clicked={this.logOut} />
                    </span>
                    <span>{this.props.auth.currentUser.email}</span>
                </div>
            }, error:this.state.error
        }
        return <div>
            {React.cloneElement(this.props.emailLogOnContainer, logOnContainerProps)}
        </div>
      
    }
}

/*
interface EmailScreenWithErrorProps {
    dividerColour?: string
}
interface EmailScreenWithErrorState {
    error: string
}
class EmailScreenWithError extends React.Component<EmailScreenWithErrorProps, EmailScreenWithErrorState> {
    constructor(props) {
        super(props);
        this.state = { error: "" };
    }
    errored = (error: firebase.auth.Error) => {
        this.setState({ error: this.getErrorMessage(error) })
    }
    getErrorMessage(error: firebase.auth.Error) {
        var errorMessage = "";
        if (error) {
            var errorCode = error.code;

            switch (errorCode) {
                case "auth/invalid-email":
                    errorMessage = "Email address is invalid";//is that firebase database rule against the email field ?
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
    }
    render() {
        return <div style={{margin:"0px 0px 10px 0px"}}>
            {React.cloneElement(this.props.children as React.ReactElement<any>, { errored: this.errored })}
            <div>
                <div style={{ display: this.state.error.length > 0 ? "initial" : "none" }}>
                    <Divider color={this.props.dividerColour} />
                    <br />
                    <div className="logonErrorBox" style={{ width: "100%", color: "red" }}>{this.state.error}</div>
                </div>
            </div>
            </div>
    }
}
*/

/*
class EmailLoggedOutScreen extends React.Component<EmailSignInScreenProps, null> {
    constructor(props) {
        super(props);
    }

    render() {
        return <EmailScreenWithError dividerColour={this.props.dividerColour}>
            <EmailSignInScreen {...this.props} />
        </EmailScreenWithError>
    }
}
*/
/*
interface EmailLoggedInScreenStyleProps {
    linkColor?: string
}
interface EmailLoggedInScreenProps extends EmailErroredProps, EmailLoggedInScreenStyleProps {
    auth: firebase.auth.Auth,
    signOutTitle?: string
}
class EmailLoggedInScreen extends React.Component<EmailLoggedInScreenProps, null> {
    public static defaultProps: Partial<EmailLoggedInScreenProps> = {
        signOutTitle: "Sign out:"
    };
    constructor(props) {
        super(props);
    }
    logOut = () => {
        var self = this;
        this.props.auth.signOut().catch(function (err) {
            var firebaseError = (err as any) as firebase.auth.Error;
            self.props.errored(firebaseError);
        });
    }
    render() {
        return <div style={{ fontWeight: "bold", padding: "10px" }}>
            <span style={{ marginRight: "5px" }}><NonNavigatableLink color={this.props.linkColor} text={this.props.signOutTitle} clicked={this.logOut} /></span>
            <span>{this.props.auth.currentUser.email}</span>
        </div>
    }
}


interface EmailSignInScreenStyleProps {
    focusColor?: string,
    errorColor?: string,
    emailPasswordBorderColor?: string,
    signInButtonType?: React.ComponentClass<SimpleButtonProps>,
    signInButtonProps?: {},
    
}
interface EmailSignInScreenProps extends EmailSignInScreenStyleProps, EmailErroredProps {
    auth: firebase.auth.Auth
    validateEmail?: (email: string) => boolean,
    validatePassword?:(password:string)=>boolean
    isSignIn?: boolean,//should handle prop change if was allowing container to change....
    signInTitle?: string,
    emailHeader?: string,
    passwordHeader?:string,
    createNewAccountTitle?: string,
    dividerColour?: string
    
}
interface EmailSignInScreenState {
    email: string,
    password: string,
    passwordSet: boolean,
    emailSet:boolean,
    emailValid: boolean,
    passwordValid: boolean,
    isSignIn: boolean,
    passwordIsFocused:boolean,
    emailIsFocused: boolean,
    
}
class EmailSignInScreen extends React.Component<EmailSignInScreenProps, EmailSignInScreenState> {
    public static defaultProps: Partial<EmailSignInScreenProps> = {
        validateEmail: function (email: string) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        validatePassword: function (password: string) {
            return password.length >= 6
        },
        signInTitle: "Sign in:",
        createNewAccountTitle: "Create new account",
        isSignIn: true,
        focusColor: "blue",
        errorColor: "red",
        emailPasswordBorderColor: "initial",
        emailHeader: "Email",
        passwordHeader: "Password ( 6+ )",
        signInButtonType: MuiButtonWrapper

    };
    constructor(props) {
        super(props);
        this.state = { passwordSet: false, emailSet: false, emailValid: true, email: "", password: "", passwordValid: true, isSignIn: this.props.isSignIn, emailIsFocused: false, passwordIsFocused: false }
    }
    emailPasswordPreviousValue:string
    passwordElement: HTMLInputElement;
    emailElement: HTMLInputElement;
    //this does not get done on auto complete
    passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        var password = event.target.value;
        this.props.errored(null);
        this.setState({ password: password, passwordValid: this.props.validatePassword(password),passwordSet:true })
    }
    emailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.errored(null);
        var emailValue = event.target.value;
        var emailValid = this.props.validateEmail(emailValue);
        this.setState({ email: emailValue, emailValid: emailValid,emailSet:true })
    }
    validatedPassword:boolean
    signInOrCreateAccount = () => {
        //now that the button has been pressed can validate password
        var validPassword = true;
        if (!this.validatedPassword) {
            validPassword = this.props.validatePassword(this.passwordElement.value);
            this.validatedPassword = true;
            if (!validPassword) {
                this.setState({ passwordValid: false });//not necessary?
            }
        }
        if (validPassword) {
            var self = this;
            if (self.state.isSignIn) {
                this.props.auth.signInWithEmailAndPassword(this.state.email, this.state.password).catch(function (err) {
                    var firebaseError = (err as any) as firebase.auth.Error;
                    self.signInError(firebaseError);
                });
            } else {
                this.props.auth.createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function (err) {
                    var firebaseError = (err as any) as firebase.auth.Error;
                    self.signInError(firebaseError);
                });
            }
            
        }
        
    }
    signInError(firebaseError: firebase.auth.Error) {
        var errorCode = firebaseError.code;
        var errorMessage: string;
        var errorFocusElement: HTMLElement;
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
        this.setState({ emailValid: !emailInError, passwordValid: !passwordInError })
    }
    switch=() =>{
        this.props.errored(null);
        this.setState(function (prevState: EmailSignInScreenState) {
            return { isSignIn: !prevState.isSignIn }
        });
    }
    passwordFocused = () => {
        this.setState({ passwordIsFocused: true })
    }
    passwordBlurred = () => {
        this.setState({ passwordIsFocused: false })
    }
    emailFocused = () => {
        this.setState({ emailIsFocused: true })
    }
    emailBlurred = () => {
        this.setState({emailIsFocused:false})
    }

    render() {
        var title = this.state.isSignIn ? this.props.signInTitle : this.props.createNewAccountTitle;
        var emailBorderColor = this.props.errorColor;
        var emailBoxShadow = "";
        var passwordBorderColor= this.props.errorColor;
        var focusBoxShadow = "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px rgba(0, 126, 255, 0.1)"
        if (this.state.emailIsFocused) {
            emailBoxShadow = focusBoxShadow;
        }
        if (this.state.emailValid) {
            if (this.state.emailIsFocused) {
                emailBorderColor = this.props.focusColor;
            } else {
                emailBorderColor = this.props.emailPasswordBorderColor;
            }
        }

        if (this.state.passwordValid) {
            if (this.state.passwordIsFocused) {
                passwordBorderColor = this.props.focusColor;
            } else {
                passwordBorderColor = this.props.emailPasswordBorderColor
            }
        }
        
        var ButtonType = this.props.signInButtonType;

        var labelStyle = { marginBottom: "7px" }
        //could create AutoCompleteLabelInput for consistency
        return <div style={{ padding: "10px 0px 10px 0px" }}>
            
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}><span>{title + " / "}</span>
                <NonNavigatableLink clicked={this.switch} removeUnderline={true} text={this.state.isSignIn ? this.props.createNewAccountTitle : this.props.signInTitle} />
               
            </div>

            <Divider color={this.props.dividerColour} />
            <br />
            

            <label style={labelStyle}>{this.props.emailHeader}</label>
            <AutoComplete  autoCompletedWait={500} containerStyle={{ marginBottom: "10px" }}>
                <input onBlur={this.emailBlurred} onFocus={this.emailFocused} ref={(input) => this.emailElement = input} spellCheck={false} style={{ borderRadius: "2px", padding: "5px", borderColor: emailBorderColor }} type="email" name="emailLogon" value={this.state.email} autoComplete="on" onChange={this.emailChange} />
            </AutoComplete>
            
            <label style={labelStyle}>{this.props.passwordHeader}</label>
            <AutoComplete containerStyle={{ marginBottom: "10px" }}>
                <input onBlur={this.passwordBlurred} onFocus={this.passwordFocused} ref={(input) => this.passwordElement = input} style={{ outline: "none", borderRadius: "2px", padding: "5px", borderColor: passwordBorderColor }} type="password" name="password" autoComplete="password" value={this.state.password} onChange={this.passwordChange} />
            </AutoComplete>
            

            <ButtonType {...this.props.signInButtonProps} disabled={!(this.state.emailSet && this.state.emailValid && this.state.passwordValid)} onClick={this.signInOrCreateAccount} text={this.state.isSignIn ? this.props.signInTitle : this.props.createNewAccountTitle} />
        </div>
    }
}



*/
