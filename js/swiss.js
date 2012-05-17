var SwissTournament = function () {
  this.players = [];
  this.rounds = [];

  var tournament = this;
  var currentPlayerId = 0;

  var makeMatchName = function () {
    var players = [].slice.apply(arguments).map(function (player) {
      return player.name;
    });

    return players.sort().join('@').toLowerCase();
  };

  var generatePlayerId = function () {
    return currentPlayerId++;
  };

  var Player = function (name, clan) {
    this.name   = name;
    this.clan   = clan.toLowerCase();
    this.points = 0;
    this.ms     = 0;
    this.id     = generatePlayerId();
  };
  Player.prototype.getPosition = function () {
    for (var i = 0; i < tournament.players.length; i++) {
      var player = tournament.players[i];
      if (player.id === this.id) {
        return ++i;
      }
    };
  };
  Player.prototype.getOpponents = function () {
    var opponents = [];

    for (var i = 0; i < tournament.rounds.length; i++) {
      var round = tournament.rounds[i];

      for (var matchName in round) {
        if (round.hasOwnProperty(matchName)){
          if (round[matchName].players.indexOf(this.name) === 0) {
            opponents.push(round[matchName].players[1]);
          } else if (round[matchName].players.indexOf(this.name) === 1) {
            opponents.push(round[matchName].players[0]);
          }
        }
      }
    };

    return opponents;
  };

  var Match = function () {
    this.name = undefined;
    this.players = [];
    this.winner  = undefined;
    this.isDone  = false;

    if (arguments.length) {
      this.name = makeMatchName.apply(null, arguments);
      this.players = [].slice.apply(arguments).map(function (player) {
        return player.name;
      });
    }
  };
  Match.prototype.reportWinner = function(winnerName) {
    this.winner = winnerName;
    this.isDone = true;

    tournament.getPlayer(winnerName).points++;
  };

  Match.prototype.reportDraw = function() {
    this.winner = undefined;
    this.isDone = true;
  };

  var Round = function () {

  };
  Round.prototype.addMatch = function (player1Name, player2Name) {
    var player1 = tournament.getPlayer(player1Name);
    var player2 = tournament.getPlayer(player2Name);

    if (player1 && player2) {
      var matchName = makeMatchName(player1, player2);

      this[matchName] = new Match(player1, player2);

      return {error:false};
    } else {
      return {error:true};
    }
  };

  this.addPlayer = function (name, clan) {
    this.players.push(new Player(name, clan));

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
    this.rounds.push(new Round());
  };

  this.getRound = function (roundNumber) {
    return (typeof roundNumber === 'number') ? this.rounds[roundNumber - 1] : this.rounds[this.rounds.length - 1];
  };

  this.getMatch = function (player1Name, player2Name) {
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

  this.updateRanking = function () {
    this.players.sort(function (a, b) {
      return b.points - a.points;
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
    var oddPlayer;
    for (var i = groupsToMatch.length - 1; i >= 0; i--) {
      var group = groupsToMatch[i];

      while(group.length >= 2) {
        var player1 = group.splice(Math.ceil(Math.random() * (group.length - 1)),1)[0];
        var player2 = group.splice(Math.ceil(Math.random() * (group.length - 1)),1)[0];

        this.getRound().addMatch(player1.name, player2.name);
      }
      if (group.length) {
        oddPlayer = group[0];
      }
    };
  }
};