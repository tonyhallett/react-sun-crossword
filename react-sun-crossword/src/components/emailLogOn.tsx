import * as React from "react";
import { app } from '../helpers/firebaseApp';
import * as firebaseui from 'firebaseui'
import * as firebase from 'firebase'

export interface EmailLogOnProps {
    loggedIn: (isLoggedIn: boolean)=>void
}

export class EmailLogOn extends React.Component<EmailLogOnProps, null> {
    containerId = "emailLogOnContainer"
    auth: firebase.auth.Auth
    div: HTMLDivElement
    constructor(props) {
        super(props);

    }
    render() {
        return <div ref={(div) => this.div=div} id={this.containerId} />
    }
    componentDidMount() {
        this.auth = app.auth();
        var ui = new firebaseui.auth.AuthUI(this.auth);
        var uiConfig = {
            signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
            callbacks: {
                signInSuccess: function (currentUser, credential, redirectUrl) {
                    return false;
                }
            }
        }
        ui.start('#' + this.containerId, uiConfig);
        var self = this;
        this.auth.onAuthStateChanged(function (user) {
            console.log("OnAuthStateChanged");
            console.log(user);
            var loggedIn = !!user
            if (loggedIn) {
                self.div.style.display = "none";
            }
            self.props.loggedIn(loggedIn);
        });
        

    }
}
