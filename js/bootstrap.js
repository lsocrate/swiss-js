yepnope([
  {
    load: {
      'jquery':'http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js',
      'swiss': 'js/swiss.js',
      'swiss-ui': 'js/swiss-ui.js',
    },
    callback: {
      'jquery' : function (url, result, key) {
        if (!window.jQuery) {
          yepnope('js/libs/jquery-1.8.2.min.js');
        }
      },
      'swiss' : function () {
      },
      'swiss-ui': function () {
      }
    },
    complete: function () {
      $(function($){
        window.tournament = new SwissJS.Tournament();
        window.tournament
          .addPlayer('Anna', 'Crab')
          .addPlayer('Bob', 'Crane')
          .addPlayer('Claude', 'Dragon')
          .addPlayer('Dennis', 'Lion')
          .addPlayer('Eliot', 'Mantis')
          .addPlayer('Francis', 'Phoenix')
          .addPlayer('George', 'Scorpion')
          .addPlayer('Henry', 'Spider')
          .addPlayer('Irvine', 'Spider')
          .addPlayer('John', 'Spider');
        window.tournamentUI = new TournamentUI(window.tournament);
        window.tournamentUI.updateRanking();
      });
    }
  },
]);