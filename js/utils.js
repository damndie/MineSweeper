'use strict'

function resetTimer() {
    clearInterval(gTimeId)
    gTimeId = 0
}

function shuffleArray(array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }
    return array
}

function onSetDifficulty(level) {
    var size = level.dataset.size
    var mines = level.dataset.mines
    gLevel.size = size
    gLevel.mines = mines
    onInit()
}

function BombAudio(){
    var bomb = new Audio('/sound/bomb.mp3')
    bomb.play()
}
function WinAudio(){
    var win = new Audio('/sound/win.mp3')
    win.play()
}
function LoseAudio(){
    var lose = new Audio('/sound/lose.mp3')
    lose.play()
}
