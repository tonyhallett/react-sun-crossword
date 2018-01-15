"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReduxActions = require("redux-actions");
var redux_1 = require("redux");
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
var richerAction = {
    type: 'INCREMENT',
    error: false,
    payload: {
        value: 2
    },
    meta: {
        remote: true
    }
};
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
////!!!!!!!!!!!!!
var tonyTestReducerMetaMap = ReduxActions.handleActions({
    INCREMENT_BY: function (state, action) {
        return action.meta.remote ? state : { value: state.value + action.payload.increase };
    },
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
ReduxActions.handleAction(ReduxActions.combineActions(act1, act3, act2), function (state, action) { return state + 1; }, 0);
ReduxActions.handleActions((_a = {},
    _a[ReduxActions.combineActions(act1, act3, act2)] = function (state, action) {
        return state + 1;
    },
    _a), 0);
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
//below does not compile
//var actionCreatorAnyFunction = ReduxActions.createAction("AnyFunction", (someArg1: number, someArg2: number, someArg3: number, someArg4: number, someArg5: number) => {
//    return "Payload: " + someArg1.toString();
//})
//because ActionFunctionAny<string> it will compile if provide different function signatures - avoid unless need more args
//note that if use one of the other ActionFunction and do not type the generics - the returned action creator will be 
//of type ActionFunctionAny<ActionMeta<Payload, Meta>>;
//************************************ typing advice
//createAction 
//No meta - provide generics <Payload,Arg1..> ( ensures that the Payload returned is of the correct type)
//Meta - provide generics <Payload,Meta,Arg1....>
var actionCreatorMetaAny = ReduxActions.createAction("MetaAny", function (someArg1, someArg2, someArg3, someArg4, someArg5) {
    return "String payload";
}, function (someArg1, someArg2, someArg3, someArg4, someArg5) {
    return 99; //metadata
});
//this allows more arguments but the caller of the actionCreator does not know the type of the arguments
//var actionWithMeta = actionCreatorMetaAny("badarg", 1, 2, 3, 4, 5, 6, 7);
//if supported by the js and if required then add more ActionFunction<Arg1,.........,T>
//note that above is the only way to go when not using args
//if using meta with 1,2,3,4 args then easier to provide the generic - saves typing for both 
//export function createAction<Payload, Meta, Arg1>(.....
var metaGenericsActionType = "MetaGenerics";
//here the returned action creator is typed as ActionFunction1<number,ActionMeta<number,string>>
var actionCreatorMetaGenerics = ReduxActions.createAction(metaGenericsActionType, function (numArg) {
    return numArg;
}, function (numArg) {
    return "meta";
});
//#region handleAction
//#region no meta
//********************** typing advice
//no meta
//it is not necessary to type the <State, Payload> as the State is provided
//and the Payload can be inferred if using action creator instead of string
//issue - have to add the initial state argument before adding the function body
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
//using meta in reducer - payload and meta type specified in the argument typing of the reducer
/*
export type ReducerMeta<State, Payload, Meta> = (state: State, action: ActionMeta<Payload, Meta>) => State;

*/
//#region necessary when using string for the action type - as the non meta type definition is being used
/*
export function handleAction<State, Payload>(
    actionType: string | ActionFunctions<Payload>,
    reducer: Reducer<State, Payload> | ReducerNextThrow<State, Payload>,
    initialState: State
): Reducer<State, Payload>;
*/
//#endregion
var metaReducer1 = ReduxActions.handleAction(metaGenericsActionType, function (state, action) {
    return {
        someValue: action.meta === "blah" ? "blah" : action.payload.toString()
    };
}, { someValue: "Initial Value" });
//specifying Payload and Meta types through generics - have to specify the state as well although this would ensure that you provide initial state of the required type
var metaReducer2 = ReduxActions.handleAction("SomeActionThatWillNeverBeCreated", function (state, action) {
    return {
        someValue: action.meta === "blah" ? "blah" : action.payload.toString()
    };
}, { someValue: "Initial Value" });
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

by using the function below the reducer has the action typed as ActionMeta<Payload,Meta>
*/
function handleActionMeta(initialState, actionType, reducer) {
    return ReduxActions.handleAction(actionType, reducer, initialState);
}
var usingMyTypedHandleActionsReducer = handleActionMeta({ someValue: "InitialState" }, actionCreatorMetaGenerics, function (state, action) {
    return { someValue: action.meta };
});
//#endregion
//#endregion
//#region createActions
//do not need to type the Payload as can be inferred from return value - and have to be the same for all if not typing to any - see below
//The typing cannot be improved with K in key of T, T[K] Wsee https://github.com/Microsoft/TypeScript/issues/14719 and https://github.com/Microsoft/TypeScript/issues/5453
//just use object with multiple createAction
var _b = ReduxActions.createActions({
    ACTION1: function (arg1) { return 1; },
    ACTION2: function (arg1) { return 2; }
}), ACTION1 = _b.ACTION1, ACTION2 = _b.ACTION2;
//the actions lose there typing as is ActionFunctionAny<Action<Payload>>
//ACTION1("incorrect")
//ACTION2(3)
//explicit typing 
/*
had to cast to any first - can this be done any better
Type '{ [actionName: string]: ActionFunctionAny<Action<any>>; }' cannot be converted to type
'{ PAYLOADDIFFERENTACTION1: () => number; PAYLOADDIFFERENTACTION2: () => string; }'.

Property 'PAYLOADDIFFERENTACTION1' is missing in type '{ [actionName: string]: ActionFunctionAny<Action<any>>; }'.
*/
var _c = ReduxActions.createActions({
    PAYLOADDIFFERENTACTION1: function () { return 1; },
    PAYLOADDIFFERENTACTION2: function () { return "1"; },
}), PAYLOADDIFFERENTACTION1 = _c.PAYLOADDIFFERENTACTION1, PAYLOADDIFFERENTACTION2 = _c.PAYLOADDIFFERENTACTION2;
//why type when it is simpler to just do the following !
var someActions = {
    someAction1: ReduxActions.createAction("SomeAction1", function (arg1, arg2) { return 22; }),
    someAction2: ReduxActions.createAction("SomeAction2", function (arg1, arg2) { return "22"; }),
    someActionMeta: ReduxActions.createAction("SomeActionMeta", function (arg1, arg2) { return "22"; }, function (arg1, arg2) { return 22; })
};
//#endregion
//#region handleActions
//can only be done for actions with the same payload type ! - use generic parameter to savetyping, have to specify state type though
var actionsHandlerGenericParameters = ReduxActions.handleActions({
    WITHNUMBERPAYLOAD1: function (state, action) { return state + action.payload; },
    WITHNUMBERPAYLOAD2: function (state, action) { return state * action.payload; }
}, 0);
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
var _a;
//#endregion
//#region to do
//!!!!!!!!!!!!!!!!!!! How do you use the API for when a reducer handles multiple actions with different payload !
//go to any payload and cast 
//handleAction multiple times - but what do you do with the resulting reducers ? i.e store only wants one *************************
//combineActions - only good if the payload and more importantly the logic is the same for 'how' the store should update
//*******************
//THINK THAT WILL HAVE TO GO TO ANY AND RETYPE
//did not do createActions - js examples has different Payload and Meta types !
//check the js to see if have embedded typescript file
//check the js docs again - perhaps the typescript is misleading as to what handleActions can do - or restricting in its typing
//(Internally, handleActions() works by applying multiple reducers in sequence using reduce-reducers.)
//read the js
//do combine
//using throw - just do inside handleAction
//#endregion
//# sourceMappingURL=reduxActionsTest.js.map