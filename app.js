(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
var Context, Crypto, Handlebars, LocalStrategy, Mongoose, React, Root, User, UserSchema, bodyParser, cookieParser, counter, db, express, expressSession, fs, getHash, passport, routes, secretKey, server, template;

require('source-map-support').install();

express = require('express');

bodyParser = require('body-parser');

cookieParser = require('cookie-parser');

expressSession = require('express-session');

fs = require('fs');

Handlebars = require('handlebars');

React = require('react');

Context = require('./renderer/context');

Root = require('./renderer/components/root-component');

routes = require('./renderer/routes');

Crypto = require('crypto');

passport = require('passport');

Mongoose = require('mongoose');

LocalStrategy = require('passport-local').Strategy;

server = express();

server.use('/static', express["static"]('public'));

server.use(bodyParser());

server.use(cookieParser());

server.use(expressSession({
  secret: "secret"
}));

server.use(passport.initialize());

server.use(passport.session());

template = Handlebars.compile(fs.readFileSync((fs.realpathSync('./')) + "/view/index.hbs").toString());

secretKey = 'secret';

getHash = function(target) {
  var sha;
  sha = Crypto.createHmac('sha256', secretKey);
  sha.update(target);
  return sha.digest('hex');
};

db = Mongoose.createConnection('mongodb://localhost/flux-server-side-rendering-sample', function(error, res) {});

UserSchema = new Mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.methods.authenticate = function(password) {
  return this.password === getHash(password);
};

User = db.model('User', UserSchema);

User.count(function(err, c) {
  var testUser;
  if (c === 0) {
    testUser = new User();
    testUser.email = 'test@sample.com';
    testUser.password = getHash('test');
    return testUser.save();
  }
});

User.count(function(err, c) {
  return console.log(c);
});

passport.serializeUser(function(user, done) {
  return done(null, {
    email: user.email,
    _id: user._id
  });
});

passport.deserializeUser(function(serializedUser, done) {
  return User.findById(serializedUser._id, function(err, user) {
    return done(err, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, done) {
  return process.nextTick(function() {
    return User.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        done(err);
      }
      if (user == null) {
        done(null, false, {
          message: 'user not found'
        });
      }
      if (!user.authenticate(password)) {
        done(null, false, {
          message: 'invalid password'
        });
      }
      return done(null, user);
    });
  });
}));

server.post('/api/login', function(req, res) {
  console.log(req.body);
  return passport.authenticate('local', function(err, user, info) {
    var res_user;
    res_user = {
      error: err,
      user: user ? {
        email: user.email,
        _id: user._id
      } : null,
      logined: !!user
    };
    if ((err == null) && user) {
      req.logIn(user, function() {});
    }
    return res.json(res_user);
  })(req, res);
});

