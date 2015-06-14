Flux = require 'material-flux'
keys = require '../keys'
request = require 'superagent'
Promise = require 'bluebird'

class CounterAction extends Flux.Action
  active: (index) ->
    @dispatch(keys.active, index)

  countUp: (index, count) ->
    @dispatch(keys.countUp, index, count)
    new Promise (resolve, reject) ->
      request
        .post "/api/counter/#{index}/count_up"
        .send
          count: count
        .end (err, res) ->
          if res.ok
            resolve res.body
          else
            reject err
    .then (res) =>
      @dispatch(keys.countUp, index, res.count)
    .catch (err) ->
      console.error err

module.exports = CounterAction
