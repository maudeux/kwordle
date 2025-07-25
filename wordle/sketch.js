let game;
let keysObj = []
let wordbank = []

function getWords(callback) {
    fetch('https://cheaderthecoder.github.io/5-Letter-words/words.txt')
        .then(response => response.text())
        .then(data => {
            wordbank = data.split('\n').map(word => word.trim())
            callback();
        })
        .catch(error => console.error('Failed to load wordbank:', error));
}

const colours = {
    green: '#538d4e',
    yellow: '#b59f3b',
    grey: '#3a3a3c',
    red: '#cd4149',
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER)
    rectMode(CENTER)
    getWords(() =>{
        game = new Game()
        game.startGame(wordbank)  
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

    for (let i =0; i<game.attempts; i++){
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
            x += size + gap
        }
        y += size + gap
    }
}

function drawKeyboard(){
    let keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<']
    ]

    let y = 440
    let height = 50
    let gap = 8

    for (let i =0; i<keys.length; i++){
        let x = 80
        if (i=== 1){x = 100}
        let row = keys[i]
        for(let key of row){
            let width = 40
            if(key === 'ENTER'){
                width = 80
            }

            if (/^[A-Z]$/.test(key)){
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

            keysObj.push(new Key(x, y, height, width, key))
            
            noStroke()
            rect(x, y, width, height, 5)

            fill(248,248,248)
            textSize(18)
            textStyle(BOLD)
            text(key, x , y)

            x += width + gap
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
}

function keyPressed(){
    if (game.over === false){
        game.validguess = true
        if (keyCode === ENTER){
            game.enterGuess()
        }
        else if (keyCode === BACKSPACE){
            game.backspace()
        }
        else if(key.toUpperCase().match(/^[A-Z]$/)){
            game.addKey(key.toLowerCase())
        }
    }
    else{
        if (keyCode === ENTER){
            setup()
        }
    }   
}

function mousePressed(){
    game.validguess = true
    for(let i=0;i<keysObj.length;i++){
        if(keysObj[i].clicked()){
            if(keysObj[i].key === 'ENTER'){
                game.enterGuess()
                return
            }
            if(keysObj[i].key === '<'){
                game.backspace()
                return
            }
            if(keysObj[i].key.match(/^[A-Z]$/)){
                game.addKey(keysObj[i].key.toLowerCase())
                return
            }
        }
    }
}