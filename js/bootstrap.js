yepnope([
  {
    load: {
      'jquery':'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
      'swiss': 'js/swiss.js',
      'swiss-ui': 'js/swiss-ui.js'
    },
    callback: {
      'jquery' : function (url, result, key) {
        if (!window.jQuery) {
          yepnope('js/libs/jquery-1.7.2.min.js');
        }
      }
    },
    complete: function () {
      $(function($){
        window.tournament = new SwissTournament();
        window.tournamentUI = new TournamentUI(window.tournament);
      });
    }
  },
]);