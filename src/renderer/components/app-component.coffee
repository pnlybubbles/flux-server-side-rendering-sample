React = require 'react'
Route = require './route-component'

class AppComponent extends React.Component
  constructor: (props) ->
    super props

  render: ->
    <div>
      <Route context={@props.context} />
    </div>

module.exports = AppComponent
