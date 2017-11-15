/////<reference types="jest"/>


//class MockConnectedDatabase implements IConnectedDatabase {
//    saveUserCrossword(uid: string, id: string, crossword: any, crosswordLookup: any): Promise<UserSaveDetails> {
//        throw new Error('Method not implemented.');
//    }

//    publicCrosswordModelJson = {id:"public"}
//    userCrosswordModelJson = {id:"user"}
//    resolveSignal = null;
//    //later will want to test the rejection
//    getPublicCrossword = jest.fn(() => {
//        this.resolveSignal = {};
//        return Promise.resolve(this.publicCrosswordModelJson);
//    });
        
//    getUserCrossword = jest.fn(() => {
//        this.resolveSignal = {};
//        return Promise.resolve(this.userCrosswordModelJson);
//    })

//    publicLookupCrosswordCallback: (lookup: CrosswordLookupJson[]) => void;
//    userLookupCrosswordCallback: (lookup: CrosswordLookupJson[]) => void;
//    listenForPublicCrosswordLookups = jest.fn(((cb: (lookup: CrosswordLookupJson[]) => void) => {
//        this.publicLookupCrosswordCallback=cb
//    }));
//    listenForUserCrosswordLookups = jest.fn(((userId:string,cb: (lookup: CrosswordLookupJson[]) => void) => {
//        this.userLookupCrosswordCallback = cb
//    }));

//    connectionCallback: (isConnected: boolean) => void
//    connectionChanged(callback: (isConnected: boolean) => void) {
//        this.connectionCallback = callback;
//    }
//    changeConnection(isConnected: boolean) {
//        this.connectionCallback(isConnected);
//    }
//}

//var mockConnectedDatabase: MockConnectedDatabase;
//jest.mock('../src/helpers/connectedDatabase', () => {
//    mockConnectedDatabase = new MockConnectedDatabase()
//    return {
//        connectedDatabase: mockConnectedDatabase
//    }
//});

//import * as React from 'react';
//import * as ReactDOM from 'react-dom'
//import { pit, pits, xpit, xbeforeAll } from '../node_modules/jestextensions/index'
//import * as enzyme from 'enzyme';
//import { IConnectedDatabase, UserSaveDetails } from '../src/helpers/connectedDatabase'
//import { CrosswordPuzzleChooser, DatabaseDisconnectedMessageProps, SelectChooserProps, CrosswordPuzzleChooserProps, SelectChooserContainerProps, DefaultSelectChooser, Select, ButtonProps, DefaultSelectChooserProps } from '../src/components/crosswordPuzzleChooser'
//import { CrosswordLookupJson, CrosswordModelJson } from "../src/models/index";
//import { EmailLogOnComp, EmailLogOnCompProps } from "../src/components/emailLogOn";

////these functions could go in a helper module
//function noop() { };
//function getSignalPromise() {
//    return new Promise((resolve, reject) => {
//        var interval = window.setInterval(() => {
//            if (mockConnectedDatabase.resolveSignal !== null) {
//                window.clearInterval(interval);
//                resolve();
                
//            }
//        });
//    })
//}
//function expectSelectChoosersDisabled(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>, isDisabled: boolean) {
//    var selectChoosers = findSelectChoosers(crosswordPuzzleChooserWrapper);
//    expect(selectChoosers.length).toBe(2);
//    expect(selectChoosers[0].props().disabled).toBe(isDisabled);
//    expect(selectChoosers[1].props().disabled).toBe(isDisabled);

//}
//function expectLookupIsLoading(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>, isPublic: boolean, isLoading: boolean) {
//    expect(findSelectChoosersOrdered(crosswordPuzzleChooserWrapper, isPublic)[0].props().isLoadingLookups).toBe(isLoading);
//}
//function expectListenForUserCrosswordLookups(userId: string) {
//    expect(mockConnectedDatabase.listenForUserCrosswordLookups).toHaveBeenCalledTimes(1);
//    expect(mockConnectedDatabase.listenForUserCrosswordLookups.mock.calls[0][0]).toBe(userId);
//    expect(mockConnectedDatabase.listenForUserCrosswordLookups.mock.calls[0][1]).toBeInstanceOf(Function);
//}
//function expectDisconnectedMessage(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>, expectedDatabaseDisconnectedMessagePropValue: string) {
//    var wrappedElements = crosswordPuzzleChooserWrapper.findWhere((childWrapper) => {
//        return childWrapper.props().disconnectedMessage !== undefined;
//    });


