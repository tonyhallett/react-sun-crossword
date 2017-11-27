import * as React from "react";
import * as PropTypes from 'prop-types';

class AddContextToThis extends React.Component<undefined, undefined>{
    static childContextTypes = {
        original: PropTypes.bool
    }
    getChildContext() {
        return { original:true}
    }
}
class UsesDynamicContext extends React.Component<undefined, undefined> {
    render() {
        return <div>{this.context.dynamic}</div>
    }
}
export class DynamicContextProvider extends React.Component<undefined, undefined>{
    constructor(props) {
        super(props);
        (AddContextToThis.childContextTypes as any).dynamic = PropTypes.string;
        var originalGetChildContext = AddContextToThis.prototype.getChildContext;
        AddContextToThis.prototype.getChildContext = function () {
            var childContext = originalGetChildContext();
            (childContext as any).dynamic = "This is dynamic";
            return childContext;
        }
    }
    render() {
        return <AddContextToThis>
            <UsesDynamicContext/>
        </AddContextToThis>
    }

}
