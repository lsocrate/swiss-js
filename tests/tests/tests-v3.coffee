generateTournament = ->
  tournament = new SwissTournament
  tournament.addPlayer("Anna", "Crab")
  tournament.addPlayer("Bob", "Crane")
  tournament.addPlayer("Claude", "Dragon")
  tournament.addPlayer("Dennis", "Lion")
  tournament.addPlayer("Eliot", "Mantis")
  tournament.addPlayer("Francis", "Phoenix")
  tournament.addPlayer("George", "Scorpion")
  tournament.addPlayer("Henry", "Spider")
  tournament.addPlayer("Irvine", "Unaligned")
  tournament.addPlayer("Juliet", "Unaligned")

  tournament


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
    @tournament = generateTournament()
})
test("Add match", ->
  @tournament.addMatch("p1", "p2")

  player1 = @tournament.getPlayer("p1")
  player2 = @tournament.getPlayer("p2")

  ok(@tournament.matches["m_p1@p2"])
  ok(player1.opponents.p2)
  ok(player2.opponents.p1)
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
    @tournament = generateTournament()

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
  player1 = @tournament.getPlayer("p1")
  matrix.removePlayerMatches(player1)
  matrixSize = Object.keys(matrix.matches).length

  equal(matrixSize, 6)
  equal(Object.keys(matrix.matrix["p2"]).length, 3)
  equal(Object.keys(matrix.matrix["p3"]).length, 3)
  equal(Object.keys(matrix.matrix["p4"]).length, 3)
)

module("Ranking", {
  setup: ->
    @tournament = generateTournament()

    @anna = @tournament.getPlayer("p1")
    @bob = @tournament.getPlayer("p2")
    @claude = @tournament.getPlayer("p3")
    @dennis = @tournament.getPlayer("p4")
    @eliot = @tournament.getPlayer("p5")
    @francis = @tournament.getPlayer("p6")
    @george = @tournament.getPlayer("p7")
    @henry = @tournament.getPlayer("p8")
    @irvine = @tournament.getPlayer("p9")
    @juliet = @tournament.getPlayer("p10")

    @tournament.addMatch(@dennis.id, @juliet.id).reportWinner(@juliet)
    @tournament.addMatch(@francis.id, @irvine.id).reportWinner(@irvine)
    @tournament.addMatch(@bob.id, @henry.id).reportWinner(@henry)
    @tournament.addMatch(@anna.id, @claude.id).reportWinner(@claude)
    @tournament.addMatch(@eliot.id, @george.id).reportWinner(@george)

    @tournament.addMatch(@irvine.id, @juliet.id).reportWinner(@juliet)
    @tournament.addMatch(@henry.id, @george.id).reportWinner(@henry)
    @tournament.addMatch(@dennis.id, @claude.id).reportWinner(@dennis)
    @tournament.addMatch(@bob.id, @francis.id).reportWinner(@francis)
    @tournament.addMatch(@anna.id, @eliot.id).reportWinner(@eliot)

    @tournament.addMatch(@henry.id, @juliet.id).reportWinner(@juliet)
    @tournament.addMatch(@george.id, @irvine.id).reportWinner(@irvine)
    @tournament.addMatch(@claude.id, @francis.id).reportWinner(@francis)
    @tournament.addMatch(@dennis.id, @eliot.id).reportWinner(@eliot)
    @tournament.addMatch(@anna.id, @bob.id).reportWinner(@bob)

    @tournament.addMatch(@francis.id, @juliet.id).reportWinner(@juliet)
    @tournament.addMatch(@eliot.id, @irvine.id).reportWinner(@irvine)
    @tournament.addMatch(@claude.id, @henry.id).reportWinner(@henry)
    @tournament.addMatch(@dennis.id, @george.id).reportWinner(@george)
    @tournament.addMatch(@anna.id, @bob.id).reportWinner(@bob)
})
test("Rank players with ms", ->
  ranking = @tournament.getRankedPlayers()

  equal(@juliet.points, 4, "juliet points")
  equal(@irvine.points, 3, "irvine points")
  equal(@henry.points, 3, "henry points")
  equal(@george.points, 2, "george points")
  equal(@francis.points, 2, "francis points")
  equal(@eliot.points, 2, "eliot points")
  equal(@bob.points, 2, "bob points")
  equal(@claude.points, 1, "claude points")
  equal(@dennis.points, 1, "dennis points")
  equal(@anna.points, 0, "anna points")

  equal(@juliet.ms.total, 9, "juliet ms total")
  equal(@irvine.ms.total, 10, "irvine ms total")
  equal(@henry.ms.total, 9, "henry ms total")
  equal(@francis.ms.total, 10, "francis ms total")
  equal(@george.ms.total, 9, "george ms total")
  equal(@eliot.ms.total, 6, "eliot ms total")
  equal(@bob.ms.total, 5, "bob ms total")
  equal(@dennis.ms.total, 9, "dennis ms total")
  equal(@claude.ms.total, 6, "claude ms total")
  equal(@anna.ms.total, 5, "anna ms total")

  equal(ranking[0].name, "Juliet", "Juliet ranking")
  equal(ranking[1].name, "Irvine", "Irvine ranking")
  equal(ranking[2].name, "Henry", "Henry ranking")
  equal(ranking[3].name, "Francis", "Francis ranking")
  equal(ranking[4].name, "George", "George ranking")
  equal(ranking[5].name, "Eliot", "Eliot ranking")
  equal(ranking[6].name, "Bob", "Bob ranking")
  equal(ranking[7].name, "Dennis", "Dennis ranking")
  equal(ranking[8].name, "Claude", "Claude ranking")
  equal(ranking[9].name, "Anna", "Anna ranking")
)
test("Get players grouped by points", ->
  playersGrouped = @tournament.getPlayerListGroupedByPoints()
  equal(playersGrouped[0].length, 1)
  equal(playersGrouped[1].length, 2)
  equal(playersGrouped[2].length, 4)
  equal(playersGrouped[3].length, 2)
  equal(playersGrouped[4].length, 1)
)