//    expect(wrappedElements.at(1).props().disconnectedMessage).toBe(expectedDatabaseDisconnectedMessagePropValue);
//}

//function reactWrapperFindPS<P, S>(wrapper: enzyme.ReactWrapper<any, any>, find: string): enzyme.ReactWrapper<P,S>[] {
//    return wrapper.find(find).map(foundWrapper => foundWrapper as enzyme.ReactWrapper<P,S>)
//}

//function findSelectChoosers(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>): enzyme.ReactWrapper<SelectChooserProps, any>[] {
//    return reactWrapperFindPS<SelectChooserProps, any>(crosswordPuzzleChooserWrapper, "SelectChooser");
//}
//function findSelectChoosersOrdered(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>,isPublicFirst:boolean): enzyme.ReactWrapper<SelectChooserProps, any>[] {
//    var selectChoosers = findSelectChoosers(crosswordPuzzleChooserWrapper);
//    var publicSelectChooser: enzyme.ReactWrapper<SelectChooserProps, any>;
//    var userSelectChooser: enzyme.ReactWrapper<SelectChooserProps, any>;
//    if (selectChoosers[0].props().isPublic) {
//        publicSelectChooser = selectChoosers[0];
//        userSelectChooser = selectChoosers[1];
//    } else {
//        publicSelectChooser = selectChoosers[1];
//        userSelectChooser = selectChoosers[0];
//    }
//    var orderedChoosers: enzyme.ReactWrapper<SelectChooserProps, any>[]=[]
//    if (isPublicFirst) {
//        orderedChoosers.push(publicSelectChooser);
//        orderedChoosers.push(userSelectChooser);
//    } else {
//        orderedChoosers.push(userSelectChooser);
//        orderedChoosers.push(publicSelectChooser);
//    }
//    return orderedChoosers;
//}
//function findPublicSelectChooser(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>): enzyme.ReactWrapper<SelectChooserProps, any> {
//    return findSelectChoosersOrdered(crosswordPuzzleChooserWrapper,true)[0]
//}
//function findUserSelectChooser(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>): enzyme.ReactWrapper<SelectChooserProps, any> {
//    return findSelectChoosersOrdered(crosswordPuzzleChooserWrapper, false)[0]
//}
//function findSelectChooserContainers(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>): enzyme.ReactWrapper<SelectChooserContainerProps, any>[] {
//    return reactWrapperFindPS<SelectChooserContainerProps, any>(crosswordPuzzleChooserWrapper, "SelectChooserContainer");
//}
//function findSelectChooserContainersOrdered(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>, isPublicFirst: boolean): enzyme.ReactWrapper<SelectChooserContainerProps, any>[] {
//    var selectChoosers = findSelectChooserContainers(crosswordPuzzleChooserWrapper);
//    var publicSelectChooserContainer: enzyme.ReactWrapper<SelectChooserContainerProps, any>;
//    var userSelectChooserContainer: enzyme.ReactWrapper<SelectChooserContainerProps, any>;
//    if (selectChoosers[0].props().isPublic) {
//        publicSelectChooserContainer = selectChoosers[0];
//        userSelectChooserContainer = selectChoosers[1];
//    } else {
//        publicSelectChooserContainer = selectChoosers[1];
//        userSelectChooserContainer = selectChoosers[0];
//    }
//    var orderedChoosers: enzyme.ReactWrapper<SelectChooserContainerProps, any>[] = []
//    if (isPublicFirst) {
//        orderedChoosers.push(publicSelectChooserContainer);
//        orderedChoosers.push(userSelectChooserContainer);
//    } else {
//        orderedChoosers.push(userSelectChooserContainer);
//        orderedChoosers.push(publicSelectChooserContainer);
//    }
//    return orderedChoosers;
//}
//function findPublicSelectChooserContainer(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>): enzyme.ReactWrapper<SelectChooserContainerProps, any> {
//    return findSelectChooserContainersOrdered(crosswordPuzzleChooserWrapper, true)[0]
//}
//function findUserSelectChooserContainer(crosswordPuzzleChooserWrapper: enzyme.ReactWrapper<any, any>): enzyme.ReactWrapper<SelectChooserContainerProps, any> {
//    return findSelectChooserContainersOrdered(crosswordPuzzleChooserWrapper, false)[0]
//}

