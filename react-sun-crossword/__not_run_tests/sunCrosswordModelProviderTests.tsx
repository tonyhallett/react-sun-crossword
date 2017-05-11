///<reference types="jest"/>
import { ModelFromJson, SunJson } from "../src/helpers/SunCrosswordModelProvider"
import * as Crossword from "../src/models/index"

describe('Can transform the sun json into initial model', () => {
    var sunJson: SunJson = {
        "data": {
            "headline": "Crossword No 431843",
            "type": "games",
            "meta": {
                "pdf": "crossword-20170506-23829.pdf",
                "print_index": "print.html"
            },
            "copy": {
                "title": "Crossword No 431843",
                "id": "23829",
                "description": "",
                "publisher": "The Sun",
                "setter": "",
                "byline": "",
                "date-publish": "Saturday, 06 May 2017",
                "date-publish-email": "06 May 2017",
                "date-publish-analytics": "2017\/05\/06 00:00 saturday",
                "date-release": "2017-05-06 00:00:00",
                "date-solution": "2017-05-07 00:00:00",
                "crosswordtype": "Two Speed",
                "correctsolutionmessagetext": "You've done it!",
                "previoussolutiontext": "Previous crossword solution",
                "previoussolutionlink": "http:\/\/feeds.thesun.co.uk\/puzzles\/crossword\/20170505\/23828\/",
                "type": "block",
                "gridsize": {
                    "type": "Standard",
                    "cols": "13",
                    "rows": "13"
                },
                "settings": {
                    "solution_hashed": "ecb9b24c41a6e137f405f3c8ed0197d5",
                    "solution": " DISTRACTION F D A C R A TOWE POTPOURRIO A E U Y S CTALISMAN AMOKS   T L C E LOSCARS LOUNGEL O Y G N   DDOLE LASTGASPI L W T E S IEYELASHES SONR G I E T A K VENTURESOME "
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
                                "clue": "One hundred traditions collapse, causing extreme agitation",
                                "format": "11",
                                "length": 11,
                                "answer": "DISTRACTION"
                            },
                            {
                                "word": 2,
                                "number": "9",
                                "clue": "Still have to pay for some flowers",
                                "format": "3",
                                "length": 3,
                                "answer": "OWE"
                            },
                            {
                                "word": 3,
                                "number": "10",
                                "clue": "Medley to flow in or tip out",
                                "format": "3-6",
                                "length": 9,
                                "answer": "POTPOURRI"
                            },
                            {
                                "word": 4,
                                "number": "11",
                                "clue": "A list written wrongly by bloke &ndash; that's charming",
                                "format": "8",
                                "length": 8,
                                "answer": "TALISMAN"
                            },
                            {
                                "word": 5,
                                "number": "12",
                                "clue": "Before noon all right to run wild like this",
                                "format": "4",
                                "length": 4,
                                "answer": "AMOK"
                            },
                            {
                                "word": 6,
                                "number": "14",
                                "clue": "So reversing automobiles get awards",
                                "format": "6",
                                "length": 6,
                                "answer": "OSCARS"
                            },
                            {
                                "word": 7,
                                "number": "16",
                                "clue": "Nothing in thrust is idle",
                                "format": "6",
                                "length": 6,
                                "answer": "LOUNGE"
                            },
                            {
                                "word": 8,
                                "number": "18",
                                "clue": "Do the French provide unemployment benefit?",
                                "format": "4",
                                "length": 4,
                                "answer": "DOLE"
                            },
                            {
                                "word": 9,
                                "number": "19",
                                "clue": "For final hope, shoemaker's equipment needs fuel &ndash; drop of petrol",
                                "format": "4,4",
                                "length": 8,
                                "answer": "LASTGASP"
                            },
                            {
                                "word": 10,
                                "number": "22",
                                "clue": "Observe possible hassle, but they may flutter",
                                "format": "9",
                                "length": 9,
                                "answer": "EYELASHES"
                            },
                            {
                                "word": 11,
                                "number": "23",
                                "clue": "We hear star is a male child",
                                "format": "3",
                                "length": 3,
                                "answer": "SON"
                            },
                            {
                                "word": 12,
                                "number": "24",
                                "clue": "Risky opening could be more use",
                                "format": "11",
                                "length": 11,
                                "answer": "VENTURESOME"
                            }
                        ]
                    },
                    {
                        "name": "Cryptic",
                        "title": "Down",
                        "clues": [
                            {
                                "word": 13,
                                "number": "2",
                                "clue": "One trade agreement most suitable",
                                "format": "5",
                                "length": 5,
                                "answer": "IDEAL"
                            },
                            {
                                "word": 14,
                                "number": "3",
                                "clue": "Records attempt at wall covering",
                                "format": "8",
                                "length": 8,
                                "answer": "TAPESTRY"
                            },
                            {
                                "word": 15,
                                "number": "4",
                                "clue": "A cult a doctor found genuine",
                                "format": "6",
                                "length": 6,
                                "answer": "ACTUAL"
                            },
                            {
                                "word": 16,
                                "number": "5",
                                "clue": "In ancient royal city",
                                "format": "4",
                                "length": 4,
                                "answer": "TROY"
                            },
                            {
                                "word": 17,
                                "number": "6",
                                "clue": "Rowers from San Remo, struggling",
                                "format": "7",
                                "length": 7,
                                "answer": "OARSMEN"
                            },
                            {
                                "word": 18,
                                "number": "7",
                                "clue": "Infantryman is twelve-inch ant",
                                "format": "4,7",
                                "length": 11,
                                "answer": "FOOTSOLDIER"
                            },
                            {
                                "word": 19,
                                "number": "8",
                                "clue": "Lightly touched flower and was highly amused",
                                "format": "7,4",
                                "length": 11,
                                "answer": "TICKLEDPINK"
                            },
                            {
                                "word": 20,
                                "number": "13",
                                "clue": "Fights against trials",
                                "format": "8",
                                "length": 8,
                                "answer": "CONTESTS"
                            },
                            {
                                "word": 21,
                                "number": "15",
                                "clue": "Cello, eg, can be played in the academy",
                                "format": "7",
                                "length": 7,
                                "answer": "COLLEGE"
                            },
                            {
                                "word": 22,
                                "number": "17",
                                "clue": "Collect the rag somehow",
                                "format": "6",
                                "length": 6,
                                "answer": "GATHER"
                            },
                            {
                                "word": 23,
                                "number": "20",
                                "clue": "Tea for fool up in the morning",
                                "format": "5",
                                "length": 5,
                                "answer": "ASSAM"
                            },
                            {
                                "word": 24,
                                "number": "21",
                                "clue": "To hang around is a burden, we hear",
                                "format": "4",
                                "length": 4,
                                "answer": "WAIT"
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
                                "clue": "Extreme agitation",
                                "format": "11",
                                "length": 11,
                                "answer": "DISTRACTION"
                            },
                            {
                                "word": 2,
                                "number": "9",
                                "clue": "Be in arrears",
                                "format": "3",
                                "length": 3,
                                "answer": "OWE"
                            },
                            {
                                "word": 3,
                                "number": "10",
                                "clue": "Dried petal mixture",
                                "format": "3-6",
                                "length": 9,
                                "answer": "POTPOURRI"
                            },
                            {
                                "word": 4,
                                "number": "11",
                                "clue": "Amulet",
                                "format": "8",
                                "length": 8,
                                "answer": "TALISMAN"
                            },
                            {
                                "word": 5,
                                "number": "12",
                                "clue": "Out of control",
                                "format": "4",
                                "length": 4,
                                "answer": "AMOK"
                            },
                            {
                                "word": 6,
                                "number": "14",
                                "clue": "Academy Awards",
                                "format": "6",
                                "length": 6,
                                "answer": "OSCARS"
                            },
                            {
                                "word": 7,
                                "number": "16",
                                "clue": "Living room",
                                "format": "6",
                                "length": 6,
                                "answer": "LOUNGE"
                            },
                            {
                                "word": 8,
                                "number": "18",
                                "clue": "Handout",
                                "format": "4",
                                "length": 4,
                                "answer": "DOLE"
                            },
                            {
                                "word": 9,
                                "number": "19",
                                "clue": "Point of exhaustion",
                                "format": "4,4",
                                "length": 8,
                                "answer": "LASTGASP"
                            },
                            {
                                "word": 10,
                                "number": "22",
                                "clue": "Mascaraed hairs",
                                "format": "9",
                                "length": 9,
                                "answer": "EYELASHES"
                            },
                            {
                                "word": 11,
                                "number": "23",
                                "clue": "Boy child",
                                "format": "3",
                                "length": 3,
                                "answer": "SON"
                            },
                            {
                                "word": 12,
                                "number": "24",
                                "clue": "Bold",
                                "format": "11",
                                "length": 11,
                                "answer": "VENTURESOME"
                            }
                        ]
                    },
                    {
                        "name": "Coffee time",
                        "title": "Down",
                        "clues": [
                            {
                                "word": 13,
                                "number": "2",
                                "clue": "Without fault",
                                "format": "5",
                                "length": 5,
                                "answer": "IDEAL"
                            },
                            {
                                "word": 14,
                                "number": "3",
                                "clue": "Wall-hanging",
                                "format": "8",
                                "length": 8,
                                "answer": "TAPESTRY"
                            },
                            {
                                "word": 15,
                                "number": "4",
                                "clue": "Authentic",
                                "format": "6",
                                "length": 6,
                                "answer": "ACTUAL"
                            },
                            {
                                "word": 16,
                                "number": "5",
                                "clue": "System of weights for gems",
                                "format": "4",
                                "length": 4,
                                "answer": "TROY"
                            },
                            {
                                "word": 17,
                                "number": "6",
                                "clue": "Male rowers",
                                "format": "7",
                                "length": 7,
                                "answer": "OARSMEN"
                            },
                            {
                                "word": 18,
                                "number": "7",
                                "clue": "Infantryman",
                                "format": "4,7",
                                "length": 11,
                                "answer": "FOOTSOLDIER"
                            },
                            {
                                "word": 19,
                                "number": "8",
                                "clue": "Highly amused",
                                "format": "7,4",
                                "length": 11,
                                "answer": "TICKLEDPINK"
                            },
                            {
                                "word": 20,
                                "number": "13",
                                "clue": "Competitions",
                                "format": "8",
                                "length": 8,
                                "answer": "CONTESTS"
                            },
                            {
                                "word": 21,
                                "number": "15",
                                "clue": "Academy",
                                "format": "7",
                                "length": 7,
                                "answer": "COLLEGE"
                            },
                            {
                                "word": 22,
                                "number": "17",
                                "clue": "Amass",
                                "format": "6",
                                "length": 6,
                                "answer": "GATHER"
                            },
                            {
                                "word": 23,
                                "number": "20",
                                "clue": "Indian state",
                                "format": "5",
                                "length": 5,
                                "answer": "ASSAM"
                            },
                            {
                                "word": 24,
                                "number": "21",
                                "clue": "Dally",
                                "format": "4",
                                "length": 4,
                                "answer": "WAIT"
                            }
                        ]
                    }
                ],
                "words": [
                    {
                        "id": 1,
                        "x": "2-12",
                        "y": "1",
                        "solution": "DISTRACTION"
                    },
                    {
                        "id": 2,
                        "x": "1-3",
                        "y": "3",
                        "solution": "OWE"
                    },
                    {
                        "id": 3,
                        "x": "5-13",
                        "y": "3",
                        "solution": "POTPOURRI"
                    },
                    {
                        "id": 4,
                        "x": "1-8",
                        "y": "5",
                        "solution": "TALISMAN"
                    },
                    {
                        "id": 5,
                        "x": "10-13",
                        "y": "5",
                        "solution": "AMOK"
                    },
                    {
                        "id": 6,
                        "x": "1-6",
                        "y": "7",
                        "solution": "OSCARS"
                    },
                    {
                        "id": 7,
                        "x": "8-13",
                        "y": "7",
                        "solution": "LOUNGE"
                    },
                    {
                        "id": 8,
                        "x": "1-4",
                        "y": "9",
                        "solution": "DOLE"
                    },
                    {
                        "id": 9,
                        "x": "6-13",
                        "y": "9",
                        "solution": "LASTGASP"
                    },
                    {
                        "id": 10,
                        "x": "1-9",
                        "y": "11",
                        "solution": "EYELASHES"
                    },
                    {
                        "id": 11,
                        "x": "11-13",
                        "y": "11",
                        "solution": "SON"
                    },
                    {
                        "id": 12,
                        "x": "2-12",
                        "y": "13",
                        "solution": "VENTURESOME"
                    },
                    {
                        "id": 13,
                        "x": "3",
                        "y": "1-5",
                        "solution": "IDEAL"
                    },
                    {
                        "id": 14,
                        "x": "5",
                        "y": "1-8",
                        "solution": "TAPESTRY"
                    },
                    {
                        "id": 15,
                        "x": "7",
                        "y": "1-6",
                        "solution": "ACTUAL"
                    },
                    {
                        "id": 16,
                        "x": "9",
                        "y": "1-4",
                        "solution": "TROY"
                    },
                    {
                        "id": 17,
                        "x": "11",
                        "y": "1-7",
                        "solution": "OARSMEN"
                    },
                    {
                        "id": 18,
                        "x": "1",
                        "y": "2-12",
                        "solution": "FOOTSOLDIER"
                    },
                    {
                        "id": 19,
                        "x": "13",
                        "y": "2-12",
                        "solution": "TICKLEDPINK"
                    },
                    {
                        "id": 20,
                        "x": "9",
                        "y": "6-13",
                        "solution": "CONTESTS"
                    },
                    {
                        "id": 21,
                        "x": "3",
                        "y": "7-13",
                        "solution": "COLLEGE"
                    },
                    {
                        "id": 22,
                        "x": "7",
                        "y": "8-13",
                        "solution": "GATHER"
                    },
                    {
                        "id": 23,
                        "x": "11",
                        "y": "9-13",
                        "solution": "ASSAM"
                    },
                    {
                        "id": 24,
                        "x": "5",
                        "y": "10-13",
                        "solution": "WAIT"
                    }
                ]
            },
            "options": [],
            "competitioncrossword": 0,
            "grid": [
                [
                    {
                        "SquareID": 1,
                        "Number": "",
                        "Letter": "",
                        "Blank": "blank",
                        "WordAcrossID": "",
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 2,
                        "Number": "1",
                        "Letter": "D",
                        "Blank": "",
                        "WordAcrossID": 1,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 3,
                        "Number": "2",
                        "Letter": "I",
                        "Blank": "",
                        "WordAcrossID": 1,
                        "WordDownID": 13
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
                        "Letter": "T",
                        "Blank": "",
                        "WordAcrossID": 1,
                        "WordDownID": 14
                    },
                    {
                        "SquareID": 6,
                        "Number": "",
                        "Letter": "R",
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
                        "WordDownID": 15
                    },
                    {
                        "SquareID": 8,
                        "Number": "",
                        "Letter": "C",
                        "Blank": "",
                        "WordAcrossID": 1,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 9,
                        "Number": "5",
                        "Letter": "T",
                        "Blank": "",
                        "WordAcrossID": 1,
                        "WordDownID": 16
                    },
                    {
                        "SquareID": 10,
                        "Number": "",
                        "Letter": "I",
                        "Blank": "",
                        "WordAcrossID": 1,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 11,
                        "Number": "6",
                        "Letter": "O",
                        "Blank": "",
                        "WordAcrossID": 1,
                        "WordDownID": 17
                    },
                    {
                        "SquareID": 12,
                        "Number": "",
                        "Letter": "N",
                        "Blank": "",
                        "WordAcrossID": 1,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 13,
                        "Number": "",
                        "Letter": "",
                        "Blank": "blank",
                        "WordAcrossID": "",
                        "WordDownID": ""
                    }
                ],
                [
                    {
                        "SquareID": 14,
                        "Number": "7",
                        "Letter": "F",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 18
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
                        "Letter": "D",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 13
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
                        "Letter": "A",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 14
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
                        "Letter": "C",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 15
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
                        "Letter": "R",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 16
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
                        "Letter": "A",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 17
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
                        "Number": "8",
                        "Letter": "T",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 19
                    }
                ],
                [
                    {
                        "SquareID": 27,
                        "Number": "9",
                        "Letter": "O",
                        "Blank": "",
                        "WordAcrossID": 2,
                        "WordDownID": 18
                    },
                    {
                        "SquareID": 28,
                        "Number": "",
                        "Letter": "W",
                        "Blank": "",
                        "WordAcrossID": 2,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 29,
                        "Number": "",
                        "Letter": "E",
                        "Blank": "",
                        "WordAcrossID": 2,
                        "WordDownID": 13
                    },
                    {
                        "SquareID": 30,
                        "Number": "",
                        "Letter": "",
                        "Blank": "blank",
                        "WordAcrossID": "",
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 31,
                        "Number": "10",
                        "Letter": "P",
                        "Blank": "",
                        "WordAcrossID": 3,
                        "WordDownID": 14
                    },
                    {
                        "SquareID": 32,
                        "Number": "",
                        "Letter": "O",
                        "Blank": "",
                        "WordAcrossID": 3,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 33,
                        "Number": "",
                        "Letter": "T",
                        "Blank": "",
                        "WordAcrossID": 3,
                        "WordDownID": 15
                    },
                    {
                        "SquareID": 34,
                        "Number": "",
                        "Letter": "P",
                        "Blank": "",
                        "WordAcrossID": 3,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 35,
                        "Number": "",
                        "Letter": "O",
                        "Blank": "",
                        "WordAcrossID": 3,
                        "WordDownID": 16
                    },
                    {
                        "SquareID": 36,
                        "Number": "",
                        "Letter": "U",
                        "Blank": "",
                        "WordAcrossID": 3,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 37,
                        "Number": "",
                        "Letter": "R",
                        "Blank": "",
                        "WordAcrossID": 3,
                        "WordDownID": 17
                    },
                    {
                        "SquareID": 38,
                        "Number": "",
                        "Letter": "R",
                        "Blank": "",
                        "WordAcrossID": 3,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 39,
                        "Number": "",
                        "Letter": "I",
                        "Blank": "",
                        "WordAcrossID": 3,
                        "WordDownID": 19
                    }
                ],
                [
                    {
                        "SquareID": 40,
                        "Number": "",
                        "Letter": "O",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 18
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
                        "Letter": "A",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 13
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
                        "WordDownID": 14
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
                        "WordDownID": 15
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
                        "Letter": "Y",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 16
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
                        "Letter": "S",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 17
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
                        "Letter": "C",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 19
                    }
                ],
                [
                    {
                        "SquareID": 53,
                        "Number": "11",
                        "Letter": "T",
                        "Blank": "",
                        "WordAcrossID": 4,
                        "WordDownID": 18
                    },
                    {
                        "SquareID": 54,
                        "Number": "",
                        "Letter": "A",
                        "Blank": "",
                        "WordAcrossID": 4,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 55,
                        "Number": "",
                        "Letter": "L",
                        "Blank": "",
                        "WordAcrossID": 4,
                        "WordDownID": 13
                    },
                    {
                        "SquareID": 56,
                        "Number": "",
                        "Letter": "I",
                        "Blank": "",
                        "WordAcrossID": 4,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 57,
                        "Number": "",
                        "Letter": "S",
                        "Blank": "",
                        "WordAcrossID": 4,
                        "WordDownID": 14
                    },
                    {
                        "SquareID": 58,
                        "Number": "",
                        "Letter": "M",
                        "Blank": "",
                        "WordAcrossID": 4,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 59,
                        "Number": "",
                        "Letter": "A",
                        "Blank": "",
                        "WordAcrossID": 4,
                        "WordDownID": 15
                    },
                    {
                        "SquareID": 60,
                        "Number": "",
                        "Letter": "N",
                        "Blank": "",
                        "WordAcrossID": 4,
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
                        "Number": "12",
                        "Letter": "A",
                        "Blank": "",
                        "WordAcrossID": 5,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 63,
                        "Number": "",
                        "Letter": "M",
                        "Blank": "",
                        "WordAcrossID": 5,
                        "WordDownID": 17
                    },
                    {
                        "SquareID": 64,
                        "Number": "",
                        "Letter": "O",
                        "Blank": "",
                        "WordAcrossID": 5,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 65,
                        "Number": "",
                        "Letter": "K",
                        "Blank": "",
                        "WordAcrossID": 5,
                        "WordDownID": 19
                    }
                ],
                [
                    {
                        "SquareID": 66,
                        "Number": "",
                        "Letter": "S",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 18
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
                        "Letter": "",
                        "Blank": "blank",
                        "WordAcrossID": "",
                        "WordDownID": ""
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
                        "Letter": "T",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 14
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
                        "Letter": "L",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 15
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
                        "Number": "13",
                        "Letter": "C",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 20
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
                        "Letter": "E",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 17
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
                        "Letter": "L",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 19
                    }
                ],
                [
                    {
                        "SquareID": 79,
                        "Number": "14",
                        "Letter": "O",
                        "Blank": "",
                        "WordAcrossID": 6,
                        "WordDownID": 18
                    },
                    {
                        "SquareID": 80,
                        "Number": "",
                        "Letter": "S",
                        "Blank": "",
                        "WordAcrossID": 6,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 81,
                        "Number": "15",
                        "Letter": "C",
                        "Blank": "",
                        "WordAcrossID": 6,
                        "WordDownID": 21
                    },
                    {
                        "SquareID": 82,
                        "Number": "",
                        "Letter": "A",
                        "Blank": "",
                        "WordAcrossID": 6,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 83,
                        "Number": "",
                        "Letter": "R",
                        "Blank": "",
                        "WordAcrossID": 6,
                        "WordDownID": 14
                    },
                    {
                        "SquareID": 84,
                        "Number": "",
                        "Letter": "S",
                        "Blank": "",
                        "WordAcrossID": 6,
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
                        "Number": "16",
                        "Letter": "L",
                        "Blank": "",
                        "WordAcrossID": 7,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 87,
                        "Number": "",
                        "Letter": "O",
                        "Blank": "",
                        "WordAcrossID": 7,
                        "WordDownID": 20
                    },
                    {
                        "SquareID": 88,
                        "Number": "",
                        "Letter": "U",
                        "Blank": "",
                        "WordAcrossID": 7,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 89,
                        "Number": "",
                        "Letter": "N",
                        "Blank": "",
                        "WordAcrossID": 7,
                        "WordDownID": 17
                    },
                    {
                        "SquareID": 90,
                        "Number": "",
                        "Letter": "G",
                        "Blank": "",
                        "WordAcrossID": 7,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 91,
                        "Number": "",
                        "Letter": "E",
                        "Blank": "",
                        "WordAcrossID": 7,
                        "WordDownID": 19
                    }
                ],
                [
                    {
                        "SquareID": 92,
                        "Number": "",
                        "Letter": "L",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 18
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
                        "Letter": "O",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 21
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
                        "Letter": "Y",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 14
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
                        "Number": "17",
                        "Letter": "G",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 22
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
                        "WordDownID": 20
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
                        "Letter": "",
                        "Blank": "blank",
                        "WordAcrossID": "",
                        "WordDownID": ""
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
                        "Letter": "D",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 19
                    }
                ],
                [
                    {
                        "SquareID": 105,
                        "Number": "18",
                        "Letter": "D",
                        "Blank": "",
                        "WordAcrossID": 8,
                        "WordDownID": 18
                    },
                    {
                        "SquareID": 106,
                        "Number": "",
                        "Letter": "O",
                        "Blank": "",
                        "WordAcrossID": 8,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 107,
                        "Number": "",
                        "Letter": "L",
                        "Blank": "",
                        "WordAcrossID": 8,
                        "WordDownID": 21
                    },
                    {
                        "SquareID": 108,
                        "Number": "",
                        "Letter": "E",
                        "Blank": "",
                        "WordAcrossID": 8,
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
                        "Letter": "L",
                        "Blank": "",
                        "WordAcrossID": 9,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 111,
                        "Number": "",
                        "Letter": "A",
                        "Blank": "",
                        "WordAcrossID": 9,
                        "WordDownID": 22
                    },
                    {
                        "SquareID": 112,
                        "Number": "",
                        "Letter": "S",
                        "Blank": "",
                        "WordAcrossID": 9,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 113,
                        "Number": "",
                        "Letter": "T",
                        "Blank": "",
                        "WordAcrossID": 9,
                        "WordDownID": 20
                    },
                    {
                        "SquareID": 114,
                        "Number": "",
                        "Letter": "G",
                        "Blank": "",
                        "WordAcrossID": 9,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 115,
                        "Number": "20",
                        "Letter": "A",
                        "Blank": "",
                        "WordAcrossID": 9,
                        "WordDownID": 23
                    },
                    {
                        "SquareID": 116,
                        "Number": "",
                        "Letter": "S",
                        "Blank": "",
                        "WordAcrossID": 9,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 117,
                        "Number": "",
                        "Letter": "P",
                        "Blank": "",
                        "WordAcrossID": 9,
                        "WordDownID": 19
                    }
                ],
                [
                    {
                        "SquareID": 118,
                        "Number": "",
                        "Letter": "I",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 18
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
                        "Letter": "L",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 21
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
                        "Letter": "W",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 24
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
                        "Letter": "T",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 22
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
                        "Letter": "E",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 20
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
                        "Letter": "S",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 23
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
                        "Letter": "I",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 19
                    }
                ],
                [
                    {
                        "SquareID": 131,
                        "Number": "22",
                        "Letter": "E",
                        "Blank": "",
                        "WordAcrossID": 10,
                        "WordDownID": 18
                    },
                    {
                        "SquareID": 132,
                        "Number": "",
                        "Letter": "Y",
                        "Blank": "",
                        "WordAcrossID": 10,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 133,
                        "Number": "",
                        "Letter": "E",
                        "Blank": "",
                        "WordAcrossID": 10,
                        "WordDownID": 21
                    },
                    {
                        "SquareID": 134,
                        "Number": "",
                        "Letter": "L",
                        "Blank": "",
                        "WordAcrossID": 10,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 135,
                        "Number": "",
                        "Letter": "A",
                        "Blank": "",
                        "WordAcrossID": 10,
                        "WordDownID": 24
                    },
                    {
                        "SquareID": 136,
                        "Number": "",
                        "Letter": "S",
                        "Blank": "",
                        "WordAcrossID": 10,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 137,
                        "Number": "",
                        "Letter": "H",
                        "Blank": "",
                        "WordAcrossID": 10,
                        "WordDownID": 22
                    },
                    {
                        "SquareID": 138,
                        "Number": "",
                        "Letter": "E",
                        "Blank": "",
                        "WordAcrossID": 10,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 139,
                        "Number": "",
                        "Letter": "S",
                        "Blank": "",
                        "WordAcrossID": 10,
                        "WordDownID": 20
                    },
                    {
                        "SquareID": 140,
                        "Number": "",
                        "Letter": "",
                        "Blank": "blank",
                        "WordAcrossID": "",
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 141,
                        "Number": "23",
                        "Letter": "S",
                        "Blank": "",
                        "WordAcrossID": 11,
                        "WordDownID": 23
                    },
                    {
                        "SquareID": 142,
                        "Number": "",
                        "Letter": "O",
                        "Blank": "",
                        "WordAcrossID": 11,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 143,
                        "Number": "",
                        "Letter": "N",
                        "Blank": "",
                        "WordAcrossID": 11,
                        "WordDownID": 19
                    }
                ],
                [
                    {
                        "SquareID": 144,
                        "Number": "",
                        "Letter": "R",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 18
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
                        "Letter": "G",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 21
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
                        "Letter": "I",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 24
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
                        "Letter": "E",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 22
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
                        "Letter": "T",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 20
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
                        "Letter": "A",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 23
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
                        "Letter": "K",
                        "Blank": "",
                        "WordAcrossID": "",
                        "WordDownID": 19
                    }
                ],
                [
                    {
                        "SquareID": 157,
                        "Number": "",
                        "Letter": "",
                        "Blank": "blank",
                        "WordAcrossID": "",
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 158,
                        "Number": "24",
                        "Letter": "V",
                        "Blank": "",
                        "WordAcrossID": 12,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 159,
                        "Number": "",
                        "Letter": "E",
                        "Blank": "",
                        "WordAcrossID": 12,
                        "WordDownID": 21
                    },
                    {
                        "SquareID": 160,
                        "Number": "",
                        "Letter": "N",
                        "Blank": "",
                        "WordAcrossID": 12,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 161,
                        "Number": "",
                        "Letter": "T",
                        "Blank": "",
                        "WordAcrossID": 12,
                        "WordDownID": 24
                    },
                    {
                        "SquareID": 162,
                        "Number": "",
                        "Letter": "U",
                        "Blank": "",
                        "WordAcrossID": 12,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 163,
                        "Number": "",
                        "Letter": "R",
                        "Blank": "",
                        "WordAcrossID": 12,
                        "WordDownID": 22
                    },
                    {
                        "SquareID": 164,
                        "Number": "",
                        "Letter": "E",
                        "Blank": "",
                        "WordAcrossID": 12,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 165,
                        "Number": "",
                        "Letter": "S",
                        "Blank": "",
                        "WordAcrossID": 12,
                        "WordDownID": 20
                    },
                    {
                        "SquareID": 166,
                        "Number": "",
                        "Letter": "O",
                        "Blank": "",
                        "WordAcrossID": 12,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 167,
                        "Number": "",
                        "Letter": "M",
                        "Blank": "",
                        "WordAcrossID": 12,
                        "WordDownID": 23
                    },
                    {
                        "SquareID": 168,
                        "Number": "",
                        "Letter": "E",
                        "Blank": "",
                        "WordAcrossID": 12,
                        "WordDownID": ""
                    },
                    {
                        "SquareID": 169,
                        "Number": "",
                        "Letter": "",
                        "Blank": "blank",
                        "WordAcrossID": "",
                        "WordDownID": ""
                    }
                ]
            ],
            "created": "2017-05-07 00:00:19"
        }
    }
    var model = ModelFromJson(sunJson);
    class RowColumn {
        constructor(readonly rowIndex:number, readonly columnIndex:number) { }
    }
    class SquareWordSolution {
        constructor(readonly rowIndex, readonly columnIndex, readonly downSolution: string, readonly acrossSolution) { }
    }
    interface AcrossDownWords {
        acrossWords: Crossword.IWord[],
        downWords: Crossword.IWord[]
    }
    it('should have blank squares which are not part of words', () => {
        function expectBlank(rowColumn: RowColumn) {
            var square = model.grid[rowColumn.rowIndex - 1][rowColumn.columnIndex - 1];
            expect(square.letter).toBe("");
            expect(square.acrossWord).toBeNull();
            expect(square.downWord).toBeNull();
        }
        var blankSquares = [new RowColumn(1, 1), new RowColumn(1, 13), new RowColumn(2, 2)];
        blankSquares.forEach(blankSquare => {
            expectBlank(blankSquare);
        });
    })

    it('should have non blank squares that are part of down words only ', () => {
        function expectNonBlank(rowColumn: RowColumn) {
            var square = model.grid[rowColumn.rowIndex - 1][rowColumn.columnIndex - 1];
            expect(square.letter).not.toBe("");
            expect(square.acrossWord).toBeNull();
            expect(square.downWord).not.toBeNull();
        }
        //
        var nonBlankSquares = [new RowColumn(2, 1), new RowColumn(8, 7), new RowColumn(10, 5)];
        nonBlankSquares.forEach(nonBlankSquare => {
            expectNonBlank(nonBlankSquare);
        });
    });
    it('should have squares that are part of across words only', () => {
        function expectNonBlank(rowColumn: RowColumn) {
            var square = model.grid[rowColumn.rowIndex - 1][rowColumn.columnIndex - 1];
            expect(square.letter).not.toBe("");
            expect(square.acrossWord).not.toBeNull();
            expect(square.downWord).toBeNull();
        }

        var nonBlankSquares = [new RowColumn(1, 2), new RowColumn(5, 10), new RowColumn(13, 2)];
        nonBlankSquares.forEach(nonBlankSquare => {
            expectNonBlank(nonBlankSquare);
        });

    });
    it('should have squares that are part of across and down words', () => {
        function expectNonBlank(rowColumn: RowColumn) {
            var square = model.grid[rowColumn.rowIndex - 1][rowColumn.columnIndex - 1];
            expect(square.letter).not.toBe("");
            expect(square.acrossWord).not.toBeNull();
            expect(square.downWord).not.toBeNull();
        }

        var nonBlankSquares = [new RowColumn(1, 3), new RowColumn(3, 1), new RowColumn(3, 3)];
        nonBlankSquares.forEach(nonBlankSquare => {
            expectNonBlank(nonBlankSquare);
        });
    });
    it('should have some numbered squares', () => {
        var numberedSquares = [new RowColumn(1, 2), new RowColumn(1, 3), new RowColumn(2, 1)];
        numberedSquares.forEach(numberedSquare => {
            expect(model.grid[numberedSquare.rowIndex - 1][numberedSquare.columnIndex - 1].number).not.toEqual("");
        });
    });
    it('should have some squares that are not numbered', () => {
        var numberedSquares = [new RowColumn(1, 4), new RowColumn(1, 6), new RowColumn(12, 3)];
        numberedSquares.forEach(numberedSquare => {
            expect(model.grid[numberedSquare.rowIndex - 1][numberedSquare.columnIndex - 1].number).toEqual("");
        });
    });
    it('all squares should have correct row and column index', () => {
        model.grid.forEach((row, rowIndex) => {
            row.forEach((square, colIndex) => {
                expect(square.rowIndex).toBe(rowIndex);
                expect(square.columnIndex).toBe(colIndex);
            }
        })
    })
    it('should have words specified by squares', () => {
        function wordSolution(word: Crossword.IWord):string {
            var solution = "";
            word.squares.forEach(square => solution += square.letter);
            return solution;
        }
        var squareWordSolutions = [new SquareWordSolution(3, 1, "FOOTSOLDIER", "OWE"),
            new SquareWordSolution(3,5,"TAPESTRY","POTPOURRI")
        ]
        squareWordSolutions.forEach(sws => {
            var square = model.grid[sws.rowIndex - 1][sws.columnIndex - 1];
            expect(wordSolution(square.acrossWord)).toBe(sws.acrossSolution);
            expect(wordSolution(square.downWord)).toBe(sws.downSolution);
        });
    });
    it('each clue provider should provide a clue for each across and each down word', () => {
        var acrossAndDownWords=model.grid.reduce<AcrossDownWords>((acrossDownWords, row) => {
            return row.reduce<AcrossDownWords>((acdWds, square) => {
                if (square.acrossWord) {
                    if (acdWds.acrossWords.indexOf(square.acrossWord) === -1) {
                        acdWds.acrossWords.push(square.acrossWord);
                    }
                }
                if (square.downWord) {
                    if (acdWds.downWords.indexOf(square.downWord) === -1) {
                        acdWds.downWords.push(square.downWord);
                    }
                }
                return acdWds;
            }, acrossDownWords);
        }, {
                acrossWords: [],
                downWords: []
            });
        model.clueProviders.forEach(cp => {
            cp.acrossClues.forEach(ac => {
                expect(acrossAndDownWords.acrossWords.indexOf(ac.word)).not.toBe(-1);
            });
            cp.downClues.forEach(ac => {
                expect(acrossAndDownWords.downWords.indexOf(ac.word)).not.toBe(-1);
            });
        })
    });
    //instead of dealing with json could possible have navigated to the jsonp, downloaded the urls for the week
    //then on a timer navigated to each of the pages and run script on a crossword object to get the equivalent
})