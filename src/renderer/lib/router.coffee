objectAssign = require 'object-assign'

class Router
  constructor: (root, routes) ->
    @setRoot(root)
    @routes = routes if routes?
    @auth = {}

  setRoot: (root) ->
    @root = if root? && root != '/' then '/' + @clearSlashes(root) + '/' else '/'

  setRoute: (path, route) ->
    unless route?
      routes = path
    else
      routes = {}
      routes[path] = route
    @routes = objectAssign(@routes, routes)

  setAuth: (route, required, renavigate) ->
    unless required? && renavigate?
      auth = route
    else
      auth = {}
      auth[route] =
        required: required
        renavigate: renavigate
    @auth = objectAssign @auth, auth

  route: (fragment, logined, resolve, reject)->
    if typeof logined == 'function' && !reject?
      reject = resolve
      resolve = logined
      logined = undefined

    fragment = fragment.replace /\?(.*)$/, ''
    fragment = @clearSlashes(fragment.replace(new RegExp("^#{@root}"), ''))
    res = []
    for re, r of @routes
      match = fragment.match new RegExp("^#{re}$")
      if match?
        match.shift()
        if logined?
          auth = @auth[r]
          if (auth?.required == true && !logined) || (auth?.required == false && logined)
            if auth.renavigate?
              for re_, r_ of @routes
                match_ = auth.renavigate.match new RegExp("^#{re_}$")
                if match_?
                  return resolve?(r_, match_, r, auth.renavigate, fragment)
              console.warn('\'renavigate\' fragment is not found in routes.')
            else
              console.warn('\'renavigate\' is not specified in authenticated route.')
        return resolve?(r, match, null, fragment, null)
    return reject?(null, [], null, fragment, null)

  clearSlashes: (path) ->
    path.toString().replace(/\/$/, '').replace(/^\//, '')

module.exports = Router
