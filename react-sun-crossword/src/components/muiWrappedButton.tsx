import * as React from "react";
import { MuiButton, MuiButtonProps } from "./muiButton";
import { SimpleButtonProps } from "./simpleButtonProps";

//to be imported from a separate file

export interface MuiButtonWrapperProps extends SimpleButtonProps, MuiButtonProps {

}
export class MuiButtonWrapper extends React.Component<MuiButtonWrapperProps, undefined> {
    //wrap in div and handle click from that ?
    onMouseUp = () => {
        this.props.onClick();
    }
    render() {
        //important consideration at a later point
        //if the consumer of this wrapper wanted to also pass onMouseUp
        //moot point as functionally is only used for onClick and the remainder is just styling
        return <MuiButton {...this.props} disabled={this.props.disabled} onMouseUp={this.onMouseUp}>  {this.props.text}</MuiButton>
    }
}
