Object.prototype.forEach = function(callback) {
  for(var property in this) {
    if (this.hasOwnProperty(property) && typeof callback === "function") {
      callback(property, this[property])
    }
  }
};

var SwissTournament = SwissTournament || {}

SwissTournament = function() {
  var playerCount = 0
  this.players = {}
  this.matches = {}

  var nextPlayerId = function () {
    return "p" + ++playerCount
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
    this.players[player1.id] = player1
    this.players[player2.id] = player2
  }
  Match.prototype.reportWinner = function(winner) {
    var opponent
    this.players.forEach(function (playerId, player) {
      if (playerId != winner.id) {
        opponent = player
      }
    })

    this.winner = winner
    this.loser = opponent

    this.winner.points++

    this.winner.opponents[opponent.id] = opponent
    this.loser.opponents[winner.id] = winner
  };
  Match.prototype.reportDoubleLoss = function() {
    var player1
    var player2
    this.players.forEach(function (playerId, player) {
      if (!player1) {
        player1 = player
      } else {
        player2 = player
      }
    })

    this.drawed = true
    this.losers = [player1, player2]

    player1.opponents[player2.id] = player2
    player2.opponents[player1.id] = player1
  };

  this.addPlayer = function (name, clan) {
    var player = new Player(name, clan)

    this.players[player.id] = player
  }
  this.getPlayer = function (id) {
    return this.players[id]
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
    this.matches.forEach(function (matchId, match){
      if (match.players[player.id]) {
        playerMatches[matchId] = match
      }
    })

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