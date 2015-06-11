React = require 'react'
AppContext = require './renderer/context'
App = require './renderer/components/app-component'

initialStates = JSON.parse document.getElementById('initial-states').getAttribute('states-json')

console.log initialStates

context = new AppContext(initialStates)

React.render React.createElement(App, {context}), document.getElementById("app")
