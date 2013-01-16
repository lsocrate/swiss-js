var SwissTournament = SwissTournament || {}

SwissTournament = function() {
  var playerCount = 0
  this.players = {}

  var nextPlayerId = function () {
    return ++playerCount
  }

  var Player = function (name, clan) {
    this.id = nextPlayerId()
    this.name = name
    this.clan = clan.toLowerCase()
    this.points = 0
    this.opponents = {}
  }

  this.addPlayer = function (name, clan) {
    var player = new Player(name, clan)

    this.players["id" + player.id] = player
  }
  this.getPlayer = function (id) {
    return this.players["id" + id]
  }
}