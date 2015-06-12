Flux = require 'material-flux'
keys = require '../keys'

class CounterAction extends Flux.Action
  active: (index) ->
    @dispatch(keys.active, index)
  countUp: (index, count) ->
    @dispatch(keys.countUp, index, count)

module.exports = CounterAction
