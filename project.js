//1. Deposit some money
//2. Determine no. of line to bet on
//3. Collect a bet amount 
//4. Spin the slot machine
//5. Check if user won
//6. Given the user their winning
//7. Play again


// function deposit() {
//     return 1
// }
// const x = deposit()
const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
}

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
}


//1. Deposit some money
const deposit = () => {
    while(true) {
        const depositAmount = prompt("Enter deposit amount: ");
        const numdepositAmount = parseFloat(depositAmount);

        if (isNaN(numdepositAmount) || numdepositAmount <= 0){
            console.log("Invalid deposit Amount, Try again.")
        } else{
            return numdepositAmount;
        }
    }
}


//2. Determine no. of line to bet on
const getNumofLines = () => {
    while(true) {
        const lines = prompt("Enter Number of Line you want to bet on (1-3): ");
        const numOfLine = parseFloat(lines);

        if (isNaN(numOfLine) || numOfLine <= 0 || numOfLine > 3){
            console.log("Invalid Number of Line, Try again.")
        } else{
            return numOfLine;
        }
    }
}

//3. Collect a bet amount 
const getBet = (balance, lines) => {
    while(true) {
        const bet = prompt("Enter the Amount you want to bet on each line: ");
        const numbet = parseFloat(bet);

        if (isNaN(numbet) || numbet <= 0 || numbet > balance/lines){
            console.log("Invalid bet, Try again.")
        } else{
            return numbet;
        }
    }
}


//4. Spin the slot machine
const spin = () => {
    // symbols contain all available symbols, below for loops takes all info form SYMBOLS_COUNT and create new array with all available symbols  
    const symbols = [];
    for(const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0; i < count; i++){
            symbols.push(symbol)
        }
    }

    // Below for loops make fill the empty reels using random() it randomly ganerate index number then that symbol is used and that index element is sliced and floor() is used to round of random generated index
  // eg reels = [[], [], []]
    const reels = [];
    for(let i = 0; i < COLS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for(let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);  
        }
    }
    return reels;
}



//5. Check if user won
// in this function we are transposing the reel 
const transpose = (reels) => {
    const rows = [];

    for(let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }

    return rows;

}

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const[i, symbol] of row.entries()){
            rowString += symbol;
            if (i != row.length - 1){
                rowString += " | "
            }
        }
        console.log(rowString)
    }
}
// Winnings
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for(let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols) {
            if (symbol != symbols[0]){
                allSame = false;
                break;
            }
        }
        if (allSame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }
    return winnings;

}
//6. Given the user their winning


const game = () => {
    
    let balance = deposit();
    // console.log(balance);

    while(true) {
        console.log("You have a Balance of $" + balance);
        const numOfLine = getNumofLines();
        const bet = getBet(balance, numOfLine);
        balance -= bet * numOfLine;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numOfLine);
        balance += winnings
        console.log("You Won, $" + winnings.toString());

        if(balance <= 0){;
            console.log("You Ran out of money")
            break;
        }
        const PlayAgain = prompt("Do you want to paly again (y/n)?");

        if (PlayAgain != "y") break;

    }
};


game()