module("Round", {
  setup: ->
    @tournament = generateTournament()
})
test("Add round", ->
  @tournament.addRound()
  equal(@tournament.rounds.length, 1)
)
test("Get round", ->
  @tournament.addRound()
  ok(@tournament.getRound(1))
)
test("Add match to round", ->
  anna = @tournament.getPlayer("p1")
  bob = @tournament.getPlayer("p2")

  @tournament.addRound()

  round = @tournament.getRound(1)
  round.addMatch(anna, bob)

  ok(round.matches["m_p1@p2"])
)
test("Auto generate first round", ->
  @tournament.generateRound()
  round = @tournament.getCurrentRound()

  equal(Object.keys(round.matches).length, 5)
);
test("Auto generate further rounds", ->
  testRoundGeneration = ->
    tournament = generateTournament()

    anna = tournament.getPlayer("p1")
    bob = tournament.getPlayer("p2")
    claude = tournament.getPlayer("p3")
    dennis = tournament.getPlayer("p4")
    eliot = tournament.getPlayer("p5")
    francis = tournament.getPlayer("p6")
    george = tournament.getPlayer("p7")
    henry = tournament.getPlayer("p8")
    irvine = tournament.getPlayer("p9")
    juliet = tournament.getPlayer("p10")

    round1 = tournament.addRound()
    round1.addMatch(anna, bob).reportWinner(bob)
    round1.addMatch(claude, dennis).reportWinner(dennis)
    round1.addMatch(eliot, francis).reportWinner(francis)
    round1.addMatch(george, henry).reportWinner(henry)
    round1.addMatch(irvine, juliet).reportWinner(juliet)

    round2 = tournament.generateRound()
    equal(Object.keys(tournament.matches).length, 10)

  testingQuantity = 1
  expect(testingQuantity)
  while testingQuantity--
    testRoundGeneration()
);