import * as React from "react";
import { addEventListener, removeEventListener } from './safeEventListener'

interface MouseBodyPositionState {
    x: number,
    y: number,
    active: boolean
}
interface MouseBodyPositionProps {
    mouseMove?: (x: number, y: number) => void
}
export class MouseBodyPosition extends React.Component<MouseBodyPositionProps, MouseBodyPositionState>{
    constructor(props) {
        super(props)
        this.state = {
            x: 0,
            y: 0,
            active: false
        }
    }
    componentDidMount() {
        addEventListener("mousemove", document.body, this.mouseMove);
    }
    componentWillUnmount() {
        removeEventListener("mousemove", document.body, this.mouseMove);
    }
    mouseMove = (e: MouseEvent) => {

        var pageX = e.pageX;
        var pageY = e.pageY;

        // IE 8
        if (pageX === undefined) {
            pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        if (this.props.mouseMove) {
            this.props.mouseMove(pageX, pageY);
        }
        this.setState({ x: pageX, y: pageY, active: true })

    }
    render() {
        return React.Children.map(this.props.children, (child => React.cloneElement(child as React.ReactElement<any>, this.state)))
    }
}

interface IdOrClassName {
    id?: string,
    className?: string
}
interface BodyCursorProps extends Partial<MouseBodyPositionState> {
    replaceCursor?: boolean,
    cursor?: string,
    positionAdjustment?: (x: number, y: number) => { x: number, y: number },
    inactiveElementIdentifiers?: IdOrClassName[]
}
export class BodyCursor extends React.Component<BodyCursorProps, undefined>{
    static defaultProps = {
        positionAdjustment: function (x: number, y: number) {
            return { x: x, y: y }
        }
    }
    isInInactiveElement() {
        var inInactiveElement = false;
        if (this.props.inactiveElementIdentifiers) {
            var elementFromPoint = document.elementFromPoint(this.props.x, this.props.y);
            var elementToTest = elementFromPoint;
            while (elementToTest) {
                var matched = false;
                for (var i = 0; i < this.props.inactiveElementIdentifiers.length; i++) {
                    var inactiveElementIdentifier = this.props.inactiveElementIdentifiers[i];
                    if (!(inactiveElementIdentifier.id === null || inactiveElementIdentifier.id === undefined)) {
                        if (elementToTest.id === inactiveElementIdentifier.id) {
                            inInactiveElement = true;
                        }
                    } else {
                        var className = elementToTest.className;
                        var classNames = className.split(" ");
                        for (var j = 0; j < classNames.length; j++) {
                            var className = classNames[j];
                            if (className === inactiveElementIdentifier.className) {
                                inInactiveElement = true;
                                break;
                            }
                        }
                    }
                    if (inInactiveElement) {
                        break;
                    }
                }
                if (inInactiveElement) {
                    break;
                }
                elementToTest = elementToTest.parentElement;
            }
        }
        return inInactiveElement;
    }
    render() {
        var shouldDisplayCursor = this.props.active && this.props.replaceCursor && !this.isInInactiveElement();
        if (shouldDisplayCursor) {

            document.body.style.cursor = "none";

            var { x, y } = this.props.positionAdjustment(this.props.x, this.props.y);
            var replacedCursorStyle = { position: "absolute", left: x, top: y, pointerEvents: "none" } as React.CSSProperties;

            var childElement = this.props.children as React.ReactElement<any>;
            var childStyle = childElement.props.style;

            var newStyle = { ...childStyle, ...replacedCursorStyle };

            var newProps = {
                style: newStyle,
                x: this.props.x,
                y: this.props.y
            }

            return React.cloneElement(this.props.children as React.ReactElement<any>, newProps);
        } else {
            document.body.style.cursor = this.props.cursor;
            return null;
        }

    }
}
