'use strict'

function resetTimer() {
    clearInterval(gTimeId)
    gTimeId = 0
}

function shuffleArray(array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array
}

// elBoard.addEventListener("contextmenu", (event) => {

//     event.preventDefault()
//     if (gIsGameOver) return
//     var elCell = event.target

//     cellMarked(elCell)
// })

function BombAudio(){
    var bomb = new Audio('bomb.mp3')
    bomb.play()
}
function WinAudio(){
    var win = new Audio('win.mp3')
    win.play()
}
function LoseAudio(){
    var lose = new Audio('lose.mp3')
    lose.play()
}