//describe('<CrosswordPuzzleChooser/>', () => {
//    //ideally should start connected then disconnect
//    var wrapper: enzyme.ReactWrapper<any, any>
//    var userId = "123"
//    beforeEach(() => {
//        mockConnectedDatabase.listenForUserCrosswordLookups.mockClear();
//        mockConnectedDatabase.listenForPublicCrosswordLookups.mockClear();
//    });
//    describe('SelectChooserContainer', () => {
//        var publicSelectChooserContainerHeader = "Public crosswords: "
//        var userSelectChooserContainerHeader = "User crosswords: "
//        var userSelectChooserContainer: enzyme.ReactWrapper<SelectChooserContainerProps, any>
//        var publicSelectChooserContainer: enzyme.ReactWrapper<SelectChooserContainerProps, any>
//        var emailSignInWording = "Sign in";
//        var emailSignOutWording = "Sign out";
//        var placeholderSelectWording = "Select";
//        beforeAll(() => {
//            wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={noop} emailSignInWording={emailSignInWording} emailSignOutWording={emailSignOutWording} placeholderSelectWording={placeholderSelectWording} userLoggedIn={null} publicSelectChooserHeader={publicSelectChooserContainerHeader} userSelectChooserHeader={userSelectChooserContainerHeader} />);
//            userSelectChooserContainer = findUserSelectChooserContainer(wrapper);
//            publicSelectChooserContainer = findPublicSelectChooserContainer(wrapper);
//        })
//        describe("User", () => {
//            it('should render a user select chooser container', () => {
//                expect(userSelectChooserContainer).not.toBeNull();
//            })
//            it('it should have correct header', () => {
//                expect(userSelectChooserContainer.props().header).toBe(userSelectChooserContainerHeader);
//            })
//            it("should contain a user select chooser", () => {
//                var childSelectChoosers = reactWrapperFindPS<SelectChooserProps, any>(userSelectChooserContainer, "SelectChooser");
//                expect(childSelectChoosers.length).toBe(1);
//                expect(childSelectChoosers[0].props().isPublic).toBe(false);
               
//            })
//            it("should contain an email logon with props passed through", () => {
//                var emailLogOnComp = userSelectChooserContainer.find(EmailLogOnComp) as enzyme.ReactWrapper<EmailLogOnCompProps, any>;
//                expect(emailLogOnComp.props().signInTitle).toBe(emailSignInWording);
//                expect(emailLogOnComp.props().signOutTitle).toBe(emailSignOutWording);
//            })
//        })
//        describe("Public", () => {
//            it('should render a public select chooser container', () => {
//                expect(publicSelectChooserContainer).not.toBeNull();
//            })
//            it('it should have correct header', () => {
//                expect(publicSelectChooserContainer.props().header).toBe(publicSelectChooserContainerHeader);
//            })
//            it("should contain a public select chooser with placeholder", () => {
//                var publicSelectChooser=reactWrapperFindPS<SelectChooserProps, any>(publicSelectChooserContainer, "SelectChooser")[0]
//                expect(publicSelectChooser.props().isPublic).toBe(true);
//                expect(publicSelectChooser.props().placeholderText).toBe(placeholderSelectWording + " public crosswords: ");
//            })

