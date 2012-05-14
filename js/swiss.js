var SwissTournament = function () {
  this.players = [];
  this.matches = [];
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

SwissTournament.prototype.addMatch = function(player1Name, player2Name) {
  var player1 = this.getPlayer(player1Name);
  var player2 = this.getPlayer(player2Name);

  if (player1 && player2) {
    this.matches.push([player1.name, player2.name]);
  }
};

SwissTournament.prototype.getMatch = function (playerName) {
  for (var i = 0; i < this.matches.length; i++) {
    var match = this.matches[i];

    if (match.indexOf(playerName) > -1) {
      return match;
    }
  };
};