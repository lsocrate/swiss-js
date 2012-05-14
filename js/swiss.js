var SwissTournament = function () {
  this.players = [];
  this.rounds = [];

  var tournament = this;

  var makeMatchName = function (player1, player2) {
    var players = [player1.name, player2.name].sort();
    return players.join('@').toLowerCase();
  };

  var Player = function (name, clan) {
    this.name   = name;
    this.clan   = clan.toLowerCase();
    this.points = 0;
  };

  var Round = function () {

  };

  Round.prototype.addMatch = function (player1Name, player2Name) {
    var player1 = tournament.getPlayer(player1Name);
    var player2 = tournament.getPlayer(player2Name);

    if (player1 && player2) {
      var matchName = makeMatchName(player1, player2);

      this[matchName] = {
        players : [player1.name, player2.name],
        winner  : null,
        isDone  : false
      };

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

  this.round = function (roundNumber) {
    return this.rounds[roundNumber - 1];
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