require('source-map-support').install()
express = require 'express'
bodyParser = require 'body-parser'
cookieParser = require 'cookie-parser'
expressSession = require 'express-session'
fs = require 'fs'
Handlebars = require 'handlebars'
React = require 'react'
Context = require './renderer/context'
Root = require './renderer/components/root-component'
routes = require './renderer/routes'
Crypto = require 'crypto'
passport = require 'passport'
Mongoose = require 'mongoose'
LocalStrategy = require('passport-local').Strategy

server = express()

server.use '/static', express.static('public')
server.use bodyParser()
server.use cookieParser()
server.use expressSession({ secret: "secret" })
server.use passport.initialize()
server.use passport.session()

template = Handlebars.compile fs.readFileSync("#{fs.realpathSync('./')}/view/index.hbs").toString()

secretKey = 'secret'
getHash = (target) ->
  sha = Crypto.createHmac 'sha256', secretKey
  sha.update target
  sha.digest 'hex'

db = Mongoose.createConnection 'mongodb://localhost/flux-server-side-rendering-sample', (error, res) ->

UserSchema = new Mongoose.Schema
  email:
    type: String
    required: true
  password:
    type: String
    required: true
UserSchema.methods.authenticate = (password) ->
  @password == getHash(password)

User = db.model 'User', UserSchema

User.count (err, c) ->
  if c == 0
    testUser = new User()
    testUser.email = 'test@sample.com'
    testUser.password = getHash 'test'
    testUser.save()

User.count (err, c) -> console.log c

passport.serializeUser (user, done) ->
  done null,
    email: user.email
    _id: user._id
passport.deserializeUser (serializedUser, done) ->
  User.findById serializedUser._id, (err, user) ->
    done err, user

passport.use new LocalStrategy
    usernameField: 'email'
    passwordField: 'password'
  , (email, password, done) ->
    process.nextTick ->
      User.findOne
        email: email
      , (err, user) ->
        if err
          done err
        unless user?
          done null, false, { message: 'user not found' }
        unless user.authenticate password
          done null, false, { message: 'invalid password' }
        done null, user

server.post '/api/login', (req, res) ->
  console.log req.body
  passport.authenticate('local', (err, user, info) ->
    res_user =
      error: err
      user:
        if user
          email: user.email
          _id: user._id
        else
          null
      logined: !!user
    if !err? && user
      req.logIn user, ->
    res.json res_user
  )(req, res)

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
  res.json
    count: counter.counters[index]?.count

server.get '/favicon.ico', (req, res) ->

server.get '*', (req, res) ->
  console.log req.originalUrl, req.isAuthenticated()
  res_user =
    error: null
    user:
      if req.user
        email: req.user.email
        _id: req.user._id
      else
        null
    logined: !!req.user
  initialStates =
    RouteStore:
      fragment: req.originalUrl
      routes: routes
    CounterStore: counter
    UserStore: res_user
  context = new Context(initialStates)
  res.send template
    initialStates: JSON.stringify initialStates
    markup: React.renderToString React.createElement(Root, {context})

server.listen (process.env.PORT || 5000)