counter = {
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

server.post('/api/counter/:index/count_up', function(req, res) {
  var index, ref, ref1;
  index = parseInt(req.params.index, 10);
  if ((ref = counter.counters[index]) != null) {
    ref.count += 1;
  }
  res.contentType('application/json');
  return res.json({
    count: (ref1 = counter.counters[index]) != null ? ref1.count : void 0
  });
});

server.get('/favicon.ico', function(req, res) {});

server.get('*', function(req, res) {
  var context, initialStates, res_user;
  console.log(req.originalUrl, req.isAuthenticated());
  res_user = {
    error: null,
    user: req.user ? {
      email: req.user.email,
      _id: req.user._id
    } : null,
    logined: !!req.user
  };
  initialStates = {
    RouteStore: {
      fragment: req.originalUrl,
      routes: routes
    },
    CounterStore: counter,
    UserStore: res_user
  };
  context = new Context(initialStates);
  return res.send(template({
    initialStates: JSON.stringify(initialStates),
    markup: React.renderToString(React.createElement(Root, {
      context: context
    }))
  }));
});

server.listen(process.env.PORT || 5000);



}).call(this,require("/Users/pnlybubbles/Devs/flux-server-side-rendering-sample/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))

},{"./renderer/components/root-component":14,"./renderer/context":16,"./renderer/routes":19,"/Users/pnlybubbles/Devs/flux-server-side-rendering-sample/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":2,"body-parser":undefined,"cookie-parser":undefined,"crypto":undefined,"express":undefined,"express-session":undefined,"fs":undefined,"handlebars":undefined,"mongoose":undefined,"passport":undefined,"passport-local":undefined,"react":undefined,"source-map-support":undefined}],2:[function(require,module,exports){
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
var CounterAction, Flux, Promise, keys, request,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Flux = require('material-flux');

keys = require('../keys');

request = require('superagent');

Promise = require('bluebird');

CounterAction = (function(superClass) {
  extend(CounterAction, superClass);

  function CounterAction() {
    return CounterAction.__super__.constructor.apply(this, arguments);
  }

  CounterAction.prototype.active = function(index) {
    return this.dispatch(keys.active, index);
  };

  CounterAction.prototype.countUp = function(index, count) {
    this.dispatch(keys.countUp, index, count);
    return new Promise(function(resolve, reject) {
      return request.post("/api/counter/" + index + "/count_up").send({
        count: count
      }).end(function(err, res) {
        if (res.ok) {
          return resolve(res.body);
        } else {
          return reject(err);
        }
      });
    }).then((function(_this) {
      return function(res) {
        return _this.dispatch(keys.countUp, index, res.count);
      };
    })(this))["catch"](function(err) {
      return console.error(err);
    });
  };

  return CounterAction;

})(Flux.Action);

module.exports = CounterAction;



},{"../keys":17,"bluebird":undefined,"material-flux":undefined,"superagent":undefined}],4:[function(require,module,exports){
var Flux, History, RouteAction, keys,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Flux = require('material-flux');

keys = require('../keys');

History = null;

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
          console.log('statechange', state.hash);
          return _this.dispatch(keys.route, state.hash);
        };
      })(this));
    } else {
      if (typeof window !== "undefined" && window !== null) {
        console.warn('html5-history is not available.');
      }
    }
  }

  RouteAction.prototype.navigate = function(path, options) {
    path = "/" + (this.clearSlashes(path));
    if ((History != null ? History.Adapter : void 0) != null) {
      console.log(History.getState().hash);
      console.log('navigate', path, options);
      if ((options != null ? options.replace : void 0) === true) {
        return History.replaceState(null, null, path, void 0, options != null ? options.silent : void 0);
      } else {
        return History.pushState(null, null, path, void 0, options != null ? options.silent : void 0);
      }
    } else if (typeof location !== "undefined" && location !== null) {
      return location.href = path;
    }
  };

  RouteAction.prototype.clearSlashes = function(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  };

  return RouteAction;

})(Flux.Action);

