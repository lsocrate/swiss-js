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