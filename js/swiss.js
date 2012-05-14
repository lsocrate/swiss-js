var SwissTournament = function () {
  this.players = [];
};

SwissTournament.prototype.addPlayer = function (name, clan) {
  this.players.push({name:name, clan:clan, points:0});

  return this;
};