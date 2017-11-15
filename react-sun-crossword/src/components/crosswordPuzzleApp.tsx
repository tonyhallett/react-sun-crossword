import * as firebase from 'firebase'
import * as React from "react";
import { ICrosswordModel, ConvertCrosswordJsonToModel, ConvertCrosswordModelToJson, CrosswordModelJson, SolvingMode } from '../models/index'
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
import { StopwatchController, Duration, FlipClock24 } from "./stopwatchController";


import { Keyboard } from "./keyboard";
import { ExpandableKeyboard } from "./expandableKeyboard";

import { DemoFlipClocks } from "./demoFlipClocks";
//note that might want mediaquery as well



interface CrosswordPuzzleAppState {
    crosswordModel: ICrosswordModel,
    crosswordModelDuration:number,
    userLoggedIn: string,
    choosing:boolean
}
export class CrosswordPuzzleApp extends React.Component<undefined, CrosswordPuzzleAppState> {

    constructor(props) {
        super(props);
        this.state = { crosswordModel: null, userLoggedIn: null, crosswordModelDuration:0,choosing:true };
    }
    componentDidMount() {
        auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
    }
    
    crosswordSelected = (selectedCrossword: CrosswordModelJson) => {
        var crosswordModel = ConvertCrosswordJsonToModel(selectedCrossword);
        if (!crosswordModel.dateStarted) {
            crosswordModel.dateStarted = new Date();
        }
        this.setState({ crosswordModel: crosswordModel, crosswordModelDuration: crosswordModel.duration,choosing:false });
    }
    saveUserCrossword = () => {
        var modelJson = ConvertCrosswordModelToJson(this.state.crosswordModel);
        modelJson.duration = this.stopwatchController.getDuration().totalMilliseconds;
        connectedDatabase.saveUserCrossword(this.state.userLoggedIn, modelJson.id, modelJson, { id: modelJson.id, dateStarted: modelJson.dateStarted, duration: modelJson.duration, datePublished: modelJson.datePublished, title: modelJson.title }).then(function (userSaveDetails: UserSaveDetails) {
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

    
    stopwatchController: StopwatchController
    stopwatchController2: StopwatchController
    pauseAnimationsContainer: HTMLDivElement
    pauseAnimationsContainer2: HTMLDivElement
    pauseAnimations = (pauseAnimationsContainer)=> {
        var descendants = pauseAnimationsContainer.querySelectorAll("*");
        for (var i = 0; i < descendants.length; i++) {
            var descendant = descendants[i] as HTMLElement
            var style = window.getComputedStyle(descendant);
            if (style.animation) {
                descendant.style.webkitAnimationPlayState = 'paused';
            }
        }
    }
    resumeAnimations = (pauseAnimationsContainer) => {
        var descendants = pauseAnimationsContainer.querySelectorAll("*");
        for (var i = 0; i < descendants.length; i++) {
            var descendant = descendants[i] as HTMLElement
            var style = window.getComputedStyle(descendant);
            if (style.animation) {
                descendant.style.webkitAnimationPlayState = 'running';
            }
        }
    }
    choose = () => {
        this.setState({choosing:true})
    }
    render() {
        var primaryColour ="gold"
        var buttonStyle: React.CSSProperties =  {
            backgroundColor: primaryColour,
            color:"#2F4F4F"
        }
        var buttonProps: MuiButtonProps = {
            buttonStyle: buttonStyle,
            disabledBackgroundColor: "#f9f9f9",
            disabledColor:"#2F4F4F",
            lightenPercentage:0.1
        }
        var selectChooserProps: DefaultSelectChooserButtonProps = {
            ButtonType: MuiButtonWrapper,
            buttonProps: buttonProps
        }

        /*
        {this.state.crosswordModel &&
                <FlipClock24 shouldUpdateSameDuration={true} startDuration={this.state.crosswordModelDuration} />
            }
            <MuiButtonWrapper disabled={!this.state.userLoggedIn || this.state.crosswordModel === null} text="Click to save" onClick={this.saveUserCrossword}   {...buttonProps}></MuiButtonWrapper>
        */

        //explicit height allows room for the Select 
        //var leftContent = <div style={{ minHeight: "1000px" }}>
        //    <CrosswordPuzzleChooser emailLogOnStyleProps={{ signInButtonProps: buttonProps, dividerColor: primaryColour }} selectChooserProps={selectChooserProps} userLoggedIn={this.state.userLoggedIn} crosswordSelected={this.crosswordSelected} /> 
            
        //</div>
        var rightContent = <CrosswordPuzzleKeyEvents crosswordModel={this.state.crosswordModel} />
        if (this.state.crosswordModel === null) {
            rightContent=<div/>
        }
        /*
        //{this.state.crosswordModel &&
            //    <StopwatchController ref={(sw) => { this.stopwatchController = sw }} reportTickInterval={ReportTickInterval.tenthSecond} startDuration={this.state.crosswordModel.duration}>
            //        <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds"  />
            //    </StopwatchController>
            //}
            //<MuiButtonWrapper disabled={!this.state.userLoggedIn || this.state.crosswordModel === null} text="Click to save" onClick={this.saveUserCrossword}   {...buttonProps}></MuiButtonWrapper>
        */

        console.log("App render");
        //<TwoCol leftContent={leftContent} rightContent={rightContent}></TwoCol>

        return <div >
            {this.state.choosing?<CrosswordPuzzleChooser emailLogOnStyleProps={{ signInButtonProps: buttonProps, dividerColor: primaryColour }} selectChooserProps={selectChooserProps} userLoggedIn={this.state.userLoggedIn} crosswordSelected={this.crosswordSelected} /> :
                <div>
                    <button onClick={this.choose}>Choose Crosword</button>
                    {this.state.crosswordModel && <CrosswordPuzzleKeyEvents crosswordModel={this.state.crosswordModel} />}
                </div>
            }
            
            </div>

        //<button onClick={}>Pause</button>
        
        


        //<div>

            //<div ref={(div) => { this.pauseAnimationsContainer=div }}>
            //<StopwatchController countdown={true} autoStart={false} ref={(sw) => { this.stopwatchController = sw }} reportTickInterval={ReportTickInterval.hundredthSecond} startDuration={112000}>
            //    <FlipCounter countdown={true} hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            //</StopwatchController>
            //    </div>

            //<button onClick={() => { this.stopwatchController.stop(); this.pauseAnimations(this.pauseAnimationsContainer)  }}>Stop</button>
            //<button onClick={() => { this.stopwatchController.pause(); this.pauseAnimations(this.pauseAnimationsContainer) }}>Pause</button>
            //<button onClick={() => { this.stopwatchController.start(); this.resumeAnimations(this.pauseAnimationsContainer) }}>Play</button>
            
            //<div ref={(div) => { this.pauseAnimationsContainer2 = div }}>
            //    <StopwatchController autoStart={false} ref={(sw) => { this.stopwatchController2 = sw }} reportTickInterval={ReportTickInterval.hundredthSecond} startDuration={0}>
            //        <FlipCounter hoursTitle="Hours" minutesTitle="Minutes" secondsTitle="Seconds" />
            //    </StopwatchController>
            //</div>

            //<button onClick={() => { this.stopwatchController2.stop(); this.pauseAnimations(this.pauseAnimationsContainer2) }}>Stop</button>
            //<button onClick={() => { this.stopwatchController2.pause(); this.pauseAnimations(this.pauseAnimationsContainer2)  }}>Pause</button>
            //<button onClick={() => { this.stopwatchController2.start(); this.resumeAnimations(this.pauseAnimationsContainer2) }}>Play</button>
            //<button onClick={this.pauseAnimations} >Pause animations</button>  

            //<button onClick={() => {
            //    console.log(this.stopwatchController2.getDuration().totalMilliseconds);
            //    var downDuration = this.stopwatchController.getDuration();
            //    console.log(downDuration.totalSeconds)
            //    console.log(downDuration.milliseconds)

            //}}>Check duration</button>
                //</div>

        //{height:"200px"}

        

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
    }
    
}
