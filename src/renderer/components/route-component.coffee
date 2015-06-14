React = require 'react'

class RouteComponent extends React.Component
  constructor: (props) ->
    super props

  _onChange: ->
    @setState @store.get()

  componentWillMount: ->
    @store = @context.ctx.routeStore
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

RouteComponent.contextTypes =
  ctx: React.PropTypes.any

module.exports = RouteComponent
