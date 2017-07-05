import * as React from "react";
import bounds = require('react-bounds');
import { makeElementQuery, Matches } from 'react-element-queries';

interface ElementQueriesProps {
    getRef?: (el: HTMLElement) => void,
    matches?: (name: string) => boolean
    width?:number,
    height?: number
}
class ElementQueriesToWrap extends React.Component<ElementQueriesProps, undefined> {
    render() {
        return <div ref={this.props.getRef}>
            <div>
                <div>{this.props.height}</div>
                <div>{this.props.width}</div>
            </div>
            <div style={{ color: this.props.matches('hasHeight') ? 'yellow' : 'pink' }}>
                <Matches hasHeight>Has height</Matches>

            </div>
            {this.props.children}
        </div>
    }
}
export var ElementQueries = makeElementQuery(ElementQueriesToWrap, { hasHeight: {minHeight:1}}) as React.ComponentClass<ElementQueriesProps>

interface BoundedProps {
    width?: number,
    height?: number,
    activeBounds?:string[]//this could be better
}
class BoundedToWrap extends React.Component<BoundedProps, undefined> {
    static bounds() {
        return {
            'hasHeight': {
                minHeight: 1,
                
            },
            'noHeight': {
                minHeight: -1,
                maxHeight: 1
            }
        }
    }
    hadFirstRender=false
    componentDidMount() {
        if (!this.hadFirstRender) {
            this.hadFirstRender = true;
            this.forceUpdate();
        }
    }
    render() {
        var activeBounds = this.props.activeBounds[0];
        
        return <div style={{ height: "100%", width: "100%" }}>
            <div>{"Active bounds: " + activeBounds}</div>
            <div>{"width: " + this.props.width}</div>
            <div>{"height: " + this.props.height}</div>
        </div>
    }
}
export var Bounded = bounds.wrap(BoundedToWrap) as React.ComponentClass<BoundedProps>

