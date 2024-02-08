'use strict'

// Consts

const LOSE = '😒'
const WIN = '😎'
const BOMB = '💣'
const FLAG = '🚩'
const HEART = '❤️'
const SMILE = '😀'
const gLevel = {
    size: 4, mines: 2
}

// Global variables

var gIsGameOver
var gBoard
var gFirstClickedCell
var gMinesOnBoard
var gFlagsOnBoardCount
var gGame
var gTimeId
var gTime
var gLivesLeft

// Models
var elBoard
var eltime = document.querySelector('.time')
var elLivesLeft = document.querySelector('.lives')
var elmine = document.querySelector('.mines')
var elresetbtn = document.querySelector('.reset-btn')


function onInit() {
    gIsGameOver = false
    gLivesLeft = 3
    updateLivesLeft(gLivesLeft)
    gBoard = buildBoard(gLevel)
    elBoard = document.querySelector('.board')
    gFirstClickedCell = null
    renderboard(gBoard, '.board')
    gFlagsOnBoardCount = 0
    elresetbtn.innerText = SMILE
    gMinesOnBoard = +gLevel.mines
    elmine.innerText = gLevel.mines
    gTime = 0
    eltime.innerText = gTime
    resetTimer()
}

function buildBoard(gLevel) {
    const board = []
    const genArr = []
    for (var i = 0; i < gLevel.size ** 2; i++) {
        var cellsData = {
            minesAroundCount: 0,
            isShown: false,
            isMine: false,
            isMarked: false,
        };
        genArr.push(cellsData)
    }
    shuffleArray(genArr)

    while (genArr.length) {
        board.push(genArr.splice(0, gLevel.size))
    }
    return board
}



function renderboard(board, selector) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>\n'

        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = setMinesNegsCount(i, j, board)
            }
            strHTML += `
                \t<td 
                    class="cell"
                    data-i="${i}" 
                    data-j="${j}" 
                    onclick="cellClicked(this,${i}, ${j})"
                    >
                </td>\n
            `
        }
        strHTML += '</tr>\n'
    }
    var elTable = document.querySelector(selector)
    elTable.innerHTML = strHTML
}



function setMinesNegsCount(cellI, cellJ, board) {
    var neighborsCount = 0
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
                if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
                    flaggedMinesCount++
                }
            }
        }
        if (flaggedMinesCount === gMinesOnBoard && gMinesOnBoard === gFlagsOnBoardCount) {
            gIsGameOver = true
            elresetbtn.innerText = WIN
        }
    } else {
        gLivesLeft--
        updateLivesLeft(gLivesLeft)
        var elLivesLeft = document.querySelector('.lives')
        var strLives = ''
        for (var i = 0; i < gLivesLeft; i++) {
            strLives += HEART
        }
        elLivesLeft.innerText = strLives

        if (gLivesLeft === 0) {
            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard[i].length; j++) {
                    if (gBoard[i][j].isMine) {
                        gBoard[i][j].isShown = true
                        var elCell = document.querySelector(`[data-i = '${i}'][data-j = '${j}']`)
                        elCell.classList.add('mine')
                        elCell.innerText = BOMB
                    }
                }
            }
            gIsGameOver = true
            elresetbtn.innerText = LOSE
        }
    }
    if (gIsGameOver) {
        resetTimer()
    }
}


function onSetDifficulty(level) {
    var size = level.dataset.size
    var mines = level.dataset.mines
    gLevel.size = size
    gLevel.mines = mines
    onInit()
}

function updateLivesLeft(gLivesLeft) {
    var strLives = ''
    for (var i = 0; i < gLivesLeft; i++) {
        strLives += HEART
    }
    elLivesLeft.innerHTML = strLives
}
