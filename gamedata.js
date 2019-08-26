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
      cost: 3
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
      cost: 4
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
      cost: 4
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
      cost: 5
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
      cost: 5
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
      cost: 5
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
      cost: 3
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
      cost: 5
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
