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
      var gamePlayers = document.createElement("span")
      gamePlayers.dataset.playerIds = ""
      gamePlayers.innerHTML = (game.players.length ? game.players.length : "0") + "/4 ("
      game.players.forEach(function(p,i) {
        var isMe = (localStorage.getItem("dominion_userid") == p.id) ? "me" : ""
        gamePlayers.innerHTML += (i == 0 ? "<span class='"+isMe+"'>" : ", <span class='"+isMe+"'>" ) + p.name + "</span>"
        gamePlayers.dataset.playerIds += p.id + ","
      })
      gamePlayers.innerHTML += ")"
      gameEntry.appendChild(gameName)
      gameEntry.appendChild(gamePlayers)
      gameEntry.appendChild(gameId)
      gamesWrapper.append(gameEntry)
    })
  }

  this.updateBoard = function() {
    var me = game.gameState.players.find(a => a.me)
    for(var i = 0; i < me.drawDeck; i++) {
      var card = document.createElement("div")
      document.getElementById("myDrawDeck").appendChild(card)
    }
    for(var i = 0; i < me.hand.length; i++) {
      var card = document.createElement("div")
      card.classList.add(me.hand[i].id)
      card.tabIndex = -1;
      document.getElementById("myHand").appendChild(card)
    }
    document.getElementById("userName").innerHTML = localStorage.getItem("dominion_username")
    document.getElementById("gameName").innerHTML = game.gameState.name
    console.log(game.gameState)
  }
}
