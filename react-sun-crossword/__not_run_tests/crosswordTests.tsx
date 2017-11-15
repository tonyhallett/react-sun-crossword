/////<reference types="jest"/>
//import * as React from 'react';
//import * as ReactDOM from 'react-dom'
//import { mount, shallow, ReactWrapper } from 'enzyme';
//import { Crossword } from '../src/components/crossword'
////don't like the solving mode in the model'
//import * as CrosswordModel from '../src/models/index';
//import { Square, SquareProps } from '../src/components/square'

//import { pit, pits } from '../node_modules/jestextensions/index'




//describe('<Crossword />', () => {
    
//    describe('should render html table with correct number of rows and columns with square component passing on props ', () => {
//        var oneByTwoSquares=
//            [
//                [{ number: "1", letter: "C", guess: "N", identifier: {id:1} }, { number: "", letter: "O", guess: "Y", identifier: {id:2} }]
//            ];
//        var fourByThreeSquares= [
//            [{ number: "1", letter: "C", guess: "A", identifier: { id: 1 } }, { number: "", letter: "O", guess: "B", identifier: { id: 2 } }, { number: "2", letter: "M", guess: "C", identifier: { id: 3 } }],
//            [{ number: "", letter: "O", guess: "D", identifier: { id: 4 } }, { number: "", letter: "", guess: "E", identifier: { id: 5 } }, { number: "", letter: "A", guess: "F", identifier: { id: 6 } }],
//            [{ number: "9", letter: "E", guess: "G", identifier: { id: 7 } }, { number: "", letter: "S", guess: "H", identifier: { id: 8 } }, { number: "", letter: "S", guess: "I", identifier: { id: 9 } }],
//            [{ number: "", letter: "R", guess: "J", identifier: { id: 10 } }, { number: "", letter: "", guess: "K", identifier: { id: 11 } }, { number: "", letter: "T", guess: "L", identifier: { id: 12 } }]
//        ];

//        pit('1*2', 1, 2, oneByTwoSquares);
//        pit('4*3', 4, 3, fourByThreeSquares);
//        pits((expectedRows: number, expectedColumns: number, squares: SquareProps[][]) => {
//            const wrapper = mount(<Crossword squares={squares} />)
//            var tableRows = wrapper.find("tr");
//            expect(tableRows.length).toBe(expectedRows);
//            expect(tableRows.everyWhere(tr => tr.find("td").length === expectedColumns));
//            expect(wrapper.find("td").everyWhere(tdWrapper => {
//                var children = tdWrapper.children();
//                return children.length == 1 && children.at(0).is(Square);
//            }));
//            tableRows.forEach((trWrapper, rowIndex) => {
//                trWrapper.find('td').forEach((tdWrapper, colIndex) => {
//                    var square = tdWrapper.childAt(0).getNode() as React.ReactElement<SquareProps>;
//                    var squareProps = squares[rowIndex][colIndex];
//                    //********** should be this rather than the loop - but it means providing a value for each prop
//                    //expect(squareProps).toEqual(square.props);
//                    for (var p in squareProps) {
//                        expect(squareProps[p]).toEqual(square.props[p]);
//                    }
//                });
//            });

//        });
//    });
   
//});

