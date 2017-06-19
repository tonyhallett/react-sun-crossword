
import * as React from "react";
import { CrosswordModel, ConvertCrosswordJsonToModel, ConvertCrosswordModelToJson, CrosswordModelJson, SolvingMode } from '../models/index'
import { CrosswordPuzzleKeyEvents } from "./crosswordPuzzle";
import { Promise } from "es6-promise";
import Select = require("react-select")
import { TwoCol } from "./twoCol";
import { CrosswordPuzzleChooseDetail, CrosswordPuzzleJsonStore, CrosswordPuzzleDataStore} from "../helpers/stores";
import { crosswordPuzzleDataStore } from "../helpers/crosswordPuzzleDataStore"
import { crosswordPuzzleJsonStore } from "../helpers/crosswordPuzzleJsonStore"
import {  EmailLogOnComp, ButtonProps } from "./emailLogOn";
import { auth } from '../helpers/firebaseApp'
import Button = require('muicss/lib/react/button');
import { connectedDatabase, UserSaveDetails } from "../helpers/connectedDatabase";
import 'firebase/database';
import { CrosswordPuzzleChooser } from "./crosswordPuzzleChooser";
import { MuiButton } from "./muiButton";


interface MuiButtonProps extends ButtonProps{
    color:string
}
class MuiButtonWrapper extends React.Component<MuiButtonProps, null>{
    constructor(props) {
        super(props);
    }
    muiMouseDown = () => {
        this.props.onClick();
    }
    render() {
        return <Button disabled={this.props.disabled} color={this.props.color} onMouseDown={this.muiMouseDown} >{this.props.text}</Button>
    }
}

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
        //explicit height allows room for the Select 
        var leftContent = <div style={{ minHeight: "1000px" }}>
            <CrosswordPuzzleChooser userLoggedIn={this.state.userLoggedIn} crosswordSelected={this.crosswordSelected} /> 
            </div>
        var rightContent = <CrosswordPuzzleKeyEvents crosswordModel={this.state.crosswordModel} />
        if (this.state.crosswordModel === null) {
            rightContent=<div/>
        }
        return <div >
            
            <MuiButton disabled={false} buttonStyle={{padding:"50px", backgroundColor: "green", color: "white" }}>My Mui</MuiButton>
            <button disabled={!this.state.userLoggedIn} onClick={this.saveUserCrossword}>Click to save</button>

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

interface CrosswordPuzzleChooserOldProps {
    chooseDetailsJson: CrosswordPuzzleChooseDetail[]
    chooseDetailsStore: CrosswordPuzzleChooseDetail[]
    jsonSelectedCrossword: CrosswordPuzzleChooseDetail,
    storeSelectedCrossword: CrosswordPuzzleChooseDetail,
    jsonCrosswordSelected: (crossword: CrosswordPuzzleChooseDetail) => void
    storeCrosswordSelected: (crossword: CrosswordPuzzleChooseDetail) => void
    jsonCrosswordChosen: () => void
    storeCrosswordChosen: () => void
    jsonCrosswordsLoading: boolean
    storeCrosswordsLoading:boolean
    userLoggedIn:boolean
}
interface CrosswordPuzzleChooserOldState {
    savedSelectFocused: boolean,
    publicSelectFocused:boolean
}
export class CrosswordPuzzleChooserOld extends React.Component<CrosswordPuzzleChooserOldProps, CrosswordPuzzleChooserOldState>{
    constructor(props) {
        super(props);
        this.state = { publicSelectFocused: false, savedSelectFocused:false }
    }
    
