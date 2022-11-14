// A section for the choice objects.
function Choice(name, killers) {
  this.name = name;
  this.killers = killers;
}

Choice.prototype.losesTo = function(choice) {
  return this.killers.includes(choice.name);
};
Choice.prototype.getName = function() {
  return this.name;
};

// A section for the player object
function Player(name) {
  this.name = name;
  this.score = 0;
  this.choice = null;
}

Player.prototype.scorePoint = function() {
  this.score += 1;
};

Player.prototype.chooseChoice = function(choice) {
  this.choice = choice;
};

Player.prototype.randomChoice = function(choices) {
  this.choice = choices[Math.floor(Math.random() * choices.length)];
};

// A section for gameObject
function Game(human, computer, choices) {
  this.choices = choices;
  this.rounds = 0;
  this.winner = null;
  this.human = human;
  this.computer = computer;
}

Game.prototype.playRound = function() {
  this.computer.randomChoice(this.choices);
  this.human.randomChoice(this.choices);


  if (this.computer.choice == this.human.choice) {
    this.winner = 'draw';
  } else if (this.checkIfPlayerWon(this.human, this.computer)) {
    this.winner = this.human;
  } else if (this.checkIfPlayerWon(this.computer, this.human)) {
    this.winner = this.computer;
  } else {
    console.warn({ computer: this.computer.choice, human: this.human.choice });
  }

  if (this.winner != null && this.winner != 'draw') {
    this.winner.scorePoint();
  }
};

Game.prototype.getWinner = function() {
  if (this.winner != null) {
    if (this.winner == 'draw') {
      return 'draw';
    } else {
      return this.winner.name;
    }
  }
};

Game.prototype.playRounds = function(x, delay, roundCallBack, endGameCallBack) {
  let i = x;
  const game = this;
  const interval = setInterval(function() {
    if (i > 0) {
      game.playRound();
      roundCallBack();
      i--;
    } else {
      clearInterval(interval);
      endGameCallBack(x);
    }
  }, delay);
};

Game.prototype.checkIfPlayerWon = function(player, other) {
  return other.choice.losesTo(player.choice);
};

// DOM manipulation functions Please ignore the mess, it's not gonna stick around ;)
function endGameCallBack(x) {
  const humanScore = game.human.score;
  const computerScore = game.computer.score;
  const draws = x - (humanScore + computerScore);
  console.log(
    `stats:\n${game.human.name} : ${humanScore}\n${game.computer.name} : ${computerScore}\nDraws : ${draws}`
  );
  document.getElementById('win').innerText = `stats:\n${game.human.name} : ${humanScore}\n${game.computer.name} : ${computerScore}\nDraws : ${draws}`
}
function roundCallBack() {
  const choiceString = game.human.choice.losesTo(game.computer.choice)
    ? `${game.computer.choice.name} beats ${game.human.choice.name}`
    : `${game.human.choice.name} beats ${game.computer.choice.name}`;
  console.log(
    `-------------------------\n${game.getWinner()} won the round\n${choiceString}\n-------------------------\n`
  );
  document.getElementById('playByplay').innerHTML += `${choiceString}<br>`;
}

// initialize and start

// choices and their killers
const choices = [
  new Choice('rock', ['paper', 'air', 'water', 'devil', 'gun']),
  new Choice('fire', ['air', 'water', 'devil', 'gun', 'rock']),
  new Choice('scissors', ['water', 'devil', 'gun', 'rock', 'fire']),
  new Choice('human', ['devil', 'gun', 'rock', 'fire', 'scissors']),
  new Choice('wolf', ['gun', 'rock', 'fire', 'scissors', 'human']),
  new Choice('sponge', ['rock', 'fire', 'scissors', 'human', 'wolf']),
  new Choice('paper', ['fire', 'scissors', 'human', 'wolf', 'sponge']),
  new Choice('air', ['scissors', 'human', 'wolf', 'sponge', 'paper']),
  new Choice('water', ['human', 'wolf', 'sponge', 'paper', 'air']),
  new Choice('devil', ['wolf', 'sponge', 'paper', 'air', 'water']),
  new Choice('gun', ['sponge', 'paper', 'air', 'water', 'devil']),
];

const computer1 = new Player('AI Bob');
const computer2 = new Player('AI Sally');
const game = new Game(computer1, computer2, choices);


function start() {
  computer1.score = 0;
  computer2.score = 0;

  document.getElementById('playByplay').innerHTML = '';
  document.getElementById('win').innerText = '';
  const ms = document.getElementById('ms').value;
  const count = document.getElementById('count').value;

  game.playRounds(count, ms, roundCallBack, endGameCallBack)
}
