React = require 'react'
Link = require './link-component'

class IndexComponent extends React.Component
  constructor: (props) ->
    super props

  render: ->
    <div>
      <p>
        Hello Index
      </p>
      <Link href='/about' context={@props.context}>About</Link>
    </div>

module.exports = IndexComponent
