import * as React from "react";
import * as WebFont from "webfontloader";
import { connect} from "react-redux"
import { AnyAction } from "redux";

export interface WebFontLoaderProps {
    config: WebFont.Config
}
export class WebFontLoader extends React.Component<WebFontLoaderProps, undefined>{
    loadFonts() {
        WebFont.load(
            this.props.config
        )
    }
    componentDidMount() {
        this.loadFonts();
    }
    shouldComponentUpdate() {
        return false;
    }
    render() {
        return this.props.children;
    }
}

export const FONT_LOADING = "FONT_LOADING";
export enum FontLoadingState { NotStarted, Loading, Active, Inactive }
export interface FontLoadingAction extends AnyAction {
    type: typeof FONT_LOADING,
    state: FontLoadingState

}

function fontLoading(state: FontLoadingState) {
    return {
        type: FONT_LOADING,
        state: state
    }
} 
export const ConnectedWebFontLoader = connect(null, (dispatch) => {
    return {
        loading: () => {
            dispatch(fontLoading(FontLoadingState.Loading))
        },
        active: () => {
            dispatch(fontLoading(FontLoadingState.Active))
        },
        inactive: () => {
            dispatch(fontLoading(FontLoadingState.Inactive))
        },
    }
}, (stateProps, dispatchProps, ownProps: WebFontLoaderProps) => {
    //for own use not concerned with overriding callbacks
    var mergedProps: WebFontLoaderProps = {
        ...ownProps,
        config: {
            ...ownProps.config,
            ...dispatchProps
        }
    }
    return mergedProps;
})(WebFontLoader);