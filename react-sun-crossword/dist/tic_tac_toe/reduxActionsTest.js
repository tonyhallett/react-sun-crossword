"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReduxActions = require("redux-actions");
var redux_1 = require("redux");
exports.dummyFn = function () { };
//#region theirs
var state;
var minimalAction = { type: 'INCREMENT' };
var incrementAction = ReduxActions.createAction('INCREMENT', function () { return 1; });
var multiplyAction = ReduxActions.createAction('MULTIPLY');
var action = incrementAction();
var actionHandler = ReduxActions.handleAction('INCREMENT', function (state, action) { return state + action.payload; }, 0);
state = actionHandler(0, incrementAction());
var actionHandlerWithReduceMap = ReduxActions.handleAction('MULTIPLY', {
    next: function (state, action) {
        return state * action.payload;
    },
    throw: function (state) { return state; }
}, 0);
state = actionHandlerWithReduceMap(0, multiplyAction(10));
var actionsHandler = ReduxActions.handleActions({
    INCREMENT: function (state, action) { return state + action.payload; },
    MULTIPLY: function (state, action) { return state * action.payload; }
}, 0);
state = actionsHandler(0, { type: 'INCREMENT' });
var actionsHandlerWithInitialState = ReduxActions.handleActions({
    INCREMENT: {
        next: function (state, action) { return state + action.payload; },
    },
    MULTIPLY: {
        next: function (state, action) { return state * action.payload; }
    }
}, 0);
state = actionsHandlerWithInitialState(0, { type: 'INCREMENT' });
var actionsHandlerWithRecursiveReducerMap = ReduxActions.handleActions({
    ADJUST: {
        UP: function (state, action) { return state + action.payload; },
        DOWN: function (state, action) { return state - action.payload; },
    }
}, 0);
state = actionsHandlerWithRecursiveReducerMap(0, { type: 'ADJUST/UP', payload: 1 });
var typedState;
//const richerAction: ReduxActions.ActionMeta<TypedState, MetaType> = {
//    type: 'INCREMENT',
//    error: false,
//    payload: {
//        value: 2
//    },
//    meta: {
//        remote: true
//    }
//};
var typedIncrementAction = ReduxActions.createAction('INCREMENT', function () { return ({ increase: 1 }); });
var typedActionHandler = ReduxActions.handleAction('INCREMENT', function (state, action) { return ({ value: state.value + 1 }); }, { value: 1 });
var actionNoArgs = typedIncrementAction();
actionNoArgs.payload.increase = 1;
typedState = typedActionHandler({ value: 0 }, actionNoArgs);
var typedIncrementAction1TypedArg = ReduxActions.createAction('INCREMENT', function (amount) { return ({ increase: amount }); });
var actionFrom1Arg = typedIncrementAction1TypedArg(10);
actionFrom1Arg.payload.increase === 10;
var typedIncrementAction2TypedArgs = ReduxActions.createAction('INCREMENT', function (numericAmount, stringAmount) { return ({ increase: numericAmount + parseInt(stringAmount, 10) }); });
var actionFrom2Args = typedIncrementAction2TypedArgs(10, '100');
actionFrom1Arg.payload.increase === 110;
var typedActionHandlerReducerMap = ReduxActions.handleActions({
    INCREMENT: function (state, action) { return ({ value: state.value + 1 }); }
}, { value: 1 });
typedState = typedActionHandlerReducerMap({ value: 0 }, actionFrom1Arg);
var typedIncrementByActionWithMetaAnyArgs = ReduxActions.createAction('INCREMENT_BY', function (amount) { return ({ increase: amount }); }, function (_, remote) { return ({ remote: remote }); });
var actionMetaFromAnyArgs = typedIncrementByActionWithMetaAnyArgs(10, true, 'nic', 'cage');
actionMetaFromAnyArgs.payload.increase === 10;
actionMetaFromAnyArgs.meta.remote;
var typedActionHandlerWithMeta = ReduxActions.handleAction('INCREMENT_BY', {
    next: function (state, action) {
        return action.meta.remote ? state : { value: state.value + action.payload.increase };
    },
    throw: function (state) { return state; }
}, { value: 1 });
typedState = typedActionHandlerWithMeta({ value: 0 }, typedIncrementByActionWithMetaAnyArgs(10));
var typedActionHandlerReducerMetaMap = ReduxActions.handleActions({
    INCREMENT_BY: {
        next: function (state, action) {
            return action.meta.remote ? state : { value: state.value + action.payload.increase };
        },
        throw: function (state) { return state; }
    }
}, { value: 1 });
typedState = typedActionHandlerReducerMetaMap({ value: 0 }, actionMetaFromAnyArgs);
var typedActionWithMeta1TypedArg = ReduxActions.createAction('INCREMENT_BY', function (amount) { return ({ increase: amount }); }, function (amount) { return ({ remote: true }); });
var actionMetaFrom1Arg = typedActionWithMeta1TypedArg(10);
actionMetaFrom1Arg.payload.increase === 10;
actionMetaFrom1Arg.meta.remote;
typedState = typedActionHandlerReducerMetaMap({ value: 0 }, actionMetaFrom1Arg);
var typedActionWithMeta2TypedArgs = ReduxActions.createAction('INCREMENT_BY', function (amount, remote) { return ({ increase: amount }); }, function (amount, remote) { return ({ remote: remote }); });
var actionMetaFrom2Args = typedActionWithMeta2TypedArgs(10, true);
actionMetaFrom2Args.payload.increase === 10;
actionMetaFrom2Args.meta.remote;
typedState = typedActionHandlerReducerMetaMap({ value: 0 }, actionMetaFrom2Args);
var act0 = ReduxActions.createAction('ACTION0');
act0().payload === null;
var act1 = ReduxActions.createAction('ACTION1');
act1('hello').payload === 'hello';
var act2 = ReduxActions.createAction('ACTION2', function (s) { return s; });
act2({ load: true }).payload.load; // $ExpectType boolean
var act3 = ReduxActions.createAction('ACTION3', function (s) { return ({ s: s }); });
act3('hello').payload.s === 'hello';
ReduxActions.handleAction(act1, function (state, action) {
    return { hello: action.payload };
}, { hello: 'greetings' });
ReduxActions.handleAction(act2, function (state, action) {
    return { hello: action.payload };
}, { hello: { load: true } });
ReduxActions.handleAction(act3, function (state, action) {
    return { hello: action.payload.s };
}, { hello: 'greetings' });
//#region TONY CHANGE
ReduxActions.handleAction(ReduxActions.combineActions(act1, act3, act2), function (state, action) { return state + 1; }, 0);
ReduxActions.handleActions((_a = {},
    _a[ReduxActions.combineActions(act1, act3, act2).toString()] = function (state, action) {
        return state + 1;
    },
    _a), 0);
