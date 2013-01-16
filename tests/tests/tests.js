function fillTournament(tournament) {
  return tournament.addPlayer('Anna', 'Crab')
    .addPlayer('Bob', 'Crane')
    .addPlayer('Claude', 'Dragon')
    .addPlayer('Dennis', 'Lion')
    .addPlayer('Eliot', 'Mantis')
    .addPlayer('Francis', 'Phoenix')
    .addPlayer('George', 'Scorpion')
    .addPlayer('Henry', 'Spider');
}

function getTestRound1() {
  var tournament = fillTournament(new SwissJS.Tournament());

  with (tournament) {
    addRound();
    getRound(1).addMatch('Anna', 'Bob');
    getRound(1).addMatch('Claude', 'Dennis');
    getRound(1).addMatch('Eliot', 'Francis');
    getRound(1).addMatch('George', 'Henry');
  }

  return tournament;
}

function autoPlayRound(tournament) {
  var round = tournament.getRound();
  for(var match in round.matches) {
    if(round.matches.hasOwnProperty(match)) {
      var players = [
        round.matches[match].players[0].name,
        round.matches[match].players[1].name
      ];

      round.matches[match].reportWinner(players.sort()[1]);
    }
  }

  return tournament;
}

function getCompleteTournament(){
  var tournament = fillTournament(new SwissJS.Tournament());

  with (tournament) {
    rankPlayers();
    addRound();
    getRound().addMatch('Anna', 'Bob');
    getMatch('Anna', 'Bob').reportWinner('Bob');
    getRound().addMatch('Claude', 'Dennis');
    getMatch('Claude', 'Dennis').reportWinner('Dennis');
    getRound().addMatch('Eliot', 'Francis');
    getMatch('Eliot', 'Francis').reportWinner('Francis');
    getRound().addMatch('George', 'Henry');
    getMatch('George', 'Henry').reportWinner('Henry');
    // Bob     => 1-0
    // Dennis  => 1-0
    // Francis => 1-0
    // Henry   => 1-0
    // Anna    => 0-0
    // Claude  => 0-0
    // Eliot   => 0-0
    // George  => 0-0

    rankPlayers();
    addRound();
    getRound().addMatch('Bob', 'Dennis');
    getMatch('Bob', 'Dennis').reportWinner('Dennis');
    getRound().addMatch('Francis', 'Henry');
    getMatch('Francis', 'Henry').reportWinner('Henry');
    getRound().addMatch('Claude', 'Anna');
    getMatch('Claude', 'Anna').reportWinner('Claude');
    getRound().addMatch('George', 'Eliot');
    getMatch('George', 'Eliot').reportWinner('George');
    // Dennis  => 2-0
    // Henry   => 2-0
    // Bob     => 1-0
    // Francis => 1-0
    // Claude  => 1-0
    // George  => 1-0
    // Anna    => 0-0
    // Eliot   => 0-0

    rankPlayers();
    addRound();
    getRound().addMatch('Henry', 'Dennis');
    getMatch('Henry', 'Dennis').reportWinner('Henry');
    getRound().addMatch('Bob', 'Claude');
    getMatch('Bob', 'Claude').reportWinner('Claude');
    getRound().addMatch('Francis', 'George');
    getMatch('Francis', 'George').reportWinner('George');
    getRound().addMatch('Anna', 'Eliot');
    getMatch('Anna', 'Eliot').reportWinner('Eliot');
    // Henry   => 3-0 = [points 3][ms from victories 5][ms total = 5]
    // Dennis  => 2-0 = [points 2][ms from victories 3][ms total = 6]
    // George  => 2-0 = [points 2][ms from victories 2][ms total = 5]
    // Claude  => 2-0 = [points 2][ms from victories 1][ms total = 3]
    // Francis => 1-0 = [points 1][ms from victories 1][ms total = 6]
    // Bob     => 1-0 = [points 1][ms from victories 0][ms total = 4]
    // Eliot   => 1-0 = [points 1][ms from victories 0][ms total = 3]
    // Anna    => 0-0 = [points 0][ms from victories 0][ms total = 4]

    rankPlayers();
  }

  return tournament;
}

module('Player', {
  setup: function () {
    this.tournament = new SwissJS.Tournament();
  }
});
test("Add player", function () {
  this.tournament.addPlayer('Anna', 'Scorpion');
  equal(this.tournament.players.length, 1);
});

test("Get player", function () {
  fillTournament(this.tournament);
  var player = this.tournament.getPlayer('Anna');

  equal(player.name, 'Anna');
  equal(player.clan, 'crab');
  equal(player.points, 0);
});

module('Round', {
  setup: function () {
    this.tournament = fillTournament(new SwissJS.Tournament());
  }
});
test("New round", function () {
  this.tournament.addRound();

  equal(this.tournament.rounds.length, 1);
});

test("Get round", function () {
  this.tournament.addRound();

  ok(this.tournament.getRound(1));
});

test("Add match to round", function () {
  this.tournament.addRound();
  this.tournament.getRound(1).addMatch('Anna', 'Bob');

  ok(this.tournament.getRound(1).matches['anna@bob']);

  var result = this.tournament.getRound(1).addMatch('Anna', 'Johnny');
  ok(result.error);
});

test("Generate first round", function () {
  this.tournament.generateRound();
  ok(this.tournament.getRound(1));
});

