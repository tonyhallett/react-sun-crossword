import * as React from "react";
import * as Modal from 'react-modal';
import * as $ from 'jquery';

enum ElementDimensionsChoice { Content, PaddingAndBorder, Padding, PaddingBorderMargin }
type ElementLengthType = "padding-left" | "border-left" | "margin-left" | "padding-top" | "border-top" | "margin-top";
//to consider box sizing - another day !
//http://blog.jquery.com/2012/08/16/jquery-1-8-box-sizing-width-csswidth-and-outerwidth/
function getElementWidth(element: HTMLElement, dimensionsChoice: ElementDimensionsChoice) {
    var $el = $(element);
    switch (dimensionsChoice) {
        case ElementDimensionsChoice.PaddingAndBorder:
            return $el.outerWidth(false);
        case ElementDimensionsChoice.Padding:
            return $el.innerWidth();
        case ElementDimensionsChoice.PaddingBorderMargin:
            return $el.outerWidth(true);
        case ElementDimensionsChoice.Content:
            return $el.width()

    }
}
function getElementHeight(element: HTMLElement, dimensionsChoice: ElementDimensionsChoice) {
    var $el = $(element);
    switch (dimensionsChoice) {
        case ElementDimensionsChoice.PaddingAndBorder:
            return $el.outerHeight(false);
        case ElementDimensionsChoice.Padding:
            return $el.innerHeight();
        case ElementDimensionsChoice.PaddingBorderMargin:
            return $el.outerHeight(true);
        case ElementDimensionsChoice.Content:
            return $el.height()

    }
}
function getElementEdgeLength(element: HTMLElement, lengthType: ElementLengthType) {
    var $el = $(element);
    return parseFloat($el.css(lengthType));
}
function getOverlay(element: HTMLElement, dimensionsChoice = ElementDimensionsChoice.PaddingAndBorder) {
    var $element = $(element);
    var offset = $element.offset();//border-box
    var left = offset.left;
    var top = offset.top;

    switch (dimensionsChoice) {
        case ElementDimensionsChoice.Content:
            var paddingLeft = getElementEdgeLength(element, "padding-left");
            var borderLeft = getElementEdgeLength(element, "border-left");
            var paddingTop = getElementEdgeLength(element, "padding-top");
            var borderTop = getElementEdgeLength(element, "border-top");
            top = top + paddingTop + borderTop;
            left = left + paddingLeft + borderLeft;
            break;
        case ElementDimensionsChoice.Padding:
            var borderLeft = getElementEdgeLength(element, "border-left");
            var borderTop = getElementEdgeLength(element, "border-top");
            top = top + borderTop;
            left = left + borderLeft;
            break;
        case ElementDimensionsChoice.PaddingAndBorder:
            //no change
            break;
        case ElementDimensionsChoice.PaddingBorderMargin:
            var marginLeft = getElementEdgeLength(element, "margin-left");
            var marginTop = getElementEdgeLength(element, "margin-top");
            top = top - marginTop;
            left = left - marginLeft;
            break;

    }
    return {
        left: left,
        top: top,
        width: getElementWidth(element, dimensionsChoice),
        height: getElementHeight(element, dimensionsChoice)
    };
}

//not entirely sure that this typing is correct - https://github.com/reactjs/react-modal
interface ModalClassNameProps {
    base?: string,
    afterOpen?: string,
    beforeClose?: string
}
type classNameProps = string | ModalClassNameProps
interface ModalStyle {
    overlay?: React.CSSProperties,
    content?: React.CSSProperties
}
interface ModalProps {
    isOpen: boolean,
    onAfterOpen?: () => any,
    onRequestClose?: () => any,
    closeTimeoutMS?: number,
    contentLabel?: string,
    aria?: {
        [x: string]: string
    },
    style?: ModalStyle
    className?: classNameProps,
    overlayClassName?: classNameProps,
    portalClassName?: string,
    shouldFocusAfterRender?: boolean
    parentSelector: () => HTMLElement

}
interface ModalReadyProps extends ModalProps {
    getStyle: () => ModalStyle
}
interface ModalReadyState {
    ready: boolean
}

export class ModalReady extends React.Component<ModalReadyProps, ModalReadyState>{
    constructor(props) {
        super(props)
        this.state = { ready: false }
    }
    componentDidMount() {
        this.setState({ ready: true })
    }
    render() {
        if (!this.state.ready) {
            return null;
        }

        return <Modal style={this.props.getStyle()} {...this.props} />
    }
}
interface ModalCoverProps extends ModalProps {
    elementSelector: string,
    coverType?: ElementDimensionsChoice
    contentStyle?: React.CSSProperties
}
export class ModalCover extends React.Component<ModalCoverProps, undefined>{
    static defaultProps = {
        coverType: ElementDimensionsChoice.PaddingAndBorder
    }
    getStyle = () => {
        return {
            overlay: getOverlay(document.querySelector(this.props.elementSelector) as HTMLElement, this.props.coverType),
            content: this.props.contentStyle
        }
    }
    render() {
        return <ModalReady {...this.props} getStyle={this.getStyle} />
    }
}

