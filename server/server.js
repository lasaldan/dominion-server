
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var atob = require('atob');

var Game = require('./game')
var GameData = require('./gamedata')
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
  this.joinable = true
  this.state = "pregame"
  this.market = []
  this.chat = []
}

server.anonymizedGameDataFor = function(gameId, socketPlayer) {
  var data = JSON.parse(JSON.stringify( server.games.find(function(e){return e.id == gameId}) ))
  data.players.forEach(function(player) {
    if(player.playerUid != socketPlayer.playerUid) {
      player.hand = player.hand.length;
      player.me = false;
      player.playerUid = null;
      player.socketId = null;
    }
    else {
      player.me = true;
    }

    player.discardDeckCount = player.discardDeck.length;
    player.drawDeck = player.drawDeck.length;
    player.discardDeck = player.discardDeck.pop();
  })
  return data
}

server.addNewGame = function(name) {
  var g = new Game(name)
  g.id = Math.random().toString(36).substring(7)
  g.market.push(GameData.Cards.find(c => c.id == "card_village"))
  g.market.push(GameData.Cards.find(c => c.id == "card_smithy"))
  g.market.push(GameData.Cards.find(c => c.id == "card_gardens"))
  g.market.push(GameData.Cards.find(c => c.id == "card_festival"))
  g.market.push(GameData.Cards.find(c => c.id == "card_laboratory"))
  g.market.push(GameData.Cards.find(c => c.id == "card_market"))
  g.market.push(GameData.Cards.find(c => c.id == "card_woodcutter"))
  g.market.push(GameData.Cards.find(c => c.id == "card_mine"))
  g.market.push(GameData.Cards.find(c => c.id == "card_council_room"))
  g.market.push(GameData.Cards.find(c => c.id == "card_workshop"))
  server.games.push( g )
  return g
}

server.joinGame = function(game, player) {
  if(game.state == "pregame") {
    var i = 0;
    while(i++ < 7)
      player.drawDeck.push(GameData.Cards.find(c => c.id == "card_copper"))
    while(i++ < 11)
      player.drawDeck.push(GameData.Cards.find(c => c.id == "card_estate"))
  }
  PlayerUtils.shuffle(player.drawDeck)
  PlayerUtils.drawHand(player)
  game.players.push(player)
}

server.rejoinGame = function(game, player) {

}

server.startGame = function(game) {
  game.state = "playing"
  game.currentPlayerId = game.players[ parseInt( Math.random() * game.players.length ) ].playerUid
  game.startedAt = new Date()
  game.joinable = false
}

var Player = function(name) {
  this.socketId;
  this.playerUid = Math.random().toString(36).substring(7);
  this.opponentUid = Math.random().toString(36).substring(7);
  this.name = name;
  this.hand = []; // Card Objects
  this.drawDeck = []; // Card Objects
  this.discardDeck = []; // Card Objects

  this.actionsRemaining = 0;
  this.buysRemaining = 0;
  this.goldRemaining = 0;
  this.me = false;
}

var PlayerUtils = {}
PlayerUtils.drawHand = function(player) {
  while(player.hand.length < 5) {
    player.hand.push(player.drawDeck.pop())
    if(player.drawDeck.length == 0) {
      while(player.discardDeck.length) {
        player.drawDeck.push(player.discardDeck.pop())
      }
      PlayerUtils.shuffle(player.drawDeck)
    }
  }
}
PlayerUtils.shuffle = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

server.addNewGame("Default Game")

