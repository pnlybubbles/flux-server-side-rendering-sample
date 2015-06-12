class RouterUtil
  constructor: (root, routes) ->
    @root = if root? && root != '/' then '/' + @clearSlashes(root) + '/' else '/'
    @routes = routes

  route: (fragment)->
    fragment = fragment.replace /\?(.*)$/, ''
    fragment = @clearSlashes(fragment.replace(new RegExp("^#{@root}"), ''))
    for re, r of @routes
      match = fragment.match new RegExp("^#{re}$")
      if match?
        match.shift()
        return [r, match]
    return [null, []]

  clearSlashes: (path) ->
    path.toString().replace(/\/$/, '').replace(/^\//, '')

module.exports = RouterUtil
