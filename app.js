(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
var App, AppContext, Handlebars, React, RouterUtil, express, fs, routerUtil, routes, server, template;

require('source-map-support').install();

express = require('express');

fs = require('fs');

Handlebars = require('handlebars');

React = require('react');

AppContext = require('./renderer/context');

App = require('./renderer/components/app-component');

RouterUtil = require('./renderer/lib/router-util');

routes = require('./renderer/routes');

server = express();

template = Handlebars.compile(fs.readFileSync((fs.realpathSync('./')) + "/view/index.hbs").toString());

server.use('/static', express["static"]('public'));

routerUtil = new RouterUtil(routes.root, routes.routes);

console.log(routerUtil);

server.get('*', function(req, res) {
  var argu, context, initialStates, ref, route;
  console.log(req.originalUrl);
  ref = routerUtil.route(req.originalUrl), route = ref[0], argu = ref[1];
  initialStates = {
    RouteStore: {
      route: route,
      argu: argu
    }
  };
  context = new AppContext(initialStates);
  return res.send(template({
    initialStates: JSON.stringify(initialStates),
    markup: React.renderToString(React.createElement(App, {
      context: context
    }))
  }));
});

server.listen(process.env.PORT || 5000);



}).call(this,require("/Users/pnlybubbles/Devs/flux-server-side-rendering-sample/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))

},{"./renderer/components/app-component":6,"./renderer/context":13,"./renderer/lib/router-util":15,"./renderer/routes":16,"/Users/pnlybubbles/Devs/flux-server-side-rendering-sample/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":2,"express":undefined,"fs":undefined,"handlebars":undefined,"react":undefined,"source-map-support":undefined}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
var CounterAction, Flux, keys,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Flux = require('material-flux');

keys = require('../keys');

CounterAction = (function(superClass) {
  extend(CounterAction, superClass);

  function CounterAction() {
    return CounterAction.__super__.constructor.apply(this, arguments);
  }

  CounterAction.prototype.active = function(index) {
    return this.dispatch(keys.active, index);
  };

  CounterAction.prototype.countUp = function(index, count) {
    return this.dispatch(keys.countUp, index, count);
  };

  return CounterAction;

})(Flux.Action);

module.exports = CounterAction;



},{"../keys":14,"material-flux":undefined}],4:[function(require,module,exports){
var Flux, History, RouteAction, keys,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Flux = require('material-flux');

keys = require('../keys');

if (typeof window !== "undefined" && window !== null) {
  History = require('html5-history');
}

RouteAction = (function(superClass) {
  extend(RouteAction, superClass);

  function RouteAction() {
    RouteAction.__super__.constructor.apply(this, arguments);
    if ((History != null ? History.Adapter : void 0) != null) {
      History.Adapter.bind(window, 'statechange', (function(_this) {
        return function() {
          var state;
          state = History.getState();
          return _this.dispatch(keys.route, state.hash);
        };
      })(this));
    } else if (typeof history !== "undefined" && history !== null) {
      if (typeof window !== "undefined" && window !== null) {
        console.warn('html5-history is not available. Now using default History API.');
      }
    } else {
      if (typeof window !== "undefined" && window !== null) {
        console.warn('Both html5-history and default History API are not available.');
      }
    }
  }

  RouteAction.prototype.navigate = function(path) {
    if ((History != null ? History.Adapter : void 0) != null) {
      return History.pushState(null, null, path);
    } else if (typeof history !== "undefined" && history !== null) {
      history.pushState(null, null, path);
      return this.dispatch(keys.route, path);
    } else if (typeof location !== "undefined" && location !== null) {
      return location.href = path;
    }
  };

  return RouteAction;

})(Flux.Action);

module.exports = RouteAction;



},{"../keys":14,"html5-history":undefined,"material-flux":undefined}],5:[function(require,module,exports){
var AboutComponent, Link, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

Link = require('./link-component');

AboutComponent = (function(superClass) {
  extend(AboutComponent, superClass);

  function AboutComponent(props) {
    AboutComponent.__super__.constructor.call(this, props);
  }

  AboutComponent.prototype.render = function() {
    return React.createElement("div", null, React.createElement("h1", null, "About"), React.createElement("p", null, "Counter with Flux"), React.createElement("h3", null, "Feature"), React.createElement("p", null, React.createElement("ul", null, React.createElement("li", null, "Flux"), React.createElement("li", null, "React.js"), React.createElement("li", null, "ServerSide Rendering"))), React.createElement("h3", null, "Source Code"), React.createElement("p", null, React.createElement("a", {
      "href": "https://github.com/pnlybubbles/flux-server-side-rendering-sample"
    }, "pnlybubbles\x2Fflux-server-side-rendering-sample")));
  };

  return AboutComponent;

})(React.Component);

module.exports = AboutComponent;



},{"./link-component":11,"react":undefined}],6:[function(require,module,exports){
var AboutComponent, AppComponent, ErrorComponent, IndexComponent, Link, React, Route,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

Route = require('./route-component');

Link = require('./link-component');

IndexComponent = require('./index-component');

AboutComponent = require('./about-component');

ErrorComponent = require('./error-component');

AppComponent = (function(superClass) {
  extend(AppComponent, superClass);

  function AppComponent(props) {
    AppComponent.__super__.constructor.call(this, props);
  }

  AppComponent.prototype.render = function() {
    return React.createElement("div", null, React.createElement("nav", null, React.createElement("li", null, React.createElement(Link, {
      "context": this.props.context,
      "href": '/'
    }, "Counter")), React.createElement("li", null, React.createElement(Link, {
      "context": this.props.context,
      "href": '/about'
    }, "About"))), React.createElement(Route, {
      "route": 'Index',
      "context": this.props.context
    }, React.createElement(IndexComponent, {
      "context": this.props.context
    })), React.createElement(Route, {
      "route": 'About',
      "context": this.props.context
    }, React.createElement(AboutComponent, {
      "context": this.props.context
    })), React.createElement(Route, {
      "route": 'Error',
      "context": this.props.context
    }, React.createElement(ErrorComponent, {
      "context": this.props.context
    })));
  };

  return AppComponent;

})(React.Component);

module.exports = AppComponent;



},{"./about-component":5,"./error-component":9,"./index-component":10,"./link-component":11,"./route-component":12,"react":undefined}],7:[function(require,module,exports){
var CounterComponent, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

CounterComponent = (function(superClass) {
  extend(CounterComponent, superClass);

  function CounterComponent(props) {
    CounterComponent.__super__.constructor.call(this, props);
  }

  CounterComponent.prototype.countUp = function() {
    return this.props.context.counterAction.countUp(this.props.counter.index, this.props.counter.count + 1);
  };

  CounterComponent.prototype.render = function() {
    return React.createElement("div", null, React.createElement("h3", null, this.props.counter.name), React.createElement("h1", null, this.props.counter.count), React.createElement("button", {
      "onClick": this.countUp.bind(this)
    }, "CountUp"));
  };

  return CounterComponent;

})(React.Component);

module.exports = CounterComponent;



},{"react":undefined}],8:[function(require,module,exports){
var CounterListItemComponent, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

CounterListItemComponent = (function(superClass) {
  extend(CounterListItemComponent, superClass);

  function CounterListItemComponent(props) {
    CounterListItemComponent.__super__.constructor.call(this, props);
  }

  CounterListItemComponent.prototype.active = function() {
    return this.props.context.counterAction.active(this.props.counter.index);
  };

  CounterListItemComponent.prototype.render = function() {
    return React.createElement("div", {
      "className": (this.props.active ? 'active' : '')
    }, React.createElement("span", null, this.props.counter.name), React.createElement("button", {
      "onClick": this.active.bind(this)
    }, "Select"));
  };

  return CounterListItemComponent;

})(React.Component);

module.exports = CounterListItemComponent;



},{"react":undefined}],9:[function(require,module,exports){
var ErrorComponent, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

ErrorComponent = (function(superClass) {
  extend(ErrorComponent, superClass);

  function ErrorComponent(props) {
    ErrorComponent.__super__.constructor.call(this, props);
  }

  ErrorComponent.prototype.render = function() {
    return React.createElement("div", null, React.createElement("h1", null, "404 NotFound"));
  };

  return ErrorComponent;

})(React.Component);

module.exports = ErrorComponent;



},{"react":undefined}],10:[function(require,module,exports){
var Counter, CounterListItem, IndexComponent, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

CounterListItem = require('./counter-list-item-component');

Counter = require('./counter-component');

IndexComponent = (function(superClass) {
  extend(IndexComponent, superClass);

  function IndexComponent(props) {
    IndexComponent.__super__.constructor.call(this, props);
    this.store = this.props.context.counterStore;
    this.state = this.store.get();
  }

  IndexComponent.prototype._onChange = function() {
    return this.setState(this.store.get());
  };

  IndexComponent.prototype.componentDidMount = function() {
    return this.store.onChange(this._onChange.bind(this));
  };

  IndexComponent.prototype.componentWillUnmount = function() {
    return this.store.removeAllChangeListeners();
  };

  IndexComponent.prototype.render = function() {
    return React.createElement("div", null, React.createElement("h1", null, "Counters"), React.createElement("h3", null, "Counter Select"), React.createElement("div", null, this.state.counters.map((function(_this) {
      return function(counter) {
        return React.createElement("li", {
          "key": counter.index
        }, React.createElement(CounterListItem, {
          "active": counter.index === _this.state.active,
          "counter": counter,
          "context": _this.props.context
        }));
      };
    })(this))), React.createElement("div", null, React.createElement(Counter, {
      "counter": this.state.counters[this.state.active],
      "context": this.props.context
    })));
  };

  return IndexComponent;

})(React.Component);

module.exports = IndexComponent;



},{"./counter-component":7,"./counter-list-item-component":8,"react":undefined}],11:[function(require,module,exports){
var Link, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

Link = (function(superClass) {
  extend(Link, superClass);

  function Link(props) {
    Link.__super__.constructor.call(this, props);
  }

  Link.prototype.navigate = function(e) {
    e.preventDefault();
    return this.props.context.routeAction.navigate(this.props.href);
  };

  Link.prototype.render = function() {
    return React.createElement("a", {
      "href": this.props.href,
      "onClick": this.navigate.bind(this)
    }, this.props.children);
  };

  return Link;

})(React.Component);

module.exports = Link;



},{"react":undefined}],12:[function(require,module,exports){
var React, RouteComponent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

RouteComponent = (function(superClass) {
  extend(RouteComponent, superClass);

  function RouteComponent(props) {
    RouteComponent.__super__.constructor.call(this, props);
    this.store = this.props.context.routeStore;
    this.state = this.store.get();
  }

  RouteComponent.prototype._onChange = function() {
    return this.setState(this.store.get());
  };

  RouteComponent.prototype.componentDidMount = function() {
    return this.store.onChange(this._onChange.bind(this));
  };

  RouteComponent.prototype.componentWillUnmount = function() {
    return this.store.removeAllChangeListeners();
  };

  RouteComponent.prototype.render = function() {
    return React.createElement("div", null, (this.state.route === this.props.route ? this.props.children : void 0));
  };

  return RouteComponent;

})(React.Component);

module.exports = RouteComponent;



},{"react":undefined}],13:[function(require,module,exports){
var Context, CounterAction, CounterStore, Flux, RouteAction, RouteStore,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Flux = require('material-flux');

RouteAction = require('./actions/route-action');

RouteStore = require('./stores/route-store');

CounterAction = require('./actions/counter-action');

CounterStore = require('./stores/counter-store');

Context = (function(superClass) {
  extend(Context, superClass);

  function Context(initialStates) {
    Context.__super__.constructor.apply(this, arguments);
    this.initialStates = initialStates;
    this.routeAction = new RouteAction(this);
    this.routeStore = new RouteStore(this);
    this.counterAction = new CounterAction(this);
    this.counterStore = new CounterStore(this);
  }

  return Context;

})(Flux.Context);

module.exports = Context;



},{"./actions/counter-action":3,"./actions/route-action":4,"./stores/counter-store":17,"./stores/route-store":18,"material-flux":undefined}],14:[function(require,module,exports){
module.exports = {
  route: 'route',
  active: 'active',
  countUp: 'countUp'
};



},{}],15:[function(require,module,exports){
var RouterUtil;

RouterUtil = (function() {
  function RouterUtil(root, routes) {
    this.root = (root != null) && root !== '/' ? '/' + this.clearSlashes(root) + '/' : '/';
    this.routes = routes;
  }

  RouterUtil.prototype.route = function(fragment) {
    var match, r, re, ref;
    fragment = fragment.replace(/\?(.*)$/, '');
    fragment = this.clearSlashes(fragment.replace(new RegExp("^" + this.root), ''));
    ref = this.routes;
    for (re in ref) {
      r = ref[re];
      match = fragment.match(new RegExp("^" + re + "$"));
      if (match != null) {
        match.shift();
        return [r, match];
      }
    }
    return [null, []];
  };

  RouterUtil.prototype.clearSlashes = function(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  };

  return RouterUtil;

})();

module.exports = RouterUtil;



},{}],16:[function(require,module,exports){
module.exports = {
  root: '/',
  routes: {
    '': 'Index',
    'about': 'About',
    '.*': 'Error'
  }
};



},{}],17:[function(require,module,exports){
var CounterStore, Flux, keys, objectAssign,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Flux = require('material-flux');

keys = require('../keys.coffee');

objectAssign = require('object-assign');

CounterStore = (function(superClass) {
  extend(CounterStore, superClass);

  function CounterStore(context) {
    CounterStore.__super__.constructor.call(this, context);
    this.state = {
      counters: [
        {
          name: 'counter1',
          count: 0,
          index: 0
        }, {
          name: 'counter2',
          count: 0,
          index: 1
        }, {
          name: 'counter3',
          count: 0,
          index: 2
        }
      ],
      active: 0
    };
    this.state = objectAssign(this.state, context.initialStates.CounterStore);
    this.register(keys.active, this.active);
    this.register(keys.countUp, this.countUp);
  }

  CounterStore.prototype.active = function(index) {
    var c;
    if (indexOf.call((function() {
      var i, len, ref, results;
      ref = this.state.counters;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        results.push(c.index);
      }
      return results;
    }).call(this), index) >= 0) {
      return this.setState({
        active: index
      });
    }
  };

  CounterStore.prototype.countUp = function(index, count) {
    var c, counters;
    if (indexOf.call((function() {
      var i, len, ref, results;
      ref = this.state.counters;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        results.push(c.index);
      }
      return results;
    }).call(this), index) >= 0) {
      counters = this.state.counters;
      counters[index].count = count;
      return this.setState({
        counters: counters
      });
    }
  };

  CounterStore.prototype.get = function() {
    return this.state;
  };

  return CounterStore;

})(Flux.Store);