//        })
//    })
//    describe('when mounts', () => {
//        it('should handle the connection changed of the connected database', () => {
//            wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={noop} userLoggedIn={null} />);
//            expect(mockConnectedDatabase.connectionCallback).toBeInstanceOf(Function);
//        })
//    })
//    describe('when the database is disconnected', () => {
//        it('should show a message', () => {
//            var disconnectedMessage = "Disconnected...."
//            //shallow https://github.com/airbnb/enzyme/issues/582 https://github.com/airbnb/enzyme/pull/538 to find by object prop
//            //note that could not use mount and find by name if the component class comes from props
//            //but having changed the displayName from HOC !
//            //although have not used that for this ComponentClass

//            wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={noop} userLoggedIn={null} disconnectedMessage={disconnectedMessage} />);
//            expectDisconnectedMessage(wrapper, disconnectedMessage);
//        })
//        it('should disable both SelectChooser', () => {
//            wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={noop} userLoggedIn={null} />);
//            expectSelectChoosersDisabled(wrapper, true);
//        })
//    });

//    //all below freeze npm after tests have passed 
//    xdescribe('when the database connects', () => {
//        it('there should be no disconnected message', () => {
//            //need to mount as connection handler added in componentDidMount - probably should do in ctor
//            wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={noop} userLoggedIn={null} />);
//            mockConnectedDatabase.changeConnection(true);
//            expectDisconnectedMessage(wrapper, "");
//        })
//        describe('public', () => {
//            beforeEach(() => {
//                wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={noop} userLoggedIn={null} />);
//                mockConnectedDatabase.changeConnection(true);
//            })
//            //*********************
//            it('should enable the public SelectChooser ', () => {
//                expect(findPublicSelectChooser(wrapper).props().disabled).toBe(false);
//            })
//            it('should set public loading lookups', () => {
//                expectLookupIsLoading(wrapper, true, true);
//            })
//            it('should listen for public crosswords', () => {
//                expect(mockConnectedDatabase.listenForPublicCrosswordLookups).toHaveBeenCalled();
//            })
//            it('should not listen if already listening', () => {
//                mockConnectedDatabase.listenForPublicCrosswordLookups.mockClear();
//                mockConnectedDatabase.changeConnection(false);
//                mockConnectedDatabase.changeConnection(true);
//                expect(mockConnectedDatabase.listenForPublicCrosswordLookups).not.toHaveBeenCalled();
//            });
//        })
//        describe('user', () => {
//            describe('and is logged in', () => {
//                beforeEach(() => {
//                    wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={noop} userLoggedIn={userId} />);
//                    mockConnectedDatabase.changeConnection(true);
//                })
//                //*********** WHY DOES THIS PASS BUT PUBLIC DOES NOT
//                it('should enable the user SelectChooser', () => {
//                    expect(findUserSelectChooser(wrapper).props().disabled).toBe(false);
//                })
//                describe('and not listening', () => {
//                    it('should listen for user crosswords', () => {
//                        expectListenForUserCrosswordLookups(userId);
//                    })
//                    it('should set user loading lookups when not listening', () => {
//                        expect(findUserSelectChooser(wrapper).props().isLoadingLookups).toBe(true);
//                    })
//                })
//                describe('and is listening', () => {
//                    it('should not listen again', () => {
//                        mockConnectedDatabase.listenForUserCrosswordLookups.mockClear();
//                        mockConnectedDatabase.changeConnection(false);
//                        mockConnectedDatabase.changeConnection(true);
//                        expect(mockConnectedDatabase.listenForUserCrosswordLookups).not.toHaveBeenCalled();
//                    });
//                })

//            });
//            describe('and is not logged in', () => {
//                beforeEach(() => {
//                    wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={noop} userLoggedIn={null} />);
//                    mockConnectedDatabase.changeConnection(true);
//                })
//                it('should not listen', () => {
//                    expect(mockConnectedDatabase.listenForUserCrosswordLookups).not.toHaveBeenCalled();
//                })
//            })
//        })
//    })
//    xdescribe('user login', () => {
//        var userSelectChooser: enyzme.ReactWrapper<SelectChooserProps, any>;
//        var placeholderSelectWording = "Select";
//        var emailSignInWording = "Sign in";
//        var userPlaceholderSignedOutWording="to access saved crosswords"
//        describe('logs in', () => {
            
