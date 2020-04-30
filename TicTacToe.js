class TicTacToe {
    constructor() {
        this.grid = [
            null, null, null,
            null, null, null,
            null, null, null,
        ];
        this.player = true;
    }
    play(index) {
        if (index > 8 || this.grid[index] !== null) {
            return false;
        }
        this.grid[index] = this.player;
        this.player = !this.player;
    }
    checkWinner() {
        const winConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        const trueWon = winConditions.some((winning) => {
            return winning.every((winningNumber) => {
                return this.grid[winningNumber] === true;
            })
        });
        if(trueWon) {
            return true;
        }
        const falseWon = winConditions.some((winning) => {
            return winning.every((winningNumber) => {
                return this.grid[winningNumber] === false;
            })
        });
        if(falseWon) {
            return false;
        }
         return null;
    }
    getPlayer() {
        return this.player ? 'X' : 'O';
    }
    getGrid() {
        let string = ""
        this.grid.forEach((v, k) => {
            string += v === true ? '❌' : v === false ? '🅾️' : k;
            if((k + 1) % 3 === 0) {
                string += "\n";
            }
        });
        return string;
    }
    boardFull() {
        return !this.grid.some((e) => e === null);
    }
}

module.exports = TicTacToe;