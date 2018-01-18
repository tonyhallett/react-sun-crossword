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

//#region TONY CHANGE
ReduxActions.handleActions({
    [ReduxActions.combineActions(act1, act3, act2).toString()](state, action) {
        return state + 1;
    }
}, 0);
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
//#region combinedActions remember not to be directly called ! 

//<Payload,Meta,Arg1>
var combinedMeta1 = ReduxActions.createAction<number, string, number>("CombinedMeta1", (arg) => {
    return arg;
}, (arg) => {
    return "Meta";
});
var combinedMeta2 = ReduxActions.createAction<number, string, string>("CombinedMeta2", (arg) => {
    return 1;
}, (arg) => {
    return "Meta2";
});
var combinedMetaDifferent = ReduxActions.createAction<number, number, number>("CombinedMeta3", (arg) => {
    return arg;
}, (arg) => {
    return 9;
});
var combinedPayloadDifferent = ReduxActions.createAction<string, string, number>("CombinedMeta4", (arg) => {
    return arg.toString();
}, (arg) => {
    return "9";
});
var combinedBothDifferent = ReduxActions.createAction<string, number, number>("CombinedMeta4", (arg) => {
    return arg.toString();
}, (arg) => {
    return 9;
});

var combined1 = ReduxActions.createAction<number, string>("Combined1", (arg) => { return 1 });
var combined2 = ReduxActions.createAction<number, string>("Combined2", (arg) => { return 2 });
var combinedDifferentPayload = ReduxActions.createAction<string, number>("Combined3", (arg) => { return "2" });




//*********** this is the only one that could be considered dodgy 
var combinedStringsNoGenericParameter = ReduxActions.combineActions("Action1", "Action2");//CombinedMeta<{},{}>

var combinedStringsGenericParameter = ReduxActions.combineActions<number>("Action1", "Action2");//Combined<number>
var combinedStringsGenericParameters = ReduxActions.combineActions<number, string>("Action1", "Action2");//CombinedMeta<number,string>

var inference = ReduxActions.combineActions(combined1, combined2);//Combined<number>
var inferenceMixedTypes = ReduxActions.combineActions(combined1, "FROMSTRING");//Combined<number>
var inferenceDifferentTypes = ReduxActions.combineActions(combined1, combinedDifferentPayload);//Combined<any>

var inferenceMeta = ReduxActions.combineActions(combinedMeta1, combinedMeta2);
var inferenceMetaMixedTypes = ReduxActions.combineActions(combinedMeta1, combinedMeta2, "SomeActionType");

//** for when either meta or payload is different then explicitly type ( of course you would not combine if needed to then check the action type in the reducer !)
//if meta different get Combined<T> - if payload the same then is typed otherwise is any
var differentMeta = ReduxActions.combineActions(combinedMeta1, combinedMetaDifferent);
var differentMetaGenericParameter = ReduxActions.combineActions<number, string | number>(combinedMeta1, combinedMetaDifferent);

//if payload different - Combined<any>
var differentPayload = ReduxActions.combineActions(combinedMeta1, combinedPayloadDifferent);

//both different - Combined<any>
var differentBoth = ReduxActions.combineActions(combinedMeta1, combinedBothDifferent);

//Combined<T> when they have the same payload
var nonMetaWithMetaCombined = ReduxActions.combineActions(combined1, combinedMeta1);


var handleActionFromInferredNonMeta = ReduxActions.handleAction(inference, (state, action) => {
    return { someValue: action.payload.toExponential() }
}, { someValue: "Initial Value" });

//although vs does not complain - webpack will prevent the combinedMeta from having different payload/meta types to those specified
var handleActionFromInferredMeta = ReduxActions.handleAction<TheState, number, string>(inferenceMeta, (state, action) => {
    return { someValue: action.meta }
}, { someValue: "Initial Value" });



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
var errorSkipsPayloadCreatorAction=ReduxActions.createAction<number, EvalError, string>("ErrorArgSkipsCreator", (arg) => {
    return 5;
});
var e = errorSkipsPayloadCreatorAction(new EvalError(""));

