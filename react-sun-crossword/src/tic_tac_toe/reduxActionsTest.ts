import * as ReduxActions from 'redux-actions';
import { createStore } from "redux";
export const dummyFn = () => { }

//#region theirs
let state: number;
const minimalAction: ReduxActions.BaseAction = { type: 'INCREMENT' };

const incrementAction: () => ReduxActions.Action<number> = ReduxActions.createAction<number>(
    'INCREMENT', () => 1
);

const multiplyAction: (...args: number[]) => ReduxActions.Action<number> = ReduxActions.createAction<number>(
    'MULTIPLY'
);

const action: ReduxActions.Action<number> = incrementAction();

const actionHandler = ReduxActions.handleAction<number, number>(
    'INCREMENT',
    (state: number, action: ReduxActions.Action<number>) => state + action.payload,
    0
);

state = actionHandler(0, incrementAction());

const actionHandlerWithReduceMap = ReduxActions.handleAction<number, number>(
    'MULTIPLY', {
        next(state: number, action: ReduxActions.Action<number>) {
            return state * action.payload;
        },
        throw(state: number) { return state; }
    },
    0
);

state = actionHandlerWithReduceMap(0, multiplyAction(10));

const actionsHandler = ReduxActions.handleActions({
    INCREMENT: (state: number, action: ReduxActions.Action<number>) => state + action.payload,
    MULTIPLY: (state: number, action: ReduxActions.Action<number>) => state * action.payload
}, 0);

state = actionsHandler(0, { type: 'INCREMENT' });

const actionsHandlerWithInitialState = ReduxActions.handleActions({
    INCREMENT: {
        next: (state: number, action: ReduxActions.Action<number>) => state + action.payload,
    },
    MULTIPLY: {
        next: (state: number, action: ReduxActions.Action<number>) => state * action.payload
    }
}, 0);

state = actionsHandlerWithInitialState(0, { type: 'INCREMENT' });

const actionsHandlerWithRecursiveReducerMap = ReduxActions.handleActions<number, number>({
    ADJUST: {
        UP: (state: number, action: ReduxActions.Action<number>) => state + action.payload,
        DOWN: (state: number, action: ReduxActions.Action<number>) => state - action.payload,
    }
}, 0);

state = actionsHandlerWithRecursiveReducerMap(0, { type: 'ADJUST/UP', payload: 1 });

// ----------------------------------------------------------------------------------------------------

interface TypedState {
    value: number;
}

interface TypedPayload {
    increase: number;
}

interface MetaType {
    remote: boolean;
}

let typedState: TypedState;

const richerAction: ReduxActions.ActionMeta<TypedState, MetaType> = {
    type: 'INCREMENT',
    error: false,
    payload: {
        value: 2
    },
    meta: {
        remote: true
    }
};

const typedIncrementAction: () => ReduxActions.Action<TypedPayload> = ReduxActions.createAction<TypedPayload>(
    'INCREMENT',
    () => ({ increase: 1 })
);

const typedActionHandler = ReduxActions.handleAction<TypedState, TypedPayload>(
    'INCREMENT',
    (state: TypedState, action: ReduxActions.Action<TypedPayload>) => ({ value: state.value + 1 }),
    {value: 1}
);

const actionNoArgs = typedIncrementAction();
actionNoArgs.payload.increase = 1;

typedState = typedActionHandler({ value: 0 }, actionNoArgs);

const typedIncrementAction1TypedArg: (value: number) =>
    ReduxActions.Action<TypedPayload> = ReduxActions.createAction<TypedPayload, number>(
        'INCREMENT',
        amount => ({ increase: amount })
    );

const actionFrom1Arg = typedIncrementAction1TypedArg(10);
actionFrom1Arg.payload.increase === 10;

const typedIncrementAction2TypedArgs: (numericAmount: number, stringAmount: string) =>
ReduxActions.Action<TypedPayload> = ReduxActions.createAction<TypedPayload, number, string>(
    'INCREMENT',
    (numericAmount, stringAmount) => ({ increase: numericAmount + parseInt(stringAmount, 10) })
);

const actionFrom2Args = typedIncrementAction2TypedArgs(10, '100');
actionFrom1Arg.payload.increase === 110;

