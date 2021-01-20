const p1 = {
    score: 0,
    button: document.querySelector('#p1Button'),
    display: document.querySelector('#p1Display')
};

const p2 = {
    score: 0,
    button: document.querySelector('#p2Button'),
    display: document.querySelector('#p2Display')
};



const resetButton = document.querySelector('#reset');
const winningSelect = document.querySelector('#playto')
let winningScore = 3;
let isGameOver = false;

function upDateScore(player, opponent) {
    if (!isGameOver) {
        player.score += 1
        if (player.score === winningScore) {
            isGameOver = true
            player.display.classList.add('has-text-success-dark')
            opponent.display.classList.add('has-text-danger')
            player.button.disabled = true
            opponent.button.disabled = true
        }
        player.display.textContent = player.score
    }
}

p1Button.addEventListener('click', () => {
    upDateScore(p1, p2)
})

p2Button.addEventListener('click', () => {
    upDateScore(p2, p1)
})


winningSelect.addEventListener('change', () => {
    winningScore = parseInt(winningSelect.value)
    reset()
})


resetButton.addEventListener('click', reset)

function reset() {
    isGameOver = false
    for (let p of [p1, p2]) {
        p.score = 0;
        p.display.textContent = 0;
        p.display.classList.remove('has-text-success-dark', 'has-text-danger');
        p.button.disabled = false;
    }
}

