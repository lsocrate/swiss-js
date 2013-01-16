module('Player', {
  setup: function () {
    this.tournament = new SwissTournament();
  }
});
test("Add player", function () {
  this.tournament.addPlayer('Anna', 'Scorpion')
  ok(this.tournament.players.id1)
});
test("Get player", function () {
  this.tournament.addPlayer('Anna', 'Scorpion')

  var player = this.tournament.getPlayer(1)
  ok(player)
});