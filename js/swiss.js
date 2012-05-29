var Player = function (tournament, name, clan) {
  this.tournament = tournament;
  this.id         = this.tournament.generatePlayerId();
  this.name       = name;
  this.clan       = clan.toLowerCase();
  this.points     = 0;
  this.msW        = 0;
  this.msT        = 0;
};
Player.prototype.getPosition = function () {
  for (var i = 0; i < this.tournament.players.length; i++) {
    var player = this.tournament.players[i];
    if (player.id === this.id) {
      return ++i;
    }
  };
};
Player.prototype.getOpponents = function () {
  var opponents = [];

  for (var i = 0; i < this.tournament.rounds.length; i++) {
    var round = this.tournament.rounds[i];

    for (var matchName in round.matches) {
      if (round.matches.hasOwnProperty(matchName)){
        if (round.matches[matchName].players.indexOf(this.name) === 0) {
          opponents.push(round.matches[matchName].players[1]);
        } else if (round.matches[matchName].players.indexOf(this.name) === 1) {
          opponents.push(round.matches[matchName].players[0]);
        }
      }
    }
  };

  return opponents;
};
Player.prototype.calculateMs = function () {
  var opponents = this.getOpponents();

  for (var i = 0; i < opponents.length; i++) {
    var opponentName = opponents[i];
    this.msT += this.tournament.getPlayer(opponentName).points;

    if(this.tournament.getMatch(opponentName, this.name).winner === this.name) {
      this.msW += this.tournament.getPlayer(opponentName).points;
    }
  };
};

var Match = function (tournament) {
  this.tournament = tournament;
  this.name       = undefined;
  this.players    = [arguments[1].name, arguments[2].name];
  this.winner     = undefined;
  this.isDone     = false;
  this.name       = this.tournament.makeMatchName(this.tournament.getPlayer(this.players[0]), this.tournament.getPlayer(this.players[1]));
};
Match.prototype.reportWinner = function(winnerName) {
  this.winner = winnerName;
  this.isDone = true;

  this.tournament.getPlayer(winnerName).points++;
};

Match.prototype.reportDraw = function() {
  this.winner = undefined;
  this.isDone = true;
};

var Round = function (tournament) {
  this.tournament = tournament;
  this.matches    = {};
};
Round.prototype.addMatch = function (player1Name, player2Name) {
  var player1 = this.tournament.getPlayer(player1Name);
  var player2 = this.tournament.getPlayer(player2Name);

  if (player1 && player2) {
    var matchName = this.tournament.makeMatchName(player1, player2);

    this.matches[matchName] = new Match(this.tournament, player1, player2);

    return {error:false};
  } else {
    return {error:true};
  }
};

var SwissTournament = function () {
  this.players = [];
  this.rounds  = [];

  var currentPlayerId = 0;
  var tournament      = this;

  this.makeMatchName = function () {
    var players = [].slice.apply(arguments).map(function (player) {
      return player.name;
    });

    return players.sort().join('@').toLowerCase();
  };

  this.generatePlayerId = function () {
    return currentPlayerId++;
  };

  this.addPlayer = function (name, clan) {
    this.players.push(new Player(this, name, clan));

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
    this.rounds.push(new Round(this));
  };

  this.getRound = function (roundNumber) {
    return (typeof roundNumber === 'number') ? this.rounds[roundNumber - 1] : this.rounds[this.rounds.length - 1];
  };

  this.getMatch = function (player1Name, player2Name) {
    var player1 = this.getPlayer(player1Name);
    var player2 = this.getPlayer(player2Name);

    if (player1 && player2) {
      var matchName = this.makeMatchName(player1, player2);

      for (var i = 0; i < this.rounds.length; i++) {
        var round = this.rounds[i];

        if (round.matches[matchName]) {
          return round.matches[matchName];
        }
      };
    }
  };

  this.updateRanking = function () {
    this.players.sort(function (a, b) {
      return b.points - a.points;
    });
  };
  this.updateFinalRanking = function() {
    this.players.sort(function (a, b) {
      if (b.points != a.points) {
        return b.points - a.points;
      } else if(b.msW != a.msW) {
        return b.msW - a.msW;
      } else {
        return b.msT - a.msT;
      }
    });
  };

  var getPlayersByPointsGroup = function () {
    var groups = [];
    for (var i = 0; i < tournament.players.length; i++) {
      var player = tournament.players[i];
      if (typeof groups[player.points] === 'undefined') {
        groups[player.points] = [player];
      } else {
        groups[player.points].push(player);
      }
    };

    return groups;
  };

  this.generateRound = function () {
    this.updateRanking();
    this.addRound();

    var groupsToMatch = getPlayersByPointsGroup();
    var oddPlayer = false;
    for (var i = groupsToMatch.length - 1; i >= 0; i--) {
      var group = groupsToMatch[i];

      while(group.length > 1) {
        var player1, player2;

        if (oddPlayer) {
          player1 = oddPlayer;
          oddPlayer = false;
        } else {
          player1 = group.splice(Math.ceil(Math.random() * (group.length - 1)),1)[0];
        }

        player2 = group.splice(Math.ceil(Math.random() * (group.length - 1)),1)[0];

        this.getRound().addMatch(player1.name, player2.name);
      }
      if (group.length) {
        oddPlayer = group[0];
      } else {
        oddPlayer = false;
      }
    };
  }

  this.end = function () {
    this.updateRanking();

    for (var i = 0; i < this.players.length; i++) {
      var player = this.players[i];
      player.calculateMs();
    };

    this.updateFinalRanking();

    return this;
  };

  this.ranking = function () {
    return this.players.map(function (player) {return player.name;});
  };
};