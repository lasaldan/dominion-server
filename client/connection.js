var Server = function(options) {

  this.socket = io.connect(SERVER_URL);

  this.join = function(name) {
    this.socket.emit('playerConnected', name);
    this.socket.emit("gameList")
    gameUI.setState("gameList")
  };

  this.socket.on('gameList', function(data) {
    gameUI.updateGamesList(data)
  })

  this.socket.on('gameState', function(data) {
    game.gameState = JSON.parse(data)
    gameUI.updateBoard()
  })

  this.createGame = function(name) {
    this.socket.emit('createGame', name);
  }

  this.joinGame = function(gameId) {
    this.socket.emit('joinGame', gameId)
  }
}
