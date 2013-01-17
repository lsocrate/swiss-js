module('Player', {
  setup: function () {
    this.tournament = new SwissTournament()
  }
})
test("Add player", function () {
  this.tournament.addPlayer('Anna', 'Scorpion')
  ok(this.tournament.players.p1)
})
test("Get player", function () {
  this.tournament.addPlayer('Anna', 'Scorpion')
  this.tournament.addPlayer('Bob', 'Crane')

  var player = this.tournament.getPlayer("p1")
  ok(player)
})

module('Matches', {
  setup: function () {
    this.tournament = new SwissTournament()
    this.tournament.addPlayer('Anna', 'Crab')
    this.tournament.addPlayer('Bob', 'Crane')
    this.tournament.addPlayer('Claude', 'Dragon')
    this.tournament.addPlayer('Dennis', 'Lion')
    this.tournament.addPlayer('Eliot', 'Mantis')
    this.tournament.addPlayer('Francis', 'Phoenix')
    this.tournament.addPlayer('George', 'Scorpion')
    this.tournament.addPlayer('Henry', 'Spider')
    this.tournament.addPlayer('Irvine', 'Unaligned')
    this.tournament.addPlayer('Juliet', 'Unaligned')
  }
})
test("Add match", function () {
  this.tournament.addMatch("p1", "p2")
  ok(this.tournament.matches["mp1@p2"])
})
test("Get match", function () {
  this.tournament.addMatch("p1", "p2")
  var match = this.tournament.getMatch("p1", "p2")
  ok(match.players)
})
test("Get player matches", function () {
  this.tournament.addMatch("p1", "p2")
  this.tournament.addMatch("p1", "p3")
  this.tournament.addMatch("p1", "p4")
  var matches = this.tournament.getPlayerMatches(this.tournament.getPlayer("p1"))
  ok(matches["mp1@p2"])
  ok(matches["mp1@p3"])
  ok(matches["mp1@p4"])
})
test("Report match victory", function () {
  this.tournament.addMatch("p1", "p2")
  var match = this.tournament.getMatch("p1", "p2")
  var winner = this.tournament.getPlayer("p1")
  match.reportWinner(winner)
  equal("p1", match.winner.id)
  equal("p2", match.loser.id)
  equal(1, match.winner.points)
  equal(0, match.loser.points)
  ok(match.winner.opponents["p2"])
  ok(match.loser.opponents["p1"])
})
test("Report double loss", function () {
  this.tournament.addMatch("p1", "p2")
  var match = this.tournament.getMatch("p1", "p2")
  var player1 = this.tournament.getPlayer("p1")
  var player2 = this.tournament.getPlayer("p2")

  match.reportDoubleLoss()
  equal(0, player1.points)
  equal(0, player2.points)
  equal(2, match.losers.length)
  ok(match.drawed)
  ok(player1.opponents["p2"])
  ok(player2.opponents["p1"])
})

module('Match Matrix', {
  setup: function () {
    this.tournament = new SwissTournament()
    this.tournament.addPlayer('Anna', 'Crab')
    this.tournament.addPlayer('Bob', 'Crane')
    this.tournament.addPlayer('Claude', 'Dragon')
    this.tournament.addPlayer('Dennis', 'Lion')
    this.tournament.addPlayer('Eliot', 'Mantis')
    this.tournament.addPlayer('Francis', 'Phoenix')
    this.tournament.addPlayer('George', 'Scorpion')
    this.tournament.addPlayer('Henry', 'Spider')
    this.tournament.addPlayer('Irvine', 'Unaligned')
    this.tournament.addPlayer('Juliet', 'Unaligned')

    this.players = [
      this.tournament.getPlayer("p1"),
      this.tournament.getPlayer("p2"),
      this.tournament.getPlayer("p3"),
      this.tournament.getPlayer("p4"),
      this.tournament.getPlayer("p5")
    ]
  }
})
test("Get match matrix", function () {
  this.tournament.addMatch("p1", "p2")

  var matrix = this.tournament.getMatchMatrixForPlayers(this.players)
  equal(9, matrix.size())
  ok(matrix["mp1@p3"])
  ok(matrix["mp1@p4"])
  ok(matrix["mp1@p5"])
  ok(matrix["mp2@p3"])
  ok(matrix["mp2@p4"])
  ok(matrix["mp2@p5"])
  ok(matrix["mp3@p4"])
  ok(matrix["mp3@p5"])
  ok(matrix["mp4@p5"])
})