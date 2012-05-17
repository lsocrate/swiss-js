function getTestTournament() {
  return new SwissTournament()
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
  var roundMatches = tournament.getRound();
  for(var match in roundMatches) {
    if(roundMatches.hasOwnProperty(match)) {
      roundMatches[match].reportWinner(decideWinner(roundMatches[match].players));
    }
  }

  return tournament;
}

function getCompleteTournament(){
  var tournament = getTestTournament();

  tournament.updateRanking();
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

  tournament.updateRanking();
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

  tournament.updateRanking();
  tournament.addRound();
  tournament.getRound().addMatch('Henry', 'Dennis');
  tournament.getMatch('Henry', 'Dennis').reportWinner('Henry');
  tournament.getRound().addMatch('Bob', 'Claude');
  tournament.getMatch('Bob', 'Claude').reportWinner('Claude');
  tournament.getRound().addMatch('Francis', 'George');
  tournament.getMatch('Francis', 'George').reportWinner('George');
  tournament.getRound().addMatch('Anna', 'Eliot');
  tournament.getMatch('Anna', 'Eliot').reportWinner('Eliot');
  // Henry   => 3-0 = [points 3][ms 2x1x2 = 5]
  // Dennis  => 2-0 = [points 2][ms 2x1x3 = 6]
  // George  => 2-0 = [points 2][ms 3x1x1 = 5]
  // Claude  => 2-0 = [points 2][ms 2x0x1 = 3]
  // Francis => 1-0 = [points 1][ms 1x3x2 = 6]
  // Bob     => 1-0 = [points 1][ms 0x2x2 = 4]
  // Eliot   => 1-0 = [points 1][ms 1x2x0 = 3]
  // Anna    => 0-0 = [points 0][ms 1x2x1 = 4]

  tournament.updateRanking();

  return tournament;
}

module('Player');
test("Add player", function () {
  var tournament = new SwissTournament();

  tournament.addPlayer('Anna', 'Scorpion');
  equal(tournament.players.length, 1);
});

test("Get player", function () {
  var tournament = getTestTournament();
  var player = tournament.getPlayer('Anna');

  equal(player.name, 'Anna');
  equal(player.clan, 'crab');
  equal(player.points, 0);
});
test("Get player opponents", function () {
  var tournament = getCompleteTournament();
  var opponents = tournament.getPlayer('Anna').getOpponents();

  deepEqual(opponents, ['Bob', 'Claude', 'Eliot'])
});

module('Round');
test("New round", function () {
  var tournament = getTestTournament();

  tournament.addRound();

  equal(tournament.rounds.length, 1);
});

test("Get round", function () {
  var tournament = getTestTournament();

  tournament.addRound();

  ok(tournament.getRound(1));
});

test("Add match to round", function () {
  var tournament = getTestTournament();

  tournament.addRound();
  tournament.getRound(1).addMatch('Anna', 'Bob');

  ok(tournament.getRound(1)['anna@bob']);

  var result = tournament.getRound(1).addMatch('Anna', 'Johnny');
  ok(result.error);
});

test("Generate first round", function () {
  var tournament = getTestTournament();
  tournament.generateRound();
  ok(tournament.getRound(1));
});

test("Generate other rounds", function () {
  var tournament = getTestTournament();

  tournament.generateRound();
  autoPlayRound(tournament);

  tournament.generateRound();
  autoPlayRound(tournament);

  tournament.generateRound();
  autoPlayRound(tournament);

  tournament.updateRanking();

  ok((Object.keys(tournament.getRound(3)).length > 0));
});

module('Matches');
test("Get match", function () {
  var tournament = getTestRound1();

  var match = tournament.getMatch('Claude', 'Dennis');
  deepEqual(match.players, ['Claude', 'Dennis']);
  equal(match.name, 'claude@dennis');
  equal(match.winner, undefined);
  equal(match.isDone, false);
});

test("Report match result", function () {
  var tournament = getTestRound1();

  var match = tournament.getMatch('Claude', 'Dennis');
  match.reportWinner('Dennis');
  equal(match.winner, 'Dennis');
  equal(match.isDone, true);

  var match2 = tournament.getMatch('Eliot', 'Francis');
  match2.reportDraw();
  equal(match2.winner, undefined);
  equal(match2.isDone, true);
});

module('Ranking');
test("Rank players", function () {
  var tournament = getTestRound1();

  tournament.getMatch('Anna', 'Bob').reportWinner('Anna');
  tournament.getMatch('Claude', 'Dennis').reportWinner('Claude');
  tournament.getMatch('Eliot', 'Francis').reportWinner('Eliot');
  tournament.getMatch('George', 'Henry').reportWinner('George');

  tournament.updateRanking();
  var annaPosition = tournament.getPlayer('Anna').getPosition();
  var isAnnaTopHalf = ((annaPosition > 0) && (annaPosition < 5));

  ok(isAnnaTopHalf);

  var bobPosition = tournament.getPlayer('Bob').getPosition();
  var isBobBottomHalf = (bobPosition > 4);

  ok(isBobBottomHalf);
});