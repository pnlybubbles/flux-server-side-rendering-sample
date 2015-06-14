React = require 'react'

class CounterComponent extends React.Component
  constructor: (props) ->
    super props

  countUp: ->
    @context.ctx.counterAction.countUp(@props.counter.index, @props.counter.count + 1)

  render: ->
    <div>
      <h3>{@props.counter.name}</h3>
      <h1>{@props.counter.count}</h1>
      <button onClick={@countUp.bind(@)}>CountUp</button>
    </div>

CounterComponent.contextTypes =
  ctx: React.PropTypes.any

module.exports = CounterComponent