module.exports = RouteAction;



},{"../keys":17,"html5-history":undefined,"material-flux":undefined}],5:[function(require,module,exports){
var Flux, Promise, UserAction, keys, request,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Flux = require('material-flux');

keys = require('../keys');

request = require('superagent');

Promise = require('bluebird');

UserAction = (function(superClass) {
  extend(UserAction, superClass);

  function UserAction() {
    return UserAction.__super__.constructor.apply(this, arguments);
  }

  UserAction.prototype.login = function(email, password) {
    return new Promise(function(resolve, reject) {
      return request.post('/api/login').send({
        email: email,
        password: password
      }).end(function(err, res) {
        if (res.ok) {
          return resolve(res.body);
        } else {
          return reject(err);
        }
      });
    }).then((function(_this) {
      return function(res) {
        console.log(res);
        return _this.dispatch(keys.user, res);
      };
    })(this))["catch"](function(err) {
      return console.error(err);
    });
  };

  UserAction.prototype.logout = function() {
    return console.log('logout');
  };

  return UserAction;

})(Flux.Action);

module.exports = UserAction;



},{"../keys":17,"bluebird":undefined,"material-flux":undefined,"superagent":undefined}],6:[function(require,module,exports){
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

AboutComponent.contextTypes = {
  ctx: React.PropTypes.any
};

module.exports = AboutComponent;



},{"./link-component":12,"react":undefined}],7:[function(require,module,exports){
var AboutComponent, AppComponent, ErrorComponent, IndexComponent, Link, LoginComponent, React, Route,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

Route = require('./route-component');

Link = require('./link-component');

IndexComponent = require('./index-component');

AboutComponent = require('./about-component');

LoginComponent = require('./login-component');

ErrorComponent = require('./error-component');

AppComponent = (function(superClass) {
  extend(AppComponent, superClass);

  function AppComponent(props) {
    AppComponent.__super__.constructor.call(this, props);
  }

  AppComponent.prototype._onChange = function() {
    return this.setState(this.store.get());
  };

  AppComponent.prototype.componentWillMount = function() {
    this.store = this.context.ctx.userStore;
    return this.setState(this.store.get());
  };

  AppComponent.prototype.componentDidMount = function() {
    return this.store.onChange(this._onChange.bind(this));
  };

  AppComponent.prototype.componentWillUnmount = function() {
    return this.store.removeAllChangeListeners();
  };

  AppComponent.prototype.render = function() {
    return React.createElement("div", null, React.createElement(Route, {
      "addClassName": 'active',
      "logined": this.state.logined
    }, React.createElement("li", {
      "route": 'Index'
    }, React.createElement(Link, {
      "href": '/'
    }, "Counter")), React.createElement("li", {
      "route": 'About'
    }, React.createElement(Link, {
      "href": '/about'
    }, "About")), React.createElement("li", {
      "route": 'Login'
    }, React.createElement(Link, {
      "href": '/login'
    }, "Login"))), React.createElement(Route, {
      "logined": this.state.logined
    }, React.createElement(IndexComponent, {
      "route": 'Index'
    }), React.createElement(AboutComponent, {
      "route": 'About'
    }), React.createElement(ErrorComponent, {
      "route": 'Error'
    }), React.createElement(LoginComponent, {
      "route": 'Login'
    })));
  };

  return AppComponent;

})(React.Component);

AppComponent.contextTypes = {
  ctx: React.PropTypes.any
};

module.exports = AppComponent;



},{"./about-component":6,"./error-component":10,"./index-component":11,"./link-component":12,"./login-component":13,"./route-component":15,"react":undefined}],8:[function(require,module,exports){
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
    return this.context.ctx.counterAction.countUp(this.props.counter.index, this.props.counter.count + 1);
  };

  CounterComponent.prototype.render = function() {
    return React.createElement("div", null, React.createElement("h3", null, this.props.counter.name), React.createElement("h1", null, this.props.counter.count), React.createElement("button", {
      "onClick": this.countUp.bind(this)
    }, "CountUp"));
  };

  return CounterComponent;

})(React.Component);

CounterComponent.contextTypes = {
  ctx: React.PropTypes.any
};

module.exports = CounterComponent;



},{"react":undefined}],9:[function(require,module,exports){
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
    return this.context.ctx.counterAction.active(this.props.counter.index);
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

CounterListItemComponent.contextTypes = {
  ctx: React.PropTypes.any
};

module.exports = CounterListItemComponent;



},{"react":undefined}],10:[function(require,module,exports){
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

ErrorComponent.contextTypes = {
  ctx: React.PropTypes.any
};

module.exports = ErrorComponent;



},{"react":undefined}],11:[function(require,module,exports){
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
  }

  IndexComponent.prototype._onChange = function() {
    return this.setState(this.store.get());
  };

  IndexComponent.prototype.componentWillMount = function() {
    this.store = this.context.ctx.counterStore;
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
          "counter": counter
        }));
      };
    })(this))), React.createElement("div", null, React.createElement(Counter, {
      "counter": this.state.counters[this.state.active]
    })));
  };

  return IndexComponent;

})(React.Component);

