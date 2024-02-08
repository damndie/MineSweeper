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
var gTimeId
var gCellsShown
var gTime
var gLivesLeft

// Models
var elBoard
var eltime = document.querySelector('.time')
var elLivesLeft = document.querySelector('.lives')
var elmine = document.querySelector('.mines')
var elresetbtn = document.querySelector('.reset-btn')
let didRightClickMounted = false

function onInit() {
    gCellsShown = 0;
    gIsGameOver = false // checks if game over
    gLivesLeft = 3 // check lives
    updateLivesLeft(gLivesLeft) // updating lives
    gBoard = buildBoard(gLevel) // building board 
    elBoard = document.querySelector('.board') // DOM connection to board
    gFirstClickedCell = null // first click no mines
    renderboard(gBoard, '.board') // rendering board with selector
    gFlagsOnBoardCount = 0 // counting how much flags
    elresetbtn.innerText = SMILE // DOM connection to SMILE EMOJI
    gMinesOnBoard = +gLevel.mines // the amount of mines each level
    elmine.innerText = gLevel.mines // DOM connection displays the amounts of mines
    gTime = 0 // restarting time upon beginning to click the first cell
    eltime.innerText = gTime // DOM connection to the timer
    resetTimer() // reset time

    if (!didRightClickMounted) {
        didRightClickMounted = true
        elBoard.addEventListener("contextmenu", (event) => {
            event.preventDefault()
            if (gIsGameOver) return

            var elCell = event.target

            cellMarked(elCell)
        })
    }
}

function buildBoard(gLevel) {
    const board = [] // creating matrix board
    const generateArr = [] // generating shuffled board each click on the cell
    //32
    for (var i = 0; i < gLevel.size ** 2; i++) {
        var cellsData = {
            minesAroundCount: 0, // Amount of mines
            isShown: false,  // if cell is shown once I pressed on the cell
            isMine: i < gMinesOnBoard, // if cell is mine
            isMarked: false, // if cell is marked
        };
        generateArr.push(cellsData) // pushing data cells inside variable
    }
    shuffleArray(generateArr) // shuffling numbers 

    while (generateArr.length) {
        board.push(generateArr.splice(0, gLevel.size))
        // shuffle using splice to display random numbers and pushing inside board
    }

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine)
                continue

            //get all non bomb negs as array
            const negs = getNegs(board, i, j)

            board[i][j].minesAroundCount = negs.length
        }
    }
    return board
}

//scan all cell and see how manny mine there are around them (if any)


/**
 * gets negs if current cell
 * @returns {[]}
 */
function getNegs(board, i, j, isBomb = true) {
    try {
        let counter = []
        if (i + 1 < board.length &&
            board[i + 1][j].isMine == isBomb)
            counter.push(board[i + 1][j])

        if (i > 0 &&
            board[i - 1][j].isMine == isBomb)
            counter.push(board[i - 1][j])

        if (j + 1 < board.length &&
            board[i][j + 1].isMine == isBomb)
            counter.push(board[i][j + 1])

        if (j > 0 &&
            board[i][j - 1].isMine == isBomb)
            counter.push(board[i][j - 1])

        if (i + 1 < board.length &&
            j + 1 < board.length &&
            board[i + 1][j + 1].isMine == isBomb)
            counter.push(board[i + 1][j + 1])

        if (i + 1 < board.length &&
            j > 0 &&
            board[i + 1][j - 1].isMine == isBomb)
            counter.push(board[i + 1][j - 1])

        if (i > 0 &&
            j + 1 < board.length &&
            board[i - 1][j + 1].isMine == isBomb)
            counter.push(board[i - 1][j + 1])

        if (i > 0 &&
            j > 0 &&
            board[i - 1][j - 1].isMine == isBomb)
            counter.push(board[i - 1][j - 1])
        return counter
    }
    catch (e) {
        throw `${i} ${j}`
    }
}


function renderboard(board, selector) {
    var strHTML = '' // creating empty string
    for (var i = 0; i < board.length; i++) { // row

        strHTML += '<tr>\n'

        for (var j = 0; j < board[i].length; j++) { // col
            const currCell = board[i][j];
            if (!currCell.isMine) {
                // if not mine calculate the number of mines next to the current cell
                currCell.minesAroundCount = setMinesNegsCount(i, j, board)
            }

            let cellContent = "",
                cellClass = "";
            if (currCell.isMarked) {
                cellClass = "marked"
                cellContent = FLAG
            }

            if (currCell.isShown) {
                cellClass = "checked"
                if (currCell.isMine)
                    cellContent = BOMB
                else
                    cellContent = currCell.minesAroundCount || "";
            }

            strHTML += `
                \t<td
                    class="cell ${cellClass}"
                    data-i="${i}" 
                    data-j="${j}" 
                    onclick="cellClicked(this,${i}, ${j})"
                    >
                    ${cellContent}
                </td>\n
            `
        }
        strHTML += '</tr>\n'
    }
    var elTable = document.querySelector(selector) // dynamic selector connected to DOM
    elTable.innerHTML = strHTML // updating DOM to the table to display board
}



function setMinesNegsCount(cellI, cellJ, board) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {

        if (i < 0 || i >= board.length) continue
        // checks if the loop is not deviating the board length

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (i === cellI && j === cellJ) continue
            // checks if we are in the same cell
            if (j < 0 || j >= board[i].length) continue
            // checks if the loop is not deviating the board length
            if (board[i][j].isMine) neighborsCount++
            // checks if there is a mine and counting the negs

        }
    }
    return neighborsCount
}


function checkGameOver(isOnMine) {
    if (!isOnMine) {
        checkFlaggedMines()
    } else {
        handleMineHit()
    }

    console.log(gBoard.length * gBoard[0].length - gCellsShown, gMinesOnBoard)
    if (gBoard.length * gBoard[0].length - gCellsShown === gMinesOnBoard) {
        gIsGameOver = true
        elresetbtn.innerText = WIN
        WinAudio()
    }

    if (gIsGameOver) {
        resetTimer()
    }
}

function checkFlaggedMines() {
    var flaggedMinesCount = countFlaggedMines();
    if (flaggedMinesCount === gMinesOnBoard && gMinesOnBoard === gFlagsOnBoardCount) {
        // checks if user identified all of the board numbers and the mines 
        gIsGameOver = true
        elresetbtn.innerText = WIN
        WinAudio()
    }
}

function countFlaggedMines() {
    var flaggedMinesCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
                flaggedMinesCount++
            }
        }
    }
    return flaggedMinesCount
}

function handleMineHit() {
    gLivesLeft--
    BombAudio()
    updateLivesLeft(gLivesLeft)
    var elLivesLeft = document.querySelector('.lives')
    var strLives = ''
    for (var i = 0; i < gLivesLeft; i++) {
        strLives += HEART
    }
    elLivesLeft.innerText = strLives

    if (gLivesLeft === 0) {
        revealMinesAndEndGame()
    }
}

function revealMinesAndEndGame() {
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
    LoseAudio()
}



function updateLivesLeft(gLivesLeft) {
    var strLives = ''
    for (var i = 0; i < gLivesLeft; i++) {
        strLives += HEART
    }
    elLivesLeft.innerHTML = strLives
}
