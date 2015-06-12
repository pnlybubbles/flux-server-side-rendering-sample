React = require 'react'
IndexComponent = require './index-component'
AboutComponent = require './about-component'
ErrorComponent = require './error-component'

class RouteComponent extends React.Component
  constructor: (props) ->
    super props
    @store = @props.context.routeStore
    @state = @store.get()
    @components =
      Index: IndexComponent
      About: AboutComponent
      Error: ErrorComponent

  _onChange: ->
    @setState @store.get()

  componentDidMount: ->
    @store.onChange @_onChange.bind(@)

  componentWillUnmount: ->
    @store.removeAllChangeListeners()

  render: ->
    <div>
      {
        if @components[@state.route]
          React.createElement @components[@state.route], { argu: @state.argu, context: @props.context }
      }
    </div>

module.exports = RouteComponent
