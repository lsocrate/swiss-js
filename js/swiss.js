var SwissTournament = function () {
  this.players = [];
  this.rounds = [];

  var makeMatchName = function (player1, player2) {
    var players = [player1.name, player2.name].sort();
    return players.join('@').toLowerCase();
  };

  this.addPlayer = function (name, clan) {
      this.players.push({
      name   : name,
      clan   : clan.toLowerCase(),
      points : 0
    });

    return this;
  };

  this.getPlayer = function (name) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].name === name) {
        return this.players[i];
      }
    }
  };

  this.addRound = function () {
    this.rounds.push({});
  };

  this.round = function (roundNumber) {
    return this.rounds[roundNumber - 1];
  };

  this.addMatchOnRound = function (player1Name, player2Name, roundNumber) {
    var player1 = this.getPlayer(player1Name);
    var player2 = this.getPlayer(player2Name);

    if (this.round(roundNumber) && player1 && player2) {
      var matchName = makeMatchName(player1, player2);

      this.round(roundNumber)[matchName] = {
        players : [player1.name, player2.name],
        winner  : null,
        isDone  : false
      };
      return {error:false};
    } else {
      return {error:true};
    }
  };

  this.getMatch = function (player1Name, player2Name, callback) {
    var player1 = this.getPlayer(player1Name);
    var player2 = this.getPlayer(player2Name);

    if (player1 && player2) {
      var matchName = makeMatchName(player1, player2);

      for (var i = 0; i < this.rounds.length; i++) {
        var round = this.rounds[i];

        if (round[matchName]) {
          return round[matchName];
        }
      };
    }
  };
};