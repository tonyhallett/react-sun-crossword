import * as React from "react";

import { commonColourStyles, BackgroundColorStyle } from './commonColourStyling'



export interface GlobalCheatButtonProps {
    isCheating: boolean,
    clicked: () => void

}
export class GlobalCheatButton extends React.Component<GlobalCheatButtonProps, undefined> {
    render() {
        var text = "Cheat"
        if (this.props.isCheating) {
            text = "Uncheat";
        }
        //will add styling later
        return <button onClick={() => { this.props.clicked(); }}>{text}</button>
    }
}
