
function Server() {
  var players[]; // Player Objects
  var currentPlayerId;

  var playCard = function(cardUid) {}
  var endTurn = function(playerUid) {}
}

function Player() {
  var playerUid;
  var opponentUid;
  var name;
  var hand[]; // Card Objects
  var drawDeck[]; // Card Objects
  var discardDeck[]; // Card Objects

  var actionsRemaining;
  var buysRemaining;
  var goldRemaining;
}

function Card() {
  var cardUid;
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
