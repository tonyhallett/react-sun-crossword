import * as React from "react";
import { MuiButton } from "./muiButton";

//to do - change the names to be clear which are for the keyboard and which are for the buttons
//add button component class, props and default to mui buttons
export interface KeyboardProps {
    keyPressed: (letter: string) => void,
    backspacePressed: () => void,

    width: number,//to do - allow keyboardStyle to be merged
    rowMarginRatio?: number,
    bottomOfScreen?: boolean,
    verticalShift?: number,
    keyboardColour?: string

    widthHeightRatio?: number,
    keySpaceRatio?: number,
    fontSizeRatio?: number,
    borderRadiusRatio?: number,
    buttonBackgroundColour?: string
    buttonColour?:string

    
}

export class Keyboard extends React.Component<KeyboardProps, undefined> {
    public static defaultProps: Partial<KeyboardProps> = {
        rowMarginRatio: 0.1,
        bottomOfScreen: true,
        verticalShift: 0,
        keyboardColour: "white",

        widthHeightRatio: 1,
        keySpaceRatio: 0.1,
        fontSizeRatio: 0.5,
        borderRadiusRatio: 0.1,
        buttonBackgroundColour: "white",
        buttonColour:"black"
        
    };
    constructor(props) {
        super(props);
    }
    buttonClicked = (id: string)=>{
        if (id === "backspace") {
            this.props.backspacePressed();
        } else {
            this.props.keyPressed(id);
        }
    }
    
    createRow(leftOffset: number, keyWidth: number, keyHeight: number, keySpace, keys: string[], fontSize: string,borderRadius:string) {
        var self = this;
        var left = leftOffset;
        
        
        return keys.map(function (key, index) {
            var value = key;
            if (key === "backspace") {
                value="\u232B"
            }
            var button = <KeyboardButton colour={self.props.buttonColour} backgroundColour={self.props.buttonBackgroundColour} borderRadius={borderRadius} fontSize={fontSize} key={key} left={left} width={keyWidth} height={keyHeight} value={value} id={key} onClick={self.buttonClicked} />
            left += keyWidth + keySpace;
            return button;
        })
          
        
    }
    render() {
      
        var keys = [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["Z", "X", "C", "V", "B", "N", "M", "backspace"]
        ]
        var keyWidth = this.props.width / (10 + (11 * this.props.keySpaceRatio));
        var keySpace = keyWidth * this.props.keySpaceRatio;
        keyWidth = Math.floor(keyWidth);
        keySpace = Math.floor(keySpace);
        var keyHeight = Math.floor(keyWidth * this.props.widthHeightRatio);

        var asdfLeft = Math.floor((this.props.width - (9 * (keyWidth) + 10 * keySpace)) / 2)
        var zxcvLeft = Math.floor((this.props.width - (8 * (keyWidth) + 9 * keySpace)) / 2)

        var marginSpace = Math.floor(keyWidth * this.props.rowMarginRatio);
        var fontSize = Math.floor(keyHeight * this.props.fontSizeRatio) + "px"
        var borderRadius = Math.floor(keyWidth * this.props.borderRadiusRatio) + "px"

        //otherwise get more margin to the right under certain widths due to rounding
        var width = (10 * keyWidth) + (11 * keySpace);
        
        var keyboardStyle:any= {
            left: "50%", transform: "translate(-50%, 0)",
            boxShadow: "0 0px 2px rgba(0,0,0, 0.12),0 2px 2px rgba(0,0,0, 0.20)",
            borderRadius: "5px",
            backgroundColor: this.props.keyboardColour,
            width: width,
            height: 3 * keyHeight + 4 * (marginSpace),
            cursor:"none"
        }
        if (this.props.bottomOfScreen) {
            keyboardStyle.position = "fixed";
            keyboardStyle.bottom= this.props.verticalShift + "px"
        } else {
            keyboardStyle.position = "absolute";
        }
        return <div style={keyboardStyle}>
            <div style={{ position: "absolute", top: marginSpace }}>
                {this.createRow(keySpace, keyWidth, keyHeight, keySpace, keys[0], fontSize, borderRadius)}
            </div>
            <div style={{ position: "absolute", top: 2 * marginSpace + keyHeight}}>
                {this.createRow(asdfLeft, keyWidth, keyHeight, keySpace, keys[1], fontSize, borderRadius)}
            </div>
            <div style={{ position: "absolute", top: 3 * marginSpace + 2 * keyHeight }}>
                {this.createRow(zxcvLeft, keyWidth, keyHeight, keySpace, keys[2], fontSize, borderRadius)}
            </div>

        </div>
    }
}
export interface KeyboardButtonProps {
    onClick: (id: string) => void,
    id: string,
    value: string//later could change to have SVG instead of the backspace unicode char
    width: number,
    height:number,
    left: number,
    fontSize: string,
    borderRadius: string,
    backgroundColour: string,
    colour:string
}
export class KeyboardButton extends React.Component<KeyboardButtonProps, undefined>{
    render() {
        //could have a prop for rippleColor from lightened bg color
        return <MuiButton preventContextMenu={true} touchOnly={true} rippleOpacity={0.5} rippleColour="#ffedcc" buttonStyle={{
            tabIndex: -1,
            fontSize: this.props.fontSize,
            color: this.props.colour,
            backgroundColor: this.props.backgroundColour,
            textAlign: "center", borderRadius: this.props.borderRadius,
            fontWeight: "bold",
            height: this.props.height,
            width: this.props.width,
            position: "absolute",
            left: this.props.left + "px",
            padding: "0px",
            cursor: "none",

    }
} onMouseUp = {() => { this.props.onClick(this.props.id) }}>{ this.props.value }</MuiButton >
    }
}
