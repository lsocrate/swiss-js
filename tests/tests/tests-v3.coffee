module("Player", {
  setup: ->
    @tournament = new SwissTournament
})
test("Add player", ->
  @tournament.addPlayer("Anna", "Scorpion")
  ok(@tournament.players.p1)
)
test("Get player", ->
  @tournament.addPlayer("Anna", "Scorpion")
  @tournament.addPlayer("Bob", "Crane")
  player = @tournament.getPlayer("p1")
  ok(player)
)

module("Matches", {
  setup: ->
    @tournament = new SwissTournament
    @tournament.addPlayer("Anna", "Crab")
    @tournament.addPlayer("Bob", "Crane")
    @tournament.addPlayer("Claude", "Dragon")
    @tournament.addPlayer("Dennis", "Lion")
    @tournament.addPlayer("Eliot", "Mantis")
    @tournament.addPlayer("Francis", "Phoenix")
    @tournament.addPlayer("George", "Scorpion")
    @tournament.addPlayer("Henry", "Spider")
    @tournament.addPlayer("Irvine", "Unaligned")
    @tournament.addPlayer("Juliet", "Unaligned")
})
test("Add match", ->
  @tournament.addMatch("p1", "p2")
  ok(@tournament.matches["m_p1@p2"])
)
test("Get match", ->
  @tournament.addMatch("p1", "p2")
  match = @tournament.getMatch("p1", "p2")
  ok(match.players.p1)
  ok(match.players.p2)
)
test("Get player matches", ->
  @tournament.addMatch("p1", "p2")
  @tournament.addMatch("p1", "p3")
  @tournament.addMatch("p1", "p4")
  matches = @tournament.getPlayerMatches(@tournament.getPlayer("p1"))
  ok(matches["m_p1@p2"])
  ok(matches["m_p1@p3"])
  ok(matches["m_p1@p4"])
)
test("Report match victory", ->
  @tournament.addMatch("p1", "p2")
  match = @tournament.getMatch("p1", "p2")
  winner = @tournament.getPlayer("p1")
  match.reportWinner(winner)
  equal("p1", match.winner.id)
  equal("p2", match.loser.id)
  equal(1, match.winner.points)
  equal(0, match.loser.points)
  ok(match.winner.opponents["p2"])
  ok(match.loser.opponents["p1"])
)
test("Report double loss", ->
  @tournament.addMatch("p3", "p4")
  match = @tournament.getMatch("p3", "p4")
  player1 = @tournament.getPlayer("p3")
  player2 = @tournament.getPlayer("p4")

  match.reportDoubleLoss()
  equal(0, player1.points)
  equal(0, player2.points)
  equal(2, match.losers.length)
  ok(match.drawed)
  ok(player1.opponents["p4"])
  ok(player2.opponents["p3"])
)

module("Match Matrix", {
  setup: ->
    @tournament = new SwissTournament
    @tournament.addPlayer("Anna", "Crab")
    @tournament.addPlayer("Bob", "Crane")
    @tournament.addPlayer("Claude", "Dragon")
    @tournament.addPlayer("Dennis", "Lion")
    @tournament.addPlayer("Eliot", "Mantis")
    @tournament.addPlayer("Francis", "Phoenix")
    @tournament.addPlayer("George", "Scorpion")
    @tournament.addPlayer("Henry", "Spider")
    @tournament.addPlayer("Irvine", "Unaligned")
    @tournament.addPlayer("Juliet", "Unaligned")

    @players = [
      @tournament.getPlayer("p1")
      @tournament.getPlayer("p2")
      @tournament.getPlayer("p3")
      @tournament.getPlayer("p4")
      @tournament.getPlayer("p5")
    ]
})
test("Get match matrix", ->
  @tournament.addMatch("p1", "p2")
  matrix = @tournament.getMatchMatrixForPlayers(@players)
  matrixSize = Object.keys(matrix.matches).length

  equal(matrixSize, 9)
  ok(matrix.matches["m_p1@p3"])
  ok(matrix.matches["m_p1@p4"])
  ok(matrix.matches["m_p1@p5"])
  ok(matrix.matches["m_p2@p3"])
  ok(matrix.matches["m_p2@p4"])
  ok(matrix.matches["m_p2@p5"])
  ok(matrix.matches["m_p3@p4"])
  ok(matrix.matches["m_p3@p5"])
  ok(matrix.matches["m_p4@p5"])
)
test("Get unique matches which are the only possible for some of it's players", ->
  @tournament.addMatch("p1", "p2")
  @tournament.addMatch("p1", "p3")
  @tournament.addMatch("p1", "p4")

  matrix = @tournament.getMatchMatrixForPlayers(@players)
  matrixSize = Object.keys(matrix.matches).length
  equal(matrixSize, 7)

  singularMatches = matrix.getSingularMatches()
  singularMatchesSize = Object.keys(singularMatches).length
  equal(singularMatchesSize, 1)
)
test("Remove player matches", ->
  matrix = @tournament.getMatchMatrixForPlayers(@players)
  console.log(@tournament)
  player1 = @tournament.getPlayer("p1")
  matrix.removePlayerMatches(player1)
  matrixSize = Object.keys(matrix.matches).length

  equal(matrixSize, 6)
  equal(Object.keys(matrix.matrix["p2"]).length, 3)
  equal(Object.keys(matrix.matrix["p3"]).length, 3)
  equal(Object.keys(matrix.matrix["p4"]).length, 3)
)