test("Generate other rounds", function () {
  this.tournament.generateRound();
  autoPlayRound(this.tournament);

  this.tournament.generateRound();
  autoPlayRound(this.tournament);

  this.tournament.generateRound();
  autoPlayRound(this.tournament);

  this.tournament.rankPlayers();
  ok((Object.keys(this.tournament.getRound(3)).length > 0));
});
test("Generate rounds with odd numbered tier", function () {
  with (this.tournament) {
    addPlayer('Irvine', 'Spider');
    addPlayer('John', 'Spider');

    rankPlayers();
    addRound();
    getRound().addMatch('Anna', 'Bob');
    getMatch('Anna', 'Bob').reportWinner('Bob');
    getRound().addMatch('Claude', 'Dennis');
    getMatch('Claude', 'Dennis').reportWinner('Dennis');
    getRound().addMatch('Eliot', 'Francis');
    getMatch('Eliot', 'Francis').reportWinner('Francis');
    getRound().addMatch('George', 'Henry');
    getMatch('George', 'Henry').reportWinner('Henry');
    getRound().addMatch('Irvine', 'John');
    getMatch('Irvine', 'John').reportWinner('John');

    generateRound();
  }

  equal(Object.keys(this.tournament.getRound(2).matches).length, 5);
});

module('Matches', {
  setup: function () {
    this.tournament = fillTournament(new SwissJS.Tournament());
    this.tournament2 = fillTournament(new SwissJS.Tournament());
    this.tournament2.addRound();
    this.tournament2.getRound(1).addMatch('Claude', 'Dennis');
    this.tournament2.getRound(1).addMatch('Eliot', 'Francis');
  }
});
test("Make match name", function () {
  var anna = this.tournament.getPlayer('Anna');
  var bob = this.tournament.getPlayer('Bob');

  equal(SwissJS.makeMatchName(anna, bob), 'anna@bob');
  equal(SwissJS.makeMatchName(bob, anna), 'anna@bob');
});

test("Get match", function () {
  var match = this.tournament2.getMatch('Claude', 'Dennis');

  equal(match.players[0].name, 'Claude');
  equal(match.players[1].name, 'Dennis');
  equal(match.name, 'claude@dennis');
  equal(match.winner, undefined);
  equal(match.isDone, false);
});

test("Report match result", function () {
  var match = this.tournament2.getMatch('Claude', 'Dennis');
  match.reportWinner('Dennis');

  equal(match.winner.name, 'Dennis');
  equal(this.tournament2.getPlayer('Claude').points, 0);
  equal(this.tournament2.getPlayer('Dennis').points, 1);
  equal(match.isDone, true);

  var match2 = this.tournament2.getMatch('Eliot', 'Francis');
  match2.reportDraw();
  equal(match2.winner, undefined);
  equal(match2.isDone, true);
});
test("Generate possible matches matrix", function () {
  var players = [
    this.tournament.getPlayer('Anna'),
    this.tournament.getPlayer('Bob'),
    this.tournament.getPlayer('Claude'),
    this.tournament.getPlayer('Dennis')
  ];
  var matrix = new SwissJS.MatchesMatrix(this.tournament, players);

  equal(matrix.possibilities.length, 6);
});
test("Generate possible matches matrix with repeated and oddPlayer", function () {
  this.tournament.addRound();
  this.tournament.getRound().addMatch('Anna', 'Bob');
  var players = [
    this.tournament.getPlayer('Anna'),
    this.tournament.getPlayer('Bob'),
    this.tournament.getPlayer('Claude')
  ];
  var oddPlayer = this.tournament.getPlayer('Dennis');
  var matrix = new SwissJS.MatchesMatrix(this.tournament, players, oddPlayer);

  equal(matrix.possibilities.length, 5);
});
test("Remove player matches", function () {
  this.tournament.addRound();
  this.tournament.getRound().addMatch('Anna', 'Bob');
  var players = [
    this.tournament.getPlayer('Anna'),
    this.tournament.getPlayer('Bob'),
    this.tournament.getPlayer('Claude')
  ];
  var oddPlayer = this.tournament.getPlayer('Dennis');
  var matrix = new SwissJS.MatchesMatrix(this.tournament, players, oddPlayer);
  matrix.removePlayerMatches(oddPlayer);

  equal(matrix.possibilities.length, 2);
});
test("Get player matches", function () {
  this.tournament.addRound();
  this.tournament.getRound().addMatch('Anna', 'Bob');
  var players = [
    this.tournament.getPlayer('Anna'),
    this.tournament.getPlayer('Bob'),
    this.tournament.getPlayer('Claude')
  ];
  var oddPlayer = this.tournament.getPlayer('Dennis');
  var matrix = new SwissJS.MatchesMatrix(this.tournament, players, oddPlayer);
  var matches = matrix.getPlayerMatches(oddPlayer);

  equal(matches.length, 3);
});

module('Ranking');
test("Rank players with ms", function () {
  var tournament = getCompleteTournament();
  tournament.end();

  equal(tournament.getPlayer('Henry').getPosition(), 1);
  equal(tournament.getPlayer('Dennis').getPosition(), 2);
  equal(tournament.getPlayer('George').getPosition(), 3);
  equal(tournament.getPlayer('Claude').getPosition(), 4);
  equal(tournament.getPlayer('Francis').getPosition(), 5);
  equal(tournament.getPlayer('Bob').getPosition(), 6);
  equal(tournament.getPlayer('Eliot').getPosition(), 7);
  equal(tournament.getPlayer('Anna').getPosition(), 8);
});