//#endregion
/* can't do this until it lands in 2.2, HKTs
ReduxActions.handleAction(act, (state, action) => {
    action.payload === 'hello'
    return {}
})

ReduxActions.handleAction(act2, (state, action) => {
    action.payload.load === true
    return {}
})

ReduxActions.handleAction(act3, (state, action) => {
    action.payload.s == 'hello'
    return {}
})*/
//#endregion
//#region createAction
//#region new !
/*
export function createAction<Payload, T extends Error, Arg1>(
    actionType: string,
    payloadCreator: ActionFunction1<Arg1, Payload>

): ActionFunction1<Arg1|T, Action<Payload | T>>;
*/
//arg and return type typed correctly
var errorSkipsPayloadCreatorAction = ReduxActions.createAction("ErrorArgSkipsCreator", function (arg) {
    return 5;
});
var e = errorSkipsPayloadCreatorAction(new EvalError(""));
var errorSkipsPayloadCreatorActionThatCanReturnError = ReduxActions.createAction("ErrorArgSkipsCreator", function (arg) {
    if (arg === "throw") {
        return new DOMError();
    }
    return 5;
});
//new createAction meta when called with error
/*
//new
export function createAction<Payload,T extends Error, Meta, Arg1>(
    actionType: string,
    payloadCreator: ActionFunction1<Arg1, Payload>,
    metaCreator: ActionFunction1<Arg1|T, Meta>
): ActionFunction1<Arg1, ActionMeta<T|Payload, Meta>>;
*/
var payloadCreatorCallCount = 0;
var metaCreatorCallCount = 0;
var metaActionCreatorWithErrorArg = ReduxActions.createAction("T", function (arg) {
    //we know this is a string
    payloadCreatorCallCount++;
    return 9;
}, function (arg) {
    metaCreatorCallCount++;
    //this can be either
    if (arg instanceof EvalError) {
        return arg.message;
    }
    else {
        return arg;
    }
});
var evalMessage = "EvalMessage";
var errorArg = new EvalError(evalMessage);
var errorAction = metaActionCreatorWithErrorArg(errorArg);
if (payloadCreatorCallCount !== 0) {
    throw new Error("Misunderstood");
}
if (metaCreatorCallCount !== 1) {
    throw new Error("Misunderstood");
}
if (!(errorAction.error && errorAction.payload === errorArg)) {
    throw new Error("Misunderstood");
}
if (errorAction.meta !== evalMessage) {
    throw new Error("Misunderstood");
}
var nonErrorArg = "SomeString";
var nonErrorAction = metaActionCreatorWithErrorArg(nonErrorArg);
if (nonErrorAction.payload !== 9) {
    throw new Error("Misunderstood");
}
if (nonErrorAction.meta !== nonErrorArg) {
    throw new Error("Misunderstood");
}
if (payloadCreatorCallCount !== 1) {
    throw new Error("Misunderstood");
}
if (metaCreatorCallCount !== 2) {
    throw new Error("Misunderstood");
}
//#endregion
//#region no meta
//no payload
var noPayloadActionCreator = ReduxActions.createAction('NoPayloadAction');
//#region example with store
//do not need to create interface for the state - the default will do
var defaultValue = 10;
var newPayloadReducer = ReduxActions.handleAction(noPayloadActionCreator, function (state, action) {
    //no error in visual studio when not returning state ( but there is with Webpack)
    return { someValue: state.someValue + 1 };
}, { someValue: defaultValue });
//do some tests will need to createStore
var noPayloadStore = redux_1.createStore(newPayloadReducer);
noPayloadStore.dispatch(noPayloadActionCreator());
if (noPayloadStore.getState().someValue !== defaultValue + 1) {
    throw new Error("Misunderstood");
}
noPayloadStore.dispatch(noPayloadActionCreator());
if (noPayloadStore.getState().someValue !== defaultValue + 2) {
    throw new Error("Misunderstood");
}
//would continue to demonstrate that is not called for different actions
//#endregion
//This is payload passthrough - PAYLOAD IS WHAT IS RETURNED BY THE ACTION CREATOR OR IN THIS CASE PASSED THROUGH
var payloadThroughGeneric = ReduxActions.createAction("PayloadThroughGeneric");
//arguments - specifiying argument type on the argument
var actionCreatorFunction = ReduxActions.createAction("ByFunction", function (someArg) {
    return "Payload: " + someArg.toString();
});
//specifying action creator arguments generically - ( Have to remember what the type parameters refer to - Payload,Meta?,Arg1?,... )
var actionCreatorFunctionGenerics = ReduxActions.createAction("ByFunctionGenerically", function (numberArg, stringArg) {
    return numberArg.toString() + stringArg;
});
//note that limited to 4 arguments by the typing.  Not sure if this is the case with the js ( metadata actions can take any )
//below does not compile normally but does with the additional typing that have provided
var actionCreatorAnyFunction = ReduxActions.createAction("AnyFunction", function (someArg1, someArg2, someArg3, someArg4, someArg5) {
    return "Payload: " + someArg1.toString();
});
//#endregion
//#region meta
//#region new ! - actionCreator is correctly typed - not any
var metaActionCreatorNoArgs = ReduxActions.createAction("MetaNoArgs", function () { return 1; }, function () {
    return "SomeMeta";
});
//#endregion
//#region ActionFunctionAny - typed arguments only
//because ActionFunctionAny<string> it will compile if provide different function signatures
//avoid unless need more args
//this allows more arguments but the caller of the actionCreator does not know the type of the arguments
//var actionWithMeta = actionCreatorMetaAny("badarg", 1, 2, 3, 4, 5, 6, 7);
//if supported by the js ( think that is ) and if required then add more ActionFunction<Arg1,.........,T>
//and additional createAction
/*
export type ActionFunction4<T1, T2, T3, T4,T5, R> = (t1: T1, t2: T2, t3: T3, t4: T4,t5:T5) => R;

export function createAction<Payload, Meta, Arg1, Arg2, Arg3, Arg4,Arg5>(
    actionType: string,
    payloadCreator: ActionFunction5<Arg1, Arg2, Arg3, Arg4,Arg5, Payload>,
    metaCreator: ActionFunction5<Arg1, Arg2, Arg3, Arg4,Arg5, Meta>
): ActionFunction5<Arg1, Arg2, Arg3, Arg4,Arg5, ActionMeta<Payload, Meta>>;


//note that if use one of the other ActionFunction n in this manner - the returned action creator will also be
//of type ActionFunctionAny<ActionMeta<Payload, Meta>>;


*/
var actionCreatorMetaAny = ReduxActions.createAction("MetaAny", function (someArg1, someArg2, someArg3, someArg4, someArg5) {
    return "String payload";
}, function (someArg1, someArg2, someArg3, someArg4, someArg5, thisIsBad) {
    return 99; //metadata
});
//note that above is the only way to go when not using args - as there is no typing for no args !
//cannot provide generic parameters createAction<Payload,T1,T2,T3,T4,T5
//
//#endregion
//#region generic parameters
//if using meta with 1,2,3,4 args then easier to provide the generic - saves typing for both 
//export function createAction<Payload, Meta, Arg1>(.....
var metaGenericsActionType = "MetaGenerics";
//here the returned action creator is typed as ActionFunction1<number,ActionMeta<number,string>>
var actionCreatorMetaGenerics = ReduxActions.createAction(metaGenericsActionType, function (numArg) {
    return numArg;
}, function (numArg) {
    return "meta";
});
//#endregion
//#endregion
//#region typing advice
//No meta - provide generics <Payload,Arg1..> ( ensures that the Payload returned is of the correct type)
//Meta - provide generics <Payload,Meta,Arg1....>
//#endregion
//#endregion
//#region handleAction
//#region typing advice
/*
if action not provided by a function then type the generics <State,Payload,Meta?>
otherwise
    types can be inferred - use pass through functions and definition file change for  meta
    use generic parameters if want to ensure initialState is typed correctly
*/
//#endregion
//#region no meta - inferred if provide action creator otherwise must provide generic type parameters
//inferred issue - have to add the initial state argument before adding the function body
//solution - use own handleAction function that has the reducer last and calls through 
function handleAction(actionType, initialState, reducer) {
    return ReduxActions.handleAction(actionType, reducer, initialState);
}
//use generic parameters when want to ensure that initial state is typed correctly or when not passing action creator
//#region examples
var actionCreatorFunctionReducer = ReduxActions.handleAction(actionCreatorFunction, function (state, action) {
    return {
        someValue: action.payload
    };
}, { someValue: "Initial value" });
var reducerMyArgOrder = handleAction(actionCreatorFunction, { someValue: "InitialValue" }, function (state, action) {
    return { someValue: action.payload };
});
//#endregion
//#endregion
//#region meta
//#region string action type
//#region payload and meta type specified in the argument typing of the reducer
//if do not type the state and infer from initial state then have to do the function body last
var metaReducer1 = ReduxActions.handleAction(metaGenericsActionType, function (state, action) {
    return {
        someValue: action.meta === "blah" ? "blah" : action.payload.toString()
    };
}, { someValue: "Initial Value" });
//#endregion
//#region generic parameters
//specifying Payload and Meta types through generics - have to specify the state as well although this would ensure that you provide initial state of the required type
var metaReducer2 = ReduxActions.handleAction("SomeActionThatWillNeverBeCreated", function (state, action) {
    return {
        someValue: action.meta === "blah" ? "blah" : action.payload.toString()
    };
}, { someValue: "Initial Value" });
//#endregion
//#endregion
//#region no typing !
/* - by changing the typing to include ActionFunctionsMeta<Payload, Meta>

export type ActionFunctionsMeta<Payload, Meta> =
    ReduxActions.ActionFunction0<ReduxActions.ActionMeta<Payload, Meta>> |
    ReduxActions.ActionFunction1<any, ReduxActions.ActionMeta<Payload, Meta>> |
    ReduxActions.ActionFunction2<any, any, ReduxActions.ActionMeta<Payload, Meta>> |
    ReduxActions.ActionFunction3<any, any, any, ReduxActions.ActionMeta<Payload, Meta>> |
    ReduxActions.ActionFunction4<any, any, any, any, ReduxActions.ActionMeta<Payload, Meta>> |
    ReduxActions.ActionFunctionAny<ReduxActions.ActionMeta<Payload, Meta>>

export function handleAction<State, Payload, Meta>(
    actionType: ActionFunctionsMeta<Payload, Meta> | { toString(): string } ,
    reducer: ReducerMeta<State, Payload, Meta> | ReducerNextThrowMeta<State, Payload, Meta>,
    initialState: State
): Reducer<State, Payload>;
*/
//the function below ensures typing is available in the reducer body immediately
function handleActionMeta(initialState, actionType, reducer) {
    return ReduxActions.handleAction(actionType, reducer, initialState);
}
var usingMyTypedHandleActionsReducer = handleActionMeta({ someValue: "InitialState" }, actionCreatorMetaGenerics, function (state, action) {
    return { someValue: action.meta };
});
var combinedMeta1 = ReduxActions.createAction("CombinedMeta1", function (arg) {
    return arg;
}, function (arg) {
    return "Meta";
});
var combinedMeta2 = ReduxActions.createAction("CombinedMeta2", function (arg) {
    return arg;
}, function (arg) {
    return "Meta2";
});
var combined1 = ReduxActions.createAction("Combined1", function (arg) { return 2; });
var combined2 = ReduxActions.createAction("Combined1", function (arg) { return 2; });
var combinedDifferentPayload = ReduxActions.createAction("Combined1", function (arg) { return "2"; });
//#region combineActions - remember not to be directly called !
//restrict to at least two args ??????????????????????????????????????
var combinedStringsNoGenericParameter = ReduxActions.combineActions("Action1", "Action2"); //Combined<{}>
var combinedStringsGenericParameter = ReduxActions.combineActions("Action1", "Action2"); //Combined<number>
var combinedStringsGenericParameters = ReduxActions.combineActions("Action1", "Action2"); //CombinedMeta<number,string>
var inference = ReduxActions.combineActions(combined1, combined2); //Combined<number>
var inferenceMixedTypes = ReduxActions.combineActions(combined1, "FROMSTRING"); //Combined<number>
var inferenceDifferentTypes = ReduxActions.combineActions(combined1, combinedDifferentPayload); //Combined<any>
/* have to specify for meta
export type ActionFunctionsMeta<Payload, Meta> =
    ReduxActions.ActionFunction0<ReduxActions.ActionMeta<Payload, Meta>> |
    ReduxActions.ActionFunction1<any, ReduxActions.ActionMeta<Payload, Meta>> |

vs

export type ActionFunctions<Payload> =
    ActionFunction0<Action<Payload>> |
    ActionFunction1<any, Action<Payload>> |



/*
var inferenceMeta = ReduxActions.combineActions(combinedMeta1, combinedMeta2);


//var combinedStringsGenericParameter = ReduxActions.combineActions<number>(["Action1","Action2"])

//#endregion

/*
getting for combineActions
export function combineActions<Payload>(...actionTypes: Array<ActionFunctions<Payload>>): Combined<Payload>;
    export type ActionFunctions<Payload> =
    ActionFunction0<Action<Payload>> |
    ActionFunction1<any, Action<Payload>> |

instead of
export function combineActions<Payload,Meta>(...actionTypes: Array<ActionFunctionsMeta<Payload,Meta>>): CombinedMeta<Payload,Meta>;
    export type ActionFunctionsMeta<Payload, Meta> =
    ReduxActions.ActionFunction0<ReduxActions.ActionMeta<Payload, Meta>> |
    ReduxActions.ActionFunction1<any, ReduxActions.ActionMeta<Payload, Meta>> |


export function createAction<Payload, Meta, Arg1>(
    actionType: string,
    payloadCreator: ActionFunction1<Arg1, Payload>,
    metaCreator: ActionFunction1<Arg1, Meta>
): ActionFunction1<Arg1, ActionMeta<Payload, Meta>>; -- export type ActionFunction1<T1, R> = (t1: T1) => R;

without specifying - with both overloads have ActionFunction<T>

can the return type change to assist with the typing ?
    fromm ActionFunction1<T1, R> = (t1: T1) => R;
    to ActionMetaFunction<T1,Payload,Meta>=(t1:T1)=>ActionMeta<Payload,Meta> *********************************************

a) If did this then what else would have to change ? ( caller of the returned action no change )
   handleAction - think that that would be ok
       just change ActionFunctionsMeta to a new AllActionMetaFunction<Payload,Meta>
        export function handleAction<State, Payload, Meta>(
            actionType: ActionFunctionsMeta<Payload, Meta> | { toString(): string } |CombinedMeta<Payload,Meta>,
            reducer: ReducerMeta<State, Payload, Meta> | ReducerNextThrowMeta<State, Payload, Meta>,
            initialState: State
        ): Reducer<State, Payload>;

    export function combineActions<Payload,Meta>(...actionTypes: Array<AllActionMetaFunction<Payload,Meta>>): CombinedMeta<Payload,Meta>;
    --- before changing do locally combineActions first - they might still be considered the same
   handleActions - think that the built in would not need to change

   DOES MINE NEED TO CHANGE ?


*/
//************************************************ to return to
//var combinedMeta = ReduxActions.combineActions(combinedMeta1, combinedMeta2);
//handleActionMeta({ someValue: "initial" }, combinedMeta, (state, action) => {
//    action
//});
//#endregion
//#endregion
//#endregion
//#region createActions - THEY DO NOT HAVE A SINGLE EXAMPLE
//#region typing advice
//DO NOT USE !
//#endregion
//#region identity
var actionsWithIdentity = ReduxActions.createActions({
    identity1: undefined
});
var identityArg = "One";
if (actionsWithIdentity.identity1(identityArg, "Ignored").payload !== identityArg) {
    throw new Error("Misunderstood");
}
//#endregion
//this is all new !
//now the keys are typesafe and if type the generic parameters can type the payload/meta if all the same
//PERSONALLY THINK THAT TYPING PAYLOAD/META IS A WASTE OF TIME AS WILL NEED TO
//RETYPE ANYWAY FOR ARGS SO HAVE TO TYPE THE PAYLOAD/META FOR EACH ONE ANYWAY !
//if wanted to lose type safety on the action creators it would still be there for handleAction/s
var createActionsArgument = {
    ACTION1: function (arg1) { return 1; },
    ACTION2: function (arg1) { return 2; }
};
//can cast if want the payload typed for all
var _b = ReduxActions.createActions(createActionsArgument), ACTION1 = _b.ACTION1, ACTION2 = _b.ACTION2;
//or - Note the requirement for typeof when providing the generic parameter
var createActionsArgument2 = {
    ACTION3: function (arg1) { return 1; },
    ACTION4: function (arg1) { return 2; }
};
var _c = ReduxActions.createActions(createActionsArgument2), ACTION3 = _c.ACTION3, ACTION4 = _c.ACTION4;
//with the previous typing the array did not need to be typed
var createActionsMetaArgument = {
    CREATEACTIONSMETA: [function () { return 1; }, function () { return "1"; }],
    CREATEACTIONSMETA2: [function () { return 1; }, function () { return "1"; }]
};
var _d = ReduxActions.createActions(createActionsMetaArgument), CREATEACTIONSMETA = _d.CREATEACTIONSMETA, CREATEACTIONSMETA2 = _d.CREATEACTIONSMETA2;
//explicit typing the action creators
var actions = ReduxActions.createActions({
    PAYLOADDIFFERENTACTION1: [function () { return 1; }, function () { return "1"; }],
    PAYLOADDIFFERENTACTION2: function (arg) { return arg; },
});
//why type when it is simpler to just do the following ! can do nested in this manner
var someActions = {
    someAction1: ReduxActions.createAction("SomeAction1", function (arg1, arg2) { return 22; }),
    someAction2: ReduxActions.createAction("SomeAction2", function (arg1, arg2) { return "22"; }),
    someActionMeta: ReduxActions.createAction("SomeActionMeta", function (arg1, arg2) { return "22"; }, function (arg1, arg2) { return 22; })
};
//#endregion
//#region handleActions
/*Note that visual studio is not type checking that the reducer is returning the state !
e.g
const actionsHandlerGenericParameters = ReduxActions.handleActions<number,number>({
    WITHNUMBERPAYLOAD1: (state, action) => state + action.payload,
    WITHNUMBERPAYLOAD2: (state, action) => state * action.payload,
    NORETURN: function (state, action) { } //this should show an intellisense error - does not compile in webpack
}, 0);
*/
//#region generic parameters - actions same payload ( meta ) type
var actionsHandlerGenericParameters = ReduxActions.handleActions({
    WITHNUMBERPAYLOAD1: function (state, action) { return state + action.payload; },
    WITHNUMBERPAYLOAD2: function (state, action) { return state * action.payload; },
}, 0);
//#region using action creator in keys 
/*typescript does not accept the action creator as key
{
    [testAction]: (state, action) => state + action.payload,
*/
var WITHNUMBERPAYLOAD1 = ReduxActions.createAction("TestAction", function (arg1, arg2) {
    return 99;
});
var actionsHandlerActionCreatorKeys = ReduxActions.handleActions((_e = {},
    _e[WITHNUMBERPAYLOAD1.toString()] = function (state, action) { return state + action.payload; },
    _e.WITHNUMBERPAYLOAD2 = function (state, action) { return state * action.payload; },
    _e), 0);
