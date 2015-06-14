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
        React.Children.map @props.children, (child) =>
          if child.props.route == @state.route
            if @props.addClassName?
              React.cloneElement child,
                argu: @state.argu
                className: @props.addClassName
            else
              React.cloneElement child,
                argu: @state.argu
          else
            if @props.addClassName?
              React.cloneElement child,
                argu: @state.argu
            else
              null
      }
    </div>

RouteComponent.contextTypes =
  ctx: React.PropTypes.any

module.exports = RouteComponent
