React = require 'react'

class RouteComponent extends React.Component
  constructor: (props) ->
    super props
    @store = @props.context.routeStore
    @state = @store.get()

  _onChange: ->
    @setState @store.get()

  componentDidMount: ->
    @store.onChange @_onChange.bind(@)

  componentWillUnmount: ->
    @store.removeAllChangeListeners()

  render: ->
    <div>
      {
        if @state.route == @props.route
          @props.children
      }
    </div>

module.exports = RouteComponent
