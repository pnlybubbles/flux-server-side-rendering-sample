React = require 'react'
Route = require './route-component'
Link = require './link-component'
IndexComponent = require './index-component'
AboutComponent = require './about-component'
LoginComponent = require './login-component'
ErrorComponent = require './error-component'

class AppComponent extends React.Component
  constructor: (props) ->
    super props

  _onChange: ->
    @setState @store.get()

  componentWillMount: ->
    @store = @context.ctx.userStore
    @setState @store.get()

  componentDidMount: ->
    @store.onChange @_onChange.bind(@)

  componentWillUnmount: ->
    @store.removeAllChangeListeners()

  render: ->
    <div>
      <Route addClassName='active' logined={@state.logined}>
        <li route='Index'><Link href='/'>Counter</Link></li>
        <li route='About'><Link href='/about'>About</Link></li>
        <li route='Login'><Link href='/login'>Login</Link></li>
      </Route>
      <Route logined={@state.logined}>
        <IndexComponent route='Index' />
        <AboutComponent route='About' />
        <ErrorComponent route='Error' />
        <LoginComponent route='Login' />
      </Route>
    </div>

AppComponent.contextTypes =
  ctx: React.PropTypes.any

module.exports = AppComponent
