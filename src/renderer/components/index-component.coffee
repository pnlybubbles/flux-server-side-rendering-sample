React = require 'react'
CounterListItem = require './counter-list-item-component'
Counter = require './counter-component'

class IndexComponent extends React.Component
  constructor: (props) ->
    super props
    @store = @props.context.counterStore
    @state = @store.get()

  _onChange: ->
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
              <CounterListItem active={counter.index == @state.active} counter={counter} context={@props.context} />
            </li>
        }
      </div>
      <div>
        <Counter counter={@state.counters[@state.active]} context={@props.context} />
      </div>
    </div>

module.exports = IndexComponent
