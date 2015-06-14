React = require 'react'
Link = require './link-component'

class AboutComponent extends React.Component
  constructor: (props) ->
    super props

  render: ->
    <div>
      <h1>About</h1>
      <p>
        Counter with Flux
      </p>
      <h3>Feature</h3>
      <p>
        <ul>
          <li>Flux</li>
          <li>React.js</li>
          <li>ServerSide Rendering</li>
        </ul>
      </p>
      <h3>Source Code</h3>
      <p>
        <a href="https://github.com/pnlybubbles/flux-server-side-rendering-sample">pnlybubbles/flux-server-side-rendering-sample</a>
      </p>
    </div>

AboutComponent.contextTypes =
  ctx: React.PropTypes.any

module.exports = AboutComponent
