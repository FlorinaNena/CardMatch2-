if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}


let cards = document.querySelectorAll(".card");
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedCards = [];

cards.forEach(card => card.addEventListener("click", flipCard));

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            setIntervalTimer();
        });
    });
}

const setIntervalTimer = () => {
    let timerText = document.getElementById("hp-remaining");
    let count = 100;

    setInterval(() => {
        if (count === 0) return;
        count -= 1;
        timerText.textContent = count;

        if (count === 0)
            gameOver();
    }, 1000);

}

function flipCard() {
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
    const victory = document.getElementById("victory-text");
    victory.classList.add("visible");

}

function gameOver() {
    const gameOver = document.getElementById("game-over-text");
    gameOver.classList.add("visible");

}

function checkForMatch() {
    let isMatch = firstCard.dataset.hero ===
        secondCard.dataset.hero;
    if (isMatch) {
        matchedCards.push(firstCard);
        matchedCards.push(secondCard);
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



(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 16);
        card.style.order = randomPos;
    });
})();

