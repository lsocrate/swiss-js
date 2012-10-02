Array.prototype.popRandom = function() {
  return this.splice(Math.ceil(Math.random() * (this.length - 1)),1)[0];
};

var SwissJS;
(function(SwissJS){
  var Player = (function(){
    function Player(tournament, name, clan){
      this.tournament = tournament;
      this.id         = this.tournament.generatePlayerId();
      this.name       = name;
      this.clan       = clan.toLowerCase();
      this.points     = 0;
      this.msW        = 0;
      this.msL        = 0;
      this.opponents  = [];
    }

    Player.prototype.getPosition = function () {
      for (var i = 0; i < this.tournament.players.length; i++) {
        var player = this.tournament.players[i];
        if (player.id === this.id) {
          return ++i;
        }
      };
    };
    Player.prototype.calculateMs = function () {
      this.opponents.forEach(function(opponentName){
        if (this.tournament.getMatch(opponentName, this.name).winner === this.name) {
          this.msW += this.tournament.getPlayer(opponentName).points;
        } else {
          this.msL += this.tournament.getPlayer(opponentName).points;
        }
      }, this);
    };

    return Player;
  })();
  var Match = (function(){
    function Match(tournament) {
      this.tournament = tournament;
      this.name       = undefined;
      this.players    = [
        arguments[1],
        arguments[2]
      ];
      this.winner     = undefined;
      this.isDone     = false;
      this.name       = this.tournament.makeMatchName(this.players[0], this.players[1]);

      arguments[1].opponents.push(arguments[2].name);
      arguments[2].opponents.push(arguments[1].name);
    };
    Match.prototype.reportWinner = function(winnerName) {
      this.winner = this.tournament.getPlayer(winnerName);
      this.isDone = true;

      this.winner.points++;
      $(this.tournament).trigger('matchReported');
    };

    Match.prototype.reportDraw = function() {
      this.winner = undefined;
      this.isDone = true;
      $(this.tournament).trigger('matchReported');
    };

    return Match;
  })();
  var Round = (function(){
    function Round(tournament) {
      this.tournament = tournament;
      this.matches    = {};
    };
    Round.prototype.addMatch = function (player1Name, player2Name) {
      var player1 = this.tournament.getPlayer(player1Name);
      var player2 = this.tournament.getPlayer(player2Name);

      if (player1 && player2) {
        var match = new Match(this.tournament, player1, player2);

        this.matches[match.name] = match;
      } else {
        return {error:true};
      }
    };

    return Round;
  })();
  var Tournament = (function(){
    function Tournament() {
      this.players = [];
      this.rounds  = [];
      this.currentPlayerId = 0;

      $(this).on('playerAdded', this.updateRanking);
    };
    Tournament.prototype.makeMatchName = function () {
        var players = [].slice.apply(arguments).map(function (player) {
          return player.name;
        });

        return players.sort().join('@').toLowerCase();
      };
    Tournament.prototype.generatePlayerId = function () {
      return this.currentPlayerId++;
    };
    Tournament.prototype.getPlayer = function (name) {
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].name === name) {
          return this.players[i];
        }
      }
    };
    Tournament.prototype.getRound = function (roundNumber) {
      return (typeof roundNumber === 'number') ? this.rounds[roundNumber - 1] : this.rounds[this.rounds.length - 1];
    };
    Tournament.prototype.getMatch = function (player1Name, player2Name) {
      var player1 = this.getPlayer(player1Name);
      var player2 = this.getPlayer(player2Name);

      if (player1 && player2) {
        var matchName = this.makeMatchName(player1, player2);

        for (var i = 0; i < this.rounds.length; i++) {
          var round = this.rounds[i];

          if (round.matches[matchName]) {
            return round.matches[matchName];
          }
        };
      }
    };
    Tournament.prototype.rankPlayers = function () {
      this.players.sort(function (a, b) {
        if (b.points !== a.points) {
          return b.points - a.points;
        } else if(b.msW !== a.msW) {
          return b.msW - a.msW;
        } else if(b.msL !== a.msL) {
          return b.msL - a.msL;
        } else {
          return 0;
        }
      });
      $(this).trigger('rankUpdated');
    };
    Tournament.prototype.getPlayersByPointsGroup = function () {
      var groups = [];

      this.players.forEach(function(player){
        if (typeof groups[player.points] === 'undefined') {
          groups[player.points] = [player];
        } else {
          groups[player.points].push(player);
        }
      });

      return groups;
    };

    /**
     *  EVENTED ACTIONS
     */
    Tournament.prototype.addPlayer = function (name, clan) {
      this.players.push(new Player(this, name, clan));
      $(this).trigger('playerAdded');

      return this;
    };
    Tournament.prototype.addRound = function () {
      this.rounds.push(new Round(this));
      $(this).trigger('roundAdded');
    };
    Tournament.prototype.end = function () {
      this.rankPlayers();

      this.players.forEach(function(player){
        player.calculateMs();
      });

      this.rankPlayers();
      $(this).trigger('tournamentEnded');

      return this;
    };
    Tournament.prototype.generateRound = function () {
      this.rankPlayers();
      this.addRound();

      var groupsToMatch = this.getPlayersByPointsGroup();
      var oddPlayer = false;

      var group;
      while (group = groupsToMatch.pop()) {
        while(group.length > 1) {
          var player1, player2;

          if (oddPlayer) {
            player1 = oddPlayer;
            oddPlayer = false;
          } else {
            player1 = group.popRandom();
          }

          player2 = group.popRandom();
          while (player1.opponents.indexOf(player2.name) > -1) {
            var failedPlayer2 = player2;
            player2 = group.popRandom();
            group.push(failedPlayer2);
          }

          this.getRound().addMatch(player1.name, player2.name);
        }
        if (group.length) {
          oddPlayer = group[0];
        } else {
          oddPlayer = false;
        }
      };

      $(this).trigger('newRound');
    }

    return Tournament;
  })();

  SwissJS.Tournament = Tournament;
})(SwissJS || (SwissJS = {}));