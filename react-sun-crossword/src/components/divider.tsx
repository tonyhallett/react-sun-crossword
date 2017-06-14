import * as React from "react";

export interface DividerProps {
    color?:string
}
export class Divider extends React.Component<DividerProps, undefined> {
    public static defaultProps: Partial<DividerProps> = {
        color:"rgba(0,0,0,.12)"
    };
    constructor(props) {
        super(props);
    }
    render() {
        return <div style={{ display: "block", height: "1px", backgroundColor: this.props.color }} />
    }
}