const typedActionHandlerReducerMap = ReduxActions.handleActions(
    {
        INCREMENT: (state: TypedState, action: ReduxActions.Action<any>) => ({ value: state.value + 1 })
    },
    {value: 1}
);

typedState = typedActionHandlerReducerMap({ value: 0 }, actionFrom1Arg);

const typedIncrementByActionWithMetaAnyArgs: (...args: any[]) => ReduxActions.ActionMeta<TypedPayload, MetaType> =
    ReduxActions.createAction<TypedPayload, MetaType>(
        'INCREMENT_BY',
        amount => ({ increase: amount }),
        (_, remote) => ({ remote })
    );

const actionMetaFromAnyArgs = typedIncrementByActionWithMetaAnyArgs(10, true, 'nic', 'cage');
actionMetaFromAnyArgs.payload.increase === 10;
actionMetaFromAnyArgs.meta.remote;

const typedActionHandlerWithMeta = ReduxActions.handleAction<TypedState, TypedPayload, MetaType>(
    'INCREMENT_BY', {
        next(state: TypedState, action: ReduxActions.ActionMeta<TypedPayload, MetaType>) {
            return action.meta.remote ? state : { value: state.value + action.payload.increase };
        },
        throw(state: TypedState) { return state; }
    },
    {value: 1}
);

typedState = typedActionHandlerWithMeta({ value: 0 }, typedIncrementByActionWithMetaAnyArgs(10));

const typedActionHandlerReducerMetaMap = ReduxActions.handleActions<TypedState, TypedPayload, MetaType>(
    {
        INCREMENT_BY: {
            next(state: TypedState, action: ReduxActions.ActionMeta<TypedPayload, MetaType>) {
                return action.meta.remote ? state : { value: state.value + action.payload.increase };
            },
            throw(state: TypedState) { return state; }
        }
    },
    {value: 1}
);
////!!!!!!!!!!!!!
const tonyTestReducerMetaMap = ReduxActions.handleActions<TypedState, TypedPayload, MetaType>(
    {
        INCREMENT_BY: (state: TypedState, action: ReduxActions.ActionMeta<TypedPayload, MetaType>)=> {
            return action.meta.remote ? state : { value: state.value + action.payload.increase };
        },
    },
    { value: 1 }
);

typedState = typedActionHandlerReducerMetaMap({ value: 0 }, actionMetaFromAnyArgs);

const typedActionWithMeta1TypedArg: (value: number) => ReduxActions.ActionMeta<TypedPayload, MetaType> =
    ReduxActions.createAction(
        'INCREMENT_BY',
        amount => ({ increase: amount }),
        amount => ({ remote: true })
    );

const actionMetaFrom1Arg = typedActionWithMeta1TypedArg(10);
actionMetaFrom1Arg.payload.increase === 10;
actionMetaFrom1Arg.meta.remote;

typedState = typedActionHandlerReducerMetaMap({ value: 0 }, actionMetaFrom1Arg);

const typedActionWithMeta2TypedArgs: (value: number, remote: boolean) => ReduxActions.ActionMeta<TypedPayload, MetaType> =
    ReduxActions.createAction(
        'INCREMENT_BY',
        (amount, remote)  => ({ increase: amount }),
        (amount, remote) => ({ remote })
    );

const actionMetaFrom2Args = typedActionWithMeta2TypedArgs(10, true);
actionMetaFrom2Args.payload.increase === 10;
actionMetaFrom2Args.meta.remote;

typedState = typedActionHandlerReducerMetaMap({ value: 0 }, actionMetaFrom2Args);

const act0 = ReduxActions.createAction('ACTION0');
act0().payload === null;

const act1 = ReduxActions.createAction<string>('ACTION1');
act1('hello').payload === 'hello';

const act2 = ReduxActions.createAction('ACTION2', (s: {load: boolean}) => s);
act2({load: true}).payload.load; // $ExpectType boolean

const act3 = ReduxActions.createAction('ACTION3', (s: string) => ({s}));
act3('hello').payload.s === 'hello';

ReduxActions.handleAction<{ hello: string }, string>(act1, (state, action) => {
    return { hello: action.payload };
}, {hello: 'greetings'});

ReduxActions.handleAction<{ hello: { load: boolean } }, { load: boolean }>(act2, (state, action) => {
    return { hello: action.payload };
}, {hello: {load: true}});

