React = require 'react'
Route = require './route-component'
Link = require './link-component'
IndexComponent = require './index-component'
AboutComponent = require './about-component'
ErrorComponent = require './error-component'

class AppComponent extends React.Component
  constructor: (props) ->
    super props

  render: ->
    <div>
      <nav>
        <li><Link context={@props.context} href='/'>Counter</Link></li>
        <li><Link context={@props.context} href='/about'>About</Link></li>
      </nav>
      <Route route='Index' context={@props.context}><IndexComponent context={@props.context}/></Route>
      <Route route='About' context={@props.context}><AboutComponent context={@props.context}/></Route>
      <Route route='Error' context={@props.context}><ErrorComponent context={@props.context}/></Route>
    </div>

module.exports = AppComponent
