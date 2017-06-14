///<reference types="jest"/>

class MockConnectedDatabase implements IConnectedDatabase {
    publicLookupCrosswordCallback: (lookup: CrosswordLookupJson[]) => void;
    userLookupCrosswordCallback: (lookup: CrosswordLookupJson[]) => void;
    listenForPublicCrosswordLookups = jest.fn(((cb: (lookup: CrosswordLookupJson[]) => void) => {
        this.publicLookupCrosswordCallback=cb
    }));
    listenForUserCrosswordLookups = jest.fn(((userId:string,cb: (lookup: CrosswordLookupJson[]) => void) => {
        this.userLookupCrosswordCallback = cb
    }));

    connectionCallback: (isConnected: boolean) => void
    connectionChanged(callback: (isConnected: boolean) => void) {
        this.connectionCallback = callback;
    }
    changeConnection(isConnected: boolean) {
        this.connectionCallback(isConnected);
    }
}

var mockConnectedDatabase: MockConnectedDatabase;
jest.mock('../src/helpers/connectedDatabase', () => {
    mockConnectedDatabase = new MockConnectedDatabase()
    return {
        connectedDatabase: mockConnectedDatabase
    }
});

import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { pit, pits, xpit } from '../node_modules/jestextensions/index'
import * as enzyme from 'enzyme';
import { IConnectedDatabase } from '../src/helpers/connectedDatabase'
import { CrosswordPuzzleChooser, DatabaseDisconnectedMessageProps, SelectChooserProps, CrosswordPuzzleChooserProps } from '../src/components/crosswordPuzzleChooser'
import { CrosswordLookupJson } from "../src/models/index";

function expectSelectChoosersDisabled(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>, isDisabled: boolean) {
    var selectChoosers = findSelectChoosers(crosswordPuzzleChooserWrapper);
    expect(selectChoosers.length).toBe(2);
    expect(selectChoosers[0].props().disabled).toBe(isDisabled);
    expect(selectChoosers[1].props().disabled).toBe(isDisabled);

}
function expectLookupIsLoading(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>, isPublic: boolean, isLoading: boolean) {
    expect(findSelectChoosersOrdered(crosswordPuzzleChooserWrapper, isPublic)[0].props().isLoadingLookups).toBe(isLoading);
}
function expectListenForUserCrosswordLookups(userId: string) {
    expect(mockConnectedDatabase.listenForUserCrosswordLookups).toHaveBeenCalledTimes(1);
    expect(mockConnectedDatabase.listenForUserCrosswordLookups.mock.calls[0][0]).toBe(userId);
    expect(mockConnectedDatabase.listenForUserCrosswordLookups.mock.calls[0][1]).toBeInstanceOf(Function);

}
function expectListenForUserCrosswordLookupsAndSetUserLoadingLookups(userId: string, crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>) {
    expectListenForUserCrosswordLookups(userId);
    expect(findUserSelectChooser(crosswordPuzzleChooserWrapper).props().isLoadingLookups).toBe(true);
}
function expectDisconnectedMessage(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>, expectedDatabaseDisconnectedMessagePropValue: string) {
    var wrappedElements = crosswordPuzzleChooserWrapper.findWhere((childWrapper) => {
        return childWrapper.props().disconnectedMessage !== undefined;
    });


    expect(wrappedElements.at(1).props().disconnectedMessage).toBe(expectedDatabaseDisconnectedMessagePropValue);
}

function reactWrapperFindPS<P, S>(wrapper: enzyme.ReactWrapper<any, any>, find: string): enzyme.ReactWrapper<P,S>[] {
    return wrapper.find(find).map(foundWrapper => foundWrapper as enzyme.ReactWrapper<P,S>)
}

