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

test("New round", function () {
  var tournament = getTestTournament();

  tournament.addRound();

  equal(tournament.rounds.length, 1);
});

test("Get round", function () {
  var tournament = getTestTournament();

  tournament.addRound();

  ok(tournament.round(1));
});

test("Add match to round", function () {
  var tournament = getTestTournament();

  tournament.addRound();
  tournament.round(1).addMatch('Anna', 'Bob');

  ok(tournament.round(1)['anna@bob']);

  var result = tournament.round(1).addMatch('Anna', 'Johnny');
  ok(result.error);
});

test("Get match", function () {
  var tournament = getTestTournament();

  tournament.addRound();
  tournament.round(1).addMatch('Anna', 'Bob');
  tournament.round(1).addMatch('Claude', 'Dennis');
  tournament.round(1).addMatch('Eliot', 'Francis');
  tournament.round(1).addMatch('George', 'Henry');

  var match = tournament.getMatch('Claude', 'Dennis');
  deepEqual(match.players, ['Claude', 'Dennis']);
  equal(match.name, 'claude@dennis');
  equal(match.winner, undefined);
  equal(match.isDone, false);
});