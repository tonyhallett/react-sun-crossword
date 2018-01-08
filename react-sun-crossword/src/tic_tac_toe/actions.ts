export const BOARD_HIT_TEST = "Board_Hit_Test";
export function boardHitTest(x: number, y: number) {
    return {
        type: BOARD_HIT_TEST,
        x: x,
        y: y
    }
}
export const BOARD_HIT_TEST_RESULT = "Board_Hit_Test_Result";
export function boardHitTestResult(hit: boolean, row: number, column: number) {
    return {
        type: BOARD_HIT_TEST_RESULT,
        hit: hit,
        row: row,
        column: column
    }
}

export const Finished_Confirmed = "FINISHED_CONFIRMED"
export const Play_Again = "PLAY_AGAIN";
export const Take_Go = "TAKE_GO"
export const Arrow_Press = "ARROW_PRESS"

export enum ArrowDirection { Up, Down, Left, Right }
export function arrowPressed(direction: ArrowDirection) {
    return {
        type: Arrow_Press,
        direction: direction
    }
}
export function finishedConfirmed() {
    return {
        type: Finished_Confirmed
    }
}
export function playAgain() {
    return {
        type: Play_Again
    }
}
export function takeGo(row: number, column: number) {
    return {
        type: Take_Go,
        row: row,
        column: column
    }
}