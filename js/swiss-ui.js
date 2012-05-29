var TournamentUI = function (tournament){
  this.tournament = tournament;
  this.nav        = {};
  this.ranking    = $('.ranking');

  var UI = this;
  $('nav').on('click', 'button', function (ev) {
    var action = $(this).data('action');
    UI[action]();
  });

  $(this.tournament).on('rankUpdated', this.updateRanking);
};

TournamentUI.prototype.addPlayer = function () {
  var playerName = prompt('Player name');
  if (typeof playerName !== 'string') {
    return;
  }

  var playerClan = prompt('Player clan');

  this.tournament.addPlayer(playerName, playerClan);
};
TournamentUI.prototype.updateRanking = function() {
  var UI = this;

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
    UI.ranking.append(row);
  });
};