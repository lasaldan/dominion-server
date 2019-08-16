
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var Game = require('./game')
var CardData = require('./gamedata')
var Player = require('./player')

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

server.games = []

var Game = function(name) {
  this.id = 0
  this.players = []
  this.name = name
  this.startedAt = ""
  this.currentPlayerId = 0
  this.active = true
}

server.addNewGame = function(name) {
  var g = new Game(name)
  g.id = Math.random().toString(36).substring(7)
  server.games.push( g )
}

var Player = function(name) {
  this.playerUid;
  this.opponentUid;
  this.name = name;
  this.hand; // Card Objects
  this.drawDeck; // Card Objects
  this.discardDeck; // Card Objects

  this.actionsRemaining;
  this.buysRemaining;
  this.goldRemaining;
}

// server.addNewGame("default")
// server.addNewGame("test")
// server.addNewGame("thing")

io.on('connection',function(socket){
  socket.on('createGame', function() {
    console.log("CREATING GAME!")
  })
  socket.on('playerConnected',function(name){

    socket.player = new Player(name)

    // server.game.data.players[socket.id] = socket.player

    // socket.emit('welcomePlayer', socket.player)
    // socket.emit('universe',getUniverse());
    // socket.broadcast.emit('playerConnected',socket.player);

    server.log("Player Joined: "+socket.id + " ("+name+")")
    socket.on('gameList', function() {
      var activeGames = server.games.filter(a => a.active)
      socket.emit('gameList', server.games.map(g => { return {name: g.name, id: g.id, players: g.players.length, startedAt: g.startedAt}}));
    })

    // socket.on('fire', function(sequence) {
    //   server.inputBuffer.push( new Input(socket.id, "fire", [], sequence) )
    // })
    //
    // socket.on('thrust', function(sequence) {
    //   server.inputBuffer.push( new Input(socket.id, "thrust", [], sequence) )
    // })
    //
    // socket.on('reverse', function(sequence) {
    //   server.inputBuffer.push( new Input(socket.id, "reverse", [], sequence) )
    // })
    //
    // socket.on('rotateRight', function(sequence) {
    //   server.inputBuffer.push( new Input(socket.id, "rotateRight", [], sequence) )
    // })
    //
    // socket.on('rotateLeft', function(sequence) {
    //   server.inputBuffer.push( new Input(socket.id, "rotateLeft", [500], sequence) )
    // })
    //
    // socket.on('disconnect',function(){
    //   delete server.game.data.players[socket.id]
    //   io.emit('playerDisconnected',socket.id);
    //   server.log("Player Disconnected: "+socket.id)
    // });

  });
});

server.log = function(msg) {
  var timestamp = new Date()
  console.log(timestamp.toDateString() + " " + timestamp.toTimeString() + "   " + msg)
}

server.listen(8081,function(){ // Listens to port 8081
  server.log('Listening on '+server.address().port);
});




function Server() {
  var players; // Player Objects
  var currentPlayerId;

  var playCard = function(cardUid) {}
  var endTurn = function(playerUid) {}
}

function Player() {
  var playerUid;
  var opponentUid;
  var name;
  var hand; // Card Objects
  var drawDeck; // Card Objects
  var discardDeck; // Card Objects

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
  var stacks; // Stack Objects
}

function Stack() {
  var cardType; // Card Object
  var qty;
}

function main() {

}

/*

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var PhysD = require('../physics/physd')
var GameData = require('./gamedata')

var ServerPlayer = require('./player')

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

function Game() {
  return {
    data: {
      name: "Serenity",
      players: {},
      asteroids: [],
      stations: [],
      background: "bg1.jpg"
    },
    lastProcessedInput: {}
  }
}

server.game = new Game()

server.log = function(msg) {
  var timestamp = new Date()
  console.log(timestamp.toDateString() + " " + timestamp.toTimeString() + "   " + msg)
}

server.inputBuffer = []
server.lastHandledInput = {}
server.processInputs = function() {
  // Process all pending messages from clients.
  // expects input:
  // {
  //   playerId: "249jlaslkj34r_324jk",
  //   method: "thrust",
  //   params: [400],
  //   sequenceNumber: 43
  // }
  if (server.inputBuffer.length)
    console.log("STEP-------")
  while (true) {

    var input = server.inputBuffer.shift();
    if (!input) {
      break;
    }
    if (server.inputBuffer.length)
      console.log(input)

    var player = server.game.data.players[input.playerId];
    player[input.method].apply(player, input.params);
    server.lastHandledInput[input.playerId] = input.sequence_number;
  }
}

PhysD.lib.initializeSim()
server.step = function() {
  server.processInputs()
  PhysD.lib.stepSim()
  broadcastUniverse()
}
setInterval(server.step, 1000/30)

Input = function(id, method, params, sequenceNumber) {
  return {
    playerId: id,
    method: method,
    params: params,
    sequenceNumber: sequenceNumber
  }
}

io.on('connection',function(socket){
  socket.on('playerConnected',function(){

    socket.player = new ServerPlayer(socket.id, PhysD.lib)

    server.game.data.players[socket.id] = socket.player

    socket.emit('welcomePlayer', socket.player)
    socket.emit('universe',getUniverse());
    socket.broadcast.emit('playerConnected',socket.player);

    server.log("Player Joined: "+socket.id)

    socket.on('fire', function(sequence) {
      server.inputBuffer.push( new Input(socket.id, "fire", [], sequence) )
    })

    socket.on('thrust', function(sequence) {
      server.inputBuffer.push( new Input(socket.id, "thrust", [], sequence) )
    })

    socket.on('reverse', function(sequence) {
      server.inputBuffer.push( new Input(socket.id, "reverse", [], sequence) )
    })

    socket.on('rotateRight', function(sequence) {
      server.inputBuffer.push( new Input(socket.id, "rotateRight", [], sequence) )
    })

    socket.on('rotateLeft', function(sequence) {
      server.inputBuffer.push( new Input(socket.id, "rotateLeft", [500], sequence) )
    })

    socket.on('disconnect',function(){
      delete server.game.data.players[socket.id]
      io.emit('playerDisconnected',socket.id);
      server.log("Player Disconnected: "+socket.id)
    });

  });
});

function transportBody(body) {
  return {
    x: body.x,
    y: body.y,
    rotation: body.rotation,
    velocity: body.velocity,
    acceleration: body.acceleration
  }
}

function broadcastUniverse() {
  io.emit("universe", getUniverse())
}
function getUniverse() {
  return server.game
}

function getAllPlayers(){
  return server.game.players
  // var players = [];
  // Object.keys(io.sockets.connected).forEach(function(socketID){
  //   var player = io.sockets.connected[socketID].player;
  //   if(player) players.push(player);
  // });
  // return players;
}

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

server.listen(8081,function(){ // Listens to port 8081
  server.log('Listening on '+server.address().port);
});
*/
