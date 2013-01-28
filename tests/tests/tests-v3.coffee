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
  console.log(matches)
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