ReduxActions.handleAction(act3, (state, action) => {
    return { hello: action.payload.s };
}, {hello: 'greetings'});

ReduxActions.handleAction(ReduxActions.combineActions(act1, act3, act2), (state, action) => state + 1, 0);

ReduxActions.handleActions({
    [ReduxActions.combineActions(act1, act3, act2)](state, action) {
        return state + 1;
    }
}, 0);

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
//#region no meta
//no payload
var noPayloadActionCreator = ReduxActions.createAction('NoPayloadAction')

//#region example with store
//do not need to create interface for the state - the default will do
var defaultValue = 10;
var newPayloadReducer = ReduxActions.handleAction(noPayloadActionCreator, (state, action) => {
    //no error in visual studio when not returning state ( but there is with Webpack)
    return { someValue: state.someValue + 1 }
}, { someValue: defaultValue })
//do some tests will need to createStore
var noPayloadStore = createStore(newPayloadReducer);
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
var payloadThroughGeneric = ReduxActions.createAction<string>("PayloadThroughGeneric");


//arguments - specifiying argument type on the argument
var actionCreatorFunction = ReduxActions.createAction("ByFunction", (someArg: number) => {
    return "Payload: " + someArg.toString();
})



//specifying action creator arguments generically - ( Have to remember what the type parameters refer to - Payload,Meta?,Arg1?,... )
var actionCreatorFunctionGenerics = ReduxActions.createAction<string, number, string>("ByFunctionGenerically", (numberArg, stringArg) => {
    return numberArg.toString() + stringArg;
});
//note that limited to 4 arguments by the typing.  Not sure if this is the case with the js ( metadata actions can take any )
//below does not compile
//var actionCreatorAnyFunction = ReduxActions.createAction("AnyFunction", (someArg1: number, someArg2: number, someArg3: number, someArg4: number, someArg5: number) => {
//    return "Payload: " + someArg1.toString();
//})
//#endregion
//#region meta

//#region ActionFunctionAny - typed arguments only

//because ActionFunctionAny<string> it will compile if provide different function signatures

//avoid unless need more args
//note that if use one of the other ActionFunctionn in this manner - the returned action creator will also be 
//of type ActionFunctionAny<ActionMeta<Payload, Meta>>;

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
*/


var actionCreatorMetaAny = ReduxActions.createAction("MetaAny", (someArg1: number, someArg2: number, someArg3: number, someArg4: number, someArg5: number) => {
    return "String payload";
}, (someArg1: number, someArg2: number, someArg3: number, someArg4: number, someArg5: number,thisIsBad:any) => {
    return 99;//metadata
    });





//note that above is the only way to go when not using args - as there is no typing for no args !
//cannot provide generic parameters createAction<Payload,T1,T2,T3,T4,T5


