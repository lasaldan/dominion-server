module.exports = {
  Cards: [
    {
      id: "card_province",
      name: "Province",
      type: "Victory",
      playable: false,
      image: "",
      description: "",
      quantity: 12,
      requiresAction: false,
      value: function(){ return 6 },
      cost: 8
    },
    {
      id: "card_duchy",
      name: "Duchy",
      type: "Victory",
      playable: false,
      image: "",
      description: "",
      quantity: 12,
      requiresAction: false,
      value: function(){ return 3 },
      cost: 5
    },
    {
      id: "card_estate",
      name: "Estate",
      type: "Victory",
      playable: false,
      image: "",
      description: "",
      quantity: 24,
      requiresAction: false,
      value: function(){ return 1 },
      cost: 2
    },
    {
      id: "card_copper",
      name: "Copper",
      type: "Treasure",
      playable: true,
      image: "",
      description: "",
      quantity: 60,
      requiresAction: false,
      cost: 0,
      value: 1,
      play: function(player) {
        player.goldRemaining += this.value
        return player
      }
    },
    {
      id: "card_silver",
      name: "Silver",
      type: "Treasure",
      playable: true,
      image: "",
      description: "",
      quantity: 40,
      requiresAction: false,
      cost: 3,
      value: 2,
      play: function(player) {
        player.goldRemaining += this.value
        return player
      }
    },
    {
      id: "card_gold",
      name: "Gold",
      type: "Treasure",
      playable: true,
      image: "",
      description: "",
      quantity: 30,
      requiresAction: false,
      cost: 6,
      value: 3,
      play: function(player) {
        player.goldRemaining += this.value
        return player
      }
    },
    {
      id: "card_village",
      name: "Village",
      type: "Action",
      playable: true,
      image: "",
      description: "",
      quantity: 10,
      requiresAction: true,
      cost: 3,
      play: function(player, game, PlayerUtils) {
        PlayerUtils.drawCard(player)
        player.actionsRemaining += 2
      }
    },
    {
      id: "card_smithy",
      name: "Smithy",
      type: "Action",
      playable: true,
      image: "",
      description: "",
      quantity: 10,
      requiresAction: true,
      cost: 4,
      play: function(player, game, PlayerUtils) {
        PlayerUtils.drawCard(player)
        PlayerUtils.drawCard(player)
        PlayerUtils.drawCard(player)
      }
    },
    {
      id: "card_gardens",
      name: "Gardens",
      type: "Victory",
      playable: false,
      image: "",
      description: "",
      quantity: 10,
      requiresAction: true,
      value:  function(deck){ return parseInt(deck.length / 10) },
      cost: 4,
      play: function() {}
    },
    {
      id: "card_festival",
      name: "Festival",
      type: "Action",
      playable: true,
      image: "",
      description: "",
      quantity: 10,
      requiresAction: true,
      cost: 5,
      play: function(player, game, PlayerUtils) {
        player.goldRemaining += 2
        player.actionsRemaining += 2
        player.buysRemaining += 1
      }
    },
    {
      id: "card_laboratory",
      name: "Laboratory",
      type: "Action",
      playable: true,
      image: "",
      description: "",
      quantity: 10,
      requiresAction: true,
      cost: 5,
      play: function(player, game, PlayerUtils) {
        player.actionsRemaining += 1
        PlayerUtils.drawCard(player)
        PlayerUtils.drawCard(player)
      }
    },
    {
      id: "card_market",
      name: "Market",
      type: "Action",
      playable: true,
      image: "",
      description: "",
      quantity: 10,
      requiresAction: true,
      cost: 5,
      play: function(player, game, PlayerUtils) {
        player.actionsRemaining += 1
        player.goldRemaining += 1
        player.buysRemaining += 1
        PlayerUtils.drawCard(player)
      }
    },
    {
      id: "card_woodcutter",
      name: "Woodcutter",
      type: "Action",
      playable: true,
      image: "",
      description: "",
      quantity: 10,
      requiresAction: true,
      cost: 3,
      play: function(player, game, PlayerUtils) {
        player.buysRemaining += 1
        player.goldRemaining += 2
      }
    },
    {
      id: "card_mine",
      name: "Mine",
      type: "Action",
      playable: true,
      image: "",
      description: "",
      quantity: 10,
      requiresAction: true,
      cost: 5
    },
    {
      id: "card_council_room",
      name: "Council Room",
      type: "Action",
      playable: true,
      image: "",
      description: "",
      quantity: 10,
      requiresAction: true,
      cost: 5,
      play: function(player, game, PlayerUtils) {
        player.buysRemaining += 1
        PlayerUtils.drawCard(player)
        PlayerUtils.drawCard(player)
        PlayerUtils.drawCard(player)
        game.players.forEach(function(p) {
          PlayerUtils.drawCard(p)
        })
      }
    },
    {
      id: "card_workshop",
      name: "Workshop",
      type: "Action",
      playable: true,
      image: "",
      description: "",
      quantity: 10,
      requiresAction: true,
      cost: 3
    },
  ]
}
