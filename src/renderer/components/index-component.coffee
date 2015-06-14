React = require 'react'
CounterListItem = require './counter-list-item-component'
Counter = require './counter-component'

class IndexComponent extends React.Component
  constructor: (props) ->
    super props

  _onChange: ->
    @setState @store.get()

  componentWillMount: ->
    @store = @context.ctx.counterStore
    @setState @store.get()

  componentDidMount: ->
    @store.onChange @_onChange.bind(@)

  componentWillUnmount: ->
    @store.removeAllChangeListeners()

  render: ->
    <div>
      <h1>Counters</h1>
      <h3>Counter Select</h3>
      <div>
        {
          @state.counters.map (counter) =>
            <li key={counter.index}>
              <CounterListItem active={counter.index == @state.active} counter={counter} />
            </li>
        }
      </div>
      <div>
        <Counter counter={@state.counters[@state.active]} />
      </div>
    </div>

IndexComponent.contextTypes =
  ctx: React.PropTypes.any

module.exports = IndexComponent
