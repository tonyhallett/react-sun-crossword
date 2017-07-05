import * as React from "react";
import { objectAssign } from "../helpers/javascriptPolyfills";

export interface DividerProps {
    color?: string,
    pixelHeight?: number,
    additionalStyle?: React.CSSProperties
}
export class Divider extends React.Component<DividerProps, undefined> {
    public static defaultProps: Partial<DividerProps> = {
        color: "rgba(0,0,0,.12)",
        pixelHeight:1
    };
    constructor(props) {
        super(props);
    }
    render() {
        var style: React.CSSProperties = {
            display: "block",
            height: this.props.pixelHeight + "px",
            backgroundColor:this.props.color
        }
        style=objectAssign({}, style, this.props.additionalStyle)
        return <div style={style} />
    }
}
