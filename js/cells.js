'use strict'


function cellClicked(elCell) {
    if (gLivesLeft <= 0 || gIsGameOver)
        return;
    
    //start the timer if not allready
    if (!gTimeId) {
        gTimeId = setInterval(() => {
            gTime++
            eltime.innerText = gTime
        }, 1000)
    }

    //getting current cell  that got clicked
    const i = elCell.dataset.i,
        j = elCell.dataset.j;
    const cell = gBoard[i][j];

    if (cell.isMarked || cell.isShown)
        return;

    if (!gFirstClickedCell) {
        gFirstClickedCell = cell;
        if (cell.isMine) {
            cell.isMine = false;
            replaceMineLocation([i, j], gBoard)
        }
    }
    cell.isShown = true;
    if (!cell.isMine) {
        expandShown(cell, ~~i, ~~j)
        gCellsShown++;
    }

    checkGameOver(cell.isMine)


    renderboard(gBoard, '.board');

}

function cellMarked(elCell) {
    const i = elCell.dataset.i,
        j = elCell.dataset.j;
    const cell = gBoard[i][j];

    if (cell.isMarked) {
        cell.isMarked = false;
        gFlagsOnBoardCount--;
    }
    else {
        cell.isMarked = true;
        gFlagsOnBoardCount++;
    }

    renderboard(gBoard, '.board');

    checkGameOver(false)
}

function expandShown(elcell, i, j) {
    const negs = getNegs(gBoard, i, j,false);
    for (let i = 0; i < negs.length; i++) {
        if (negs[i].isShown)
            continue;

        negs[i].isShown = true;
        gCellsShown++;
    }
}

function replaceMineLocation(location, board) {
    let didReplacment = false
    for (var i = 0; i < board.length && !didReplacment; i++) {
        for (var j = 0; j <= board[i].length && !didReplacment; j++) {
            const currCell = board[i][j];
            //if its the same location as the one that just clicked -ignore it
            if (i === location[0] && j === location[1])
                continue;

            if (!currCell.isMine) {
                currCell.isMine = true;
                const negs = getNegs(gBoard, i, j, false);
                negs.forEach(c => c.minesAroundCount++);
                didReplacment = true;
            }
        }
    }
}




