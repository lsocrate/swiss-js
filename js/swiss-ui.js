var TournamentUI = function (tournament){
  this.tournament = tournament;
  this.nav        = {};
  this.ranking    = $('.ranking');

  $('nav button').each(function () {
    $(this).on('click', function (ev) {
      var action = $(this).data('action');

      switch (action) {
        case 'addPlayer':
          this.nav.addPlayer = $(this);
          return this.addPlayer();
        case 'startRound':
        case 'endTournament':
        default:
      }
    });
  });
};

TournamentUI.prototype.addPlayer = function () {
  var playerName, playerClan;

  playerName = prompt('Player name');
  if (typeof playerName !== 'string') {
    return;
  }

  playerClan = prompt('Player clan');
  tournament.addPlayer(playerName, playerClan);
  tournament.updateRanking();
};
TournamentUI.prototype.updateRanking = function() {
  this.ranking.find('.ranking-row').remove();
  $.each(this.tournament.players, function (index, player) {
    var row = $('<tr/>', {
      class:'ranking-row',
      data: {
        playerId:player.id
      }
    });
    row.append($('<td/>', {
      class:'ranking-header ranking-player',
      data: {
        attribute: 'name'
      },
      text: player.name
    }));
    row.append($('<td/>', {
      class:'ranking-header ranking-clan',
      data: {
        attribute: 'clan'
      },
      text: player.clan
    }));
    row.append($('<td/>', {
      class:'ranking-header ranking-points',
      data: {
        attribute: 'points'
      },
      text: player.points
    }));
    this.ranking.append(row);
  });
};