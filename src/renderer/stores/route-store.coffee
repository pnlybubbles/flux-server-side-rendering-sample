Flux = require 'material-flux'
keys = require '../keys'
routes = require '../routes'
RouterUtil = require '../lib/router-util'
objectAssign = require 'object-assign'

class RouteStore extends Flux.Store
  constructor: (context) ->
    super context
    @state =
      route: '/'
      argu: []
    @state = objectAssign(@state, context.initialStates.RouteStore)
    @register keys.route, @route
    @routerUtil = new RouterUtil routes.root, routes.routes

  route: (fragment) ->
    console.log "route:", fragment
    [route, argu] = @routerUtil.route fragment
    if route?
      @setState
        route: route
        argu: argu

  get: ->
    @state

module.exports = RouteStore
