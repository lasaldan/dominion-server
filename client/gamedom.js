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
      gamePlayerCount.innerHTML = game.players + "/4"
      var gameStartedAt = document.createElement("span")
      gameStartedAt.innerHTML = game.startedAt
      gameEntry.appendChild(gameName)
      gameEntry.appendChild(gamePlayerCount)
      gameEntry.appendChild(gameStartedAt)
      gameEntry.appendChild(gameId)
      gamesWrapper.append(gameEntry)
    })
  }

  this.updateBoard = function() {
    console.log(game.gameState)
  }
}
