
const url = 'https://cheaderthecoder.github.io/5-Letter-words/words.txt';
let wordbank = []

let game = {
    word :'',
    row: 0,
    col:0,
    board: [],
    over:false,
    win: false,
    keypad: {},
    validguess: true,
    reveal: false
}

const colours = {
    green: '#538d4e',
    yellow: '#b59f3b',
    grey: '#3a3a3c',
    red: '#cd4149',

}

function getWords(callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            wordbank = data.split('\n').map(word => word.trim())
            callback();
        })
        .catch(error => console.error('Failed to load wordbank:', error));
}

// setup and draw functions
function setup() {
    createCanvas(600, 600);
    textAlign(CENTER, CENTER)
    rectMode(CENTER)

    getWords(() =>{

        let randomIndex = Math.floor(Math.random() * wordbank.length)
        game.word = wordbank[randomIndex];
        game.row = 0
        game.col = 0
        game.over = false
        game.win = false
        game.keypad = {}
        game.validguess = true
        game.reveal = false
        for(let i=0; i<5; i++){
            game.board[i] = []
            for(let j=0; j<5; j++){
                game.board[i][j] = {
                    letter: '',
                    cell:'empty'
                    }
                }
        }   
    })
}

function draw() {
    background(18, 18, 19)

    if(game.over === true){
        drawGameOver()
    }else{
        drawboard()
        drawKeyboard()
    } 
}

function drawboard(){
    let size = 60
    let y = 80
    let gap = 10

    for (let i =0; i<5; i++){
        let x = 150
        for(let j=0; j<5; j++){

            if(game.board[i][j].cell === 'correct'){
                fill(colours.green)
                noStroke()

            }else if(game.board[i][j].cell === 'present'){
                fill(colours.yellow)
                noStroke()

            }else if(game.board[i][j].cell === 'absent'){
                fill(colours.grey)
                noStroke()
                
            }else{ 
                // empty or occupied
                fill(18,18,19)
                if(game.validguess === false && game.row === i){
                    stroke(colours.red)
                }else{
                    stroke(colours.grey)

                }
                
                strokeWeight(2)
            }

            square(x, y, size)

            fill(248,248,248)
            noStroke()
            textSize(36)
            textStyle(BOLD)
            text(game.board[i][j].letter.toUpperCase(), x , y )

            x += size
            x += gap
        }
        y += size
        y += gap
    }
}

function drawKeyboard(){
    let keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M',]
    ]

    let y = 440
    let height = 50
    let gap = 8

    for (let i =0; i<keys.length; i++){

        let x = 80
        if (i=== 1){x = 100}
        if(i===2){x = 150}

        let row = keys[i]

        for(let key of row){

            let width = 40

            if (isKey(key)){
                if(key.toLowerCase() in game.keypad){
                    if(game.keypad[key.toLowerCase()] === 'correct'){
                        fill(colours.green)
                    }else if(game.keypad[key.toLowerCase()] === 'present'){
                        fill(colours.yellow)
                    }else{
                        fill(colours.grey)
                    }
                }else{
                    fill(129,131,132)
                }
            }else{
                fill(129,131,132)
            }
            
            noStroke()
            rect(x, y, width, height, 5)

            // key text
            fill(248,248,248)
            textSize(18)
            textStyle(BOLD)
            text(key, x , y)

            x += width
            x += gap
        }
        y += 60
    }
}

function drawGameOver(){
    let txt = ''

    if(game.win === true){
        txt = 'Congratulations!'
    }else{
        txt = 'Better luck next time'
    }

    fill(248,248,248)
    noStroke()
    textSize(42)
    text(txt, 300, 200)

    fill(colours.green)
    noStroke()
    rect(300, 300 , 150, 60, 5)

    fill(248,248,248)
    textSize(38)
    textStyle(BOLD)
    text(game.word, 300, 300)

    textSize(18)
    text("Press ENTER to start a new game", 300, 400)
    // text("BACKSPACE to look at your puzzle", 300, 430)
}

function keyPressed(){
    if (game.over === false){
        game.validguess = true
    
        if (keyCode === ENTER){
            enterGuess()
            
            return
        }
        else if (keyCode === BACKSPACE){
            backspace()
            return
        }
        else if(key.toUpperCase().match(/^[A-Z]$/)){
            typeLetter(key.toLowerCase())
            return
        }
        else{
            return
        }
    }
    else{
        if (keyCode === ENTER){
            setup()
        }
    }   
}

function typeLetter(key){
    let row = game.row
    let col = game.col
   
    if (col === 4){
        if(game.board[row][col].cell === 'occupied'){

            return
        }else{
        game.board[row][col].letter = key
        game.board[row][col].cell = 'occupied'
        }
    }else{
        game.board[row][col].letter = key
        game.board[row][col].cell = 'occupied'
        game.col += 1
    }
}

function backspace(){
    let row = game.row
    let col = game.col
    let column = col
    if (col === 0){
        if(game.board[row][col].cell === 'occupied'){
            column = col
        }else{
            return
        }
    }else{
        if (game.board[row][col].cell === 'occupied'){
            column = col
        }else{
            column = col -1
        }
        game.col -= 1
    }
    game.board[row][column].letter = ''
    game.board[row][column].cell = 'empty'
}

function enterGuess(){
    let row = game.row
    let guess = ''

    for(let i=0; i<5; i++){
        guess += game.board[row][i].letter
    }

    if(guess.length != 5){
        game.validguess = false
    }
    else if (wordbank.includes(guess)){
        game.validguess = true
            wordle()
            if(guess === game.word){
                game.win = true
                game.over = true
                return
            }
            if(game.row === 4){ 
                game.over = true
                return
            } 
            game.row += 1
            game.col = 0
        }
        else{
            game.validguess = false
        }
}

function wordle(){
    let word = game.word
    let wordArr = word.split('')
    let row = game.row

    for(let i=0; i<5; i++){
        if ( wordArr.includes(game.board[row][i].letter)){

            if (game.board[row][i].letter === wordArr[i]){
                game.board[row][i].cell = 'correct'
                wordArr[i] = '*'

                game.keypad[game.board[row][i].letter] = 'correct'
                
            }
            else {

                let state = ''
                const index = wordArr.indexOf(game.board[row][i].letter)

                if (game.board[row][index].letter === wordArr[index]){
                    state = 'absent'

                }else{

                    state = 'present'
                    if (index !== -1) {
                        wordArr[index] = '*'
                    }
                }

                game.board[row][i].cell = state
                
                if(!(game.board[row][i].letter in game.keypad)){
                    game.keypad[game.board[row][i].letter] = state
                }
            }   
        }else{
            
            game.board[row][i].cell = 'absent'
            
            game.keypad[game.board[row][i].letter] = 'absent'
        }
    }  
}

function isKey(key){
    return /^[A-Z]$/.test(key)
}