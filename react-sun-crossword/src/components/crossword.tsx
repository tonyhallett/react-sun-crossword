import * as React from "react";

import { Square, SquareProps} from "./square";
export interface CrosswordProps { squares: SquareProps[][] }


// State is never set so we use the 'undefined' type.
export class Crossword extends React.Component<CrosswordProps, undefined> {
    
    render() {
        var squares = this.props.squares;
        var trs=squares.map((row,rowIndex) => {
            var tds = row.map((square, index) => {
                var square = squares[rowIndex][index];
                return <td key={index}>
                    <Square selected={square.selected} letter={square.letter} isSelected={square.isSelected} isWordSelected={square.isWordSelected} solvingMode={square.solvingMode} guess={square.guess} identifier={square.identifier} number={square.number} />
                </td>
            });
            return <tr key={rowIndex}>{tds}</tr>;
        });
        
        //could do above inline
        return <table>
            <tbody>
                {trs}
            </tbody>
        </table>
       
    }
}