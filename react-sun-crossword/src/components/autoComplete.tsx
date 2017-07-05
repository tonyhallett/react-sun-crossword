import * as React from "react";
import * as Color from "Color";

export interface AutoCompleteStyleProps {
    focusShadow?: string,
    showFocusShadow?: boolean,
    backgroundColor?: string,
    autoCompleteColor?: string,
    containerStyle?: React.CSSProperties,
}
export interface AutoCompleteProps extends AutoCompleteStyleProps {
    autoCompletedWait?: number,
    autoCompleted?:()=>void
}
interface AutoCompleteState {
    inputFocused:boolean
}
export class AutoComplete extends React.Component<AutoCompleteProps, AutoCompleteState> {
    //might have a boolean for determining if autocompleted 
    //then will have to use the color module for creating a slightly lighter "rgb(244,244,244)"
    public static defaultProps: Partial<AutoCompleteProps> = {
        backgroundColor: "white",
        autoCompleteColor:"white",
        showFocusShadow: true,
        focusShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px rgba(0, 126, 255, 0.1)",
        autoCompletedWait:500
    };
    public static idCount = 0
    public static readonly idName = "autoComplete"
    private id: string
    private autoFillCss:string
    private autoCompleteElement: HTMLInputElement
    constructor(props) {
        super(props);
        this.id = AutoComplete.idName + (AutoComplete.idCount++).toString();

        var webkitAutoFill = ":-webkit-autofill";
        var autoFillHover = webkitAutoFill + ":hover";
        var autoFillFocus = webkitAutoFill + ":focus";
        var inputSelector = "#" + this.id + ">input";
        this.autoFillCss = inputSelector + webkitAutoFill + "," + inputSelector + autoFillHover + "," + autoFillFocus + "{" + this.getAutoCompleteBoxShadow() + "}";
        this.state = { inputFocused: false }
        
    }
    getAutoFill
    getAutoCompleteBoxShadow() {
        return "box-shadow: 0 0 0 100px " + this.props.autoCompleteColor + " inset";
    }
    inputBlur() {
        this.setState({inputFocused:false})
    }
    inputFocus() {
        this.setState({ inputFocused: true })
    }
    componentDidMount() {
        var self = this;
        if (this.props.autoCompleted) {
            window.setTimeout(function () {
                var boxShadow = window.getComputedStyle(self.autoCompleteElement).boxShadow;
                
                if (boxShadow !== "none") {
                    self.props.autoCompleted();
                }
            }, this.props.autoCompletedWait);
        }
    }
    componentWillUnmount() {

    }
    render() {
        var child = this.props.children as React.ReactElement<any>;
        var childStyle = child.props.style;
        
        var hiddenStyle: React.CSSProperties = { position: "absolute", left: 0, top: 0, zIndex: -1 };
        var styleIgnoreCopyProperties = ["boxShadow", "position", "left", "top", "zIndex"];
        var cloneStyle: React.CSSProperties = { backgroundColor: this.props.backgroundColor }
        for (var p in childStyle) {
            if (styleIgnoreCopyProperties.indexOf(p) === -1) {
                hiddenStyle[p] = childStyle[p];
            }
            cloneStyle[p] = childStyle[p];
        }
        
        var self = this;
        var cloneProps: any = { style: cloneStyle }//need to type this 
        //should this be done in render ? once ?
        if (this.props.showFocusShadow) {
            cloneStyle.outline = "none";
            var currentOnBlur = child.props.onBlur as any;
            cloneProps.onBlur = function (ev: FocusEvent) {
                currentOnBlur(ev);
                self.inputBlur();
            }
            var currentOnFocus = child.props.onFocus as any;
            cloneProps.onFocus = function (ev: FocusEvent) {
                currentOnFocus(ev);
                self.inputFocus();
            }
        }
        if (this.props.autoCompleted) {
            cloneProps.ref= function(node) {
                self.autoCompleteElement = node;
                // Call the original ref, if any
                const { ref } = child as any;
                if (typeof ref === 'function') {
                    ref(node);
                }
            }
        }
        if (this.state.inputFocused) {
            hiddenStyle.boxShadow = this.props.focusShadow;
        }
        var childClone = React.cloneElement(child, cloneProps);
        
        

        var containerStyle: React.CSSProperties = { position: "relative" };
        
        
        return <div id={this.id} style={{ ...containerStyle, ...this.props.containerStyle }}>
            {childClone}
            <input tabIndex={-1} style={hiddenStyle} type="text" disabled={true} />
            
            <style dangerouslySetInnerHTML={{
                __html: this.autoFillCss
            }} />
        </div>
    }
}