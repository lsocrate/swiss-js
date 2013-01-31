makeMatchName = (player1, player2) ->
  "m_" + player1.id + "@" + player2.id

class Player
  constructor: (@name, @clan, @id, @points = 0, @opponents = {}) ->

class Match
  constructor: (player1, player2) ->
    @id = makeMatchName(player1, player2)
    @players = {}
    @players[player1.id] = player1
    @players[player2.id] = player2

  reportWinner: (@winner) ->
    for playerId, player of @players
      @loser = player if (playerId isnt @winner.id)

    @winner.points++
    @winner.opponents[@loser.id] = @loser
    @loser.opponents[@winner.id] = @winner

  reportDoubleLoss: ->
    [player1Id, player2Id] = Object.keys(@players)
    player1 = @players[player1Id]
    player2 = @players[player2Id]

    @drawed = true
    @losers = [player1, player2]
    player1.opponents[player2.id] = player2
    player2.opponents[player1.id] = player1

class MatchMatrix

  constructor: (players, @tournament) ->
    @matches = {}
    @matrix = {}

    while player1 = players.shift()
      for player2 in players
        match = new Match(player1, player2)

        unless @tournament.matches[match.id]?
          @matches[match.id] = match

          @matrix[player1.id] = {} unless @matrix[player1.id]?
          @matrix[player1.id][player2.id] = match

          @matrix[player2.id] = {} unless @matrix[player2.id]?
          @matrix[player2.id][player1.id] = match

  getSingularMatches: ->
    matches = {}
    for playerId, opponents of @matrix
      opponentsKeys = Object.keys(opponents)
      if opponentsKeys.length is 1
        match = opponents[opponentsKeys[0]]
        matches[match.id] = match
    matches

  removePlayerMatches: (player) ->
    delete @matrix[player.id]
    for matchId, match of @matches
      delete @matches[matchId] if match.players[player.id]?
    for opponentId, opponentOpponents of @matrix
      delete @matrix[opponentId][player.id] if opponentOpponents[player.id]?


class @SwissTournament
  playerCount = 0
  nextPlayerId = ->
    "p" + ++playerCount

  players: {}
  addPlayer: (name, clan) ->
    player = new Player(name, clan, nextPlayerId())
    @players[player.id] = player

  getPlayer: (playerId) ->
    @players[playerId]

  matches: {}
  addMatch: (player1Id, player2Id) ->
    player1 = @getPlayer(player1Id)
    player2 = @getPlayer(player2Id)

    match = new Match(player1, player2)

    @matches[match.id] = match

  getMatch: (player1Id, player2Id) ->
    player1 = @getPlayer(player1Id)
    player2 = @getPlayer(player2Id)

    @matches[makeMatchName(player1, player2)]

  getPlayerMatches: (player) ->
    matches = {}
    for matchId, match of @matches
      if (match.players[player.id]?)
        matches[matchId] = match
    matches

  getMatchMatrixForPlayers: (players) ->
    new MatchMatrix(players, @)