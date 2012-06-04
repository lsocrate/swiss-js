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

function getTestTournament() {
  return new SwissJS.Tournament()
    .addPlayer('Anna', 'Crab')
    .addPlayer('Bob', 'Crane')
    .addPlayer('Claude', 'Dragon')
    .addPlayer('Dennis', 'Lion')
    .addPlayer('Eliot', 'Mantis')
    .addPlayer('Francis', 'Phoenix')
    .addPlayer('George', 'Scorpion')
    .addPlayer('Henry', 'Spider');
}

function getTestRound1() {
  var tournament = getTestTournament();

  tournament.addRound();
  tournament.getRound(1).addMatch('Anna', 'Bob');
  tournament.getRound(1).addMatch('Claude', 'Dennis');
  tournament.getRound(1).addMatch('Eliot', 'Francis');
  tournament.getRound(1).addMatch('George', 'Henry');

  return tournament;
}
function decideWinner(players){
  return players.sort()[1];
}

function autoPlayRound(tournament) {
  var round = tournament.getRound();
  for(var match in round.matches) {
    if(round.matches.hasOwnProperty(match)) {

      round.matches[match].reportWinner(decideWinner(round.matches[match].players));
    }
  }

  return tournament;
}

function getCompleteTournament(){
  var tournament = getTestTournament();

  tournament.rankPlayers();
  tournament.addRound();
  tournament.getRound().addMatch('Anna', 'Bob');
  tournament.getMatch('Anna', 'Bob').reportWinner('Bob');
  tournament.getRound().addMatch('Claude', 'Dennis');
  tournament.getMatch('Claude', 'Dennis').reportWinner('Dennis');
  tournament.getRound().addMatch('Eliot', 'Francis');
  tournament.getMatch('Eliot', 'Francis').reportWinner('Francis');
  tournament.getRound().addMatch('George', 'Henry');
  tournament.getMatch('George', 'Henry').reportWinner('Henry');
  // Bob     => 1-0
  // Dennis  => 1-0
  // Francis => 1-0
  // Henry   => 1-0
  // Anna    => 0-0
  // Claude  => 0-0
  // Eliot   => 0-0
  // George  => 0-0

  tournament.rankPlayers();
  tournament.addRound();
  tournament.getRound().addMatch('Bob', 'Dennis');
  tournament.getMatch('Bob', 'Dennis').reportWinner('Dennis');
  tournament.getRound().addMatch('Francis', 'Henry');
  tournament.getMatch('Francis', 'Henry').reportWinner('Henry');
  tournament.getRound().addMatch('Claude', 'Anna');
  tournament.getMatch('Claude', 'Anna').reportWinner('Claude');
  tournament.getRound().addMatch('George', 'Eliot');
  tournament.getMatch('George', 'Eliot').reportWinner('George');
  // Dennis  => 2-0
  // Henry   => 2-0
  // Bob     => 1-0
  // Francis => 1-0
  // Claude  => 1-0
  // George  => 1-0
  // Anna    => 0-0
  // Eliot   => 0-0

  tournament.rankPlayers();
  tournament.addRound();
  tournament.getRound().addMatch('Henry', 'Dennis');
  tournament.getMatch('Henry', 'Dennis').reportWinner('Henry');
  tournament.getRound().addMatch('Bob', 'Claude');
  tournament.getMatch('Bob', 'Claude').reportWinner('Claude');
  tournament.getRound().addMatch('Francis', 'George');
  tournament.getMatch('Francis', 'George').reportWinner('George');
  tournament.getRound().addMatch('Anna', 'Eliot');
  tournament.getMatch('Anna', 'Eliot').reportWinner('Eliot');
  // Henry   => 3-0 = [points 3][ms from victories 5][ms total = 5]
  // Dennis  => 2-0 = [points 2][ms from victories 3][ms total = 6]
  // George  => 2-0 = [points 2][ms from victories 2][ms total = 5]
  // Claude  => 2-0 = [points 2][ms from victories 1][ms total = 3]
  // Francis => 1-0 = [points 1][ms from victories 1][ms total = 6]
  // Bob     => 1-0 = [points 1][ms from victories 0][ms total = 4]
  // Eliot   => 1-0 = [points 1][ms from victories 0][ms total = 3]
  // Anna    => 0-0 = [points 0][ms from victories 0][ms total = 4]

  tournament.rankPlayers();

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
  this.tournament.addPlayer('Irvine', 'Spider');
  this.tournament.addPlayer('John', 'Spider');

  this.tournament.rankPlayers();
  this.tournament.addRound();
  this.tournament.getRound().addMatch('Anna', 'Bob');
  this.tournament.getMatch('Anna', 'Bob').reportWinner('Bob');
  this.tournament.getRound().addMatch('Claude', 'Dennis');
  this.tournament.getMatch('Claude', 'Dennis').reportWinner('Dennis');
  this.tournament.getRound().addMatch('Eliot', 'Francis');
  this.tournament.getMatch('Eliot', 'Francis').reportWinner('Francis');
  this.tournament.getRound().addMatch('George', 'Henry');
  this.tournament.getMatch('George', 'Henry').reportWinner('Henry');
  this.tournament.getRound().addMatch('Irvine', 'John');
  this.tournament.getMatch('Irvine', 'John').reportWinner('John');

  this.tournament.generateRound();

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

  equal(this.tournament.makeMatchName(anna, bob), 'anna@bob');
  equal(this.tournament.makeMatchName(bob, anna), 'anna@bob');
});

test("Get match", function () {
  var match = this.tournament2.getMatch('Claude', 'Dennis');
  deepEqual(match.players, ['Claude', 'Dennis']);
  equal(match.name, 'claude@dennis');
  equal(match.winner, undefined);
  equal(match.isDone, false);
});

test("Report match result", function () {
  var match = this.tournament2.getMatch('Claude', 'Dennis');
  match.reportWinner('Dennis');
  equal(match.winner, 'Dennis');
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
test("Rank players", function () {
  var tournament = getTestRound1();

  tournament.getMatch('Anna', 'Bob').reportWinner('Anna');
  tournament.getMatch('Claude', 'Dennis').reportWinner('Claude');
  tournament.getMatch('Eliot', 'Francis').reportWinner('Eliot');
  tournament.getMatch('George', 'Henry').reportWinner('George');

  tournament.rankPlayers();
  var annaPosition = tournament.getPlayer('Anna').getPosition();
  var isAnnaTopHalf = ((annaPosition > 0) && (annaPosition < 5));

  ok(isAnnaTopHalf);

  var bobPosition = tournament.getPlayer('Bob').getPosition();
  var isBobBottomHalf = (bobPosition > 4);

  ok(isBobBottomHalf);
});

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