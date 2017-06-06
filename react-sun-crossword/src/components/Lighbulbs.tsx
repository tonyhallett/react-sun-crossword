import * as React from "react";
import { Lightbulb } from "./lightbulb";
export interface LightbulbsProps {

}
export interface LightbulbsState {
    bulbOn: boolean
}

export class Lightbulbs extends React.Component<LightbulbsProps, LightbulbsState> {
    constructor(props) {
        super(props);
        this.state = {
            bulbOn: false
        };
    }
    buttonClicked = () => {
        this.setState((prevState: LightbulbsState) => {
            return { bulbOn: !prevState.bulbOn }
        });
    }
    render() {
        return <div>
            
            <Lightbulb on={this.state.bulbOn} rayColour="red" onGlowColour="red" text="Cheat" id="cheatBulb" bulbOuterColour="red" innerGlowColour="red" />
            
                <Lightbulb on={this.state.bulbOn} rayColour="yellow" onGlowColour="yellow" text="Solve" id="solveBulb" bulbOuterColour="yellow" innerGlowColour="yellow" />
            
            </div>
    }

}
