module('Player', {
  setup: function () {
    this.tournament = new SwissTournament();
  }
})
test("Add player", function () {
  this.tournament.addPlayer('Anna', 'Scorpion')
  ok(this.tournament.players.id1)
})
test("Get player", function () {
  this.tournament.addPlayer('Anna', 'Scorpion')
  this.tournament.addPlayer('Bob', 'Crane')

  var player = this.tournament.getPlayer(1)
  ok(player)
})

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
})
test("Add match", function () {
  this.tournament.addMatch(1, 2)
  ok(this.tournament.matches["m1@2"])
})
test("Get match", function () {
  this.tournament.addMatch(1, 2)
  var match = this.tournament.getMatch(1, 2)
  ok(match.players)
})
test("Get player matches", function () {
  this.tournament.addMatch(1, 2)
  this.tournament.addMatch(1, 3)
  this.tournament.addMatch(1, 4)
  var matches = this.tournament.getPlayerMatches(this.tournament.getPlayer(1))
  ok(matches["m1@2"])
  ok(matches["m1@3"])
  ok(matches["m1@4"])
})
test("Get match matrix", function () {
  var players = [
    this.tournament.getPlayer(1),
    this.tournament.getPlayer(2),
    this.tournament.getPlayer(3),
    this.tournament.getPlayer(4),
    this.tournament.getPlayer(5)
  ]

  var matrix = this.tournament.getMatchMatrixForPlayers(players)
  ok(matrix["m1@2"])
  ok(matrix["m1@3"])
  ok(matrix["m1@4"])
  ok(matrix["m1@5"])
  ok(matrix["m2@3"])
  ok(matrix["m2@4"])
  ok(matrix["m2@5"])
  ok(matrix["m3@4"])
  ok(matrix["m3@5"])
  ok(matrix["m4@5"])
})
test("Report match victory", function () {
  this.tournament.addMatch(1, 2)
  var match = this.tournament.getMatch(1, 2)
  var winner = this.tournament.getPlayer(1)
  match.reportWinner(winner)
  equal(1, match.winner.id)
  equal(2, match.loser.id)
})