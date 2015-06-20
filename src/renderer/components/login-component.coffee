React = require 'react'

class LoginComponent extends React.Component
  constructor: (props) ->
    super props
    @state =
      email: ''
      password: ''

  changeEmailInput: (e) ->
    @setState
      email: e.target.value

  changePasswordInput: (e) ->
    @setState
      password: e.target.value

  login: ->
    @context.ctx.userAction.login(@state.email, @state.password)

  render: ->
    <div>
      <h1>Login</h1>
      <span>email</span>
      <input name='email' type='text' value={@state.email} onChange={@changeEmailInput.bind(@)} />
      <span>password</span>
      <input name='password' type='password' value={@state.password} onChange={@changePasswordInput.bind(@)} />
      <button onClick={@login.bind(@)}>Login</button>
    </div>

LoginComponent.contextTypes =
  ctx: React.PropTypes.any

module.exports = LoginComponent
