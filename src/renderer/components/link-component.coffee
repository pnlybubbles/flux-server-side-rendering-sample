React = require 'react'

class Link extends React.Component
  constructor: (props) ->
    super props

  navigate: (e) ->
    e.preventDefault()
    @props.context.routeAction.navigate(@props.href)

  render: ->
    <a href={@props.href} onClick={ @navigate.bind(@) }>
      {@props.children}
    </a>

module.exports = Link
