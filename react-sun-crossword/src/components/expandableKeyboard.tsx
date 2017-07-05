import * as React from "react";
import { makeElementQuery, Matches } from 'react-element-queries';
import { Keyboard } from "./keyboard";

interface ElementQueriesProps {
    getRef: (el: HTMLElement) => void,
    matches: (name: string) => boolean
    width: number,
    height: number
}
export interface KeyboardProps {
    keyPressed: (letter: string) => void,
    backspacePressed: () => void,

    //width: number,
    rowMarginRatio?: number,
    bottomOfScreen?: boolean,
    verticalShift?: number,
    keyboardColour?: string

    widthHeightRatio?: number,
    keySpaceRatio?: number,
    fontSizeRatio?: number,
    borderRadiusRatio?: number,
    buttonBackgroundColour?: string
    buttonColour?: string


}
interface ExpandableKeyboardToWrapProps extends ElementQueriesProps, KeyboardProps {

}
class ExpandableKeyboardToWrap extends React.Component<ExpandableKeyboardToWrapProps, undefined> {
    render() {
        return <div style={{ width: "100%" }} ref={this.props.getRef}>
            
            {this.props.width ? <Keyboard {...this.props} />:null}
            {this.props.children}
        </div>
    }
}
export var ExpandableKeyboard = makeElementQuery(ExpandableKeyboardToWrap, {}) as React.ComponentClass<KeyboardProps>

