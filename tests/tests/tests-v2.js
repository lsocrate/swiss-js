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
    this.tournament.addPlayer('Bob', 'Crane')

  var player = this.tournament.getPlayer(1)
  ok(player)
});

module('Matches', {
  setup: function () {
    this.tournament = new SwissTournament();
    this.tournament.addPlayer('Anna', 'Crab')
    this.tournament.addPlayer('Bob', 'Crane')
    this.tournament.addPlayer('Claude', 'Dragon')
    this.tournament.addPlayer('Dennis', 'Lion')
    this.tournament.addPlayer('Eliot', 'Mantis')
    this.tournament.addPlayer('Francis', 'Phoenix')
    this.tournament.addPlayer('George', 'Scorpion')
    this.tournament.addPlayer('Henry', 'Spider');
    this.tournament.addPlayer('Irvine', 'Unaligned');
    this.tournament.addPlayer('Juliet', 'Unaligned');
  }
});
test("Add match", function () {
  this.tournament.addMatch(1, 2)
  ok(this.tournament.matches["m1@2"])
});