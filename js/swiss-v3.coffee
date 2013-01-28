Object.forEach = (object, callback) ->
  callback(value, name) for key, value of object

Object.size = (object) ->
  size = 0
  for key of object
    size++
  size

class Player
  constructor: (@name, @clan, @id) ->

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