    mapToOptions(chooseDetails: CrosswordPuzzleChooseDetail[]) {
        if (chooseDetails) {
            return chooseDetails.map(function (chooseDetail) {
                return { label: chooseDetail.title, value: chooseDetail.id, _chooseDetail: chooseDetail }
            });
        } else {
            return [];
        }
        
    }
    optionToDetail(option: any): CrosswordPuzzleChooseDetail {
        var selectedDetail: CrosswordPuzzleChooseDetail
        if (option) {
            selectedDetail = option._chooseDetail as CrosswordPuzzleChooseDetail;
        } else {
            selectedDetail = null;
        }
        return selectedDetail
    }
    jsonOptionChange = (option:any)=>{
        this.props.jsonCrosswordSelected(this.optionToDetail(option));
    }
    storeOptionChange = (option:any) => {
        this.props.storeCrosswordSelected(this.optionToDetail(option));
    }
    savedOnFocus = ()=>{
        this.setState({ savedSelectFocused: true })
    }
    savedOnBlur = ()=>{
        this.setState({ savedSelectFocused:false})
    }
    publicOnFocus = ()=>{
        this.setState({ publicSelectFocused: true })
    }
    publicOnBlur = ()=>{
        this.setState({ publicSelectFocused: false })
    }
    render() {
        var jsonOptions = this.mapToOptions(this.props.chooseDetailsJson);
        var storeOptions = this.mapToOptions(this.props.chooseDetailsStore);
        var displayWhenLoggedOut = this.props.userLoggedIn ? "none" : "block";
        var displayWhenLoggedIn = this.props.userLoggedIn ? "block" : "none";

        var borderColor = "grey";
        var unfocusedBorderColor = borderColor;
        var focusedBorderColor = "blue";
        var fieldsetBorder = "1px " + borderColor + " solid";
        var placeholderTextColour = "rgb(51,51,51)";
        var placeholderDisabledTextColour = "grey"
        
        var signInTitle = "Sign in";
        var savedSelectPlaceholderText = this.props.userLoggedIn ? "Select saved crosswords:" : signInTitle + " to access saved crosswords:" ;
        var savedSelectPlaceholder = <div style={{ color: this.props.userLoggedIn ? placeholderTextColour : placeholderDisabledTextColour }}>{savedSelectPlaceholderText}</div>
        var publicSelectPlaceholder = <div style={{ color: placeholderTextColour}}>Select public crossword:</div>
        return <div style={{ height: "700px" }}>
            <h2>Select a crossword</h2>
            
            <fieldset style={{ borderRadius: "8px", border: fieldsetBorder }}>
                <legend>Saved crosswords:</legend>
                <div style={{ borderRadius: "8px", marginBottom: "10px", border: fieldsetBorder }}>
                    <EmailLogOnComp signInButtonProps={{ style: { color: "red", outlineWidth:"0px"} }} focusColor={focusedBorderColor} signInTitle={signInTitle} signOutTitle="Sign out" reLoginWait={1000} auth={auth} ></EmailLogOnComp>
                </div>
                <Select isLoading={this.props.storeCrosswordsLoading} placeholder={savedSelectPlaceholder} onFocus={this.savedOnFocus} onBlur={this.savedOnBlur} style={{ borderColor: this.state.savedSelectFocused ? focusedBorderColor : unfocusedBorderColor }} disabled={!this.props.userLoggedIn} options={storeOptions} value={this.props.storeSelectedCrossword !== null ? this.props.storeSelectedCrossword.id : null} onChange={this.storeOptionChange} />
                <Button  color="accent" disabled={this.props.storeSelectedCrossword === null} onMouseUp={this.props.storeCrosswordChosen}>Play crossword</Button>
                
            </fieldset>
            
            <fieldset style={{ borderRadius: "8px", border: fieldsetBorder}}>
                <legend>Public crosswords:</legend>
                <Select isLoading={this.props.jsonCrosswordsLoading} placeholder={publicSelectPlaceholder} onFocus={this.publicOnFocus} onBlur={this.publicOnBlur} style={{ borderColor: this.state.publicSelectFocused ? focusedBorderColor : unfocusedBorderColor }} options={jsonOptions} value={this.props.jsonSelectedCrossword !== null ? this.props.jsonSelectedCrossword.id : null} onChange={this.jsonOptionChange} />
                <Button color="accent" disabled={this.props.jsonSelectedCrossword === null} onMouseUp={this.props.jsonCrosswordChosen}>Play crossword</Button>
               
            </fieldset>

            
        </div>
        
    }
}
