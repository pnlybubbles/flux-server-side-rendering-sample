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

server.get '*', (req, res) ->
  console.log req.originalUrl
  [route, argu] = routerUtil.route req.originalUrl
  initialStates =
    RouteStore:
      route: route
      argu: argu
  context = new AppContext(initialStates)
  res.send template
    initialStates: JSON.stringify initialStates
    markup: React.renderToString React.createElement(App, {context})

server.listen (process.env.PORT || 5000)
