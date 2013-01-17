var SwissTournament = SwissTournament || {}

SwissTournament = function() {
  var playerCount = 0
  this.players = {}
  this.matches = {}

  var nextPlayerId = function () {
    return ++playerCount
  }
  var makeMatchName = function (id1, id2) {
    return "m" + id1 + "@" + id2
  }

  var Player = function (name, clan) {
    this.id = nextPlayerId()
    this.name = name
    this.clan = clan.toLowerCase()
    this.points = 0
    this.opponents = {}
  }
  var Match = function (player1, player2) {
    this.players = {}
    this.players["id" + player1.id] = player1
    this.players["id" + player2.id] = player2
  }
  Match.prototype.reportWinner = function(winner) {
    var opponent
    for(var player in this.players) {
      if (this.players.hasOwnProperty(player) && this.players[player].id != winner.id) {
        opponent = this.players[player]
      }
    }

    this.winner = winner
    this.loser = opponent

    this.winner.points++

    this.winner.opponents["id" + opponent.id] = opponent
    this.loser.opponents["id" + winner.id] = winner
  };

  this.addPlayer = function (name, clan) {
    var player = new Player(name, clan)

    this.players["id" + player.id] = player
  }
  this.getPlayer = function (id) {
    return this.players["id" + id]
  }
  this.addMatch = function (playerId1, playerId2) {
    var player1 = this.getPlayer(playerId1)
    var player2 = this.getPlayer(playerId2)
    var match = new Match(player1, player2)

    this.matches[makeMatchName(playerId1, playerId2)] = match
  }
  this.getMatch = function (playerId1, playerId2) {
    return this.matches[makeMatchName(playerId1, playerId2)]
  }
  this.getPlayerMatches = function (player) {
    var playerMatches = {}
    for (var matchName in this.matches) {
      if (this.matches.hasOwnProperty(matchName)) {
        var match = this.matches[matchName]
        if (match.players["id" + player.id]) {
          playerMatches[matchName] = match
        }
      }
    }

    return playerMatches
  }
  this.getMatchMatrixForPlayers = function (players) {
    var matrix = {}
    var player1
    while (player1 = players.shift()) {
      for (var i = 0; i < players.length; i++) {
        var player2 = players[i]
        var match = new Match(player1, player2)

        matrix[makeMatchName(player1.id, player2.id)] = match
      };
    }

    return matrix
  }
}