var SERVER_URL = ""

function Client() {
  var opponent[]; // Opponent Objects
  var game; // Game Object
  var player; // Player Object

  var setTurn = function(opponentUid) {}
  var
}

function Player() {
  var name;

  var hand[]; // Card Objects
  var drawDeck[]; // Card Objects
  var discardDeck[]; // Card Objects

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
  var stacks[]; // Stack Objects
}

function Stack() {
  var cardType; // Card Object
  var qty;
}

function main() {

}
