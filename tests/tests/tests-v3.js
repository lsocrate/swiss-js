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

  test("Get player", function() {
    var player;
    this.tournament.addPlayer("Anna", "Scorpion");
    this.tournament.addPlayer("Bob", "Crane");
    player = this.tournament.getPlayer("p1");
    return ok(player);
  });

  module("Matches", {
    setup: function() {
      this.tournament = new SwissTournament;
      this.tournament.addPlayer("Anna", "Crab");
      this.tournament.addPlayer("Bob", "Crane");
      this.tournament.addPlayer("Claude", "Dragon");
      this.tournament.addPlayer("Dennis", "Lion");
      this.tournament.addPlayer("Eliot", "Mantis");
      this.tournament.addPlayer("Francis", "Phoenix");
      this.tournament.addPlayer("George", "Scorpion");
      this.tournament.addPlayer("Henry", "Spider");
      this.tournament.addPlayer("Irvine", "Unaligned");
      return this.tournament.addPlayer("Juliet", "Unaligned");
    }
  });

  test("Add match", function() {
    this.tournament.addMatch("p1", "p2");
    return ok(this.tournament.matches["m_p1@p2"]);
  });

  test("Get match", function() {
    var match;
    this.tournament.addMatch("p1", "p2");
    match = this.tournament.getMatch("p1", "p2");
    ok(match.players.p1);
    return ok(match.players.p2);
  });

  test("Get player matches", function() {
    var matches;
    this.tournament.addMatch("p1", "p2");
    this.tournament.addMatch("p1", "p3");
    this.tournament.addMatch("p1", "p4");
    matches = this.tournament.getPlayerMatches(this.tournament.getPlayer("p1"));
    ok(matches["m_p1@p2"]);
    ok(matches["m_p1@p3"]);
    return ok(matches["m_p1@p4"]);
  });

  test("Report match victory", function() {
    var match, winner;
    this.tournament.addMatch("p1", "p2");
    match = this.tournament.getMatch("p1", "p2");
    winner = this.tournament.getPlayer("p1");
    match.reportWinner(winner);
    equal("p1", match.winner.id);
    equal("p2", match.loser.id);
    equal(1, match.winner.points);
    equal(0, match.loser.points);
    ok(match.winner.opponents["p2"]);
    return ok(match.loser.opponents["p1"]);
  });

  test("Report double loss", function() {
    var match, player1, player2;
    this.tournament.addMatch("p3", "p4");
    match = this.tournament.getMatch("p3", "p4");
    player1 = this.tournament.getPlayer("p3");
    player2 = this.tournament.getPlayer("p4");
    match.reportDoubleLoss();
    equal(0, player1.points);
    equal(0, player2.points);
    equal(2, match.losers.length);
    ok(match.drawed);
    ok(player1.opponents["p4"]);
    return ok(player2.opponents["p3"]);
  });

  module("Match Matrix", {
    setup: function() {
      this.tournament = new SwissTournament;
      this.tournament.addPlayer("Anna", "Crab");
      this.tournament.addPlayer("Bob", "Crane");
      this.tournament.addPlayer("Claude", "Dragon");
      this.tournament.addPlayer("Dennis", "Lion");
      this.tournament.addPlayer("Eliot", "Mantis");
      this.tournament.addPlayer("Francis", "Phoenix");
      this.tournament.addPlayer("George", "Scorpion");
      this.tournament.addPlayer("Henry", "Spider");
      this.tournament.addPlayer("Irvine", "Unaligned");
      this.tournament.addPlayer("Juliet", "Unaligned");
      return this.players = [this.tournament.getPlayer("p1"), this.tournament.getPlayer("p2"), this.tournament.getPlayer("p3"), this.tournament.getPlayer("p4"), this.tournament.getPlayer("p5")];
    }
  });

  test("Get match matrix", function() {
    var matrix, matrixSize;
    this.tournament.addMatch("p1", "p2");
    matrix = this.tournament.getMatchMatrixForPlayers(this.players);
    matrixSize = Object.keys(matrix.matches).length;
    equal(matrixSize, 9);
    ok(matrix.matches["m_p1@p3"]);
    ok(matrix.matches["m_p1@p4"]);
    ok(matrix.matches["m_p1@p5"]);
    ok(matrix.matches["m_p2@p3"]);
    ok(matrix.matches["m_p2@p4"]);
    ok(matrix.matches["m_p2@p5"]);
    ok(matrix.matches["m_p3@p4"]);
    ok(matrix.matches["m_p3@p5"]);
    return ok(matrix.matches["m_p4@p5"]);
  });

  test("Get unique matches which are the only possible for some of it's players", function() {
    var matrix, matrixSize, singularMatches, singularMatchesSize;
    this.tournament.addMatch("p1", "p2");
    this.tournament.addMatch("p1", "p3");
    this.tournament.addMatch("p1", "p4");
    matrix = this.tournament.getMatchMatrixForPlayers(this.players);
    matrixSize = Object.keys(matrix.matches).length;
    equal(matrixSize, 7);
    singularMatches = matrix.getSingularMatches();
    singularMatchesSize = Object.keys(singularMatches).length;
    return equal(singularMatchesSize, 1);
  });

  test("Remove player matches", function() {
    var matrix, matrixSize, player1;
    matrix = this.tournament.getMatchMatrixForPlayers(this.players);
    player1 = this.tournament.getPlayer("p1");
    matrix.removePlayerMatches(player1);
    matrixSize = Object.keys(matrix.matches).length;
    equal(matrixSize, 6);
    equal(Object.keys(matrix.matrix["p2"]).length, 3);
    equal(Object.keys(matrix.matrix["p3"]).length, 3);
    return equal(Object.keys(matrix.matrix["p4"]).length, 3);
  });

}).call(this);
