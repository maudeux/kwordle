// gobal variables
const url = 'https://cheaderthecoder.github.io/5-Letter-words/words.txt';
let wordbank = []

let game = {
    word :'',
    attempt: 0,
    idx:0,
    Board: [],
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
        console.log(game.word)
        game.attempt = 0
        game.idx = 0
        game.over = false
        game.win = false
        game.keypad = {}
        game.validguess = true
        game.reveal = false
        for(let i=0; i<5; i++){
            game.Board[i] = []
            for(let j=0; j<5; j++){
                game.Board[i][j] = {
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
        drawBoard()
        drawKeyboard()
    } 
}

function drawBoard(){
    let boxSize = 60
    let currY = 80
    let boxGap = 10

    for (let i =0; i<5; i++){
        let currX = 150
        for(let j=0; j<5; j++){

            if(game.Board[i][j].cell === 'correct'){
                fill(colours.green)
                noStroke()

            }else if(game.Board[i][j].cell === 'present'){
                fill(colours.yellow)
                noStroke()

            }else if(game.Board[i][j].cell === 'absent'){
                fill(colours.grey)
                noStroke()
                
            }else{ 
                // empty or occupied
                fill(18,18,19)
                if(game.validguess === false && game.attempt === i){
                    stroke(colours.red)
                }else{
                    stroke(colours.grey)

                }
                
                strokeWeight(2)
            }

            square(currX, currY, boxSize)

            fill(248,248,248)
            noStroke()
            textSize(36)
            textStyle(BOLD)
            text(game.Board[i][j].letter.toUpperCase(), currX , currY )

            currX += boxSize
            currX += boxGap
        }
        currY += boxSize
        currY += boxGap
    }
}

function drawKeyboard(){
    let keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M',]
    ]

    let y = 440
    let keyHeight = 50
    let keyGap = 8

    for (let i =0; i<keys.length; i++){

        let x = 80
        if (i=== 1){x = 100}
        if(i===2){x = 150}

        let row = keys[i]

        for(let key of row){

            let keyWidth = getKeyWidth(key)

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
            rect(x, y, keyWidth, keyHeight, 5)

            // key text
            fill(248,248,248)
            textSize(18)
            textStyle(BOLD)
            text(key, x , y)

            x += keyWidth
            x += keyGap
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
    text("BACKSPACE to look at your puzzle", 300, 430)
}

// input handling
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
            typeLetter(key)
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
    let row = game.attempt
    let col = game.idx
   
    if (col === 4){
        if(game.Board[row][col].cell === 'occupied'){

            return
        }else{
        game.Board[row][col].letter = key
        game.Board[row][col].cell = 'occupied'
        }
    }else{
        game.Board[row][col].letter = key
        game.Board[row][col].cell = 'occupied'
        game.idx += 1
    }
}

function backspace(){
    let row = game.attempt
    let col = game.idx
    let column = col
    if (col === 0){
        if(game.Board[row][col].cell === 'occupied'){
            column = col
        }else{
            return
        }
    }else{
        if (game.Board[row][col].cell === 'occupied'){
            column = col
        }else{
            column = col -1
        }
        game.idx -= 1
    }
    game.Board[row][column].letter = ''
    game.Board[row][column].cell = 'empty'
}

function enterGuess(){
    let attempt = game.attempt
    let guess = ''

    for(let i=0; i<5; i++){
        guess += game.Board[attempt][i].letter
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
            if(game.attempt === 4){ 
                game.over = true
                return
            } 
            game.attempt += 1
            game.idx = 0
        }
        else{
            game.validguess = false
        }
}

// Logic
function wordle(){
    let word = game.word
    let wordArr = word.split('')
    let attempt = game.attempt

    for(let i=0; i<5; i++){
        if ( wordArr.includes(game.Board[attempt][i].letter)){

            if (game.Board[attempt][i].letter === wordArr[i]){
                game.Board[attempt][i].cell = 'correct'
                wordArr[i] = '*'

                game.keypad[game.Board[attempt][i].letter] = 'correct'
                
            }
            else {

                let state = ''
                const index = wordArr.indexOf(game.Board[attempt][i].letter)

                if (game.Board[attempt][index].letter === wordArr[index]){
                    state = 'absent'

                }else{

                    state = 'present'
                    if (index !== -1) {
                        wordArr[index] = '*'
                    }
                }

                game.Board[attempt][i].cell = state
                
                if(!(game.Board[attempt][i].letter in game.keypad)){
                    game.keypad[game.Board[attempt][i].letter] = state
                }
            }   
        }else{
            
            game.Board[attempt][i].cell = 'absent'
            
            game.keypad[game.Board[attempt][i].letter] = 'absent'
        }
        console.log(wordArr)
    }  
}

// helper functions
function isKey(key){
    return /^[A-Z]$/.test(key)
}

function getKeyWidth(key){
    if (key === 'ENTER' || key ==='<='){return 80}
    else{return 40}
}