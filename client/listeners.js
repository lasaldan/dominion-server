if(! localStorage.getItem("dominion_userid")) {
  gameUI.setState("login")
} else {
  server.rejoin(localStorage.getItem("dominion_userid"), localStorage.getItem("dominion_username"))
  if(localStorage.getItem("dominion_gameId")) {
    server.requestRejoinGame(localStorage.getItem("dominion_gameId"))
  }
}

document.querySelector("#login .button").addEventListener("click", function() {
  var username = document.querySelector("#login input").value
  server.join(username)
})

document.querySelector("#gameList .button").addEventListener("click", function() {
  gameUI.setState("addNewGame")
})

document.querySelector("#addNewGame .button.cancel").addEventListener("click", function() {
  gameUI.setState("gameList")
})

document.querySelector("#addNewGame .button.create").addEventListener("click", function() {
  var gamename = document.querySelector("#addNewGame input").value
  server.createGame(gamename)
  gameUI.setState("game")
})

document.querySelector("#games").addEventListener("click", function(e) {
  var entry = e.target.closest("#games > div")
  var gameId = entry.querySelector("span.hidden").textContent
  if(document.querySelector("#games > div span[data-player-ids]").dataset.playerIds.indexOf( localStorage.getItem("dominion_userid") ) > -1)
    server.requestRejoinGame(gameId)
  else
    server.joinGame(gameId)
  gameUI.setState("game")
})

document.querySelector("#logout").addEventListener("click", function(e) {
  server.leaveGame(localStorage.getItem("dominion_gameId"))
  server.getGameList()
})

document.querySelector("#lobby").addEventListener("click", function(e) {
  localStorage.removeItem("dominion_gameId")
  server.getGameList()
  gameUI.setState("gameList")
})
