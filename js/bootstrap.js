yepnope([
  {
    load: {
      'jquery':'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
      'swiss': 'js/swiss.js'
    },
    callback: {
      'jquery' : function (url, result, key) {
        if (!window.jQuery) {
          yepnope('js/libs/jquery-1.7.2.min.js');
        }
      }
    },
    complete: function () {
      window.tournament = new SwissTournament();
      $(function($){
        var $ranking = $('.ranking');

        $('.js-button').on('click', function (ev) {
          if ($(this).data('action') === 'addPlayer') {
            var playerName = prompt('Player name');
            var playerClan = prompt('Player clan');

            tournament.addPlayer(playerName, playerClan);
            tournament.updateRanking();

            $ranking.find('.ranking-row').remove();
            $.each(tournament.players, function (index, player) {
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
              $ranking.append(row);
            });
          }
        });
      });
    }
  },
]);