//            beforeEach(() => {

//                wrapper = enzyme.mount(<CrosswordPuzzleChooser placeholderSelectWording={placeholderSelectWording} crosswordSelected={null} userLoggedIn={null} />);
//                mockConnectedDatabase.changeConnection(true);
//                wrapper.setProps({ userLoggedIn: userId });
//                userSelectChooser = findUserSelectChooser(wrapper);
//            })
//            it('should change user placeholder text to Select saved crosswords ', () => {

//                expect(userSelectChooser.props().placeholderText).toBe(placeholderSelectWording + " saved crosswords: ");
//            })
//            describe('and there is connection', () => {
                
//                it('should listen for user crosswords', () => {
//                    expectListenForUserCrosswordLookups(userId);
//                })
//                xit('should set user loading lookups', () => {
//                    expect(userSelectChooser.props().isLoadingLookups).toBe(true);
//                })
//                xit('should enable the user SelectChooser', () => {
//                    expect(userSelectChooser.props().disabled).toBe(false);
//                })
//            })
//        });
//        describe('logs out', () => {
//            beforeEach(() => {
//                wrapper = enzyme.mount(<CrosswordPuzzleChooser emailSignInWording={emailSignInWording} userPlaceholderSignedOutWording={userPlaceholderSignedOutWording} crosswordSelected={noop} userLoggedIn={userId} />);
//                mockConnectedDatabase.changeConnection(true);
//                wrapper.setProps({ userLoggedIn: null });
//                wrapper.update();
//                userSelectChooser = findUserSelectChooser(wrapper);
//            })
//            it('should change user placeholder text', () => {

//                expect(userSelectChooser.props().placeholderText).toBe(placeholderSelectWording + " saved crosswords: " + emailSignInWording + " " + userPlaceholderSignedOutWording);
//            })
//            it('should remove user lookup listener', () => {

//            })
//            it('should remove user options', () => {

//            })
//            it('should remove the user selected option', () => {

//            })
//            xit('should disable the user SelectChooser', () => {
//                expect(userSelectChooser.props().disabled).toBe(true);
//            })
//        });
//    })
//    xdescribe('receiving crossword lookups', () => {
//        beforeEach(() => {
//            wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={noop} userLoggedIn={"123"} />);
//            mockConnectedDatabase.changeConnection(true);
//        })
//        describe('filters out public in user before passing to the public SelectChooser and users to user SelectChooser', () => {
//            var matchingLookup: CrosswordLookupJson = { id: "1", title: "1", datePublished: "" };
//            var publicLookups: CrosswordLookupJson[] = [matchingLookup, { id: "2", title: "2", datePublished: "" }]
//            var userLookupsNoMatches: CrosswordLookupJson[] = [{ id: "3", title: "3", datePublished: "" }, { id: "4", title: "4", datePublished: "" }]
//            var userLookupsMatches: CrosswordLookupJson[] = [matchingLookup, { id: "3", title: "3", datePublished: "" }]
//            var expectedMatchesResult: CrosswordLookupJson[] = [{ id: "2", title: "2", datePublished: "" }]
//            function doTests(publicFirst: boolean) {
//                pit('no users', publicLookups, null, publicLookups);
//                pit('none to filter', publicLookups, userLookupsNoMatches, publicLookups);
//                pit('filtered', publicLookups, userLookupsMatches, expectedMatchesResult);

//                pits((publicLookups: CrosswordLookupJson[], userLookups: CrosswordLookupJson[], expectedPublicLookups: CrosswordLookupJson[], callbackUser: boolean = true) => {
//                    if (publicFirst) {
//                        mockConnectedDatabase.publicLookupCrosswordCallback(publicLookups);
//                        mockConnectedDatabase.userLookupCrosswordCallback(userLookups);
//                    } else {
//                        mockConnectedDatabase.userLookupCrosswordCallback(userLookups);
//                        mockConnectedDatabase.publicLookupCrosswordCallback(publicLookups);
//                    }
                    
