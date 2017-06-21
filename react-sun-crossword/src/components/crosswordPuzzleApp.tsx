
import * as React from "react";
import { CrosswordModel, ConvertCrosswordJsonToModel, ConvertCrosswordModelToJson, CrosswordModelJson, SolvingMode } from '../models/index'
import { CrosswordPuzzleKeyEvents } from "./crosswordPuzzle";
import { Promise } from "es6-promise";
import Select = require("react-select")
import { TwoCol } from "./twoCol";
import { CrosswordPuzzleChooseDetail, CrosswordPuzzleJsonStore, CrosswordPuzzleDataStore} from "../helpers/stores";
import { crosswordPuzzleDataStore } from "../helpers/crosswordPuzzleDataStore"
import { crosswordPuzzleJsonStore } from "../helpers/crosswordPuzzleJsonStore"
import { EmailLogOnComp } from "./emailLogOn";
import { auth } from '../helpers/firebaseApp'
import Button = require('muicss/lib/react/button');
import { connectedDatabase, UserSaveDetails } from "../helpers/connectedDatabase";
import 'firebase/database';
import { CrosswordPuzzleChooser, DefaultSelectChooserButtonProps } from "./crosswordPuzzleChooser";
import { MuiButton, MuiButtonProps } from "./muiButton";
import { MuiButtonWrapper } from "./muiWrappedButton";




interface CrosswordPuzzleAppState {
    crosswordModel: CrosswordModel,
    userLoggedIn: string,
}
export class CrosswordPuzzleApp extends React.Component<undefined, CrosswordPuzzleAppState> {
    constructor(props) {
        super(props);
        this.state = { crosswordModel: null, userLoggedIn: null};
    }
    componentDidMount() {
        auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
    }
    
    crosswordSelected = (selectedCrossword: CrosswordModelJson) => {
        var crosswordModel = ConvertCrosswordJsonToModel(selectedCrossword);
        
        this.setState({ crosswordModel: crosswordModel });
    }
    saveUserCrossword = () => {
        
        var modelJson = ConvertCrosswordModelToJson(this.state.crosswordModel);
        connectedDatabase.saveUserCrossword(this.state.userLoggedIn, modelJson.id, modelJson, { id: modelJson.id, datePublished: modelJson.datePublished, title: modelJson.title }).then(function (userSaveDetails:UserSaveDetails) {
            //will now know not dirty
        }).catch(function (err) {
            //should be firebase error
            //logic to be done later
        });
        
    }
    onAuthStateChanged(user: firebase.User) {

        var loggedIn = user !== null;
        if (loggedIn) {
            this.setState({ userLoggedIn: user.uid })
        } else{
            this.setState({ userLoggedIn: null })
        }
    }
    //going to have to deal with saving of old one here

    
    
    render() {
        var primaryColour ="#f2e090"
        var buttonStyle: React.CSSProperties =  {
            backgroundColor: primaryColour,
            color:"gray"
        }
        var buttonProps: MuiButtonProps = {
            buttonStyle: buttonStyle,
            disabledBackgroundColor: "#667799",
            disabledColor:"white",
            lightenPercentage:0.1
        }
        var selectChooserProps: DefaultSelectChooserButtonProps = {
            ButtonType: MuiButtonWrapper,
            buttonProps: buttonProps
            
        }
        //explicit height allows room for the Select 
        var leftContent = <div style={{ minHeight: "1000px" }}>
            <CrosswordPuzzleChooser emailLogOnStyleProps={{ signInButtonProps: buttonProps, dividerColor: primaryColour }} selectChooserProps={selectChooserProps} userLoggedIn={this.state.userLoggedIn} crosswordSelected={this.crosswordSelected} /> 
            </div>
        var rightContent = <CrosswordPuzzleKeyEvents crosswordModel={this.state.crosswordModel} />
        if (this.state.crosswordModel === null) {
            rightContent=<div/>
        }
        return <div >
            
            <MuiButtonWrapper disabled={!this.state.userLoggedIn || this.state.crosswordModel === null} text="Click to save" onClick={this.saveUserCrossword}   {...buttonProps}></MuiButtonWrapper>

            <TwoCol leftContent={leftContent} rightContent={rightContent}>
            
            </TwoCol>
            </div>

       
        //return <div>
        //    <div style={{width:"500px"}}>
        //        <CrosswordPuzzleChooser userLoggedIn={this.state.userLoggedIn} crosswordSelected={this.crosswordSelected} />
        //    </div>
        //    {this.state.crosswordModel ? <CrosswordPuzzleKeyEvents crosswordModel={this.state.crosswordModel} /> : null}
        //    <button disabled={!this.state.userLoggedIn} onClick={this.saveUserCrossword}>Click to save</button>

        //     </div>
    }
    
}