module.exports = CounterStore;



},{"../keys.coffee":14,"material-flux":undefined,"object-assign":undefined}],18:[function(require,module,exports){
var Flux, RouteStore, RouterUtil, keys, objectAssign, routes,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Flux = require('material-flux');

keys = require('../keys');

routes = require('../routes');

RouterUtil = require('../lib/router-util');

objectAssign = require('object-assign');

RouteStore = (function(superClass) {
  extend(RouteStore, superClass);

  function RouteStore(context) {
    RouteStore.__super__.constructor.call(this, context);
    this.state = {
      route: '/',
      argu: []
    };
    this.state = objectAssign(this.state, context.initialStates.RouteStore);
    this.register(keys.route, this.route);
    this.routerUtil = new RouterUtil(routes.root, routes.routes);
  }

  RouteStore.prototype.route = function(fragment) {
    var argu, ref, route;
    console.log("route:", fragment);
    ref = this.routerUtil.route(fragment), route = ref[0], argu = ref[1];
    if (route != null) {
      return this.setState({
        route: route,
        argu: argu
      });
    }
  };

  RouteStore.prototype.get = function() {
    return this.state;
  };

  return RouteStore;

})(Flux.Store);

module.exports = RouteStore;



},{"../keys":14,"../lib/router-util":15,"../routes":16,"material-flux":undefined,"object-assign":undefined}]},{},[1])


//# sourceMappingURL=app.js.map