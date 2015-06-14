require('source-map-support').install()
express = require 'express'
fs = require 'fs'
Handlebars = require 'handlebars'
React = require 'react'
AppContext = require './renderer/context'
App = require './renderer/components/app-component'
RouterUtil = require './renderer/lib/router-util'
routes = require './renderer/routes'
server = express()

template = Handlebars.compile fs.readFileSync("#{fs.realpathSync('./')}/view/index.hbs").toString()

server.use '/static', express.static('public')

routerUtil = new RouterUtil routes.root, routes.routes
console.log routerUtil

counter =
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

server.post '/api/counter/:index/count_up', (req, res) ->
  index = parseInt req.params.index, 10
  counter.counters[index]?.count += 1
  res.contentType 'application/json'
  res.send JSON.stringify
    count: counter.counters[index]?.count

server.get '*', (req, res) ->
  console.log req.originalUrl
  [route, argu] = routerUtil.route req.originalUrl
  initialStates =
    RouteStore:
      route: route
      argu: argu
    CounterStore: counter
  context = new AppContext(initialStates)
  res.send template
    initialStates: JSON.stringify initialStates
    markup: React.renderToString React.createElement(App, {context})

server.listen (process.env.PORT || 5000)