//#endregion
//<State,Payload,Meta>
var actionsHandlerMeta = ReduxActions.handleActions({
    SOMEMETAREDUCER1: function (state, action) {
        var meta = action.meta.someMetaValue;
        return parseInt(action.meta.someMetaValue) + state + parseInt(action.payload);
    },
    SOMEMETAREDUCER2: function (state, action) {
        return state + action.payload + action.meta.someMetaValue === "Do it" ? 999 : 0;
    }
}, 99);
//.....having corrected the return type
var topLevelPayload = new Date();
var topLevelMeta = new RegExp("blah");
var nested1Payload = 7;
var nested1Meta = "9";
var nested2Payload = "7";
var nested2Meta = 9;
var nestedActions = ReduxActions.createActions({
    topLevel: [function (arg1) { return topLevelPayload; }, function (arg1) { return topLevelMeta; }],
    nested: {
        nested1: [function (arg1) { return nested1Payload; }, function (arg1) { return nested1Meta; }],
        nested2: [function (arg1) { return nested2Payload; }, function (arg1) { return nested2Meta; }],
    }
});
//#region example usage of calling nested action creators
/*

Example usage https://redux-actions.js.org/docs/api/createAction.html
const actionCreators = createActions({
  APP: {
    COUNTER: {
      INCREMENT: [
        amount => ({ amount }),
        amount => ({ key: 'value', amount })
      ],
    ....

expect(actionCreators.app.counter.increment(1)).to.deep.equal({
  type: 'APP/COUNTER/INCREMENT',
  payload: { amount: 1 },
  meta: { key: 'value', amount: 1 }
});
*/
//#endregion
//a) Set up the reducers to demonstrate calls and action values
//is there any point in nesting when can dot in to the return of createActions
//and use toString() for safe key names (assuming that the toString itself is dotted to show the path)
var reducerCallCount = 0;
var topLevelActionArg;
var nested1ActionArg;
var nested2ActionArg;
//single reducer that will call the others
//ONLY USE THIS OVERLOAD WHEN ALL ACTION CREATORS PROVIDE META  ( if action was identity then no meta )
var nestedMetaReducer = ReduxActions.handleActions((_f = {},
    _f[nestedActions.topLevel.toString()] = function (state, action) {
        reducerCallCount++;
        topLevelActionArg = action;
        return {
            someValue: "InitialValue"
        };
    },
    _f.nested = {
        nested1: function (state, action) {
            reducerCallCount++;
            nested1ActionArg = action;
            return {
                someValue: "InitialValue"
            };
        },
        nested2: function (state, action) {
            reducerCallCount++;
            nested2ActionArg = action;
            return {
                someValue: "InitialValue"
            };
        }
    },
    _f), { someValue: "InitialValue" });