//
//#endregion
//#region generic parameters
//if using meta with 1,2,3,4 args then easier to provide the generic - saves typing for both 
//export function createAction<Payload, Meta, Arg1>(.....
const metaGenericsActionType = "MetaGenerics";
//here the returned action creator is typed as ActionFunction1<number,ActionMeta<number,string>>
var actionCreatorMetaGenerics = ReduxActions.createAction<number, string, number>(metaGenericsActionType, (numArg) => {
    return numArg;
}, (numArg) => {
    return "meta"
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
function handleAction<State, Payload>(
    actionType: string | ReduxActions.ActionFunctions<Payload>,
    initialState: State,
    reducer: ReduxActions.Reducer<State, Payload> | ReduxActions.ReducerNextThrow<State, Payload>,
) {
    return ReduxActions.handleAction(actionType, reducer, initialState);
}
//use generic parameters when want to ensure that initial state is typed correctly or when not passing action creator


//#region examples

var actionCreatorFunctionReducer = ReduxActions.handleAction(actionCreatorFunction, (state, action) => {
    return {
        someValue: action.payload
    }
}, { someValue: "Initial value" })

var reducerMyArgOrder = handleAction(actionCreatorFunction, { someValue: "InitialValue" }, (state, action) => {
    return { someValue: action.payload };
});
//#endregion

//#endregion
//#region meta
//#region string action type
//#region payload and meta type specified in the argument typing of the reducer
//if do not type the state and infer from initial state then have to do the function body last

var metaReducer1=ReduxActions.handleAction(metaGenericsActionType, (state, action: ReduxActions.ActionMeta<number, string>) => {
    return {
        someValue: action.meta === "blah" ? "blah" : action.payload.toString()
    }
}, { someValue: "Initial Value" });
//#endregion
//#region generic parameters
//specifying Payload and Meta types through generics - have to specify the state as well although this would ensure that you provide initial state of the required type
var metaReducer2 = ReduxActions.handleAction < { someValue: string },number,string>("SomeActionThatWillNeverBeCreated", (state, action) => {
    return {
        someValue: action.meta === "blah" ? "blah" : action.payload.toString()
    }
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
function handleActionMeta<State, Payload, Meta>(
    initialState: State,
    actionType: ReduxActions.ActionFunctionsMeta<Payload, Meta> ,
    reducer: ReduxActions.ReducerMeta<State, Payload, Meta> | ReduxActions.ReducerNextThrowMeta<State, Payload, Meta>,
    
) {
    return ReduxActions.handleAction(actionType, reducer, initialState);
}

var usingMyTypedHandleActionsReducer = handleActionMeta({ someValue: "InitialState" }, actionCreatorMetaGenerics, (state, action) => {
    return { someValue: action.meta }
});
//#endregion

//#endregion
//#endregion

//#region createActions
//#region typing advice
//DO NOT USE !
//#endregion
//do not need to type the Payload as can be inferred from return value - and have to be the same for all if not typing to any - see below
//The typing cannot be improved with K in key of T, T[K] Wsee https://github.com/Microsoft/TypeScript/issues/14719 and https://github.com/Microsoft/TypeScript/issues/5453
//just use object with multiple createAction
const { ACTION1,ACTION2 } = ReduxActions.createActions({
    ACTION1: (arg1: number) => { return 1 },
    ACTION2: (arg1: string) => { return 2 }
});




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


const { PAYLOADDIFFERENTACTION1, PAYLOADDIFFERENTACTION2 }=  <{ PAYLOADDIFFERENTACTION1: ()=>number, PAYLOADDIFFERENTACTION2: ()=>string }> <any>ReduxActions.createActions<any>(
    {
        PAYLOADDIFFERENTACTION1: () => { return 1 },
        PAYLOADDIFFERENTACTION2: () => { return "1" },

    }
);
//why type when it is simpler to just do the following ! can do nested in this manner
const someActions = {
    someAction1: ReduxActions.createAction("SomeAction1", (arg1: number, arg2: string) => { return 22 }),
    someAction2: ReduxActions.createAction("SomeAction2", (arg1: string, arg2: number) => { return "22" }),
    someActionMeta: ReduxActions.createAction<string,number,string,number>("SomeActionMeta", (arg1, arg2) => { return "22" }, (arg1, arg2) => { return 22 })
}
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
const actionsHandlerGenericParameters = ReduxActions.handleActions<number,number>({
    WITHNUMBERPAYLOAD1: (state, action) => state + action.payload,
    WITHNUMBERPAYLOAD2: (state, action) => state * action.payload,
}, 0);


//#region using action creator in keys 
/*typescript does not accept the action creator as key
{
    [testAction]: (state, action) => state + action.payload,
*/
var testAction = ReduxActions.createAction<number, string, number>("TestAction", (arg1, arg2) => {
    return 99;
})
const actionsHandlerActionCreatorKeys = ReduxActions.handleActions<number, number>({
    [testAction.toString()]: (state, action) => state + action.payload,
    WITHNUMBERPAYLOAD2: (state, action) => state * action.payload
}, 0);
//#endregion

//<State,Payload,Meta>
const actionsHandlerMeta = ReduxActions.handleActions<number, string, { someMetaValue: string }>(
    {
        SOMEMETAREDUCER1: (state, action) => {
            var meta = action.meta.someMetaValue;
            return parseInt(action.meta.someMetaValue) + state + parseInt(action.payload);
    },
        SOMEMETAREDUCER2: (state, action) => {
            return state + action.payload + action.meta.someMetaValue === "Do it"?999:0;
        }
    },99
)
//#endregion
//#region STATEANDPAYLOAD TYPING
/*
export function handleActions<StateAndPayload>(
    reducerMap: ReducerMap<StateAndPayload, StateAndPayload>,
    initialState: StateAndPayload
): Reducer<StateAndPayload, StateAndPayload>;
*/
const reducerStateAndPayloadsTypescriptOverload = ReduxActions.handleActions({
    SAMEPAYLOADASSTATE1: (state, action) => state + action.payload,
    SAMEPAYLOADASSTATE2: (state, action) => state * action.payload
}, 0);
//#endregion

//#region different payloads
const reducerDifferentPayloadTypes = ReduxActions.handleActions<number, any>({
    PAYLOADSTRING: (state, action: ReduxActions.Action<string>) => state + parseInt(action.payload),
    PAYLOADNUMBER: (state, action: ReduxActions.Action<number>) => state + action.payload,
}, 0);

//#region helpers

//#region types
type ReducerTypes<State, Payload> = ReduxActions.Reducer<State, Payload> | ReduxActions.ReducerNextThrow<State, Payload> 
type ReducerMetaTypes<State, Payload, Meta> = ReduxActions.ReducerMeta<State, Payload, Meta> | ReduxActions.ReducerNextThrowMeta<State, Payload, Meta>;

interface ActionCreatorHandler<State,Payload > {
    actionCreator: ReduxActions.ActionFunctions < Payload >,
    reducer: ReducerTypes<State,Payload>  
}
interface ActionCreatorMetaHandler<State, Payload,Meta> {
    actionCreator: ReduxActions.ActionFunctionsMeta<Payload,Meta>,
    reducer: ReducerMetaTypes<State, Payload,Meta>
}
//#endregion
//#region handleActionsFromCreators
function handleActionsFromCreators<State, Payload1, Payload2, Payload3, Payload4, Payload5, Payload6, Payload7, Payload8>(initialState: State, ach1: ActionCreatorHandler<State, Payload1>, ach2: ActionCreatorHandler<State, Payload2>, ach3?: ActionCreatorHandler<State, Payload3>, ach4?: ActionCreatorHandler<State, Payload4>, ach5?: ActionCreatorHandler<State, Payload5>, ach6?: ActionCreatorHandler<State, Payload6>, ach7?: ActionCreatorHandler<State, Payload7>, ach8?: ActionCreatorHandler<State, Payload8>) {
    var reducerMap= {};
    for (var i = 1; i < arguments.length; i++) {
        var actionCreatorHandler = arguments[i] as ActionCreatorHandler<State, any>;
        reducerMap[actionCreatorHandler.actionCreator.toString()] = actionCreatorHandler.reducer;
    }
    return ReduxActions.handleActions(reducerMap, initialState) as ReduxActions.Reducer<State,any>;
}
//<payload, meta? arg1,arg2,....>
var someActionCreator = ReduxActions.createAction<RegExp, string>("SomeAction", (arg1) => {
    
    return new RegExp(arg1);
})
var someActionCreator2 = ReduxActions.createAction<Date, string, number>("SomeAction2", (arg1, arg2) => {
    if (arg1 === "throw") {
        return new Error("Some error");
    }
    return new Date();
})

var reducer1StateArg;
var reducer1ActionArg;
var reducer2StateArg;
var reducer2ActionArg;
var reducer2ErrorStateArg;
var reducer2ErrorActionArg;
var reducerFromTypingHelper1 = handleActionsFromCreators(
    { someValue: "Initial Value" },
    {
        actionCreator: someActionCreator,
        reducer: (state, action) => {
            reducer1StateArg = state;
            reducer1ActionArg = action;
            return { someValue: action.payload.source }
        }
    },
    {
        actionCreator: someActionCreator2,
        reducer: {
            next: (state, action) => {
                reducer2StateArg = state;
                reducer2ActionArg = action;
                return {
                    someValue: action.payload.toTimeString()
                }
            },
            throw: (state, action) => {
                reducer2ErrorStateArg = state;
                reducer2ErrorActionArg = action;
                return { someValue: "Errored" }
            }
        }
    }

)
var action1 = someActionCreator("Some value");
var action2 = someActionCreator2("Some value", 99);
var action2Error = someActionCreator2("throw", 99);
var reducerState = { someValue: "MyValue" };
reducerFromTypingHelper1(reducerState, action1);
if (!(reducer1StateArg === reducerState && reducer1ActionArg === action1)){
    throw new Error("Unexpected");
}
reducerFromTypingHelper1(reducerState, action2);
if (!(reducer2StateArg === reducerState && reducer2ActionArg === action2)){
    throw new Error("Unexpected");
}
reducerFromTypingHelper1(reducerState, action2Error);
if (!(reducer2ErrorStateArg === reducerState && reducer2ErrorActionArg === action2Error)) {
    throw new Error("Unexpected");
}


//#endregion
//#region handleActionsFromMetaCreators
function handleActionsFromMetaCreators<State, Payload1, Meta1, Payload2, Meta2>(initialState: State, ach1: ActionCreatorMetaHandler<State, Payload1, Meta1>, ach2: ActionCreatorMetaHandler<State, Payload2, Meta2>) {
    var reducerMap = {};
    for (var i = 1; i < arguments.length; i++) {
        var actionCreatorHandler = arguments[i] as ActionCreatorMetaHandler<State, any, any>;
        reducerMap[actionCreatorHandler.actionCreator.toString()] = actionCreatorHandler.reducer;
    }
    return ReduxActions.handleActions(reducerMap, initialState) as ReduxActions.Reducer<State, any>;
}
var actionCreatorMetaGenerics2 = ReduxActions.createAction<string, number, string>("SomeActionType", (stringArg) => {
    return stringArg;
}, (stringArg) => {
    return 1
});
var reducerFromTypingHelper2 = handleActionsFromCreators({
    someValue: "InitialValue"
}, {
        actionCreator: actionCreatorMetaGenerics,
        reducer: (state, action) => {
            return state;
        }
    },
    {
        actionCreator: actionCreatorMetaGenerics2,
        reducer: (state, action) => {
            return state;
        }
});
//#endregion
//#region createReducerMap
//we only need these when have meta and non meta
//pass the map from the first in to the second and call the reducerMapHandleActions to get correctly typed reducer - state being correctly typed
//have to pass in a state arg to get the typing
interface Map<State> {}
function createReducerMap<State, Payload1, Payload2>(state: State, ach1: ActionCreatorHandler<State, Payload1>, ach2?: ActionCreatorHandler<State, Payload2>): Map<State> {
    var reducerMap = {};
    for (var i = 1; i < arguments.length; i++) {
        var actionCreatorHandler = arguments[i] as ActionCreatorHandler<State, any>;
        reducerMap[actionCreatorHandler.actionCreator.toString()] = actionCreatorHandler.reducer;
    }
    return reducerMap;
}

function createReducerMapMeta<State, Payload1, Meta1, Payload2, Meta2>(state: State, reducerMap: Map<State>, ach: ActionCreatorMetaHandler<State, Payload1, Meta1>, ach2?: ActionCreatorMetaHandler<State, Payload2, Meta2>): Map<State>{
    for (var i = 2; i < arguments.length; i++) {
        var actionCreatorHandler = arguments[i] as ActionCreatorMetaHandler<State, any, any>;
        reducerMap[actionCreatorHandler.actionCreator.toString()] = actionCreatorHandler.reducer;
    }
    return reducerMap;
}
//#region example 
var initialState = { someValue: "Initial" };
var reducerMap = createReducerMap(initialState,
    {
        actionCreator: someActionCreator,
        reducer: (state, action) => { return { someValue: action.payload.source } }
    },
    {
        actionCreator: someActionCreator2,
        reducer: {
            next: (state, action) => { return { someValue: action.payload.toTimeString() } },
            throw: (state, action) => {
                return { someValue: "Errored" }
            }
        }
    });
var reducerMapMeta = createReducerMapMeta(initialState, reducerMap,
    {
        actionCreator: actionCreatorMetaGenerics,
        reducer: (state, action) => {
            return state;
        }
    },
    {
        actionCreator: actionCreatorMetaGenerics2,
        reducer: (state, action) => {
            return state;
        }
    }
);
function reducerMapHandleActions<State>(map: Map<State>, initialState: State) {
    return ReduxActions.handleActions(map as any, initialState) as ReduxActions.Reducer<State, any>;
}
//what should the typing be for the reducer map - aside from the store calling the reducer
//only time will be called is for a test so should have the state typed and if was used as the root reducer could accept any action
var reducerFromTypingHelper3 = reducerMapHandleActions(reducerMapMeta, initialState);
//#endregion
//#endregion
//#endregion

//#endregion


//#endregion


