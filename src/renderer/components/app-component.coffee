React = require 'react'
Route = require './route-component'
Link = require './link-component'
IndexComponent = require './index-component'
AboutComponent = require './about-component'
ErrorComponent = require './error-component'

class AppComponent extends React.Component
  constructor: (props) ->
    super props

  getChildContext: ->
    ctx: @props.context

  render: ->
    <div>
      <nav>
        <li><Link href='/'>Counter</Link></li>
        <li><Link href='/about'>About</Link></li>
      </nav>
      <Route route='Index'><IndexComponent /></Route>
      <Route route='About'><AboutComponent /></Route>
      <Route route='Error'><ErrorComponent /></Route>
    </div>

AppComponent.childContextTypes =
  ctx: React.PropTypes.any

module.exports = AppComponent
