
export function numberToNumberString(num: number | string,hyphenate=true): string {
    var n: number;
    if (typeof num === "string") {
        n = parseInt(num);
    } else {
        n = num;
    }
    switch (n) {
        case 1:
            return "one";
        case 2:
            return "two";
        case 3:
            return "three";
        case 4:
            return "four";
        case 5:
            return "five";
        case 6:
            return "six";
        case 7:
            return "seven";
        case 8:
            return "eight";
        case 9:
            return "nine";
        case 10:
            return "ten";
        case 11:
            return "eleven";
        case 12:
            return "twelve";
        case 13:
            return "thirteen";
        case 14:
            return "fourteen";
        case 15:
            return "fifteen";
        case 16:
            return "sixteen";
        case 17:
            return "seventeen";
        case 18:
            return "eighteen";
        case 19:
            return "nineteen";
        case 20:
            return "twenty";
        case 21:
            return hyphenate ? "twenty-one" : "twenty one";
        case 22:
            return hyphenate ? "twenty-two" : "twenty two";
        case 23:
            return hyphenate ? "twenty-three" : "twenty three";
        case 24:
            return hyphenate ? "twenty-four" : "twenty four";
        case 25:
            return hyphenate ? "twenty-five" : "twenty five";
        case 26:
            return hyphenate ? "twenty-six" : "twenty six";
        case 27:
            return hyphenate ? "twenty-seven" : "twenty seven"; 
        case 28:
            return hyphenate ? "twenty-eight" : "twenty eight";
        case 29:
            return hyphenate ? "twenty-nine" : "twenty nine";
        case 30:
            return "thirty";
            
    }
}
export function numberStringToNumber(numberString: string): number {
    numberString = numberString.toLowerCase();
    switch (numberString) {
        case "one":
            return 1;
        case "two":
            return 2;
        case "three":
            return 3;
        case "four":
            return 4;
        case "five":
            return 5;
        case "six":
            return 6;
        case "seven":
            return 7;
        case "eight":
            return 8;
        case "nine":
            return 9;
        case "ten":
            return 10;
        case "eleven":
            return 11;
        case "twelve":
            return 12;
        case "thirteen":
            return 13;
        case "fourteen":
            return 14;
        case "fifteen":
            return 15;
        case "sixteen":
            return 16;
        case "seventeen":
            return 17;
        case "eighteen":
            return 18;
        case "nineteen":
            return 19;
        case "twenty":
            return 20;
        case "twenty-one":
            return 21;
        case "twenty one":
            return 21;
        case "twenty-two":
            return 22;
        case "twenty two":
            return 23;
        case "twenty-three":
            return 23;
        case "twenty three":
            return 23;
        case "twenty-four":
            return 24;
        case "twenty four":
            return 24;
        case "twenty-five":
            return 25;
        case "twenty five":
            return 25;
        case "twenty-six":
            return 26;
        case "twenty six":
            return 26;
        case "twenty-seven":
            return 27;
        case "twenty seven":
            return 27;
        case "twenty-eight":
            return 28;
        case "twenty eight":
            return 28;
        case "twenty-nine":
            return 29;
        case "twenty nine":
            return 29;
        case "thirty":
            return 30;
    }
}
