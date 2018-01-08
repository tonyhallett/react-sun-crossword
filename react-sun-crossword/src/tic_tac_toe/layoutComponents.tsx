import * as React from "react";

export class HorizontalCenter extends React.Component<undefined, undefined>{
    render() {
        return <div style={{ display: "table", margin: "0 auto" }}>
            {this.props.children}
        </div>
    }
}

interface VerticallyCenteredContainerProps {
    backgroundColor?: string
}
export class VerticallyCenteredContainer extends React.Component<VerticallyCenteredContainerProps, undefined>{
    render() {
        var containerStyle: React.CSSProperties = {
            display: "table",
            position: "absolute",
            height: "100%",
            width: " 100%"
        }
        if (this.props.backgroundColor) {
            containerStyle.backgroundColor = this.props.backgroundColor;
        }
        return <div style={containerStyle}>
            <div style={{
                display: "table-cell",
                verticalAlign: "middle"
            }}>
                {this.props.children}
            </div>
        </div>
    }
}
