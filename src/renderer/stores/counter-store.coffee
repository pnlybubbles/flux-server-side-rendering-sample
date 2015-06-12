Flux = require 'material-flux'
keys = require '../keys.coffee'
objectAssign = require 'object-assign'

class CounterStore extends Flux.Store
  constructor: (context) ->
    super context
    @state =
      counters: [
          name: 'counter1'
          count: 0
          index: 0
        ,
          name: 'counter2'
          count: 0
          index: 1
        ,
          name: 'counter3'
          count: 0
          index: 2
      ]
      active: 0
    @state = objectAssign(@state, context.initialStates.CounterStore)
    @register keys.active, @active
    @register keys.countUp, @countUp

  active: (index) ->
    if index in (c.index for c in @state.counters)
      @setState
        active: index

  countUp: (index, count) ->
    if index in (c.index for c in @state.counters)
      counters = @state.counters
      counters[index].count = count
      @setState
        counters: counters

  get: ->
    @state

module.exports = CounterStore
