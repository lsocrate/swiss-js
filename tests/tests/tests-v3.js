// Generated by CoffeeScript 1.4.0
(function() {

  module("Player", {
    setup: function() {
      return this.tournament = new SwissTournament;
    }
  });

  test("Add player", function() {
    this.tournament.addPlayer("Anna", "Scorpion");
    return ok(this.tournament.players.p1);
  });

}).call(this);
