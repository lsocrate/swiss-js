var SwissTournament = function () {
  this.players = [];
  this.rounds = [];
};

SwissTournament.prototype.addPlayer = function (name, clan) {
  this.players.push({name:name, clan:clan, points:0});

  return this;
};

SwissTournament.prototype.getPlayer = function (name) {
  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];

    if (player.name === name) {
      return player;
    }
  };
};

SwissTournament.prototype.addRound = function () {
  this.rounds.push({});
};

SwissTournament.prototype.round = function (roundNumber) {
  return this.rounds[roundNumber - 1];
};

SwissTournament.prototype.addMatchOnRound = function (player1Name, player2Name, roundNumber) {
  var player1 = this.getPlayer(player1Name);
  var player2 = this.getPlayer(player2Name);

  if (player1 && player2 && this.rounds[roundNumber - 1]) {
    var matchName = player1.name + "@" + player2.name;
    matchName = matchName.toLowerCase();

    this.round(roundNumber)[matchName] = {players:[player1.name, player2.name]};
  }
};