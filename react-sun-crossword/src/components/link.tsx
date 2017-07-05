import * as React from "react";

export interface NonNavigatableLinkStyleProps {
    color?: string,
    removeUnderline?: boolean,
    removeOutline?: boolean,
    transparentBackground?: boolean,
}
export interface NonNavigatableLinkProps extends NonNavigatableLinkStyleProps{
    text:string,
    clicked:()=>void
}

export class NonNavigatableLink extends React.Component<NonNavigatableLinkProps, undefined> {
    public static defaultProps: Partial<NonNavigatableLinkProps> = {
        color: "#2196F3",
        transparentBackground: true,
        removeUnderline: true,
        removeOutline:true
    };
    public static idCount = 0
    public static readonly idName = "nonNavigatableLink"
    private id:string
    constructor(props) {
        super(props);
        this.id = NonNavigatableLink.idName + (NonNavigatableLink.idCount++).toString();
    }
    clicked = (evt: React.MouseEvent<HTMLAnchorElement>) => {
        evt.preventDefault();
        this.props.clicked();
    }
    render() {
        
        var linkBackgroundColorCss = this.props.transparentBackground ? "background-color:transparent" : "";
        var linkTextDecoration = this.props.removeUnderline ? "text-decoration:none" : "text-decoration:underline";
        var linkRemoveOutline = this.props.removeOutline ? "outline:none" : "";
        var linkAdditionCss = [linkBackgroundColorCss, linkTextDecoration, linkRemoveOutline];
        var linkCss = "color:" + this.props.color + ";"
        for (var i = 0; i < linkAdditionCss.length; i++) {
            var linkAdditional = linkAdditionCss[i];
            if (linkAdditional !== "") {
                linkCss += linkAdditional + ";";
            }
        }
        
        var idSelector = "#" + this.id;
        var css = idSelector + " {" + linkCss + "}" + idSelector + ":focus," + idSelector + ":hover" + "{" + "text-decoration:underline" + "}"  
        
        return <span>
            <a href="" id={this.id} onClick={this.clicked}>{this.props.text}</a>
            <style dangerouslySetInnerHTML={{
                __html: css
				}} />

            </span>
    }
}