io.on('connection',function(socket){

  socket.on('playerConnected',function(name){

    socket.player = new Player(name)
    socket.player.socketId = socket.id;

    server.log("Player Connected: "+socket.id + " ("+name+")")

    socket.on('playerJoined', function() {
      socket.emit("welcome", '{"id": "'+socket.player.playerUid+'", "name": "'+socket.player.name+'"}')
      server.log("Player Joined: "+socket.id + " ("+name+")")
    })

    socket.on('playerRejoined', function(id) {
      socket.player.playerUid = id;

      var playerGames = server.games.filter(function(g) { return g.players.map(p => p.playerUid).indexOf(id) >= 0 })
      playerGames.forEach(function(game) {
        game.players.find(p => p.playerUid == id).socketId = socket.id
      })

      socket.emit("welcome", '{"id": "'+socket.player.playerUid+'", "name": "'+socket.player.name+'"}')
      server.log("Player Re-joined: " +name+ " !!Updated all existing games to new socketID")
    })

    socket.on('gameList', function() {
      var joinableGames = server.games.filter(a => a.joinable)
      socket.emit('gameList', joinableGames.map(g => { return {name: g.name, id: g.id, players: g.players.map(p => ({id: p.playerUid, name: p.name})), startedAt: g.startedAt}}));
    })

    socket.on('createChat', function(message) {
      var msg = JSON.parse(message)
      var game = server.games.find(function(e) {return e.id == msg.id})
      var gameId = msg.id
      var fullMessage = atob(msg.message)

      game.chat.push({
        message: fullMessage,
        name: socket.player.name
      });
      socket.emit('gameState', JSON.stringify(server.anonymizedGameDataFor(game.id, socket.player)))
      server.log("Player Chat: " + socket.player.name + " -> " + fullMessage)

      game.players.forEach(function(p) {
        socket.to(p.socketId).emit('gameState', JSON.stringify(server.anonymizedGameDataFor(gameId, p)))
      })
    })

    socket.on('createGame', function(name) {
      var game = server.addNewGame(name);
      server.joinGame(game, socket.player)
      socket.emit('gameJoin', game.id)
      socket.emit('gameState', JSON.stringify(server.anonymizedGameDataFor(game.id, socket.player)))
    })

    socket.on('startGame', function(gameId) {
      var game = server.games.find(function(e) {return e.id == gameId})
      server.startGame(game)
      var joinableGames = server.games.filter(a => a.joinable)

      server.log("Starting Game with " + game.players.length + " players: " + game.name)
      // socket.broadcast.emit("gameStart")
      socket.emit('gameState', JSON.stringify(server.anonymizedGameDataFor(game.id, socket.player)))
      socket.emit('gameList', joinableGames.map(g => { return {name: g.name, id: g.id, players: g.players.map(p => ({id: p.playerUid, name: p.name})), startedAt: g.startedAt}}));
      socket.broadcast.emit('gameList', joinableGames.map(g => { return {name: g.name, id: g.id, players: g.players.map(p => ({id: p.playerUid, name: p.name})), startedAt: g.startedAt}}));

      game.players.forEach(function(p) {
        socket.to(p.socketId).emit('gameState', JSON.stringify(server.anonymizedGameDataFor(gameId, p)))
      })
    })

    socket.on('joinGame', function(gameId) {
      var game = server.games.find(function(e) {return e.id == gameId})
      server.joinGame(game, socket.player)
      socket.emit('gameState', JSON.stringify(server.anonymizedGameDataFor(gameId, socket.player)))
      // socket.broadcast.emit('gameState', JSON.stringify(server.anonymizedGameDataFor(gameId, socket.player)))
      socket.broadcast.emit('gameList', server.games.map(g => { return {name: g.name, id: g.id, players: g.players.map(p => ({id: p.playerUid, name: p.name})), startedAt: g.startedAt}}));
      server.log("Player Joined Game: " + socket.player.name + " -> " + game.name)

      game.players.forEach(function(p) {
        socket.to(p.socketId).emit('gameState', JSON.stringify(server.anonymizedGameDataFor(gameId, p)))
      })

    })

    socket.on('requestRejoinGame', function(gameId) {
      var game = server.games.find(function(e) {return e.id == gameId})
      if(game) {
        server.rejoinGame(game, socket.player)
        socket.emit('gameState', JSON.stringify(server.anonymizedGameDataFor(gameId, socket.player)))
        socket.broadcast.emit('gameList', server.games.map(g => { return {name: g.name, id: g.id, players: g.players.map(p => ({id: p.playerUid, name: p.name})), startedAt: g.startedAt}}));
        server.log("Player Re-joined Game: " + socket.player.name + " -> " + game.name)
      }
      else {
        server.log("Couldn't find game to rejoin: " + socket.player.name + " -> " + gameId)
        socket.emit('gameEnded')
      }
    })

    socket.on('leaveGame', function(gameId) {
      var game = server.games.find(function(e) {return e.id == gameId})
      game.players = game.players.filter(function(p){ return p.playerUid != socket.player.playerUid})
      socket.broadcast.emit('gameList', server.games.map(g => { return {name: g.name, id: g.id, players: g.players.map(p => ({id: p.playerUid, name: p.name})), startedAt: g.startedAt}}));
      server.log("Player Left Game: " + socket.player.name + " -> " + game.name)

      game.players.forEach(function(p) {
        socket.to(p.socketId).emit('gameState', JSON.stringify(server.anonymizedGameDataFor(gameId, p)))
      })
    })

  });
});

server.log = function(msg) {
  var timestamp = new Date()
  console.log(timestamp.toDateString() + " " + timestamp.toTimeString() + "   " + msg)
}

server.listen(8081,function(){ // Listens to port 8081
  server.log('Listening on '+server.address().port);
});



//
// function Server() {
//   var players; // Player Objects
//   var currentPlayerId;
//
//   var playCard = function(cardUid) {}
//   var endTurn = function(playerUid) {}
// }
//
// function Player() {
//   var playerUid;
//   var opponentUid;
//   var name;
//   var hand; // Card Objects
//   var drawDeck; // Card Objects
//   var discardDeck; // Card Objects
//
//   var actionsRemaining;
//   var buysRemaining;
//   var goldRemaining;
// }
//
// function Card() {
//   var cardUid;
//   var name;
//   var description;
//   var image;
// }
//
// function Market() {
//   var stacks; // Stack Objects
// }
//
// function Stack() {
//   var cardType; // Card Object
//   var qty;
// }
//
// function main() {
//
// }

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
