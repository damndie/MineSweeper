'use strict'

// Consts

const LOSE = '😒'
const WIN = '😎'
const BOMB = '💣'
const FLAG = '🚩'
const HEART = '❤️'
const SMILE = '😀'

// Global variables

var gIsGameOver
var gFirstClickedCell
var gMinesOnBoard
var gFlagsOnBoardCount
var gintervalId
var gLivesLeft
var gGame
var gBoard
var gLevel = {
    SIZE: 4,
    BOMB: 2
}

// Models
var elBoard
var timerDisplay = document.querySelector('.timer')
var elLivesLeft = document.querySelector('.lives')
var elbomb = document.querySelector('.bomb')
var elresetbtn = document.querySelector('.reset-btn')


function onInit() {
    gIsGameOver = false
    gLivesLeft = 3
    updateLivesLeft()
    gBoard = buildBoard(gLevel)
    elBoard = document.querySelector('.board')
    gFirstClickedCell = null
    renderboard(gBoard, '.board')
    gFlagsOnBoardCount = 0
    elresetbtn.innerText = SMILE
    gMinesOnBoard = +gLevel.BOMB
    elbomb.innerText = gLevel.BOMB
    resetTimer()
}

function buildBoard() {
    const board = []
    const generationArray = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        var cellsData = {
            isShown: false,
            isMine: i < gLevel.mines ? true : false,
            isMarked: false,
            minesAroundCount: null
        }
        generationArray.push(cellsData)
    }
    shuffleArray(generationArray)

    for (var i = 0; i < generationArray.length; i += gLevel.SIZE) {
        board.push(generationArray.splice(0, gLevel.SIZE))
    }
    return board
}

function renderboard(board, selector) {
    // console.table(board)
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = setMinesNegsCount(i, j, board)
            }
            var strClass = board[i][j].isMine ? 'mine-cell' : 'safe-cell';
            strHTML += `\t<td class"${strClass}" data-i="${i}" data-j="${j}"
            onclick="onCellClicked(this, ${i}, ${j})">
            </td>\n`
        }
        strHTML += '<tr>\n'
    }
    var elTable = document.querySelector(selector)
    elTable.innerHTML = strHTML
}

function setMinesNegsCount(cellI, cellJ, board) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {

        if (i < 0 || i >= board.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) neighborsCount++

        }
    }
    return neighborsCount
}

function checkGameOver(isOnMine) {
    if (!isOnMine) {
        var flaggedMinesCount = 0
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                var currCell = gBoard[i][j]
                if (currCell.isMarked && currCell.isMine) {
                    flaggedMinesCount++
                }
            }
        }
        if (flaggedMinesCount === gMinesOnBoard && gMinesOnBoard === gFlagsOnBoardCount) {
            gIsGameOver = true
            elresetbtn.innerText = WIN
            console.log("You won!")
            WinAudio()
        }
        else {
            gLivesLeft--
            updateLivesLeft(gLivesLeft)
            var elLivesLeft = document.querySelector('.lives')
            var strLives = ''
            for (var i = 0; i < gLivesLeft; i++) {
                strLives += HEART
            }
            elLivesLeft.innerHTML = strLives
            if (gLivesLeft === 0){
                for(var i = 0; gBoard.length; i++){
                    for(var j = 0; j < gBoard[i].length; j++){
                        const currCell = gBoard[i][j]
                        if(currCell.isMine){
                            currCell.isShown = true
                            var elCell = document.querySelector(`[data-i = '${i}'][data-j] = '${j}'`)
                            elCell.classList.add('.mine')
                            elCell.innerText = BOMB
                            console.log("You have been bombed")
                            BombAudio()
                        }
                    }
                }
                gIsGameOver = true
                elresetbtn.innerText = LOSE
                console.log("You lost")
                LoseAudio()
            }
        }
    }
    if(gIsGameOver){
        resetTimer()
        console.log("Game is over")
        onInit()
    }
}

function onSetDifficulty(level) {
    var size = level.dataset.size
    var bombs = level.dataset.bombs
    gLevel.SIZE = size
    gLevel.BOMB = bombs
    onInit()
}

function updateLivesLeft(gLivesLeft) {
    var strLives = 'Lives: '
    for (var i = 0; i < gLivesLeft; i++) {
        strLives += HEART
    }
    elLivesLeft.innerHTML = strLives
}
