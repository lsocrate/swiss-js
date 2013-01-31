// Generated by CoffeeScript 1.4.0
(function() {
  var Match, MatchMatrix, Player, makeMatchName;

  makeMatchName = function(player1, player2) {
    return "m_" + player1.id + "@" + player2.id;
  };

  Player = (function() {

    function Player(name, clan, id, points, opponents) {
      this.name = name;
      this.clan = clan;
      this.id = id;
      this.points = points != null ? points : 0;
      this.opponents = opponents != null ? opponents : {};
    }

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

  this.SwissTournament = (function() {

    function SwissTournament() {
      this.players = {};
      this.matches = {};
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
      match = new Match(player1, player2);
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
        if ((match.players[player.id] != null)) {
          matches[matchId] = match;
        }
      }
      return matches;
    };

    SwissTournament.prototype.getMatchMatrixForPlayers = function(players) {
      return new MatchMatrix(players, this);
    };

    return SwissTournament;

  })();

}).call(this);
