Flux = require 'material-flux'
keys = require '../keys'
objectAssign = require 'object-assign'

class UserStore extends Flux.Store
  constructor: (context) ->
    super context
    @state =
      error: null
      user: null
      logined: false
    @state = objectAssign(@state, context.initialStates.UserStore)
    @register keys.user, @user

  user: (res) ->
    @setState res

  get: ->
    @state

module.exports = UserStore
