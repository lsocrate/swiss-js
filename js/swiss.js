var SwissTournament = function () {
  this.players = [];
  this.rounds = [];

  var tournament = this;

  var makeMatchName = function () {
    var players = [];
    for (var i = 0; i < arguments.length; i++) {
      players.push(arguments[i].name);
    };

    return players.sort().join('@').toLowerCase();
  };

  var Player = function (name, clan) {
    this.name   = name;
    this.clan   = clan.toLowerCase();
    this.points = 0;
  };

  var Match = function () {
    this.name = undefined;
    this.players = [];
    this.winner  = undefined;
    this.isDone  = false;

    if (arguments) {
      this.name = makeMatchName.apply(null, arguments);

      for (var i = 0; i < arguments.length; i++) {
        this.players.push(arguments[i].name);
      };
    }
  };
  Match.prototype.reportWinner = function(winnerName) {
    this.winner = winnerName;
    this.isDone = true;
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

  this.round = function (roundNumber) {
    return this.rounds[roundNumber - 1];
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
};