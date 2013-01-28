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