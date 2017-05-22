import * as React from "react";


/**
         * The overflow property controls how extra content exceeding the bounding box of an element is rendered. It can be used in conjunction with an element that has a fixed width and height, to eliminate text-induced page distortion.
         */
//overflow ?: CSSWideKeyword | "auto" | "hidden" | "scroll" | "visible";

/**
 * Specifies the preferred scrolling methods for elements that overflow.
 */
//overflowStyle ?: CSSWideKeyword | any;

/**
 * Controls how extra content exceeding the x-axis of the bounding box of an element is rendered.
 */
//overflowX ?: CSSWideKeyword | "auto" | "hidden" | "scroll" | "visible";

/**
 * Controls how extra content exceeding the y-axis of the bounding box of an element is rendered.
 */
//overflowY ?: CSSWideKeyword | "auto" | "hidden" | "scroll" | "visible";

        

export interface TwoColProps {
    colOverflow?: React.CSSWideKeyword | "auto" | "hidden" | "scroll" | "visible",
    leftContent: JSX.Element,
    rightContent: JSX.Element,
    containerStyle?: React.CSSProperties,
    leftPercentage?:number

}
export class TwoCol extends React.Component<TwoColProps, undefined> {
    render() {
        var leftPercent = 50;
        if (this.props.leftPercentage) {
            leftPercent = this.props.leftPercentage
        }
        var rightPercent = 100 - leftPercent;

        var leftStyle: React.CSSProperties = {
            float: 'left',
            width: leftPercent + '%',
            height: '100%',
            overflow: this.props.colOverflow ? this.props.colOverflow:'hidden'
        }
        var rightStyle: React.CSSProperties = {
            float: 'left',
            width: rightPercent + '%',
            height: '100%',
            overflow: this.props.colOverflow ? this.props.colOverflow : 'hidden'
        }
        var left = <div style={leftStyle}>{this.props.leftContent}</div>;
        var right = <div style={rightStyle}>{this.props.rightContent} </div>
        var container = <div>
            {left}
            {right}
            </div>
        
        if (this.props.containerStyle) {
            container = <div style={this.props.containerStyle}>
                {left}
                {right}
            </div>
        }
        return container;
    }
}

