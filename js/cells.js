'use strict'

function onCellClicked(elCell, i, j){
    var elCellI = elCell.dataset.i
    var elCellJ = elCell.dataset.j

    if(!gFirstClickedCell){
        gFirstClickedCell = {i:elCellI , j:elCellJ}
        if(gBoard[gFirstClickedCell.i][gFirstClickedCell.j].isMine){
            startTimer()
            replaceMineLocation(gFirstClickedCell, gBoard)
        }
    }
    if (gIsGameOver) return

    if (!gTimeId) {
        gTimeId = setInterval(() => {
            gTime++
            elTime.innerText = gTime
        }, 1000)
    }
    
    if (gBoard[elCellI][elCellJ].isShown === true || gBoard[elCellI][elCellJ].isMarked === true) return

    if (gBoard[elCellI][elCellJ].isMine === true) {
        gBoard[elCellI][elCellJ].isShown = true
        elCell.innerText = BOMB
        checkGameOver(gBoard[elCellI][elCellJ].isMine)
        return
    }

    if (gBoard[elCellI][elCellJ].minesAroundCount !== 0) {
        // Update Model
        gBoard[elCellI][elCellJ].isShown = true
        // Update DOM
        elCell.classList.add(`checked`)
        elCell.classList.add(`color-${gBoard[elCellI][elCellJ].minesAroundCount}`)
        elCell.innerText = gBoard[elCellI][elCellJ].minesAroundCount
        return
    }
    if (gBoard[elCellI][elCellJ].minesAroundCount === 0) {
        gBoard[elCellI][elCellJ].isShown = true
        elCell.classList.add('checked')
        elCell.innerText = ' '
        expandShown(gBoard, elCell)
    }
    return
}

function onCellMarked(elCell){
    var elCellI = elCell.dataset.i
    var elCellJ = elCell.dataset.j

    if (gBoard[elCellI][elCellJ].isShown) return
    // Model
    gBoard[elCellI][elCellJ].isMarked = !gBoard[elCellI][elCellJ].isMarked
    gBoard[elCellI][elCellJ].isMarked ? gFlagsOnBoardCount++ : gFlagsOnBoardCount--
    // DOM
    elCell.innerText = gBoard[elCellI][elCellJ].isMarked ? FLAG : ""
    elCell.classList.toggle('marked')

    var minesOnBoardCount = +elMinesOnBoard.textContent
    elMinesOnBoard.innerText = gBoard[elCellI][elCellJ].isMarked ? minesOnBoardCount - 1 : minesOnBoardCount + 1

    checkGameOver()
}

function expandShown(board, elCell){
     // get coords
     var cellI = elCell.dataset.i
     var cellJ = elCell.dataset.j
     // go through all neigbors and run cellClicked recursivley if the neigbor is not a mine

     for (var i = cellI - 1; i <= cellI + 1; i++) {

         if (i < 0 || i >= board.length) continue

         for (var j = cellJ - 1; j <= cellJ + 1; j++) {

             if (i === cellI && j === cellJ) continue
             if (j < 0 || j >= board[i].length) continue
             var elCell = document.querySelector(`[data-i = '${i}'][data-j = '${j}']`)
             if (!board[i][j].isMine && board[i][j].minesAroundCount <= 3) onCellClicked(elCell)
         }
     }
}

function replaceMineLocation(location, board){
    // coords
    var coordI = location.i
    var coordJ = location.j
    // looping 
    for (var i = coordI - 1; i <= coordI + 1; i++) {
        
        if (i < 0 || i >= board.length) continue // 

        for (var j = coordJ - 1; j <= coordJ + 1; j++) {

            if (i === coordI && j === coordJ) continue
            if (j < 0 || j >= board[i].length) continue
            var tempCell = gBoard[coordI][coordJ]
            if (!board[i][j].isMine) {
                gBoard[coordI][coordJ] = board[i][j]
                board[i][j] = tempCell
            }
        }
    }
}

