// Generated by CoffeeScript 1.4.0
(function() {
  var generateTournament;

  generateTournament = function() {
    var tournament;
    tournament = new SwissTournament;
    tournament.addPlayer("Anna", "Crab");
    tournament.addPlayer("Bob", "Crane");
    tournament.addPlayer("Claude", "Dragon");
    tournament.addPlayer("Dennis", "Lion");
    tournament.addPlayer("Eliot", "Mantis");
    tournament.addPlayer("Francis", "Phoenix");
    tournament.addPlayer("George", "Scorpion");
    tournament.addPlayer("Henry", "Spider");
    tournament.addPlayer("Irvine", "Unaligned");
    tournament.addPlayer("Juliet", "Unaligned");
    return tournament;
  };

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
      return this.tournament = generateTournament();
    }
  });

  test("Add match", function() {
    var player1, player2;
    this.tournament.addMatch("p1", "p2");
    player1 = this.tournament.getPlayer("p1");
    player2 = this.tournament.getPlayer("p2");
    ok(this.tournament.matches["m_p1@p2"]);
    ok(player1.opponents.p2);
    return ok(player2.opponents.p1);
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
      this.tournament = generateTournament();
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

  module("Ranking", {
    setup: function() {
      this.tournament = generateTournament();
      this.anna = this.tournament.getPlayer("p1");
      this.bob = this.tournament.getPlayer("p2");
      this.claude = this.tournament.getPlayer("p3");
      this.dennis = this.tournament.getPlayer("p4");
      this.eliot = this.tournament.getPlayer("p5");
      this.francis = this.tournament.getPlayer("p6");
      this.george = this.tournament.getPlayer("p7");
      this.henry = this.tournament.getPlayer("p8");
      this.irvine = this.tournament.getPlayer("p9");
      this.juliet = this.tournament.getPlayer("p10");
      this.tournament.addMatch(this.dennis.id, this.juliet.id).reportWinner(this.juliet);
      this.tournament.addMatch(this.francis.id, this.irvine.id).reportWinner(this.irvine);
      this.tournament.addMatch(this.bob.id, this.henry.id).reportWinner(this.henry);
      this.tournament.addMatch(this.anna.id, this.claude.id).reportWinner(this.claude);
      this.tournament.addMatch(this.eliot.id, this.george.id).reportWinner(this.george);
      this.tournament.addMatch(this.irvine.id, this.juliet.id).reportWinner(this.juliet);
      this.tournament.addMatch(this.henry.id, this.george.id).reportWinner(this.henry);
      this.tournament.addMatch(this.dennis.id, this.claude.id).reportWinner(this.dennis);
      this.tournament.addMatch(this.bob.id, this.francis.id).reportWinner(this.francis);
      this.tournament.addMatch(this.anna.id, this.eliot.id).reportWinner(this.eliot);
      this.tournament.addMatch(this.henry.id, this.juliet.id).reportWinner(this.juliet);
      this.tournament.addMatch(this.george.id, this.irvine.id).reportWinner(this.irvine);
      this.tournament.addMatch(this.claude.id, this.francis.id).reportWinner(this.francis);
      this.tournament.addMatch(this.dennis.id, this.eliot.id).reportWinner(this.eliot);
      this.tournament.addMatch(this.anna.id, this.bob.id).reportWinner(this.bob);
      this.tournament.addMatch(this.francis.id, this.juliet.id).reportWinner(this.juliet);
      this.tournament.addMatch(this.eliot.id, this.irvine.id).reportWinner(this.irvine);
      this.tournament.addMatch(this.claude.id, this.henry.id).reportWinner(this.henry);
      this.tournament.addMatch(this.dennis.id, this.george.id).reportWinner(this.george);
      return this.tournament.addMatch(this.anna.id, this.bob.id).reportWinner(this.bob);
    }
  });

  test("Rank players with ms", function() {
    var ranking;
    ranking = this.tournament.getRankedPlayers();
    equal(this.juliet.points, 4, "juliet points");
    equal(this.irvine.points, 3, "irvine points");
    equal(this.henry.points, 3, "henry points");
    equal(this.george.points, 2, "george points");
    equal(this.francis.points, 2, "francis points");
    equal(this.eliot.points, 2, "eliot points");
    equal(this.bob.points, 2, "bob points");
    equal(this.claude.points, 1, "claude points");
    equal(this.dennis.points, 1, "dennis points");
    equal(this.anna.points, 0, "anna points");
    equal(this.juliet.ms.total, 9, "juliet ms total");
    equal(this.irvine.ms.total, 10, "irvine ms total");
    equal(this.henry.ms.total, 9, "henry ms total");
    equal(this.francis.ms.total, 10, "francis ms total");
    equal(this.george.ms.total, 9, "george ms total");
    equal(this.eliot.ms.total, 6, "eliot ms total");
    equal(this.bob.ms.total, 5, "bob ms total");
    equal(this.dennis.ms.total, 9, "dennis ms total");
    equal(this.claude.ms.total, 6, "claude ms total");
    equal(this.anna.ms.total, 5, "anna ms total");
    equal(ranking[0].name, "Juliet", "Juliet ranking");
    equal(ranking[1].name, "Irvine", "Irvine ranking");
    equal(ranking[2].name, "Henry", "Henry ranking");
    equal(ranking[3].name, "Francis", "Francis ranking");
    equal(ranking[4].name, "George", "George ranking");
    equal(ranking[5].name, "Eliot", "Eliot ranking");
    equal(ranking[6].name, "Bob", "Bob ranking");
    equal(ranking[7].name, "Dennis", "Dennis ranking");
    equal(ranking[8].name, "Claude", "Claude ranking");
    return equal(ranking[9].name, "Anna", "Anna ranking");
  });

  test("Get players grouped by points", function() {
    var playersGrouped;
    playersGrouped = this.tournament.getPlayerListGroupedByPoints();
    equal(playersGrouped[0].length, 1);
    equal(playersGrouped[1].length, 2);
    equal(playersGrouped[2].length, 4);
    equal(playersGrouped[3].length, 2);
    return equal(playersGrouped[4].length, 1);
  });

  module("Round", {
    setup: function() {
      return this.tournament = generateTournament();
    }
  });

  test("Add round", function() {
    this.tournament.addRound();
    return equal(this.tournament.rounds.length, 1);
  });

  test("Get round", function() {
    this.tournament.addRound();
    return ok(this.tournament.getRound(1));
  });

  test("Add match to round", function() {
    var anna, bob, round;
    anna = this.tournament.getPlayer("p1");
    bob = this.tournament.getPlayer("p2");
    this.tournament.addRound();
    round = this.tournament.getRound(1);
    round.addMatch(anna, bob);
    return ok(round.matches["m_p1@p2"]);
  });

  test("Auto generate first round", function() {
    var round;
    this.tournament.generateRound();
    round = this.tournament.getCurrentRound();
    return equal(Object.keys(round.matches).length, 5);
  });

  test("Auto generate further rounds", function() {
    var testRoundGeneration, testingQuantity, _results;
    testRoundGeneration = function() {
      var anna, bob, claude, dennis, eliot, francis, george, henry, irvine, juliet, round1, round2, tournament;
      tournament = generateTournament();
      anna = tournament.getPlayer("p1");
      bob = tournament.getPlayer("p2");
      claude = tournament.getPlayer("p3");
      dennis = tournament.getPlayer("p4");
      eliot = tournament.getPlayer("p5");
      francis = tournament.getPlayer("p6");
      george = tournament.getPlayer("p7");
      henry = tournament.getPlayer("p8");
      irvine = tournament.getPlayer("p9");
      juliet = tournament.getPlayer("p10");
      round1 = tournament.addRound();
      round1.addMatch(anna, bob).reportWinner(bob);
      round1.addMatch(claude, dennis).reportWinner(dennis);
      round1.addMatch(eliot, francis).reportWinner(francis);
      round1.addMatch(george, henry).reportWinner(henry);
      round1.addMatch(irvine, juliet).reportWinner(juliet);
      round2 = tournament.generateRound();
      return equal(Object.keys(tournament.matches).length, 10);
    };
    testingQuantity = 1;
    expect(testingQuantity);
    _results = [];
    while (testingQuantity--) {
      _results.push(testRoundGeneration());
    }
    return _results;
  });

}).call(this);