function findSelectChoosers(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>): enzyme.ReactWrapper<SelectChooserProps, any>[] {
    return reactWrapperFindPS<SelectChooserProps, any>(crosswordPuzzleChooserWrapper, "SelectChooser");
}
function findSelectChoosersOrdered(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>,isPublicFirst:boolean): enzyme.ReactWrapper<SelectChooserProps, any>[] {
    var selectChoosers = findSelectChoosers(crosswordPuzzleChooserWrapper);
    var publicSelectChooser: enzyme.ReactWrapper<SelectChooserProps, any>;
    var userSelectChooser: enzyme.ReactWrapper<SelectChooserProps, any>;
    if (selectChoosers[0].props().isPublic) {
        publicSelectChooser = selectChoosers[0];
        userSelectChooser = selectChoosers[1];
    } else {
        publicSelectChooser = selectChoosers[1];
        userSelectChooser = selectChoosers[0];
    }
    var orderedChoosers: enzyme.ReactWrapper<SelectChooserProps, any>[]=[]
    if (isPublicFirst) {
        orderedChoosers.push(publicSelectChooser);
        orderedChoosers.push(userSelectChooser);
    } else {
        orderedChoosers.push(userSelectChooser);
        orderedChoosers.push(publicSelectChooser);
    }
    return orderedChoosers;
}
function findPublicSelectChooser(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>): enzyme.ReactWrapper<SelectChooserProps, any> {
    return findSelectChoosersOrdered(crosswordPuzzleChooserWrapper,true)[0]
}
function findUserSelectChooser(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>): enzyme.ReactWrapper<SelectChooserProps, any> {
    return findSelectChoosersOrdered(crosswordPuzzleChooserWrapper, false)[0]
}

