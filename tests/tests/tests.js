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

test("Schedule matchs", function () {
  var tournament = getTestTournament();

  tournament.addMatch('Anna', 'Bob');
  tournament.addMatch('Claude', 'Dennis');
  tournament.addMatch('Eliot', 'Francis');
  tournament.addMatch('George', 'Henry');

  equal(tournament.matches.length, 4);
});

test("Get match", function () {
  var tournament = getTestTournament();

  tournament.addMatch('Anna', 'Bob');
  tournament.addMatch('Claude', 'Dennis');
  tournament.addMatch('Eliot', 'Francis');
  tournament.addMatch('George', 'Henry');

  deepEqual(tournament.getMatch('Francis'), ['Eliot', 'Francis']);
});