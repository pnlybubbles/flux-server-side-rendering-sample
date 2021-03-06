Flux = require 'material-flux'
RouteAction = require './actions/route-action'
RouteStore = require './stores/route-store'
CounterAction = require './actions/counter-action'
CounterStore = require './stores/counter-store'
UserAction = require './actions/user-action'
UserStore = require './stores/user-store'

class Context extends Flux.Context
  constructor: (initialStates) ->
    super
    @initialStates = initialStates
    @routeAction = new RouteAction(@)
    @routeStore = new RouteStore(@)
    @counterAction = new CounterAction(@)
    @counterStore = new CounterStore(@)
    @userAction = new UserAction(@)
    @userStore = new UserStore(@)

module.exports = Context