//                    //NOW GETTING CANNOT READ PROPS OF UNDEFINED
//                    expect(findPublicSelectChooser(wrapper).props().crosswordLookups).toEqual(expectedPublicLookups);
//                    expect(findUserSelectChooser(wrapper).props().crosswordLookups).toEqual(userLookups)
//                })
//            };
//            doTests(false);
//            doTests(true);
            
//        })
//        describe('when receive public crosswords', () => {
//            it('should remove public loading indicator', () => {
//                mockConnectedDatabase.publicLookupCrosswordCallback(null);
//                expectLookupIsLoading(wrapper, true, false);
//            })
            
//        })
//        describe('when receive user crosswords', () => {//four warnings just for this
//            it('should remove user loading indicator', () => {
//                mockConnectedDatabase.userLookupCrosswordCallback(null);
//                expectLookupIsLoading(wrapper, false, false);
//            })
//        })
//    })

//    //this uses getSignalPromise
//    xdescribe('crossword lookup selection', () => {
//        //should it disallow further selection ? show a loading indicator ?
//        describe('gets crossword from the database', () => {
//            beforeEach(() => {
//                mockConnectedDatabase.resolveSignal = null;
//            });
//            describe('public', () => {
//                it('should get public selection publicly from the connected database', () => {
//                    wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={noop} userLoggedIn={"123"} />);
//                    var crosswordPuzzleChooser = wrapper.instance() as CrosswordPuzzleChooser
//                    var publicCrosswordId = "1";
//                    crosswordPuzzleChooser.publicLookupSelected(publicCrosswordId);//will be props on the SelectChooser
//                    expect(mockConnectedDatabase.getPublicCrossword).toHaveBeenCalledWith(publicCrosswordId)
//                });
//                it('should callback through props when receives', async () => {
//                    var crosswordSelectedProp = jest.fn();
//                    wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={crosswordSelectedProp} userLoggedIn={"123"} />);
//                    var crosswordPuzzleChooser = wrapper.instance() as CrosswordPuzzleChooser
//                    var publicCrosswordId = "1";
//                    crosswordPuzzleChooser.publicLookupSelected(publicCrosswordId);
                    
//                    await getSignalPromise();
                    
//                    expect(crosswordSelectedProp).toHaveBeenCalledWith(mockConnectedDatabase.publicCrosswordModelJson)
//                })
//            })
//            describe('user', () => {
//                it('should get user selection userly from the connected database', () => {
//                    wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={noop} userLoggedIn={userId} />);
//                    var crosswordPuzzleChooser = wrapper.instance() as CrosswordPuzzleChooser
//                    var userCrosswordId = "2";
//                    crosswordPuzzleChooser.userLookupSelected(userCrosswordId);
//                    expect(mockConnectedDatabase.getUserCrossword).toHaveBeenCalledWith(userId, userCrosswordId)
//                });
//                it('should callback through props when receives', async () => {
//                    var crosswordSelectedProp = jest.fn();
//                    wrapper = enzyme.mount(<CrosswordPuzzleChooser crosswordSelected={crosswordSelectedProp} userLoggedIn={"123"} />);
//                    var crosswordPuzzleChooser = wrapper.instance() as CrosswordPuzzleChooser

//                    var userCrosswordId = "1";
//                    crosswordPuzzleChooser.userLookupSelected(userCrosswordId);

//                    await getSignalPromise();
                    
//                    expect(crosswordSelectedProp).toHaveBeenCalledWith(mockConnectedDatabase.userCrosswordModelJson)
                    
//                })
//            })
//        })

//    });
//})

////this should go in a helper module - to be used with testing components that wrap react-select
//function reactSelectSelectByText(selectWrapper: enzyme.ReactWrapper<any, any>,text:string) {
//    var input = selectWrapper.find('input');
//    input.simulate('focus');
//    input.simulate('change', { target: { value: text } });
//    input.simulate('keyDown', { keyCode: 13, key: 'Enter' });
    
