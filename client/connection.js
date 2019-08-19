var Server = function(options) {

  this.socket = io.connect(SERVER_URL);

  this.join = function(name) {
    this.socket.emit('playerConnected', name);
    this.socket.emit('playerJoined')
    this.socket.emit("gameList")
    gameUI.setState("gameList")
  };

  this.rejoin = function(id, name) {
    this.socket.emit('playerConnected', name);
    this.socket.emit('playerRejoined', id);
    this.socket.emit("gameList")
    gameUI.setState("gameList")
  };

  this.getGameList = function(name) {
    this.socket.emit("gameList")
  }

  this.createGame = function(name) {
    this.socket.emit('createGame', name);
  }

  this.joinGame = function(gameId) {
    this.socket.emit('joinGame', gameId)
    localStorage.setItem("dominion_gameId", gameId)
  }

  this.rejoinGame = function(gameId) {
    this.socket.emit('rejoinGame', gameId)
    localStorage.setItem("dominion_gameId", gameId)
  }

  this.leaveGame = function(gameId) {
    this.socket.emit('leaveGame', gameId)
    localStorage.removeItem("dominion_gameId")
    gameUI.setState("gameList")
  }

  this.socket.on('welcome', function(playerData) {
    console.log(playerData)
    var data = JSON.parse(playerData)
    localStorage.setItem("dominion_userid", data.id)
    localStorage.setItem("dominion_username", data.name)
  })

  this.socket.on('gameList', function(data) {
    gameUI.updateGamesList(data)
  })

  this.socket.on('gameState', function(data) {
    game.gameState = JSON.parse(data)
    gameUI.updateBoard()
  })
}