describe('<CrosswordPuzzleChooser/', () => {
    //ideally should start connected then disconnect
    beforeEach(() => {
        mockConnectedDatabase.listenForUserCrosswordLookups.mockClear();
        mockConnectedDatabase.listenForPublicCrosswordLookups.mockClear();
    });
    it('should render a public and user SelectChooser with header', () => {
        var publicSelectChooserHeader = "Public crosswords: "
        var userSelectChooserHeader = "User crosswords: "
        var wrapper = enzyme.mount(<CrosswordPuzzleChooser userLoggedIn={null} publicSelectChooserHeader={publicSelectChooserHeader} userSelectChooserHeader={userSelectChooserHeader} />);
        var selectChoosers = reactWrapperFindPS<SelectChooserProps, any>(wrapper, "SelectChooser");
        
        //not bothered with order
        expect(selectChoosers.length).toBe(2);
        var firstProps = selectChoosers[0].props();
        var secondProps = selectChoosers[1].props();
        var publicSelectChooserProps: SelectChooserProps;
        var userSelectChooserProps: SelectChooserProps
        expect(firstProps.isPublic === secondProps.isPublic).toBe(false);
        
        if (firstProps.isPublic) {
            publicSelectChooserProps = firstProps;
            userSelectChooserProps = secondProps;
        } else {
            publicSelectChooserProps = secondProps;
            userSelectChooserProps = firstProps;
        }
        expect(publicSelectChooserProps.header).toBe(publicSelectChooserHeader);
        expect(userSelectChooserProps.header).toBe(userSelectChooserHeader);
    })
    describe('when the database is disconnected', () => {
        it('should show a message', () => {
            var disconnectedMessage = "Disconnected...."
            //shallow https://github.com/airbnb/enzyme/issues/582 https://github.com/airbnb/enzyme/pull/538 to find by object prop
            //note that could not use mount and find by name if the component class comes from props
            //but having changed the displayName from HOC !
            //although have not used that for this ComponentClass

            var wrapper = enzyme.mount(<CrosswordPuzzleChooser userLoggedIn={null} disconnectedMessage={disconnectedMessage} />);
            expectDisconnectedMessage(wrapper, disconnectedMessage);
        })
        it('should disable both SelectChooser', () => {
            var wrapper = enzyme.mount(<CrosswordPuzzleChooser userLoggedIn={null} />);
            //start getting enzyme difficulties when use ComponentClass<P,S> through props
            //as can only find through props
            //could check that the state is expected on the root
            //but then there is no test that child component will be rendered

            //force to use longer property name
            expectSelectChoosersDisabled(wrapper, true);
            
        })
    });
    describe('when mounts', () => {
        it('should handle the connection changed of the connected database', () => {
            var wrapper = enzyme.mount(<CrosswordPuzzleChooser userLoggedIn={null} />);
            expect(mockConnectedDatabase.connectionCallback).toBeInstanceOf(Function);
        })
    })
    describe('when the database connects', () => {
        var wrapper: enzyme.ReactWrapper<CrosswordPuzzleChooserProps,any>
        beforeEach(() => {
            wrapper = enzyme.mount(<CrosswordPuzzleChooser userLoggedIn={null} />);
            mockConnectedDatabase.changeConnection(true);
        })
        it('should be no disconnected message', () => {
            //need to mount as connection handler added in componentDidMount - probably should do in ctor
            expectDisconnectedMessage(wrapper, "");
        })
        it('should enable both SelectChooser ', () => {
            expectSelectChoosersDisabled(wrapper, false);
        })
        describe('listenening for public crosswords', () => {
            it('should listen for public crosswords and set public loading lookups', () => {
                expect(mockConnectedDatabase.listenForPublicCrosswordLookups).toHaveBeenCalled();
                expectLookupIsLoading(wrapper, true, true);
            })
            it('should not listen if already listening up', () => {
                mockConnectedDatabase.listenForPublicCrosswordLookups.mockClear();
                mockConnectedDatabase.changeConnection(false);
                mockConnectedDatabase.changeConnection(true);
                expect(mockConnectedDatabase.listenForPublicCrosswordLookups).not.toHaveBeenCalled();
            });
        })
        
        describe('listening for user crosswords', () => {
            it('should not listen if not logged in', () => {
                expect(mockConnectedDatabase.listenForUserCrosswordLookups).not.toHaveBeenCalled();
            })
            //this removing connection/logging in/adding connection is poor
            describe('when logged in', () => {
                it('should listen for user crosswords and set user loading lookups when not listening', () => {
                    mockConnectedDatabase.changeConnection(false);
                    var userId = "123";
                    wrapper.setProps({ userLoggedIn: userId });
                    mockConnectedDatabase.changeConnection(true);

                    expectListenForUserCrosswordLookupsAndSetUserLoadingLookups(userId,wrapper);
                })
                it('should not listen if already listening', () => {
                    mockConnectedDatabase.changeConnection(false);
                    wrapper.setProps({ userLoggedIn: "123" });
                    mockConnectedDatabase.changeConnection(true);
                    mockConnectedDatabase.listenForUserCrosswordLookups.mockClear();
                    mockConnectedDatabase.changeConnection(false);
                    mockConnectedDatabase.changeConnection(true);
                    expect(mockConnectedDatabase.listenForUserCrosswordLookups).not.toHaveBeenCalled();
                });
            })
            
        })
        

    })
    describe('user login', () => {
        describe('logs in', () => {
            it('and there is connection, should listen for user crosswords and set user loading lookups', () => {
                var wrapper = enzyme.mount(<CrosswordPuzzleChooser userLoggedIn={null} />);
                mockConnectedDatabase.changeConnection(true);
                var userId = "123";
                wrapper.setProps({ userLoggedIn: userId });

                expectListenForUserCrosswordLookupsAndSetUserLoadingLookups(userId, wrapper);
            })
        });
        describe('logs out', () => {
            it('should remove user lookup listener', () => {

            })
            it('should remove user options', () => {

            })
            it('should remove the user selected option', () => {

            })
            it('should disable the user SelectChooser button', () => {
                //need for it to be initially enabled
            })
        });
    })
    describe('when receive public crosswords', () => {
        it('should remove public loading indicator', () => {
            var wrapper = enzyme.mount(<CrosswordPuzzleChooser userLoggedIn={null} />);
            mockConnectedDatabase.changeConnection(true);
            expectLookupIsLoading(wrapper, true, true);
            
            var lookUps: CrosswordLookupJson[] = []
            mockConnectedDatabase.publicLookupCrosswordCallback(lookUps);
            //wrapper.update(); has no effect
            //need to understand if the wrapper from find is a snapshot
            expectLookupIsLoading(wrapper, true, false);
        })
    })
    describe('when receive user crosswords', () => {
        it('should remove user loading indicator', () => {
            var wrapper = enzyme.mount(<CrosswordPuzzleChooser userLoggedIn={"123"} />);
            mockConnectedDatabase.changeConnection(true);
            expectLookupIsLoading(wrapper, false, true);

            var lookUps: CrosswordLookupJson[] = []
            mockConnectedDatabase.userLookupCrosswordCallback(lookUps);

            expectLookupIsLoading(wrapper, false, false);
        })
    })
    xdescribe('when receive public or user crosswords', () => {
        /*
            export interface CrosswordLookupJson {
                id: string
                title: string
                datePublished: string
            }
            */
        describe("the states publicOptions and savedOptions should be updated, a saved option for each saved crossword and a public option for each public crossword that has not been saved", () => {
            //will need initial states to work with 
        })
    });
})