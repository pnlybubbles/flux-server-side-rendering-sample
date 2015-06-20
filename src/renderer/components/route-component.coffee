React = require 'react'
Router = require '../lib/router'

class RouteComponent extends React.Component
  constructor: (props) ->
    super props

  _onChange: ->
    @setState @store.get()
    console.log 'onChange', @store.get()

  componentWillMount: ->
    @store = @context.ctx.routeStore
    state = @store.get()
    @setState state

    @router = new Router state.routes.root, state.routes.routes
    @router.setAuth state.routes.auth

  componentDidMount: ->
    @store.onChange @_onChange.bind(@)

  componentWillUnmount: ->
    @store.removeAllChangeListeners()

  # shouldComponentUpdate: (nextProps, nextState) ->

  render: ->
    <div>
      {
        @router.route @state.fragment, @props.logined, (route, argu, default_route, fragment, default_fragment) =>
          # console.log @state
          # console.log @props
          console.log route, argu, default_route, fragment, default_fragment
          if default_route? && default_fragment?
            @context.ctx.routeAction.navigate(fragment, {replace: true, silent: true})
          React.Children.map @props.children, (child) =>
            if child.props.route == route
              if @props.addClassName?
                React.cloneElement child,
                  argu: argu
                  className: @props.addClassName
              else
                React.cloneElement child,
                  argu: argu
            else
              if @props.addClassName?
                React.cloneElement child,
                  argu: argu
              else
                null
        , (route, argu, default_route) =>
          <h1>404 NotFound</h1>
      }
    </div>

RouteComponent.contextTypes =
  ctx: React.PropTypes.any

module.exports = RouteComponent
