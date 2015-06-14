React = require 'react'

class CounterListItemComponent extends React.Component
  constructor: (props) ->
    super props

  active: ->
    @context.ctx.counterAction.active(@props.counter.index)

  render: ->
    <div className={if @props.active then 'active' else ''}>
      <span>{@props.counter.name}</span>
      <button onClick={@active.bind(@)}>Select</button>
    </div>

CounterListItemComponent.contextTypes =
  ctx: React.PropTypes.any

module.exports = CounterListItemComponent
