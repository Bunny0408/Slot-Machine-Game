const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
};

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
};

let balance = 0;

function deposit() {
    const depositAmount = parseFloat(prompt("Enter deposit amount:"));
    if (isNaN(depositAmount) || depositAmount <= 0) {
        alert("Invalid deposit amount. Please try again.");
        return deposit();
    }
    return depositAmount;
}

function getNumOfLines() {
    const lines = parseInt(prompt("Enter number of lines you want to bet on (1-3):"));
    if (isNaN(lines) || lines <= 0 || lines > 3) {
        alert("Invalid number of lines. Please try again.");
        return getNumOfLines();
    }
    return lines;
}

function getBet(balance, lines) {
    const bet = parseFloat(prompt("Enter the amount you want to bet on each line:"));
    if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
        alert("Invalid bet amount. Please try again.");
        return getBet(balance, lines);
    }
    return bet;
}

function spin() {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

function transpose(reels) {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
}
function printRows(rows) {
    const reelsContainer = document.getElementById("reelsContainer");
    reelsContainer.innerHTML = "";
  
    for (const row of rows) {
      let rowString = "";
      for (const symbol of row) {
        rowString += symbol + " | ";
      }
      rowString = rowString.slice(0, -3); // Remove the trailing "| "
      const rowElement = document.createElement("p");
      rowElement.textContent = rowString;
      reelsContainer.appendChild(rowElement);
    }
  }
  

// function printRows(rows) {
//     const output = document.getElementById("gameOutput");
//     output.innerHTML = "";

//     for (const row of rows) {
//         let rowString = "";
//         for (const symbol of row) {
//             rowString += symbol + " | ";
//         }
//         rowString = rowString.slice(0, -3); // Remove the trailing "| "
//         output.innerHTML += rowString + "<br>";
//     }
// }

function getWinnings(rows, bet, lines) {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
}
function updateBalance(newBalance) {
    const balanceElement = document.getElementById("balance");
    balanceElement.textContent = "Balance: $" + newBalance.toFixed(2);
}

function updateGameOutput(output) {
    const gameOutput = document.getElementById("gameOutput");
    gameOutput.textContent = output;
}

function playAgain() {
    const numOfLines = getNumOfLines();
    const bet = getBet(balance, numOfLines);

    balance -= bet * numOfLines;

    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);

    const winnings = getWinnings(rows, bet, numOfLines);
    balance += winnings;

    const newBalance = balance;
    updateBalance(newBalance);

    const outputMessage = "You won $" + winnings.toFixed(2) + "!";
    updateGameOutput(outputMessage, newBalance);

    if (balance <= 0) {
        updateGameOutput("You ran out of money!");
        document.getElementById("playAgainBtn").disabled = true;
    }
}

function startGame() {
    balance = deposit();
    updateBalance(balance);

    document.getElementById("playAgainBtn").disabled = false; // Enable the button

    const numOfLines = getNumOfLines();
    const bet = getBet(balance, numOfLines);

    balance -= bet * numOfLines;

    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);

    const winnings = getWinnings(rows, bet, numOfLines);
    balance += winnings;

    updateBalance(balance);
    updateGameOutput("You won $" + winnings.toFixed(2) + "!");

    // if (balance <= 0) {
    //     updateGameOutput("You ran out of money!");
    //     document.getElementById("playAgainBtn").disabled = true;
    // }
}