Flux = require 'material-flux'
keys = require '../keys'

class RouteAction extends Flux.Action
  route: (path) ->
    @dispatch(keys.route, path)

module.exports = RouteAction
