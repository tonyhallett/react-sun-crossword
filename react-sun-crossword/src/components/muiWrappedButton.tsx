import * as React from "react";
import { MuiButton, MuiButtonProps } from "./muiButton";
import { SimpleButtonProps } from "./simpleButtonProps";

//to be imported from a separate file

export interface MuiButtonWrapperProps extends SimpleButtonProps, MuiButtonProps {

}
export class MuiButtonWrapper extends React.Component<MuiButtonWrapperProps, undefined> {
    onClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
        
        this.props.onClick(ev);
    }
    render() {
        return <MuiButton {...this.props} disabled={this.props.disabled} onClick={this.onClick}>  {this.props.text}</MuiButton>
    }
}