var topLevelAction = nestedActions.topLevel("Value");
var nested1Action = nestedActions.nested.nested1(9);
var nested2Action = nestedActions.nested.nested2("Value", 9);
nestedMetaReducer({ someValue: "SomeValue" }, topLevelAction);
if (!(reducerCallCount === 1 && topLevelAction.payload === topLevelPayload && topLevelAction.meta === topLevelMeta)) {
    throw new Error("Misunderstood");
}
nestedMetaReducer({ someValue: "SomeValue" }, nested1Action);
if (!(reducerCallCount === 2 && nested1Action.payload === nested1Payload && nested1Action.meta === nested1Meta)) {
    throw new Error("Misunderstood");
}
nestedMetaReducer({ someValue: "SomeValue" }, nested2Action);
if (!(reducerCallCount === 3 && nested2Action.payload === nested2Payload && nested2Action.meta === nested2Meta)) {
    throw new Error("Misunderstood");
}
//endregion
//#endregion
//#region STATEANDPAYLOAD TYPING
/*
export function handleActions<StateAndPayload>(
    reducerMap: ReducerMap<StateAndPayload, StateAndPayload>,
    initialState: StateAndPayload
): Reducer<StateAndPayload, StateAndPayload>;
*/
var reducerStateAndPayloadsTypescriptOverload = ReduxActions.handleActions({
    SAMEPAYLOADASSTATE1: function (state, action) { return state + action.payload; },
    SAMEPAYLOADASSTATE2: function (state, action) { return state * action.payload; }
}, 0);
//#endregion
//#region different payloads
var reducerDifferentPayloadTypes = ReduxActions.handleActions({
    PAYLOADSTRING: function (state, action) { return state + parseInt(action.payload); },
    PAYLOADNUMBER: function (state, action) { return state + action.payload; },
}, 0);
//#endregion
//#region handleActionsFromCreators
function handleActionsFromCreators(initialState, ach1, ach2, ach3, ach4, ach5, ach6, ach7, ach8) {
    var reducerMap = {};
    for (var i = 1; i < arguments.length; i++) {
        var actionCreatorHandler = arguments[i];
        reducerMap[actionCreatorHandler.actionCreator.toString()] = actionCreatorHandler.reducer;
    }
    return ReduxActions.handleActions(reducerMap, initialState);
}
//<payload, meta? arg1,arg2,....>
var someActionCreator = ReduxActions.createAction("SomeAction", function (arg1) {
    if (arg1 === "throw") {
        return new Error();
    }
    return new RegExp(arg1);
});
var someActionCreator2 = ReduxActions.createAction("SomeAction2", function (arg1, arg2) {
    if (arg1 === "throw") {
        return new EvalError("msg");
    }
    return new Date();
});
var possibleErrorAction = someActionCreator2("throw", 1);
if (possibleErrorAction.error) {
    var evalError = possibleErrorAction.payload;
}
var reducer1StateArg;
var reducer1ActionArg;
var reducer2StateArg;
var reducer2ActionArg;
var reducer2ErrorStateArg;
var reducer2ErrorActionArg;
//now need to combine some
var toCombine1 = ReduxActions.createAction("ToCombine1", function (arg) {
    return new Date();
});
var toCombine2 = ReduxActions.createAction("ToCombine2", function (arg1, arg2) {
    return new Date();
});
var combinedActionCreator = ReduxActions.combineActions(toCombine1, toCombine2);
var reducerFromTypingHelper1 = handleActionsFromCreators({ someValue: "Initial Value" }, {
    actionCreator: combinedActionCreator,
    reducer: function (state, action) {
        return {
            someValue: action.payload.getMonth().toString()
        };
    }
}, {
    actionCreator: someActionCreator,
    reducer: function (state, action) {
        reducer1StateArg = state;
        reducer1ActionArg = action;
        return { someValue: action.error ? "Error" : action.payload.source };
    }
}, {
    actionCreator: someActionCreator2,
    reducer: {
        next: function (state, action) {
            reducer2StateArg = state;
            reducer2ActionArg = action;
            return {
                someValue: action.error ? "Error" : action.payload.toTimeString()
            };
        },
        throw: function (state, action) {
            reducer2ErrorStateArg = state;
            reducer2ErrorActionArg = action;
            return { someValue: "Errored" };
        }
    }
});
var action1 = someActionCreator("Some value");
var action2 = someActionCreator2("Some value", 99);
var action2Error = someActionCreator2("throw", 99);
var reducerState = { someValue: "MyValue" };
reducerFromTypingHelper1(reducerState, action1);
if (!(reducer1StateArg === reducerState && reducer1ActionArg === action1)) {
    throw new Error("Unexpected");
}
reducerFromTypingHelper1(reducerState, action2);
if (!(reducer2StateArg === reducerState && reducer2ActionArg === action2)) {
    throw new Error("Unexpected");
}
reducerFromTypingHelper1(reducerState, action2Error);
if (!(reducer2ErrorStateArg === reducerState && reducer2ErrorActionArg === action2Error)) {
    throw new Error("Unexpected");
}
var actionsNested = {
    LevelOne1: {
        action1: ReduxActions.createAction("Level1.Action1", function (arg) { return 9; }),
        actions2: ReduxActions.createAction("Level1.Action2", function (arg) { return arg.toString(); })
    },
    LevelOne2: {
        action1: ReduxActions.createAction("Level1.Action1", function (arg) { return 9; }),
        actions2: ReduxActions.createAction("Level1.Action2", function (arg) { return arg.toString(); })
    }
};
//export function combineActions(...actionTypes: Array<ActionFunctions<any> | string>): string;
//var t = handleActionsFromCreators({someValue:"initial"},)
//#endregion
//#region handleActionsFromMetaCreators
function handleActionsFromMetaCreators(initialState, ach1, ach2) {
    var reducerMap = {};
    for (var i = 1; i < arguments.length; i++) {
        var actionCreatorHandler = arguments[i];
        reducerMap[actionCreatorHandler.actionCreator.toString()] = actionCreatorHandler.reducer;
    }
    return ReduxActions.handleActions(reducerMap, initialState);
}
var actionCreatorMetaGenerics2 = ReduxActions.createAction("SomeActionType", function (stringArg) {
    return stringArg;
}, function (stringArg) {
    return 1;
});
var reducerFromTypingHelper2 = handleActionsFromMetaCreators({
    someValue: "InitialValue"
}, {
    actionCreator: actionCreatorMetaGenerics,
    reducer: function (state, action) {
        return state;
    }
}, {
    actionCreator: actionCreatorMetaGenerics2,
    reducer: function (state, action) {
        return state;
    }
});
function createReducerMap(state, ach1, ach2) {
    var reducerMap = {};
    for (var i = 1; i < arguments.length; i++) {
        var actionCreatorHandler = arguments[i];
        reducerMap[actionCreatorHandler.actionCreator.toString()] = actionCreatorHandler.reducer;
    }
    return reducerMap;
}
function createReducerMapMeta(state, reducerMap, ach, ach2) {
    for (var i = 2; i < arguments.length; i++) {
        var actionCreatorHandler = arguments[i];
        reducerMap[actionCreatorHandler.actionCreator.toString()] = actionCreatorHandler.reducer;
    }
    return reducerMap;
}
//what should the typing be for the reducer map - aside from the store calling the reducer
//only time will be called is for a test so should have the state typed and if was used as the root reducer could accept any action
function reducerMapHandleActions(map, initialState) {
    return ReduxActions.handleActions(map, initialState);
}
//#region example 
var initialState = { someValue: "Initial" };
var crMapReducer1State;
var crMapReducer1Action;
var crMapReducer2State;
var crMapReducer2Action;
var crMapReducer1MetaState;
var crMapReducer1MetaAction;
var crMapReducer2MetaState;
var crMapReducer2MetaAction;
var reducerMap = createReducerMap(initialState, {
    actionCreator: someActionCreator,
    reducer: function (state, action) {
        crMapReducer1Action = action;
        crMapReducer1State = state;
        return { someValue: "blah" };
    }
}, {
    actionCreator: someActionCreator2,
    reducer: {
        next: function (state, action) {
            crMapReducer2Action = action;
            crMapReducer2State = state;
            return { someValue: "Blah" };
        },
        throw: function (state, action) {
            return { someValue: "Errored" };
        }
    }
});
var reducerMapMeta = createReducerMapMeta(initialState, reducerMap, {
    actionCreator: actionCreatorMetaGenerics,
    reducer: function (state, action) {
        crMapReducer1MetaAction = action;
        crMapReducer1MetaState = state;
        return state;
    }
}, {
    actionCreator: actionCreatorMetaGenerics2,
    reducer: function (state, action) {
        crMapReducer2MetaAction = action;
        crMapReducer2MetaState = state;
        return state;
    }
});
var reducerFromTypingHelper3 = reducerMapHandleActions(reducerMapMeta, initialState);
reducerFromTypingHelper3(reducerState, action1);
if (!(crMapReducer1State === reducerState && crMapReducer1Action === action1)) {
    throw new Error("Unexpected");
}
reducerFromTypingHelper3(reducerState, action2);
if (!(crMapReducer2State === reducerState && crMapReducer2Action === action2)) {
    throw new Error("Unexpected");
}
var actionGenerics1 = actionCreatorMetaGenerics(9);
var actionGenerics2 = actionCreatorMetaGenerics2("1");
reducerFromTypingHelper3(reducerState, actionGenerics1);
if (!(crMapReducer1MetaState === reducerState && crMapReducer1MetaAction === actionGenerics1)) {
    throw new Error("Unexpected");
}
reducerFromTypingHelper3(reducerState, actionGenerics2);
if (!(crMapReducer2MetaState === reducerState && crMapReducer2MetaAction === actionGenerics2)) {
    throw new Error("Unexpected");
}
var _a, _e, _f;
//#endregion
//#endregion
//#endregion
//#endregion
//#endregion
//# sourceMappingURL=reduxActionsTest.js.map