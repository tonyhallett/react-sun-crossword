import * as React from "react";
import * as PropTypes from 'prop-types';

interface AddContextToThisProps {
    someProp: string
}
class AddContextToThis extends React.Component<AddContextToThisProps, undefined>{
    static childContextTypes = {
        original: PropTypes.bool
    }
    getChildContext() {
        return { original:true}
    }
    render() {
        return this.props.children;
    }
}

class UsesDynamicContext extends React.Component<undefined, undefined> {
    static contextTypes = {
        dynamic:PropTypes.func
    }
    render() {
        
        return <div>{this.context.dynamic()}</div>
    }
}
export class DynamicContextProvider extends React.Component<undefined, undefined>{
    constructor(props) {
        super(props);
        function _getDynamicValue(someProp: string) {
            return "Got: " + someProp;
        }
        (AddContextToThis.childContextTypes as any).dynamic = PropTypes.func;
        var originalGetChildContext = AddContextToThis.prototype.getChildContext;
        AddContextToThis.prototype.getChildContext = function () {
            var _that = this;
            var childContext = originalGetChildContext();
            (childContext as any).dynamic = function () {
                return _getDynamicValue(_that.props.someProp);
            }
            return childContext;
        }
    }
    
    render() {
        return <AddContextToThis someProp="Some value">
            <UsesDynamicContext/>
        </AddContextToThis>
    }

}
