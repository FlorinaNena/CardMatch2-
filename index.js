let cards = document.querySelectorAll(".card");
const hpTrack = document.querySelector('.hp-track');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedCards = [];

let intervalId = null;

const numOfTries = 12;
let numOfFailedFlips = 0;

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

cards.forEach(card => card.addEventListener("click", flipCard));

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    // debugger;
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            if(intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
            resetBoard();
            resetGameState();
            setIntervalTimer();
        });
    });
}

const setIntervalTimer = () => {
    let timerText = document.getElementById("hp-remaining");
    let count = 100;

    intervalId = setInterval(() => {
        if (count === 0) return;
        count -= 1;
        timerText.textContent = count;

        if (count === 0)
            gameOver();
    }, 1000);

}

function flipCard() {
    debugger;
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flip");

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;

    checkForMatch();

    if (matchedCards.length === cards.length)
        victory();

}


function victory() {
    if(intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    const victory = document.getElementById("victory-text");
    victory.classList.add("visible");

}

function gameOver() {
    const gameOver = document.getElementById("game-over-text");
    gameOver.classList.add("visible");

}

function checkForMatch() {
    debugger;
    let isMatch = firstCard.dataset.hero ===
        secondCard.dataset.hero;
    let triedOut = false;
    if (isMatch) {
        matchedCards.push(firstCard);
        matchedCards.push(secondCard);
    } else {
      numOfFailedFlips += 1;
      const trackScale = 1 - (numOfFailedFlips / numOfTries);
      debugger;
      hpTrack.style.transform = `scaleX(${trackScale})`;
      triedOut = numOfFailedFlips === numOfTries;
    }

    if(triedOut) {
      gameOver();
      return;
    }

    isMatch ? disableCards() : unflipCards()
}


function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    resetBoard();
}


function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        resetBoard();
    }, 1000);
}


function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


function resetGameState() {
  resetBoard();
  const gameContainer = document.querySelector('.game-container');
  numOfFailedFlips = 0;
  hpTrack.style.transform = 'scaleX(1)';
  [...gameContainer.children].forEach((card) => {
    card.classList.remove('flip');
    card.classList.remove('matched');
    matchedCards = [];
    card.addEventListener('click', flipCard);
    let randomPos = Math.floor(Math.random() * 16);
    card.style.order = randomPos;
  });
}