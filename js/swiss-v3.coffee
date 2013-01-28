Object.forEach = (object, callback) ->
  callback(value, name) for key, value of object

Object.size = (object) ->
  size = 0
  for key of object
    size++
  size

class Player
  constructor: (@name, @clan, @id) ->

class Match
  makeMatchName = (player1, player2) ->
    "m_" + player1.id + "@" + player2.id

  constructor: (player1, player2) ->
    @id = makeMatchName(player1, player2)
    @players = {}
    @players[player1.id] = player1
    @players[player2.id] = player2

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