Flux = require 'material-flux'
keys = require '../keys'
History = require 'html5-history' if window?

class RouteAction extends Flux.Action
  constructor: ->
    super
    if History?.Adapter?
      History.Adapter.bind window, 'statechange' , =>
        state = History.getState()
        @dispatch(keys.route, state.hash)
    else if history?
      console.warn 'html5-history is not available. Now using default History API.' if window?
      # window.addEventListener 'popstate', (e) =>
      #   state = e.state
      #   @dispatch(keys.route, state.hash)
    else
      console.warn 'Both html5-history and default History API are not available.' if window?


  navigate: (path) ->
    if History?.Adapter?
      History.pushState null, null, path
    else if history?
      history.pushState null, null, path
      @dispatch(keys.route, path)
    else if location?
      location.href = path

module.exports = RouteAction