var errorSkipsPayloadCreatorActionThatCanReturnError = ReduxActions.createAction<number|DOMError, EvalError, string>("ErrorArgSkipsCreator", (arg) => {
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
var payloadCreatorCallCount: any = 0;
var metaCreatorCallCount: any = 0;
var metaActionCreatorWithErrorArg = ReduxActions.createAction<number, EvalError, string, string>("T",
    (arg) => {
        //we know this is a string
        payloadCreatorCallCount++;
        return 9;
    },
    (arg) => {
        metaCreatorCallCount++;
        //this can be either
        if (arg instanceof EvalError) {
            return arg.message;
        } else {
            return arg;
        }
    }
)
var evalMessage = "EvalMessage";
var errorArg = new EvalError(evalMessage);
var errorAction=metaActionCreatorWithErrorArg(errorArg);
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
var actionCreatorFunction = ReduxActions.createAction("ByFunction", (someArg:number) => {
    return "Payload: " + someArg.toString();
})



//specifying action creator arguments generically - ( Have to remember what the type parameters refer to - Payload,Meta?,Arg1?,... )
var actionCreatorFunctionGenerics = ReduxActions.createAction<string, number, string>("ByFunctionGenerically", (numberArg, stringArg) => {
    return numberArg.toString() + stringArg;
});
//note that limited to 4 arguments by the typing.  Not sure if this is the case with the js ( metadata actions can take any )
//below does not compile normally but does with the additional typing that have provided
var actionCreatorAnyFunction = ReduxActions.createAction("AnyFunction", (someArg1: number, someArg2: number, someArg3: number, someArg4: number, someArg5: number) => {
    return "Payload: " + someArg1.toString();
})
//#endregion
//#region meta
//#region new ! - actionCreator is correctly typed - not any
var metaActionCreatorNoArgs=ReduxActions.createAction("MetaNoArgs",
    () => { return 1 },
    () => {
        return "SomeMeta";
    }
)
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
    actionType: ReduxActions.handleActionActionType<Payload>,
    initialState: State,
    reducer: ReduxActions.handleActionReducer<State,Payload>,
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
//the function below ensures typing is available 
function handleActionMeta<State, Payload, Meta>(
    initialState: State,
    actionType: ReduxActions.handleActionMetaActionType<Payload, Meta>,
    reducer: ReduxActions.handleActionMetaReducer<State,Payload,Meta>,
    
) {
    return ReduxActions.handleAction(actionType, reducer, initialState);
}



var usingMyTypedHandleActionsReducer = handleActionMeta({ someValue: "InitialState" }, actionCreatorMetaGenerics, (state, action) => {
    return { someValue: action.meta }
});

//****************** HAVE TO PROVIDE GENERIC PARAMETERS 
ReduxActions.handleAction<TheState, number, string>(actionCreatorMetaGenerics, (state, action) => {
    return { someValue: action.meta + action.payload.toExponential() }
}, { someValue: "InitialState" });




//#endregion

//#endregion
//#endregion

//#region createActions - THEY DO NOT HAVE A SINGLE EXAMPLE
//#region typing advice
//DO NOT USE !
//#endregion
//#region identity

var actionsWithIdentity = <{ identity1: (arg1: string, ignored: string) => ReduxActions.Action<string> }><any>ReduxActions.createActions({
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
    ACTION1: (arg1: number) => { return 1 },
    ACTION2: (arg1: string) => { return 2 }
}
var createActionsArgument2 = {
    ACTION3: (arg1: number) => { return 1 },
    ACTION4: (arg1: string) => { return 2 }
}

var actionsObjPayloadNotTyped=ReduxActions.createActions(createActionsArgument2);
//can cast if want the payload typed for all
const { ACTION1, ACTION2 } = <ReduxActions.MappedActions<typeof createActionsArgument, number>>ReduxActions.createActions(createActionsArgument);

//or - Note the requirement for typeof when providing the generic parameter
const { ACTION3, ACTION4 } = ReduxActions.createActions<number, typeof createActionsArgument2>(createActionsArgument2);

//with the previous typing the array did not need to be typed - DOWNSIDE
var createActionsMetaArgument = {
    CREATEACTIONSMETA: [() => { return 1 }, () => { return "1" }] as ReduxActions.ActionMapPayloadAndMetaCreator,
    CREATEACTIONSMETA2: [() => { return 1 }, () => { return "1" }] as ReduxActions.ActionMapPayloadAndMetaCreator
}



const { CREATEACTIONSMETA, CREATEACTIONSMETA2 } = ReduxActions.createActions < number, string,typeof createActionsMetaArgument>(createActionsMetaArgument);









//explicit typing the action creators
const actions = <{
    PAYLOADDIFFERENTACTION1: () => ReduxActions.ActionMeta<number, string>,
    PAYLOADDIFFERENTACTION2: (arg: string) => ReduxActions.Action<string>
}>ReduxActions.createActions(
    {
        PAYLOADDIFFERENTACTION1: [() => { return 1 },()=>"1"],
        PAYLOADDIFFERENTACTION2: (arg:string) => { return arg},

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

//#region generic parameters 

//#region actions same payload (meta) type
//<State,Payload>
const actionsHandlerGenericParameters = ReduxActions.handleActions<number,number>({
    WITHNUMBERPAYLOAD1: (state, action) => state + action.payload,
    WITHNUMBERPAYLOAD2: (state, action) => state * action.payload,
}, 0);


//#region using action creator in keys 
/*typescript does not accept the action creator as key
{
    [testAction]: (state, action) => state + action.payload,
*/
var WITHNUMBERPAYLOAD1 = ReduxActions.createAction<number, string, number>("TestAction", (arg1, arg2) => {
    return 99;
})
const actionsHandlerActionCreatorKeys = ReduxActions.handleActions<number, number>({
    [WITHNUMBERPAYLOAD1.toString()]: (state, action) => state + action.payload,
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
//#region nested - also is for different payload / meta on each creator

interface TheState {
    someValue:string
}

interface CreateActionsReturnType {
    topLevel: ReduxActions.ActionFunction1<number, ReduxActions.ActionMeta<Date,RegExp>>,
    nested: {
        nested1: ReduxActions.ActionFunction1<number, ReduxActions.ActionMeta<number,string>>,
        nested2: ReduxActions.ActionFunction2<string,number, ReduxActions.ActionMeta<string,number>>
    }
}


//#region vars for testing
var topLevelPayload = new Date();
var topLevelMeta = new RegExp("blah");
var nested1Payload = 7;
var nested1Meta = "9";
var nested2Payload = "7";
var nested2Meta = 9;

var reducerCallCount: any = 0;
var topLevelActionArg: ReduxActions.ActionMeta<Date, RegExp>;
var nested1ActionArg: ReduxActions.ActionMeta<number, string>
var nested2ActionArg: ReduxActions.ActionMeta<string, number>
//#endregion

var nestedActions = <CreateActionsReturnType>ReduxActions.createActions({
    topLevel: [(arg1: number) => topLevelPayload, (arg1: number) => topLevelMeta],
    nested: {
        nested1: [(arg1: number) => nested1Payload, (arg1: number) => nested1Meta] as ReduxActions.ActionMapPayloadAndMetaCreator,
        nested2: [(arg1: string,arg2:number) => nested2Payload, (arg1: string,arg2:number) => nested2Meta] as ReduxActions.ActionMapPayloadAndMetaCreator,
    }
});




//single reducer that will call the others 
var nestedMetaReducer = ReduxActions.handleActions<TheState, any, any>({
    [nestedActions.topLevel.toString()]: (state, action: ReduxActions.ActionMeta<Date, RegExp>) => {
        reducerCallCount++;
        topLevelActionArg = action;
        return {
            someValue: "InitialValue"
        }
    },
    nested: {
        nested1: (state, action: ReduxActions.ActionMeta<number, string>) => {
            reducerCallCount++;
            nested1ActionArg = action;
            return {
                someValue: "InitialValue"
            }
        },
        nested2: (state, action: ReduxActions.ActionMeta<string, number>) => {
            reducerCallCount++;
            nested2ActionArg = action;
            return {
                someValue: "InitialValue"
            }
        }
    }

}, { someValue: "InitialValue" });




/* alternatively
//is there any point in nesting when can dot in to the return of createActions ( have to create the return type to be typesafe )
//and use toString() for safe key names
*/
var nestedMetaReducer2 = ReduxActions.handleActions<TheState, any, any>({
    [nestedActions.topLevel.toString()]: (state, action: ReduxActions.ActionMeta<Date, RegExp>) => {
        reducerCallCount++;
        topLevelActionArg = action;
        return {
            someValue: "InitialValue"
        }
    },
    [nestedActions.nested.nested1.toString()]: (state, action: ReduxActions.ActionMeta<number, string>) => {
        reducerCallCount++;
        nested1ActionArg = action;
        return {
            someValue: "InitialValue"
        }
    },
    [nestedActions.nested.nested1.toString()]: (state, action: ReduxActions.ActionMeta<string, number>) => {
        reducerCallCount++;
        nested2ActionArg = action;
        return {
            someValue: "InitialValue"
        }
    }
}, { someValue: "InitialValue" });
/*
Better still create own nested object without createActions and use handleActions with a flat object
copying actions above - ( but not nesting the action type names  ( could if wanted to ) ) - note no need for the cast
var nestedActions = <CreateActionsReturnType>ReduxActions.createActions({
    topLevel: [(arg1: number) => topLevelPayload, (arg1: number) => topLevelMeta],
    nested: {
        nested1: [(arg1: number) => nested1Payload, (arg1: number) => nested1Meta] as ReduxActions.ActionMapPayloadAndMetaCreator,
        nested2: [(arg1: string) => nested2Payload, (arg1: number) => nested2Meta] as ReduxActions.ActionMapPayloadAndMetaCreator,
    }
});
*/

var nestedActionsWithoutCreateActions = {
    topLevel: ReduxActions.createAction<Date,RegExp,number>("topLevel", (arg1) => topLevelPayload, (arg1) => topLevelMeta),
    nested: {
        nested1: ReduxActions.createAction<number,string,number>("nested1", (arg1) => nested1Payload, (arg1) => nested1Meta),
        nested2: ReduxActions.createAction<string,number,string,number>("nested2", (arg1,arg2) => nested2Payload, (arg1) => nested2Meta)
    }
}
var nestedMetaReducer3 = ReduxActions.handleActions<TheState, any, any>({
    [nestedActionsWithoutCreateActions.topLevel.toString()]: (state, action: ReduxActions.ActionMeta<Date, RegExp>) => {
        reducerCallCount++;
        topLevelActionArg = action;
        return {
            someValue: "InitialValue"
        }
    },
    [nestedActionsWithoutCreateActions.nested.nested1.toString()]: (state, action: ReduxActions.ActionMeta<number, string>) => {
        reducerCallCount++;
        nested1ActionArg = action;
        return {
            someValue: "InitialValue"
        }
    },
    [nestedActionsWithoutCreateActions.nested.nested2.toString()]: (state, action: ReduxActions.ActionMeta<string, number>) => {
        reducerCallCount++;
        nested2ActionArg = action;
        return {
            someValue: "InitialValue"
        }
    }
}, { someValue: "InitialValue" });

function testReducer(nestedMetaReducer: ReduxActions.ReducerMeta<TheState, any, any>, nestedActions: CreateActionsReturnType) {
    //reset the parts that are testing
    reducerCallCount= 0;
    topLevelActionArg = null;
    nested1ActionArg = null;
    nested2ActionArg = null;

    //#region actions from creators - for reducer
    //args not used - just demonstrating that the appropriate reducer gets called as expected
    var topLevelAction = nestedActions.topLevel(1);
    var nested1Action = nestedActions.nested.nested1(9);
    var nested2Action = nestedActions.nested.nested2("Value", 9);
    //#endregion
    //#region calls and expectations
    nestedMetaReducer({ someValue: "SomeValue" }, topLevelAction)
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
    //#endregion
}
testReducer(nestedMetaReducer, nestedActions);
testReducer(nestedMetaReducer2, nestedActions);
testReducer(nestedMetaReducer3, nestedActionsWithoutCreateActions);
/*
Better still use the helper functions below !!!!
*/

//#region to be thorough - though no need
/*note that if wanted to (and there is no need to [ you could just pass a flat object with keys being toString from the nested actions object created yourself ] ) use nested handleActions with structure matching a nested object created yourself
I think it would be necessary to 'level' your ActionTypes
var actionsNested = {
    LevelOne1: {
        action1: ReduxActions.createAction<number, string>("LevelOne1/action1", (arg) => { return 9 }),
        action2: ReduxActions.createAction<string, number>("LevelOne1/action2", (arg) => { return arg.toString() })
    },
    LevelOne2: {
        action1: ReduxActions.createAction<number, string>("LevelOne2/action1", (arg) => { return 9 }),
        action2: ReduxActions.createAction<string, number>("LevelOne2/action2", (arg) => { return arg.toString() })
    }
}
*/
//#endregion
//#endregion
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


//#region helpers

//#region types
type ReducerTypes<State, Payload> = ReduxActions.Reducer<State, Payload> | ReduxActions.ReducerNextThrow<State, Payload> 
type ReducerMetaTypes<State, Payload, Meta> = ReduxActions.ReducerMeta<State, Payload, Meta> | ReduxActions.ReducerNextThrowMeta<State, Payload, Meta>;


interface ActionCreatorHandler<State,Payload > {
    actionCreator: ReduxActions.Combined<Payload> | ReduxActions.ActionFunctions<Payload>,
    reducer: ReducerTypes<State,Payload>  
}
interface ActionCreatorMetaHandler<State, Payload,Meta> {
    actionCreator: ReduxActions.ActionFunctionsMeta<Payload,Meta>|ReduxActions.CombinedMeta<Payload,Meta>
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
class CustomError extends Error {
    constructor(message?: string) {
        super(message); // 'Error' breaks prototype chain here
        //Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.additionalProp = new Date();
    }
    additionalProp: Date;
}
var someActionCreator = ReduxActions.createAction<RegExp|CustomError, string>("SomeAction", (arg1) => {
    if (arg1==="throw") {
        return new CustomError()
    }
    return new RegExp(arg1);
})

var someActionCreator2 = ReduxActions.createAction<Date | CustomError, string, number>("SomeAction2", (arg1, arg2) => {
    if (arg1 === "throw") {
        return new CustomError("msg");
    }
    return new Date();
})


var reducer1StateArg;
var reducer1ActionArg;
var reducer2StateArg;
var reducer2ActionArg;
var reducer2ErrorStateArg;
var reducer2ErrorActionArg;

var toCombine1 = ReduxActions.createAction<Date, string>("ToCombine1", (arg) => {
    return  new Date();
})
var toCombine2 = ReduxActions.createAction<Date, number, string>("ToCombine2", (arg1, arg2) => {
    return new Date();
})
var combinedActionCreator = ReduxActions.combineActions(toCombine1, toCombine2);

function payloadIsError(payload: any| Error):payload is Error {
    return payload instanceof Error;
}

var reducerFromTypingHelper1 = handleActionsFromCreators(
    { someValue: "Initial Value" },
    {
        actionCreator: combinedActionCreator,
        reducer: (state, action)=>{
            return {
                someValue:action.payload.getMonth().toString()
            }
        }
    },
    {
        actionCreator: someActionCreator,
        reducer: (state, action) => {
            reducer1StateArg = state;
            reducer1ActionArg = action;
            if (payloadIsError(action.payload)) {
                return {
                    someValue: action.payload.additionalProp.toLocaleTimeString()
                }
            } else {
                return {
                    someValue: action.payload.source
                }
            }
           
        }
    },
    {
        actionCreator: someActionCreator2,
        reducer: {
            //for the moment we have to cast
            next: (state, action) => {
                reducer2StateArg = state;
                reducer2ActionArg = action;
                
                return {
                    someValue: (<Date>action.payload).toLocaleTimeString()
                }
            },
            throw: (state, action) => {
                reducer2ErrorStateArg = state;
                reducer2ErrorActionArg = action;
                //casting above fixes action.payload - so have to go to any !
                var v = (<CustomError><any>action.payload).additionalProp;
                return { someValue: "s"}
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
function handleActionsFromMetaCreators<State, Payload1, Meta1, Payload2, Meta2, Payload3, Meta3>(initialState: State, ach1: ActionCreatorMetaHandler<State, Payload1, Meta1>, ach2: ActionCreatorMetaHandler<State, Payload2, Meta2>, ach3?: ActionCreatorMetaHandler<State, Payload3, Meta3>) {
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
var metaCombine1 = ReduxActions.createAction<number, string, string>("Meta1", (arg) => 1, (arg) => arg);
var metaCombine2 = ReduxActions.createAction<number, string, string>("Meta1", (arg) => 1, (arg) => arg);
var reducerFromTypingHelper2 = handleActionsFromMetaCreators({
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
    },
    {
        actionCreator: ReduxActions.combineActions(metaCombine1, metaCombine2),
        reducer: (state, action) => {
            return {
                someValue: action.payload.toExponential() + action.meta
            }
        }

    }
);
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
//what should the typing be for the reducer map - aside from the store calling the reducer
//only time will be called is for a test so should have the state typed and if was used as the root reducer could accept any action
function reducerMapHandleActions<State>(map: Map<State>, initialState: State) {
    return ReduxActions.handleActions<State,any>(map as any, initialState);
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

var reducerMap = createReducerMap(initialState,
    {
        actionCreator: someActionCreator,
        reducer: (state, action) => {
            crMapReducer1Action = action;
            crMapReducer1State = state;
            return { someValue: "blah" }
        }
    },
    {
        actionCreator: someActionCreator2,
        reducer: {
            next: (state, action) => {
                crMapReducer2Action = action;
                crMapReducer2State = state;
                return { someValue: "Blah"}
            },
            throw: (state, action) => {
                return { someValue: "Errored" }
            }
        }
    });
var reducerMapMeta = createReducerMapMeta(initialState, reducerMap,
    {
        actionCreator: actionCreatorMetaGenerics,
        reducer: (state, action) => {
            crMapReducer1MetaAction = action;
            crMapReducer1MetaState = state;
            return state;
        }
    },
    {
        actionCreator: actionCreatorMetaGenerics2,
        reducer: (state, action) => {
            crMapReducer2MetaAction = action;
            crMapReducer2MetaState = state;
            return state;
        }
    }
);


var reducerFromTypingHelper3 = reducerMapHandleActions(reducerMapMeta, initialState);

reducerFromTypingHelper3(reducerState, action1);
if (!(crMapReducer1State === reducerState && crMapReducer1Action === action1)) {
    throw new Error("Unexpected");
}
reducerFromTypingHelper3(reducerState, action2);
if (!(crMapReducer2State === reducerState && crMapReducer2Action === action2)) {
    throw new Error("Unexpected");
}
var actionGenerics1 = actionCreatorMetaGenerics(9)
var actionGenerics2 = actionCreatorMetaGenerics2("1")
reducerFromTypingHelper3(reducerState, actionGenerics1);
if (!(crMapReducer1MetaState === reducerState && crMapReducer1MetaAction === actionGenerics1)) {
    throw new Error("Unexpected");
}
reducerFromTypingHelper3(reducerState, actionGenerics2);
if (!(crMapReducer2MetaState === reducerState && crMapReducer2MetaAction === actionGenerics2)) {
    throw new Error("Unexpected");
}

//#endregion
//#endregion
//#endregion

//#endregion


//#endregion


