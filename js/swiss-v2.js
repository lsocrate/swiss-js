Object.prototype.forEach = function(callback) {
  for(var property in this) {
    if (this.hasOwnProperty(property) && typeof callback === "function") {
      callback(property, this[property])
    }
  }
};
Object.prototype.size = function() {
    var size = 0, key;
    for (key in this) {
        if (this.hasOwnProperty(key)) size++;
    }
    return size;
};

var SwissTournament = SwissTournament || {}

SwissTournament = function() {
  var tournament = this
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
    this.id = makeMatchName(player1.id, player2.id)
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

  var MatchMatrix = function (players) {
    this.matches = {}
    this.matrix = {}

    var player1
    while (player1 = players.shift()) {
      for (var i = 0; i < players.length; i++) {
        var player2 = players[i]
        var match = new Match(player1, player2)

        if (!tournament.matches[match.id]) {
          this.matches[match.id] = match

          if (!this.matrix[player1.id]) this.matrix[player1.id] = {}
          this.matrix[player1.id][player2.id] = match

          if (!this.matrix[player2.id]) this.matrix[player2.id] = {}
          this.matrix[player2.id][player1.id] = match
        }
      };
    }
  }
  MatchMatrix.prototype.getSingularMatches = function() {
    var matches = {}
    this.matrix.forEach(function (playerId, opponents) {
      if (opponents.size() < 2) {
        opponents.forEach(function (opponentId, match) {
          matches[match.id] = match
        })
      }
    })

    return matches
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

    this.matches[match.id] = match
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
    return new MatchMatrix(players)
  }
}