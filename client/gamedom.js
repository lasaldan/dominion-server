var GameDOM = function() {
  this.defaultState = "login"
  this.state = this.defaultState

  this.setState = function(state) {
    this.state = state
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
    document.getElementById("myDrawDeck").innerHTML = ""
    document.getElementById("myHand").innerHTML = ""
    document.getElementById("topDrawDeck").innerHTML = ""
    document.getElementById("topHand").innerHTML = ""
    document.getElementById("leftDrawDeck").innerHTML = ""
    document.getElementById("leftHand").innerHTML = ""
    document.getElementById("rightDrawDeck").innerHTML = ""
    document.getElementById("rightHand").innerHTML = ""
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
    if(game.gameState.players.length >= 2) {
      var left = game.gameState.players[(game.gameState.players.indexOf(me) + 1) % game.gameState.players.length]
      for(var i = 0; i < left.drawDeck; i++) {
        var card = document.createElement("div")
        document.getElementById("leftDrawDeck").appendChild(card)
      }
      for(var i = 0; i < left.hand; i++) {
        var card = document.createElement("div")
        card.classList.add("card_blank")
        document.getElementById("leftHand").appendChild(card)
      }
      document.getElementById("leftDrawDeck").dataset.playerName = left.name
    }
    if(game.gameState.players.length >= 3) {
      var top = game.gameState.players[(game.gameState.players.indexOf(me) + 2) % game.gameState.players.length]
      for(var i = 0; i < top.drawDeck; i++) {
        var card = document.createElement("div")
        document.getElementById("topDrawDeck").appendChild(card)
      }
      for(var i = 0; i < top.hand; i++) {
        var card = document.createElement("div")
        card.classList.add("card_blank")
        document.getElementById("topHand").appendChild(card)
      }
      document.getElementById("topDrawDeck").dataset.playerName = top.name
    }
    if(game.gameState.players.length >= 4) {
      var right = game.gameState.players[(game.gameState.players.indexOf(me) + 3) % game.gameState.players.length]
      for(var i = 0; i < right.drawDeck; i++) {
        var card = document.createElement("div")
        document.getElementById("rightDrawDeck").appendChild(card)
      }
      for(var i = 0; i < right.hand; i++) {
        var card = document.createElement("div")
        card.classList.add("card_blank")
        document.getElementById("rightHand").appendChild(card)
      }
      document.getElementById("rightDrawDeck").dataset.playerName = right.name
    }
    document.getElementById("userName").innerHTML = localStorage.getItem("dominion_username")
    document.getElementById("myDrawDeck").dataset.playerName = localStorage.getItem("dominion_username")
    document.getElementById("gameName").innerHTML = game.gameState.name
    console.log(game.gameState)
  }
}
