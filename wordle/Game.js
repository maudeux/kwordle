class Game{
    constructor(){
        this.attempts = 5
        this.word = ''
        this.wordbank = []
        this.row = 0
        this.col =0
        this.over = false
        this.win = false
        this.validguess = true
        this.board = []
        this.keypad = {}
    }

    startGame(wordbank){
        this.wordbank = wordbank
        let randomIndex = Math.floor(Math.random() * wordbank.length)
        this.word = wordbank[randomIndex];
        this.row = 0
        this.col = 0
        this.over = false
        this.win = false
        this.keypad = {}
        this.validguess = true
        for(let i=0; i<this.attempts; i++){
            this.board[i] = []
            for(let j=0; j<5; j++){
                this.board[i][j] = {
                    letter: '',
                    cell:'empty'
                    }
                }
        }
    }

    addKey(key){
        let row = this.row
        let col = this.col
    
        if (col === 4){
            if(this.board[row][col].cell === 'occupied'){
                return
            }else{
            this.board[row][col].letter = key
            this.board[row][col].cell = 'occupied'
            }
        }else{
            this.board[row][col].letter = key
            this.board[row][col].cell = 'occupied'
            this.col += 1
        }
    }

    backspace(){
        let row = this.row
        let col = this.col
        let column = col
        if (col === 0){
            if(this.board[row][col].cell === 'occupied'){
                column = col
            }else{
                return
            }
        }else{
            if (this.board[row][col].cell === 'occupied'){
                column = col
            }else{
                column = col -1
                this.col -= 1
            }
        }
        this.board[row][column].letter = ''
        this.board[row][column].cell = 'empty'
    }

    enterGuess(){
        let row = this.row
        let guess = ''

        for(let i=0; i<5; i++){
            guess += this.board[row][i].letter
        }

        if(guess.length != 5){
            this.validguess = false
        }
        else if (wordbank.includes(guess)){
            this.validguess = true
                this.wordle()
                if(guess === this.word){
                    this.win = true
                    this.over = true
                    return
                }
                if(this.row === 4){ 
                    this.over = true
                    return
                } 
                this.row += 1
                this.col = 0
            }
            else{
                this.validguess = false
            }
    }

    wordle(){
        let word = this.word
        let wordArr = word.split('')
        let row = this.row

        for(let i=0; i<5; i++){
            if ( wordArr.includes(this.board[row][i].letter)){

                if (this.board[row][i].letter === wordArr[i]){
                    this.board[row][i].cell = 'correct'
                    wordArr[i] = '*'

                    this.keypad[this.board[row][i].letter] = 'correct'
                }
                else {
                    let state = ''
                    const index = wordArr.indexOf(this.board[row][i].letter)

                    if (this.board[row][index].letter === wordArr[index]){
                        state = 'absent'

                    }else{
                        state = 'present'
                        if (index !== -1) {
                            wordArr[index] = '*'
                        }
                    }

                    this.board[row][i].cell = state
                    
                    if(!(this.board[row][i].letter in this.keypad)){
                        this.keypad[this.board[row][i].letter] = state
                    }
                }   
            }else{
                this.board[row][i].cell = 'absent'
                
                this.keypad[this.board[row][i].letter] = 'absent'
            }
        }  
    }
}