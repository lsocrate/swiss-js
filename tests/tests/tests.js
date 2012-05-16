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
  console.log(tournament);

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