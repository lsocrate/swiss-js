// Generated by CoffeeScript 1.4.0
(function() {
  var Match, MatchMatrix, Player, Round, makeMatchName, rankPlayers;

  makeMatchName = function(player1, player2) {
    var ids;
    ids = [player1.id, player2.id];
    ids.sort(function(a, b) {
      a = parseInt(a.slice(1), 10);
      b = parseInt(b.slice(1), 10);
      return a - b;
    });
    return "m_" + ids[0] + "@" + ids[1];
  };

  rankPlayers = function(player1, player2) {
    if (player2.points !== player1.points) {
      return player2.points - player1.points;
    } else if (player2.ms.total !== player1.ms.total) {
      return player2.ms.total - player1.ms.total;
    } else if (player2.ms.victories !== player1.ms.victories) {
      return player2.ms.victories - player1.ms.victories;
    } else {
      return player2.ms.losses - player1.ms.losses;
    }
  };

  Array.prototype.popRandom = function() {
    return this.splice(Math.ceil(Math.random() * (this.length - 1)), 1)[0];
  };

  Object.popRandom = function(object) {
    var key, value;
    key = Object.keys(object).popRandom();
    value = object[key];
    delete object[key];
    return [key, value];
  };

  Object.size = function(object) {
    return Object.keys(object).length;
  };

  Player = (function() {

    function Player(name, clan, id) {
      this.name = name;
      this.clan = clan;
      this.id = id;
      this.points = 0;
      this.opponents = {};
      this.matches = {};
      this.ms = {
        total: 0,
        victories: 0,
        losses: 0
      };
    }

    Player.prototype.registerMatch = function(match) {
      return this.matches[match.id] = match;
    };

    Player.prototype.calculateMiliseconds = function() {
      var match, matchId, opponent, _ref;
      this.ms = {
        total: 0,
        victories: 0,
        losses: 0
      };
      _ref = this.matches;
      for (matchId in _ref) {
        match = _ref[matchId];
        opponent = match.getOpponentForPlayer(this);
        this.ms.total += opponent.points;
        if (match.winner.id === this.id) {
          this.ms.victories += opponent.points;
        } else {
          this.ms.losses += opponent.points;
        }
      }
      return this.ms;
    };

    return Player;

  })();

  Match = (function() {

    function Match(player1, player2) {
      this.id = makeMatchName(player1, player2);
      this.players = {};
      this.players[player1.id] = player1;
      this.players[player2.id] = player2;
    }

    Match.prototype.reportWinner = function(winner) {
      var player, playerId, _ref;
      this.winner = winner;
      _ref = this.players;
      for (playerId in _ref) {
        player = _ref[playerId];
        if (playerId !== this.winner.id) {
          this.loser = player;
        }
      }
      this.winner.points++;
      this.winner.opponents[this.loser.id] = this.loser;
      return this.loser.opponents[this.winner.id] = this.winner;
    };

    Match.prototype.reportDoubleLoss = function() {
      var player1, player1Id, player2, player2Id, _ref;
      _ref = Object.keys(this.players), player1Id = _ref[0], player2Id = _ref[1];
      player1 = this.players[player1Id];
      player2 = this.players[player2Id];
      this.drawed = true;
      this.losers = [player1, player2];
      player1.opponents[player2.id] = player2;
      return player2.opponents[player1.id] = player1;
    };

    Match.prototype.getOpponentForPlayer = function(player) {
      var matchPlayer, matchPlayerId, _ref;
      _ref = this.players;
      for (matchPlayerId in _ref) {
        matchPlayer = _ref[matchPlayerId];
        if (matchPlayer.id !== player.id) {
          return matchPlayer;
        }
      }
    };

    return Match;

  })();

  MatchMatrix = (function() {

    function MatchMatrix(players, tournament) {
      var match, player1, player2, _i, _len;
      this.tournament = tournament;
      this.matches = {};
      this.matrix = {};
      while (player1 = players.shift()) {
        for (_i = 0, _len = players.length; _i < _len; _i++) {
          player2 = players[_i];
          match = new Match(player1, player2);
          if (this.tournament.matches[match.id] == null) {
            this.matches[match.id] = match;
            if (this.matrix[player1.id] == null) {
              this.matrix[player1.id] = {};
            }
            this.matrix[player1.id][player2.id] = match;
            if (this.matrix[player2.id] == null) {
              this.matrix[player2.id] = {};
            }
            this.matrix[player2.id][player1.id] = match;
          }
        }
      }
    }

    MatchMatrix.prototype.getSingularMatches = function() {
      var match, matches, opponents, opponentsKeys, playerId, _ref;
      matches = {};
      _ref = this.matrix;
      for (playerId in _ref) {
        opponents = _ref[playerId];
        opponentsKeys = Object.keys(opponents);
        if (opponentsKeys.length === 1) {
          match = opponents[opponentsKeys[0]];
          matches[match.id] = match;
        }
      }
      return matches;
    };

    MatchMatrix.prototype.removePlayerMatches = function(player) {
      var match, matchId, opponentId, opponentOpponents, _ref, _ref1, _results;
      delete this.matrix[player.id];
      _ref = this.matches;
      for (matchId in _ref) {
        match = _ref[matchId];
        if (match.players[player.id] != null) {
          delete this.matches[matchId];
        }
      }
      _ref1 = this.matrix;
      _results = [];
      for (opponentId in _ref1) {
        opponentOpponents = _ref1[opponentId];
        if (opponentOpponents[player.id] != null) {
          _results.push(delete this.matrix[opponentId][player.id]);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return MatchMatrix;

  })();

  Round = (function() {

    function Round(tournament) {
      this.tournament = tournament;
      this.matches = {};
    }

    Round.prototype.addMatch = function(player1, player2) {
      var match;
      match = this.tournament.addMatch(player1.id, player2.id);
      return this.matches[match.id] = match;
    };

    return Round;

  })();

  this.SwissTournament = (function() {

    function SwissTournament() {
      this.players = {};
      this.matches = {};
      this.rounds = [];
    }

    SwissTournament.prototype.nextPlayerId = function() {
      var playerCount;
      playerCount = Object.keys(this.players).length;
      return "p" + ++playerCount;
    };

    SwissTournament.prototype.addPlayer = function(name, clan) {
      var player;
      player = new Player(name, clan, this.nextPlayerId());
      return this.players[player.id] = player;
    };

    SwissTournament.prototype.getPlayer = function(playerId) {
      return this.players[playerId];
    };

    SwissTournament.prototype.addMatch = function(player1Id, player2Id) {
      var match, player1, player2;
      player1 = this.getPlayer(player1Id);
      player2 = this.getPlayer(player2Id);
      player1.opponents[player2.id] = player2;
      player2.opponents[player1.id] = player1;
      match = new Match(player1, player2);
      player1.registerMatch(match);
      player2.registerMatch(match);
      return this.matches[match.id] = match;
    };

    SwissTournament.prototype.getMatch = function(player1Id, player2Id) {
      var player1, player2;
      player1 = this.getPlayer(player1Id);
      player2 = this.getPlayer(player2Id);
      return this.matches[makeMatchName(player1, player2)];
    };

    SwissTournament.prototype.getPlayerMatches = function(player) {
      var match, matchId, matches, _ref;
      matches = {};
      _ref = this.matches;
      for (matchId in _ref) {
        match = _ref[matchId];
        if (match.players[player.id] != null) {
          matches[matchId] = match;
        }
      }
      return matches;
    };

    SwissTournament.prototype.getMatchMatrixForPlayers = function(players) {
      return new MatchMatrix(players, this);
    };

    SwissTournament.prototype.addRound = function() {
      var round;
      round = new Round(this);
      this.rounds.push(round);
      return round;
    };

    SwissTournament.prototype.getRound = function(round) {
      return this.rounds[--round];
    };

    SwissTournament.prototype.getCurrentRound = function() {
      return this.rounds[this.rounds.length - 1];
    };

    SwissTournament.prototype.getPlayerList = function() {
      var id, player, playerList, _ref;
      playerList = [];
      _ref = this.players;
      for (id in _ref) {
        player = _ref[id];
        playerList.push(player);
      }
      return playerList;
    };

    SwissTournament.prototype.getPlayerListGroupedByPoints = function() {
      var id, player, playerList, _ref;
      playerList = [];
      _ref = this.players;
      for (id in _ref) {
        player = _ref[id];
        if (playerList[player.points] == null) {
          playerList[player.points] = [];
        }
        playerList[player.points].push(player);
      }
      return playerList;
    };

    SwissTournament.prototype.getRankedPlayers = function() {
      var playerList;
      playerList = this.getPlayerList();
      playerList.forEach(function(player) {
        return player.calculateMiliseconds();
      });
      return playerList.sort(rankPlayers);
    };

    SwissTournament.prototype.generateRound = function() {
      var group, match, matchId, matrix, oddPlayer, oddPlayerId, player, playerGroups, playerId, players, round, _i, _len, _ref, _ref1, _ref2;
      this.addRound();
      round = this.getCurrentRound();
      playerGroups = this.getPlayerListGroupedByPoints().reverse();
      oddPlayer;

      for (_i = 0, _len = playerGroups.length; _i < _len; _i++) {
        group = playerGroups[_i];
        if (typeof oddPlayer !== "undefined" && oddPlayer !== null) {
          group.push(oddPlayer);
        }
        matrix = this.getMatchMatrixForPlayers(group);
        while (Object.size(matrix.matches) > 0) {
          _ref = Object.popRandom(matrix.matches), matchId = _ref[0], match = _ref[1];
          players = [];
          if (this.matches[matchId] == null) {
            _ref1 = match.players;
            for (playerId in _ref1) {
              player = _ref1[playerId];
              players.push(player);
              matrix.removePlayerMatches(player);
            }
            round.addMatch(players[0], players[1]);
          } else {
            matrix.matches[matchId] = match;
          }
        }
        oddPlayerId = ((_ref2 = Object.keys(matrix.matrix)) != null ? _ref2[0] : void 0) || null;
        oddPlayer = this.getPlayer(oddPlayerId);
      }
      return round;
    };

    return SwissTournament;

  })();

}).call(this);
