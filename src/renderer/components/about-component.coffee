React = require 'react'
Link = require './link-component'

class AboutComponent extends React.Component
  constructor: (props) ->
    super props

  render: ->
    <div>
      <p>
        Hello About
      </p>
      <p>
        I am pnlybubbles
      </p>
      <Link href='/' context={@props.context}>Index</Link>
    </div>

module.exports = AboutComponent
