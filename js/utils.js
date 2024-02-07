'use strict'
let gTimerInterval;
let startTime;

function startTimer() {
    if (gTimerInterval) clearInterval(gTimerInterval)
    startTime = Date.now() // Set start time

    gTimerInterval = setInterval(() => {
        const timeDiff = Date.now() - startTime
        const seconds = getFormatSeconds(timeDiff)
        const milliSeconds = getFormatMilliSeconds(timeDiff)

        document.querySelector('span.seconds').innerText = seconds
        document.querySelector('span.milli-seconds').innerText = milliSeconds
    }, 10);
}

function getFormatSeconds(timeDiff) {
    const seconds = Math.floor(timeDiff / 1000)
    return (seconds + '').padStart(2, '0')
}

function getFormatMilliSeconds(timeDiff) {
    const milliSeconds = timeDiff % 1000
    return (milliSeconds + '').padStart(3, '0')
}



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

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