IndexComponent.contextTypes = {
  ctx: React.PropTypes.any
};

module.exports = IndexComponent;



},{"./counter-component":8,"./counter-list-item-component":9,"react":undefined}],12:[function(require,module,exports){
var LinkComponent, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

LinkComponent = (function(superClass) {
  extend(LinkComponent, superClass);

  function LinkComponent(props) {
    LinkComponent.__super__.constructor.call(this, props);
  }

  LinkComponent.prototype.navigate = function(e) {
    e.preventDefault();
    return this.context.ctx.routeAction.navigate(this.props.href);
  };

  LinkComponent.prototype.render = function() {
    return React.createElement("a", {
      "href": this.props.href,
      "onClick": this.navigate.bind(this)
    }, this.props.children);
  };

  return LinkComponent;

})(React.Component);

LinkComponent.contextTypes = {
  ctx: React.PropTypes.any
};

module.exports = LinkComponent;



},{"react":undefined}],13:[function(require,module,exports){
var LoginComponent, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

LoginComponent = (function(superClass) {
  extend(LoginComponent, superClass);

  function LoginComponent(props) {
    LoginComponent.__super__.constructor.call(this, props);
    this.state = {
      email: '',
      password: ''
    };
  }

  LoginComponent.prototype.changeEmailInput = function(e) {
    return this.setState({
      email: e.target.value
    });
  };

  LoginComponent.prototype.changePasswordInput = function(e) {
    return this.setState({
      password: e.target.value
    });
  };

  LoginComponent.prototype.login = function() {
    return this.context.ctx.userAction.login(this.state.email, this.state.password);
  };

  LoginComponent.prototype.render = function() {
    return React.createElement("div", null, React.createElement("h1", null, "Login"), React.createElement("span", null, "email"), React.createElement("input", {
      "name": 'email',
      "type": 'text',
      "value": this.state.email,
      "onChange": this.changeEmailInput.bind(this)
    }), React.createElement("span", null, "password"), React.createElement("input", {
      "name": 'password',
      "type": 'password',
      "value": this.state.password,
      "onChange": this.changePasswordInput.bind(this)
    }), React.createElement("button", {
      "onClick": this.login.bind(this)
    }, "Login"));
  };

  return LoginComponent;

})(React.Component);

LoginComponent.contextTypes = {
  ctx: React.PropTypes.any
};

module.exports = LoginComponent;



},{"react":undefined}],14:[function(require,module,exports){
var App, React, RootComponent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

App = require('./app-component');

RootComponent = (function(superClass) {
  extend(RootComponent, superClass);

  function RootComponent(props) {
    RootComponent.__super__.constructor.call(this, props);
  }

  RootComponent.prototype.getChildContext = function() {
    return {
      ctx: this.props.context
    };
  };

  RootComponent.prototype.render = function() {
    return React.createElement(App, null);
  };

  return RootComponent;

})(React.Component);

RootComponent.childContextTypes = {
  ctx: React.PropTypes.any
};

module.exports = RootComponent;



},{"./app-component":7,"react":undefined}],15:[function(require,module,exports){
var React, RouteComponent, Router,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

Router = require('../lib/router');

RouteComponent = (function(superClass) {
  extend(RouteComponent, superClass);

  function RouteComponent(props) {
    RouteComponent.__super__.constructor.call(this, props);
  }

  RouteComponent.prototype._onChange = function() {
    this.setState(this.store.get());
    return console.log('onChange', this.store.get());
  };

  RouteComponent.prototype.componentWillMount = function() {
    var state;
    this.store = this.context.ctx.routeStore;
    state = this.store.get();
    this.setState(state);
    this.router = new Router(state.routes.root, state.routes.routes);
    return this.router.setAuth(state.routes.auth);
  };

  RouteComponent.prototype.componentDidMount = function() {
    return this.store.onChange(this._onChange.bind(this));
  };

  RouteComponent.prototype.componentWillUnmount = function() {
    return this.store.removeAllChangeListeners();
  };

  RouteComponent.prototype.render = function() {
    return React.createElement("div", null, this.router.route(this.state.fragment, this.props.logined, (function(_this) {
      return function(route, argu, default_route, fragment, default_fragment) {
        console.log(route, argu, default_route, fragment, default_fragment);
        if ((default_route != null) && (default_fragment != null)) {
          _this.context.ctx.routeAction.navigate(fragment, {
            replace: true,
            silent: true
          });
        }
        return React.Children.map(_this.props.children, function(child) {
          if (child.props.route === route) {
            if (_this.props.addClassName != null) {
              return React.cloneElement(child, {
                argu: argu,
                className: _this.props.addClassName
              });
            } else {
              return React.cloneElement(child, {
                argu: argu
              });
            }
          } else {
            if (_this.props.addClassName != null) {
              return React.cloneElement(child, {
                argu: argu
              });
            } else {
              return null;
            }
          }
        });
      };
    })(this), (function(_this) {
      return function(route, argu, default_route) {
        return React.createElement("h1", null, "404 NotFound");
      };
    })(this)));
  };

  return RouteComponent;

})(React.Component);

RouteComponent.contextTypes = {
  ctx: React.PropTypes.any
};

module.exports = RouteComponent;



},{"../lib/router":18,"react":undefined}],16:[function(require,module,exports){
var Context, CounterAction, CounterStore, Flux, RouteAction, RouteStore, UserAction, UserStore,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Flux = require('material-flux');

RouteAction = require('./actions/route-action');

RouteStore = require('./stores/route-store');

CounterAction = require('./actions/counter-action');

CounterStore = require('./stores/counter-store');

UserAction = require('./actions/user-action');

UserStore = require('./stores/user-store');

Context = (function(superClass) {
  extend(Context, superClass);

  function Context(initialStates) {
    Context.__super__.constructor.apply(this, arguments);
    this.initialStates = initialStates;
    this.routeAction = new RouteAction(this);
    this.routeStore = new RouteStore(this);
    this.counterAction = new CounterAction(this);
    this.counterStore = new CounterStore(this);
    this.userAction = new UserAction(this);
    this.userStore = new UserStore(this);
  }

  return Context;

})(Flux.Context);

module.exports = Context;



},{"./actions/counter-action":3,"./actions/route-action":4,"./actions/user-action":5,"./stores/counter-store":20,"./stores/route-store":21,"./stores/user-store":22,"material-flux":undefined}],17:[function(require,module,exports){
module.exports = {
  route: 'route',
  active: 'active',
  countUp: 'countUp'
};



},{}],18:[function(require,module,exports){
var Router, objectAssign;

objectAssign = require('object-assign');

Router = (function() {
  function Router(root, routes) {
    this.setRoot(root);
    if (routes != null) {
      this.routes = routes;
    }
    this.auth = {};
  }

  Router.prototype.setRoot = function(root) {
    return this.root = (root != null) && root !== '/' ? '/' + this.clearSlashes(root) + '/' : '/';
  };

  Router.prototype.setRoute = function(path, route) {
    var routes;
    if (route == null) {
      routes = path;
    } else {
      routes = {};
      routes[path] = route;
    }
    return this.routes = objectAssign(this.routes, routes);
  };

  Router.prototype.setAuth = function(route, required, renavigate) {
    var auth;
    if (!((required != null) && (renavigate != null))) {
      auth = route;
    } else {
      auth = {};
      auth[route] = {
        required: required,
        renavigate: renavigate
      };
    }
    return this.auth = objectAssign(this.auth, auth);
  };

  Router.prototype.route = function(fragment, logined, resolve, reject) {
    var auth, match, match_, r, r_, re, re_, ref, ref1, res;
    if (typeof logined === 'function' && (reject == null)) {
      reject = resolve;
      resolve = logined;
      logined = void 0;
    }
    fragment = fragment.replace(/\?(.*)$/, '');
    fragment = this.clearSlashes(fragment.replace(new RegExp("^" + this.root), ''));
    res = [];
    ref = this.routes;
    for (re in ref) {
      r = ref[re];
      match = fragment.match(new RegExp("^" + re + "$"));
      if (match != null) {
        match.shift();
        if (logined != null) {
          auth = this.auth[r];
          if (((auth != null ? auth.required : void 0) === true && !logined) || ((auth != null ? auth.required : void 0) === false && logined)) {
            if (auth.renavigate != null) {
              ref1 = this.routes;
              for (re_ in ref1) {
                r_ = ref1[re_];
                match_ = auth.renavigate.match(new RegExp("^" + re_ + "$"));
                if (match_ != null) {
                  return typeof resolve === "function" ? resolve(r_, match_, r, auth.renavigate, fragment) : void 0;
                }
              }
              console.warn('\'renavigate\' fragment is not found in routes.');
            } else {
              console.warn('\'renavigate\' is not specified in authenticated route.');
            }
          }
        }
        return typeof resolve === "function" ? resolve(r, match, null, fragment, null) : void 0;
      }
    }
    return typeof reject === "function" ? reject(null, [], null, fragment, null) : void 0;
  };

  Router.prototype.clearSlashes = function(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  };

  return Router;

})();

module.exports = Router;



},{"object-assign":undefined}],19:[function(require,module,exports){
module.exports = {
  root: '/',
  routes: {
    '': 'Index',
    'about': 'About',
    'login': 'Login',
    '.*': 'Error'
  },
  auth: {
    Index: {
      required: true,
      renavigate: 'login'
    },
    Login: {
      required: false,
      renavigate: ''
    }
  }
};



},{}],20:[function(require,module,exports){
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



},{"../keys.coffee":17,"material-flux":undefined,"object-assign":undefined}],21:[function(require,module,exports){
var Flux, RouteStore, keys, objectAssign,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Flux = require('material-flux');

keys = require('../keys');

objectAssign = require('object-assign');

RouteStore = (function(superClass) {
  extend(RouteStore, superClass);

  function RouteStore(context) {
    RouteStore.__super__.constructor.call(this, context);
    this.state = {
      fragment: '/',
      routes: null
    };
    this.state = objectAssign(this.state, context.initialStates.RouteStore);
    this.register(keys.route, this.route);
    if (this.state.routes == null) {
      throw new Error('state.routes must be specifyed by initialState.');
    }
  }

  RouteStore.prototype.route = function(fragment) {
    console.log('route:', fragment);
    return this.setState({
      fragment: fragment
    });
  };

  RouteStore.prototype.get = function() {
    return this.state;
  };

  return RouteStore;

})(Flux.Store);

module.exports = RouteStore;



},{"../keys":17,"material-flux":undefined,"object-assign":undefined}],22:[function(require,module,exports){
var Flux, UserStore, keys, objectAssign,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Flux = require('material-flux');

keys = require('../keys');

objectAssign = require('object-assign');

UserStore = (function(superClass) {
  extend(UserStore, superClass);

  function UserStore(context) {
    UserStore.__super__.constructor.call(this, context);
    this.state = {
      error: null,
      user: null,
      logined: false
    };
    this.state = objectAssign(this.state, context.initialStates.UserStore);
    this.register(keys.user, this.user);
  }

  UserStore.prototype.user = function(res) {
    return this.setState(res);
  };

  UserStore.prototype.get = function() {
    return this.state;
  };

  return UserStore;

})(Flux.Store);

module.exports = UserStore;



},{"../keys":17,"material-flux":undefined,"object-assign":undefined}]},{},[1])


//# sourceMappingURL=app.js.map