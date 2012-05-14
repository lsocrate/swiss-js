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

  deepEqual(player, {name:'Anna', clan:'Crab', points:0});
});

test("New round", function () {
  var tournament = getTestTournament();

  tournament.addRound();

  equal(tournament.rounds.length, 1);
});

test("get round", function () {
  var tournament = getTestTournament();

  tournament.addRound();

  deepEqual(tournament.round(1), {});
});

test("Add match to round", function () {
  var tournament = getTestTournament();

  tournament.addRound();
  tournament.addMatchOnRound('Anna', 'Bob', 1);

  ok(tournament.round(1)['anna@bob']);

  var result = tournament.addMatchOnRound('Anna', 'Johnny', 1);
  ok(result.error);

  var result2 = tournament.addMatchOnRound('Anna', 'Henry', 2);
  ok(result2.error);
});