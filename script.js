// css class for different card image
const CARD_TECHS = [
  'html5',
  'css3',
  'js',
  'sass',
  'nodejs',
  'react',
  'linkedin',
  'heroku',
  'github',
  'aws'
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  level: 1,
  gameOver: true,
  preSelected: null,
  checkMatching: false,
  totalCards: 0,
  clearedCards: 0,
  gameBoard: null,
  timer: 60,
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,
  // and much more
};

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
  // register any element in your game object
  game.timerDisplay = document.querySelector('.game-timer__bar');
  game.scoreDisplay = document.querySelector('.game-stats__score--value');
  game.levelDisplay = document.querySelector('.game-stats__level--value');
  game.startButton = document.querySelector('.game-stats__button');
  game.gameBoard = document.querySelector('.game-board')
  //game. = document.querySelector('');
  bindStartButton();
}

function startGame() {
  clearGameBoard();
  game.startButton.innerHTML = 'End Game';
  //init game
  game.checkMatching = false;
  game.clearedCards = 0;
  game.level = 1;
  game.gameOver = false;
  game.score = 0;
  game.preSelected = null;
  game.totalCards = 0;
  game.clearedCards = 0;
  generateCards();
  bindCardClick();
  game.levelDisplay.innerHTML = game.level;
  game.scoreDisplay.innerHTML = game.score;
  startTimer();

}

function handleCardFlip() {
  if (game.checkMatching || game.gameOver) {
    return;
  }

  const currentSelected = this;

  if (currentSelected === game.preSelected) {
    currentSelected.classList.remove('card--flipped');
    game.preSelected = null;
    return;
  }
  currentSelected.classList.add('card--flipped');
  if (game.preSelected) {
    checkCardMatching(currentSelected, game.preSelected);
    return;
  }
  game.preSelected = currentSelected;
}

function checkCardMatching(card1, card2) {
    // find the matched cards
  if (card1.dataset.tech === card2.dataset.tech) {
    unBindCardClick(card1);
    unBindCardClick(card2);
    game.preSelected = null;
    game.clearedCards += 2;
    updateScore();
    if (game.clearedCards === game.totalCards){
      stopTimer();
      setTimeout(() => nextLevel(), 1500);
    }
  } else {
    console.log("Not matched");
    game.checkMatching = true;
    setTimeout(() => {
      card1.classList.remove('card--flipped');
      card2.classList.remove('card--flipped');
      game.preSelected = null;
      game.checkMatching = false;
    }, 1000)
  }

}

function nextLevel() {
  // level 1: 2x2 level 2: 4x4 level 3: 6x6
  if (game.level === 3) {
    handleGameOver();
    return;
  }
  clearGameBoard();
  
  game.level++;
  game.levelDisplay.innerHTML = game.level;
  game.clearedCards = 0;
  game.totalCards = 0;

  generateCards();
  bindCardClick();
  startTimer();
}

function handleGameOver() {
  game.startButton.innerHTML = 'Start Game';
  clearInterval(game.timerInterval);
  game.gameOver = true;
  alert('Congratulations, your score is ' + game.score);
}

/*******************************************
/     UI update
/******************************************/
function updateScore() {
  const score = game.level * game.level * game.timer;
  game.score += score;
  game.scoreDisplay.innerHTML = game.score;
}

function updateTimerDisplay() {
  game.timerDisplay.innerHTML = `${game.timer}s`;
  const percentage = (game.timer /60) * 100;
  game.timerDisplay.style.width = percentage + '%';
}

function clearGameBoard() {
  const {gameBoard} = game; // have no idea what is this
  while (gameBoard.firstChild) {
    //clear clicking handler
    gameBoard.firstChild.removeEventListener('click', handleCardFlip);
    //remove instruction
    gameBoard.removeChild(gameBoard.firstChild);
  }
}

function stopTimer() {
  clearInterval(game.timerInterval);
  game.timerInterval = null;
}

function startTimer() {
  if (game.timerInterval) {
    stopTimer();
  }
  game.timer = 60;
  game.timerInterval = setInterval(() => {
    game.timer--;
    updateTimerDisplay();
    if (game.timer === 0) {
      handleGameOver();
    }
  }, 1000)
}

function generateCards(level) {
  const gameBoard = game.gameBoard;
  const gameSize = game.level * 2;
  const totalCards = gameSize * gameSize;
  game.totalCards = totalCards;
  gameBoard.style['grid-template-columns'] = '1fr '.repeat(gameSize);
  const cards = [];
  for (let i = 0; i < totalCards/2; i++) {
    const tech = CARD_TECHS[i % CARD_TECHS.length];
    const card = createCardElement(tech);
    cards.push(card);
    cards.unshift(card.cloneNode(true));
  }
  while (cards.length > 0) {
    const index = Math.floor(Math.random() * cards.length);
    const card = cards.splice(index, 1)[0];
    gameBoard.appendChild(card); 
  }
}

function createCardElement(tech) {
    /* <div class="card css3" data-tech="css3">
        <div class="card__face card__face--front"></div>
        <div class="card__face card__face--back"></div>
      </div> */
  const node = document.createElement('div');
  const cardFront = document.createElement('div');
  const cardBack = document.createElement('div');

  node.classList.add('card', tech);
  node.dataset.tech = tech;
  cardFront.classList.add('card__face', 'card__face--front');
  cardBack.classList.add('card__face', 'card__face--back');

  node.appendChild(cardFront);
  node.appendChild(cardBack);
  return node;
}

function updateLevel() {

}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
  game.startButton.addEventListener('click', () => {
    if (game.gameOver) {
      startGame();
    } else {
      handleGameOver();
    }
  });
}

function unBindCardClick(card) {
  card.removeEventListener('click', handleCardFlip);
}

function bindCardClick() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', handleCardFlip);
  })
}

