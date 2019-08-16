var SERVER_URL = "http://localhost:8081"

var GameDOM = function() {
  this.defaultState = "login"

  this.setState = function(state) {
    document.body.className = ""
    document.body.classList.add(state)
  }

  this.updateGamesList = function(games) {
    var gamesWrapper = document.getElementById("games")
    if(games.length)
      gamesWrapper.innerHTML = ""
    else
      gamesWrapper.innerHTML = "<p>No Active Games</p>"

    games.forEach(function(game) {
      var gameEntry = document.createElement("div")
      var gameName = document.createElement("span")
      gameName.innerHTML = game.name
      var gameId = document.createElement("span")
      gameId.classList.add("hidden")
      gameId.innerHTML = game.id
      var gamePlayerCount = document.createElement("span")
      gamePlayerCount.innerHTML = game.players
      var gameStartedAt = document.createElement("span")
      gameStartedAt.innerHTML = game.startedAt
      gameEntry.appendChild(gameName)
      gameEntry.appendChild(gamePlayerCount)
      gameEntry.appendChild(gameStartedAt)
      gameEntry.appendChild(gameId)
      gamesWrapper.append(gameEntry)
    })
  }
}

var Server = function(options) {

  this.socket = io.connect(SERVER_URL);

  this.join = function(name) {
    this.socket.emit('playerConnected', name);
    this.socket.emit("gameList")
    game.setState("gameList")
  };

  this.socket.on('gameList', function(data) {
    game.updateGamesList(data)
  })
}

var server = new Server()
var game = new GameDOM()

function Client() {
  var opponent; // Opponent Objects
  var game; // Game Object
  var player; // Player Object

  var setTurn = function(opponentUid) {}
}

function Player() {
  var name;

  var hand; // Card Objects
  var drawDeck; // Card Objects
  var discardDeck; // Card Objects

  var actionsRemaining;
  var buysRemaining;
  var goldRemaining;
}

function Opponent() {
  var opponentUid; // Fake Player UID
  var name;
  var actionsRemaining;
  var buysRemaining;
  var goldRemaining;
}

function Card() {
  var name;
  var description;
  var image;
}

function Market() {
  var stacks; // Stack Objects
}

function Stack() {
  var cardType; // Card Object
  var qty;
}

function main() {

}
