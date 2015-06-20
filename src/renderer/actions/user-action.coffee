Flux = require 'material-flux'
keys = require '../keys'
request = require 'superagent'
Promise = require 'bluebird'

class UserAction extends Flux.Action
  login: (email, password) ->
    new Promise (resolve, reject) ->
      request
        .post '/api/login'
        .send
          email: email
          password: password
        .end (err, res) ->
          if res.ok
            resolve res.body
          else
            reject err
    .then (res) =>
      console.log res
      @dispatch(keys.user, res)
    .catch (err) ->
      console.error err

  logout: ->
    console.log 'logout'

module.exports = UserAction
