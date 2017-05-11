import * as React from "react";

import { Square, SquareProps } from "./square";


export interface CrosswordProps { squares: SquareProps[][] }


// State is never set so we use the 'undefined' type.
export class Crossword extends React.Component<CrosswordProps, undefined> {
    //this is wrong do not want to pass through SquareProps as the selected ?

    render() {
        var squares = this.props.squares;
        var id = 0;//solely for finding in tests
        var trs=squares.map((row,rowIndex) => {
            var tds = row.map((square, index) => {
                id++;
                var square = squares[rowIndex][index];
                //remember that square.selected is callback from the CrosswordPuzzle
                return <td style={{ border: "0px" }} key={index} id={"SquareTd" + id} >
                    <Square  selected={square.selected} letter={square.letter} isSelected={square.isSelected} isWordSelected={square.isWordSelected} solvingMode={square.solvingMode} guess={square.guess} identifier={square.identifier} number={square.number} />
                </td>
            });
            return <tr key={rowIndex}>{tds}</tr>;
        });
        
        //could do above inline  ,
        return <table style={{ backgroundColor: "black",border:"2px solid black",  borderCollapse:"collapse" }}>
            <tbody>
                {trs}
            </tbody>
        </table>
       
    }
}