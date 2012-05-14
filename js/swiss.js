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