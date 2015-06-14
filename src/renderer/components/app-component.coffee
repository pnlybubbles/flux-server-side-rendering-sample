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
        <Route addClassName='active'>
          <li route='Index'><Link href='/'>Counter</Link></li>
          <li route='About'><Link href='/about'>About</Link></li>
        </Route>
      </nav>
      <Route>
        <IndexComponent route='Index' />
        <AboutComponent route='About' />
        <ErrorComponent route='Error' />
      </Route>
    </div>

AppComponent.childContextTypes =
  ctx: React.PropTypes.any

module.exports = AppComponent
