///<reference types="jest"/>
import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { mount, shallow, ReactWrapper } from 'enzyme';
import { CrosswordPuzzle } from '../src/components/crosswordPuzzle'
import { Crossword } from '../src/components/crossword'
import { CrosswordModel,Square } from '../src/models/index'
import { ModelFromJson } from '../src/helpers/SunCrosswordModelProvider'

import { pit, pits,xpit } from '../node_modules/jestextensions/index'


type ArrowKeys = 'arrowLeft' | 'arrowRight' | 'arrowUp' | 'arrowDown';

describe('<CrosswordPuzzle/ navigation>', () => {
    function getModel(): CrosswordModel {
        var crosswordJson = {
            "data": {

                "headline": "Crossword No 431844",
                "type": "games",
                "meta": {
                    "pdf": "crossword-20170507-23830.pdf",
                    "print_index": "print.html"
                },
                "copy": {
                    "title": "Crossword No 431844",
                    "id": "23830",
                    "description": "",
                    "publisher": "The Sun",
                    "setter": "",
                    "byline": "",
                    "date-publish": "Sunday, 07 May 2017",
                    "date-publish-email": "07 May 2017",
                    "date-publish-analytics": "2017\/05\/07 00:00 sunday",
                    "date-release": "2017-05-07 00:00:00",
                    "date-solution": "2017-05-08 00:00:00",
                    "crosswordtype": "Two Speed",
                    "correctsolutionmessagetext": "You've done it!",
                    "previoussolutiontext": "Previous crossword solution",
                    "previoussolutionlink": "http:\/\/feeds.thesun.co.uk\/puzzles\/crossword\/20170506\/23829\/",
                    "type": "block",
                    "gridsize": {
                        "type": "Standard",
                        "cols": "13",
                        "rows": "13"
                    },
                    "settings": {
                        "solution_hashed": "4ba089e97b12962ceb1b70e6111c9c87",
                        "solution": "CLOSECALL INKR U X S E R NOCTET TREMOLOS S E U R N WSATURATE ASTI  A N E M   NKEYPAD NOSINGE   L P N S  EDGY KINGCRABP R E C O A EFROGMAN LEEKSI A U I I L ETON SOCIALIST"
                    },
                    "hints": {
                        "Mark Errors": "0",
                        "Solve Letter": "0",
                        "Solve Word": "0",
                        "Ask A Friend": "0"
                    },
                    "clues": [
                        {
                            "name": "Cryptic",
                            "title": "Across",
                            "clues": [
                                {
                                    "word": 1,
                                    "number": "1",
                                    "clue": "A hundred to miss summons &ndash; a narrow escape",
                                    "format": "5,4",
                                    "length": 9,
                                    "answer": "CLOSECALL"
                                },
                                {
                                    "word": 2,
                                    "number": "6",
                                    "clue": "Some thinking writers need it?",
                                    "format": "3",
                                    "length": 3,
                                    "answer": "INK"
                                },
                                {
                                    "word": 3,
                                    "number": "8",
                                    "clue": "Eight players etc to play",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "OCTET"
                                },
                                {
                                    "word": 4,
                                    "number": "9",
                                    "clue": "Lot more confused by the musical effect",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "TREMOLO"
                                },
                                {
                                    "word": 5,
                                    "number": "10",
                                    "clue": "Soak a suet-tar concoction",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "SATURATE"
                                },
                                {
                                    "word": 6,
                                    "number": "11",
                                    "clue": "Firstly, all should try Italian wine",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "ASTI"
                                },
                                {
                                    "word": 7,
                                    "number": "13",
                                    "clue": "Part of phone provides entry device to flat",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "KEYPAD"
                                },
                                {
                                    "word": 8,
                                    "number": "14",
                                    "clue": "Numbers in Greek capital being inquisitive",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "NOSING"
                                },
                                {
                                    "word": 9,
                                    "number": "17",
                                    "clue": "Entered gym, somewhat nervous",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "EDGY"
                                },
                                {
                                    "word": 10,
                                    "number": "19",
                                    "clue": "Cooks ring back to get crustacean",
                                    "format": "4,4",
                                    "length": 8,
                                    "answer": "KINGCRAB"
                                },
                                {
                                    "word": 11,
                                    "number": "22",
                                    "clue": "Gold initially brought in from an amphibious diver",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "FROGMAN"
                                },
                                {
                                    "word": 12,
                                    "number": "23",
                                    "clue": "Seeps, it's said, like these vegetables?",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "LEEKS"
                                },
                                {
                                    "word": 13,
                                    "number": "24",
                                    "clue": "Part of a stone weight",
                                    "format": "3",
                                    "length": 3,
                                    "answer": "TON"
                                },
                                {
                                    "word": 14,
                                    "number": "25",
                                    "clue": "Left-wing gathering, it's broken up",
                                    "format": "9",
                                    "length": 9,
                                    "answer": "SOCIALIST"
                                }
                            ]
                        },
                        {
                            "name": "Cryptic",
                            "title": "Down",
                            "clues": [
                                {
                                    "word": 15,
                                    "number": "1",
                                    "clue": "Mark is annoyed",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "CROSS"
                                },
                                {
                                    "word": 16,
                                    "number": "2",
                                    "clue": "Show greater endurance than troublesome tout, say",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "OUTSTAY"
                                },
                                {
                                    "word": 17,
                                    "number": "3",
                                    "clue": "Outside in vortex, tern alights",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "EXTERNAL"
                                },
                                {
                                    "word": 18,
                                    "number": "4",
                                    "clue": "Clever use of statue",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "ASTUTE"
                                },
                                {
                                    "word": 19,
                                    "number": "5",
                                    "clue": "Ogle when dance comes up",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "LEER"
                                },
                                {
                                    "word": 20,
                                    "number": "6",
                                    "clue": "Makes smooth for fetters",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "IRONS"
                                },
                                {
                                    "word": 21,
                                    "number": "7",
                                    "clue": "Aware of the monarch about this time",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "KNOWING"
                                },
                                {
                                    "word": 22,
                                    "number": "12",
                                    "clue": "Looming, a different Asian country",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "MONGOLIA"
                                },
                                {
                                    "word": 23,
                                    "number": "13",
                                    "clue": "Look up suitable exercises",
                                    "format": "4-3",
                                    "length": 7,
                                    "answer": "KEEPFIT"
                                },
                                {
                                    "word": 24,
                                    "number": "15",
                                    "clue": "Serial I translated, from Jerusalem perhaps",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "ISRAELI"
                                },
                                {
                                    "word": 25,
                                    "number": "16",
                                    "clue": "Meal outside to choose and take, both unfinished",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "PICNIC"
                                },
                                {
                                    "word": 26,
                                    "number": "18",
                                    "clue": "Low sound, developed sound",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "GROAN"
                                },
                                {
                                    "word": 27,
                                    "number": "20",
                                    "clue": "Surround and harass live group",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "BESET"
                                },
                                {
                                    "word": 28,
                                    "number": "21",
                                    "clue": "Some Aussie museum houses birds",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "EMUS"
                                }
                            ]
                        },
                        {
                            "name": "Coffee time",
                            "title": "Across",
                            "clues": [
                                {
                                    "word": 1,
                                    "number": "1",
                                    "clue": "Narrow escape",
                                    "format": "5,4",
                                    "length": 9,
                                    "answer": "CLOSECALL"
                                },
                                {
                                    "word": 2,
                                    "number": "6",
                                    "clue": "Pen fluid",
                                    "format": "3",
                                    "length": 3,
                                    "answer": "INK"
                                },
                                {
                                    "word": 3,
                                    "number": "8",
                                    "clue": "Band of eight",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "OCTET"
                                },
                                {
                                    "word": 4,
                                    "number": "9",
                                    "clue": "Musical vibration",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "TREMOLO"
                                },
                                {
                                    "word": 5,
                                    "number": "10",
                                    "clue": "Drench",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "SATURATE"
                                },
                                {
                                    "word": 6,
                                    "number": "11",
                                    "clue": "Fizzy wine",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "ASTI"
                                },
                                {
                                    "word": 7,
                                    "number": "13",
                                    "clue": "Console",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "KEYPAD"
                                },
                                {
                                    "word": 8,
                                    "number": "14",
                                    "clue": "Prying",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "NOSING"
                                },
                                {
                                    "word": 9,
                                    "number": "17",
                                    "clue": "Anxious",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "EDGY"
                                },
                                {
                                    "word": 10,
                                    "number": "19",
                                    "clue": "Edible crustacean of the North Pacific",
                                    "format": "4,4",
                                    "length": 8,
                                    "answer": "KINGCRAB"
                                },
                                {
                                    "word": 11,
                                    "number": "22",
                                    "clue": "Diver",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "FROGMAN"
                                },
                                {
                                    "word": 12,
                                    "number": "23",
                                    "clue": "Pungent vegetables",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "LEEKS"
                                },
                                {
                                    "word": 13,
                                    "number": "24",
                                    "clue": "Great weight",
                                    "format": "3",
                                    "length": 3,
                                    "answer": "TON"
                                },
                                {
                                    "word": 14,
                                    "number": "25",
                                    "clue": "Left-wing",
                                    "format": "9",
                                    "length": 9,
                                    "answer": "SOCIALIST"
                                }
                            ]
                        },
                        {
                            "name": "Coffee time",
                            "title": "Down",
                            "clues": [
                                {
                                    "word": 15,
                                    "number": "1",
                                    "clue": "Angry",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "CROSS"
                                },
                                {
                                    "word": 16,
                                    "number": "2",
                                    "clue": "Last longer than",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "OUTSTAY"
                                },
                                {
                                    "word": 17,
                                    "number": "3",
                                    "clue": "Lying outside",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "EXTERNAL"
                                },
                                {
                                    "word": 18,
                                    "number": "4",
                                    "clue": "Canny",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "ASTUTE"
                                },
                                {
                                    "word": 19,
                                    "number": "5",
                                    "clue": "Stare suggestively",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "LEER"
                                },
                                {
                                    "word": 20,
                                    "number": "6",
                                    "clue": "Chains, fetters",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "IRONS"
                                },
                                {
                                    "word": 21,
                                    "number": "7",
                                    "clue": "Being aware of",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "KNOWING"
                                },
                                {
                                    "word": 22,
                                    "number": "12",
                                    "clue": "East Asian country",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "MONGOLIA"
                                },
                                {
                                    "word": 23,
                                    "number": "13",
                                    "clue": "Healthy exercises",
                                    "format": "4-3",
                                    "length": 7,
                                    "answer": "KEEPFIT"
                                },
                                {
                                    "word": 24,
                                    "number": "15",
                                    "clue": "From Tel Aviv, perhaps",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "ISRAELI"
                                },
                                {
                                    "word": 25,
                                    "number": "16",
                                    "clue": "Alfresco meal",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "PICNIC"
                                },
                                {
                                    "word": 26,
                                    "number": "18",
                                    "clue": "Sigh loudly",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "GROAN"
                                },
                                {
                                    "word": 27,
                                    "number": "20",
                                    "clue": "Encircle",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "BESET"
                                },
                                {
                                    "word": 28,
                                    "number": "21",
                                    "clue": "Australian birds",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "EMUS"
                                }
                            ]
                        }
                    ],
                    "words": [
                        {
                            "id": 1,
                            "x": "1-9",
                            "y": "1",
                            "solution": "CLOSECALL"
                        },
                        {
                            "id": 2,
                            "x": "11-13",
                            "y": "1",
                            "solution": "INK"
                        },
                        {
                            "id": 3,
                            "x": "1-5",
                            "y": "3",
                            "solution": "OCTET"
                        },
                        {
                            "id": 4,
                            "x": "7-13",
                            "y": "3",
                            "solution": "TREMOLO"
                        },
                        {
                            "id": 5,
                            "x": "1-8",
                            "y": "5",
                            "solution": "SATURATE"
                        },
                        {
                            "id": 6,
                            "x": "10-13",
                            "y": "5",
                            "solution": "ASTI"
                        },
                        {
                            "id": 7,
                            "x": "1-6",
                            "y": "7",
                            "solution": "KEYPAD"
                        },
                        {
                            "id": 8,
                            "x": "8-13",
                            "y": "7",
                            "solution": "NOSING"
                        },
                        {
                            "id": 9,
                            "x": "1-4",
                            "y": "9",
                            "solution": "EDGY"
                        },
                        {
                            "id": 10,
                            "x": "6-13",
                            "y": "9",
                            "solution": "KINGCRAB"
                        },
                        {
                            "id": 11,
                            "x": "1-7",
                            "y": "11",
                            "solution": "FROGMAN"
                        },
                        {
                            "id": 12,
                            "x": "9-13",
                            "y": "11",
                            "solution": "LEEKS"
                        },
                        {
                            "id": 13,
                            "x": "1-3",
                            "y": "13",
                            "solution": "TON"
                        },
                        {
                            "id": 14,
                            "x": "5-13",
                            "y": "13",
                            "solution": "SOCIALIST"
                        },
                        {
                            "id": 15,
                            "x": "1",
                            "y": "1-5",
                            "solution": "CROSS"
                        },
                        {
                            "id": 16,
                            "x": "3",
                            "y": "1-7",
                            "solution": "OUTSTAY"
                        },
                        {
                            "id": 17,
                            "x": "5",
                            "y": "1-8",
                            "solution": "EXTERNAL"
                        },
                        {
                            "id": 18,
                            "x": "7",
                            "y": "1-6",
                            "solution": "ASTUTE"
                        },
                        {
                            "id": 19,
                            "x": "9",
                            "y": "1-4",
                            "solution": "LEER"
                        },
                        {
                            "id": 20,
                            "x": "11",
                            "y": "1-5",
                            "solution": "IRONS"
                        },
                        {
                            "id": 21,
                            "x": "13",
                            "y": "1-7",
                            "solution": "KNOWING"
                        },
                        {
                            "id": 22,
                            "x": "9",
                            "y": "6-13",
                            "solution": "MONGOLIA"
                        },
                        {
                            "id": 23,
                            "x": "1",
                            "y": "7-13",
                            "solution": "KEEPFIT"
                        },
                        {
                            "id": 24,
                            "x": "11",
                            "y": "7-13",
                            "solution": "ISRAELI"
                        },
                        {
                            "id": 25,
                            "x": "7",
                            "y": "8-13",
                            "solution": "PICNIC"
                        },
                        {
                            "id": 26,
                            "x": "3",
                            "y": "9-13",
                            "solution": "GROAN"
                        },
                        {
                            "id": 27,
                            "x": "13",
                            "y": "9-13",
                            "solution": "BESET"
                        },
                        {
                            "id": 28,
                            "x": "5",
                            "y": "10-13",
                            "solution": "EMUS"
                        }
                    ]
                },
                "options": [],
                "competitioncrossword": 0,
                "grid": [
                    [
                        {
                            "SquareID": 1,
                            "Number": "1",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 2,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 3,
                            "Number": "2",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 4,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 5,
                            "Number": "3",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 6,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 7,
                            "Number": "4",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 8,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 9,
                            "Number": "5",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 19
                        },
                        {
                            "SquareID": 10,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 11,
                            "Number": "6",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 2,
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 12,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 2,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 13,
                            "Number": "7",
                            "Letter": "K",
                            "Blank": "",
                            "WordAcrossID": 2,
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 14,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 15,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 16,
                            "Number": "",
                            "Letter": "U",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 17,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 18,
                            "Number": "",
                            "Letter": "X",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 19,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 20,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 21,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 22,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 19
                        },
                        {
                            "SquareID": 23,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 24,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 25,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 26,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 27,
                            "Number": "8",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 28,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 29,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 30,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 31,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 32,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 33,
                            "Number": "9",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 34,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 35,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": 19
                        },
                        {
                            "SquareID": 36,
                            "Number": "",
                            "Letter": "M",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 37,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 38,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 39,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 40,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 41,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 42,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 43,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 44,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 45,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 46,
                            "Number": "",
                            "Letter": "U",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 47,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 48,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 19
                        },
                        {
                            "SquareID": 49,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 50,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 51,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 52,
                            "Number": "",
                            "Letter": "W",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 53,
                            "Number": "10",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 54,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 55,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 56,
                            "Number": "",
                            "Letter": "U",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 57,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 58,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 59,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 60,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 61,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 62,
                            "Number": "11",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 6,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 63,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 6,
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 64,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 6,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 65,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 6,
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 66,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 67,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 68,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 69,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 70,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 71,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 72,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 73,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 74,
                            "Number": "12",
                            "Letter": "M",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 75,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 76,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 77,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 78,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 79,
                            "Number": "13",
                            "Letter": "K",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 80,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 81,
                            "Number": "",
                            "Letter": "Y",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 82,
                            "Number": "",
                            "Letter": "P",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 83,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 84,
                            "Number": "",
                            "Letter": "D",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 85,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 86,
                            "Number": "14",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 87,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 88,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 89,
                            "Number": "15",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 90,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 91,
                            "Number": "",
                            "Letter": "G",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 92,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 93,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 94,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 95,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 96,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 97,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 98,
                            "Number": "16",
                            "Letter": "P",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 99,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 100,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 101,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 102,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 103,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 104,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        }
                    ],
                    [
                        {
                            "SquareID": 105,
                            "Number": "17",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 9,
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 106,
                            "Number": "",
                            "Letter": "D",
                            "Blank": "",
                            "WordAcrossID": 9,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 107,
                            "Number": "18",
                            "Letter": "G",
                            "Blank": "",
                            "WordAcrossID": 9,
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 108,
                            "Number": "",
                            "Letter": "Y",
                            "Blank": "",
                            "WordAcrossID": 9,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 109,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 110,
                            "Number": "19",
                            "Letter": "K",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 111,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 112,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 113,
                            "Number": "",
                            "Letter": "G",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 114,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 115,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 116,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 117,
                            "Number": "20",
                            "Letter": "B",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": 27
                        }
                    ],
                    [
                        {
                            "SquareID": 118,
                            "Number": "",
                            "Letter": "P",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 119,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 120,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 121,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 122,
                            "Number": "21",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 28
                        },
                        {
                            "SquareID": 123,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 124,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 125,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 126,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 127,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 128,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 129,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 130,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 27
                        }
                    ],
                    [
                        {
                            "SquareID": 131,
                            "Number": "22",
                            "Letter": "F",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 132,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 133,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 134,
                            "Number": "",
                            "Letter": "G",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 135,
                            "Number": "",
                            "Letter": "M",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": 28
                        },
                        {
                            "SquareID": 136,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 137,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 138,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 139,
                            "Number": "23",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 140,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 141,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 142,
                            "Number": "",
                            "Letter": "K",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 143,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": 27
                        }
                    ],
                    [
                        {
                            "SquareID": 144,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 145,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 146,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 147,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 148,
                            "Number": "",
                            "Letter": "U",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 28
                        },
                        {
                            "SquareID": 149,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 150,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 151,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 152,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 153,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 154,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 155,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 156,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 27
                        }
                    ],
                    [
                        {
                            "SquareID": 157,
                            "Number": "24",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 13,
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 158,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 13,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 159,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 13,
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 160,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 161,
                            "Number": "25",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 28
                        },
                        {
                            "SquareID": 162,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 163,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 164,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 165,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 166,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 167,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 168,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 169,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 27
                        }
                    ]
                ],
                "created": "2017-05-08 00:00:21"
            }
        }
        var model = ModelFromJson(crosswordJson);
        return model;
    }
    describe('nothing selected', () => {
        it('should not select', () => {
            var model = getModel();
            const wrapper = mount(<CrosswordPuzzle crosswordModel={model} />);
            var crosswordPuzzle = wrapper.instance() as CrosswordPuzzle;
            var mockSquareSelected = jest.fn();
            crosswordPuzzle.squareSelected = mockSquareSelected;
            crosswordPuzzle.arrowDown();
            expect(mockSquareSelected).not.toBeCalled();
        })
        
    });
    //must remember that although the cols and index are not starting at 0 in the pit, they are in the test and
    //that a failing result will show the values starting from 0
    describe('affects selection if something is selected', () => {
        pit('stays in word, first, right', 1, 11, 'arrowRight', 1, 12);
        pit('stays in word, penultimate, right', 1, 12, 'arrowRight', 1, 13);
        pit('stays in word, last, left', 1, 13, 'arrowLeft', 1, 12);
        pit('stays in word, penultimate, left', 1, 12, 'arrowLeft', 1, 11);
        pit('stays in word, first, down', 1, 1, 'arrowDown', 2, 1);
        pit('stays in word, last, up', 5, 1, 'arrowUp', 4, 1);

        pit('skips left single no pacman', 1, 11, 'arrowLeft', 1, 9);
        pit('skips right single no pacman', 1, 9, 'arrowRight', 1, 11);
        pit('skips down single no pacman', 13, 3, 'arrowDown', 1, 3);
        pit('skips up single no pacman', 1, 3, 'arrowUp', 13, 3);


        pit('skips left multiple no pacman', 8, 5, 'arrowLeft', 8, 1);
        pit('skips right multiple no pacman', 6, 9, 'arrowRight', 6, 13);
        pit('skips down multiple no pacman', 1, 6, 'arrowDown', 5, 6);
        pit('skips up multiple no pacman', 5, 6, 'arrowUp', 1, 6);

        pit('left pacman no skip', 1, 1, 'arrowLeft', 1, 13);
        pit('right pacman no skip', 1, 13, 'arrowRight', 1, 1);
        pit('down pacman no skip', 13, 5, 'arrowDown', 1, 5);
        pit('up pacman no skip', 1, 13, 'arrowUp', 13, 13);

        pit('left pacman skip after', 8, 1, 'arrowLeft', 8, 11);
        pit('right pacman skip after', 6, 13, 'arrowRight', 6, 3);
        pit('left pacman skip before', 6, 3, 'arrowLeft', 6, 13);
        pit('down pacman skip before', 11, 4, 'arrowDown', 1, 4);
        //.. could add couple more 
        pits((initialSelectedRowIndex:number, initialSelectedColIndex:number, arrowKey: ArrowKeys,expectedSelectedRowIndex:number,expectedSelectedColIndex:number) => {
            var model = getModel();
            var initialSelected = model.grid[initialSelectedRowIndex - 1][initialSelectedColIndex - 1];
            initialSelected.selected = true;
            model.selectedSquare = initialSelected;
            const wrapper = mount(<CrosswordPuzzle crosswordModel={model} />);
            var crosswordPuzzle = wrapper.instance() as CrosswordPuzzle;
            var stubPerformSelection = jest.fn();
            crosswordPuzzle.performSelection = stubPerformSelection;
            crosswordPuzzle[arrowKey]();
            var square = stubPerformSelection.mock.calls[0][0] as Square;
            expect(square.rowIndex).toBe(expectedSelectedRowIndex - 1);
            expect(square.columnIndex).toBe(expectedSelectedColIndex - 1);
            expect(stubPerformSelection.mock.calls[0][1]).toBe(true);
            //will decrease by 1 on each
        }
    })
});