//}
//xdescribe('<DefaultSelectChooser/>', () => {
//    var wrapper: enzyme.ReactWrapper<DefaultSelectChooserProps, any>;
//    function findSelect() {
//        return wrapper.find(Select);
//    }
//    function findButton(): enzyme.CommonWrapper<ButtonProps, any> {
//        return reactWrapperFindPS<ButtonProps, any>(wrapper, "Button")[0];
//    }
//    function expectButtonDisabled(isDisabled: boolean) {
//        expect(findButton().props().disabled).toBe(isDisabled);
//    }
//    function expectSelectDisabled(isDisabled: boolean) {
//        expect(findSelect().props().disabled).toBe(isDisabled);
//    }
    
//    describe('Select options ', () => {
//        it('should have an option for each lookup, showing the title and identifying with id', () => {
//            var crosswordLookups: CrosswordLookupJson[] = [{
//                id: "1",
//                title: "t1",
//                datePublished:""
//            }, {
//                    id: "2",
//                    title: "t2",
//                    datePublished: ""
//                }]
//            wrapper = enzyme.mount(<DefaultSelectChooser crosswordLookups={crosswordLookups} isPublic={true} placeholderText={""} isLoadingLookups={false} lookupSelected={() => { }} disabled={false} />)
//            var expectedOptions: Select.Option[] = [{ label: "t1", value: "1" }, { label: "t2", value: "2" } ]
//            expect(findSelect().props().options).toEqual(expectedOptions);

//        });
//    });
    
//    describe('when disabled', () => {
        
//        beforeEach(() => {
//            wrapper = enzyme.mount(<DefaultSelectChooser crosswordLookups={null} isPublic={true} placeholderText={""} isLoadingLookups={false} lookupSelected={() => { }} disabled={true} />);
//        })
//        it('should have disabled button', () => {
//            expectButtonDisabled(true);
//        })
//        it('should have disabled select', () => {
//            expectSelectDisabled(true);
//        })
//    });

    
//    describe('should pass props through to Select', () => {
//        pit('isLoadingLookups false', { 'isLoadingLookups': false },'isLoading');
//        pit('isLoadingLookups true', { 'isLoadingLookups': true },'isLoading');
//        pit('placeholderText 1', { placeholderText: '1' },'placeholder');
//        pit('placeholderText 1', { placeholderText: '2' },'placeholder');
//        pits((prop: any, selectPropName: string) => {
//            wrapper = enzyme.mount(<DefaultSelectChooser crosswordLookups={null} isPublic={true} placeholderText={""} isLoadingLookups={false} lookupSelected={() => { }} disabled={true}  {...prop} />);
//            var selectProps = findSelect().props();
//            var propValue = prop[Object.getOwnPropertyNames(prop)[0]];
//            expect(selectProps[selectPropName]).toBe(propValue);
//        });
       
//    })

//    describe('when enabled', () => {
//        var select: enzyme.ReactWrapper<any, any>
//        var lookupSelected = jest.fn();
//        beforeEach(() => {
//            wrapper = enzyme.mount(<DefaultSelectChooser crosswordLookups={[{ id: "1", title: "title", datePublished: "" }]} isPublic={true} placeholderText={""} isLoadingLookups={false} lookupSelected={lookupSelected} disabled={false} />);
//            select = findSelect();
//        })
//        //should the option be disabled if no options or is that covered with disable ?
//        it('should have enabled Select', () => {
//            expectSelectDisabled(false);
//        });

//        describe('and option', () => {
//            describe('selected', () => {
//                beforeEach(() => {
//                    reactSelectSelectByText(select, "1");
//                });
//                it('then the value should reflect', () => {
//                    expect(select.props().value).toBe("1");
//                });
//                it('then the button should be enabled ', () => {
//                    expectButtonDisabled(false);
//                })
//                describe('and the button is pressed', () => {
//                    it('should callback with the id of the selected crossword lookup', () => {
//                        (wrapper.instance() as DefaultSelectChooser).buttonClicked();
//                        expect(lookupSelected).toHaveBeenCalledWith("1");
//                    });
//                })
//            })
//            describe('not selected', () => {
//                it('then the button should be disabled', () => {
//                    expectButtonDisabled(true);
//                })
//            });
//        })
        
//    });
    

//})