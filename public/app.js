(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("actions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialFetchChats = exports.initialFetchUsers = exports.loadChatMessages = exports.createChat = exports.addChatMessage = exports.selectChat = undefined;

var _apiCalls = require('utils/apiCalls');

var selectChat = exports.selectChat = function selectChat(chatId) {
  return {
    type: 'SELECT_CHAT',
    chatId: chatId
  };
};

var addChatMessage = exports.addChatMessage = function addChatMessage(chatId, message) {
  return {
    type: 'ADD_CHAT_MESSAGE',
    chatId: chatId,
    message: message
  };
};

var createChat = exports.createChat = function createChat(username) {
  return function (dispatch) {
    (0, _apiCalls.createChat)(username).then(function (chatId) {
      dispatch({ type: 'ADD_CHAT', chatId: chatId });
    });
  };
};

var loadChatMessages = exports.loadChatMessages = function loadChatMessages(chatId) {
  return function (dispatch) {
    (0, _apiCalls.loadChatMessages)(chatId).then(function (chatMessages) {
      dispatch({ type: 'RECEIVE_CHAT_MESSAGES', chatMessages: chatMessages });
    });
  };
};

var initialFetchUsers = exports.initialFetchUsers = function initialFetchUsers() {
  return function (dispatch) {
    (0, _apiCalls.getAllUsers)().then(function (users) {
      dispatch({ type: 'RECEIVE_USERS', users: users });
    });
  };
};

var initialFetchChats = exports.initialFetchChats = function initialFetchChats() {
  return function (dispatch) {
    (0, _apiCalls.getUserChats)().then(function (chats) {
      dispatch({ type: 'RECEIVE_CHATS', chats: chats });
    });
  };
};
});

require.register("components/Chat.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'Chat',

  propTypes: {
    chatId: _react2.default.PropTypes.string.isRequired,
    selectedChat: _react2.default.PropTypes.string.isRequired,
    onSelect: _react2.default.PropTypes.func.isRequired
  },

  handleClick: function handleClick() {
    this.props.onSelect(this.props.chatId);
  },
  render: function render() {
    var _props = this.props;
    var chatId = _props.chatId;
    var selectedChat = _props.selectedChat;

    var className = chatId === selectedChat ? 'Chat-selected' : 'Chat';

    return _react2.default.createElement(
      'div',
      { className: className, onClick: this.handleClick },
      chatId
    );
  }
});
});

require.register("components/MessageForm.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ws = void 0;

exports.default = _react2.default.createClass({
  displayName: 'MessageForm',

  propTypes: {
    chatId: _react2.default.PropTypes.string.isRequired,
    onMessage: _react2.default.PropTypes.func.isRequired
  },

  componentWillMount: function componentWillMount() {
    var _props = this.props;
    var chatId = _props.chatId;
    var onMessage = _props.onMessage;


    ws = new WebSocket('ws://127.0.0.1:8888/tornado_chat/' + chatId + '/');

    ws.onmessage = function (e) {
      onMessage(chatId, e.data);
    };
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    if (nextProps.chatId === this.props.chatId) {
      return false;
    } else {
      return true;
    }
  },
  componentWillUpdate: function componentWillUpdate(nextProps) {
    ws.close();
    ws = new WebSocket('ws://127.0.0.1:8888/tornado_chat/' + nextProps.chatId + '/');

    ws.onmessage = function (e) {
      nextProps.onMessage(nextProps.chatId, e.data);
    };
  },
  handleClick: function handleClick() {
    var message = this.refs.message.value;
    ws.send(message);
    this.refs.message.value = '';
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'MessageForm' },
      _react2.default.createElement('textarea', { ref: 'message', type: 'text', placeholder: 'Type your text here' }),
      _react2.default.createElement(
        'button',
        { onClick: this.handleClick },
        'Send'
      )
    );
  }
});
});

require.register("components/MessagesBlock.jsx", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: "MessagesBlock",

  propTypes: {
    chatMessages: _react2.default.PropTypes.array
  },

  render: function render() {
    var chatMessages = this.props.chatMessages;


    if (chatMessages) {
      return _react2.default.createElement(
        "div",
        { className: "MessagesBlock" },
        chatMessages.map(function (message) {
          return _react2.default.createElement(
            "div",
            { className: "Message" },
            message.text
          );
        })
      );
    } else {
      return _react2.default.createElement(
        "div",
        { className: "MessagesBlock" },
        "There is no messages"
      );
    }
  }
});
});

require.register("components/User.jsx", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: "User",

  propTypes: {
    username: _react2.default.PropTypes.string.isRequired,
    onChatCreate: _react2.default.PropTypes.func.isRequired
  },

  handleClick: function handleClick() {
    this.props.onChatCreate(this.props.username);
  },
  render: function render() {
    var username = this.props.username;


    return _react2.default.createElement(
      "div",
      { className: "User" },
      _react2.default.createElement(
        "div",
        null,
        username
      ),
      _react2.default.createElement(
        "button",
        { onClick: this.handleClick },
        "Start chat"
      )
    );
  }
});
});

require.register("container/App.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _ChatsList = require('./ChatsList');

var _ChatsList2 = _interopRequireDefault(_ChatsList);

var _ChatWindow = require('./ChatWindow');

var _ChatWindow2 = _interopRequireDefault(_ChatWindow);

var _UsersList = require('./UsersList');

var _UsersList2 = _interopRequireDefault(_UsersList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App(_ref) {
  var selectedChat = _ref.selectedChat;

  return _react2.default.createElement(
    'div',
    { className: 'Container' },
    _react2.default.createElement(_ChatsList2.default, { selectedChat: selectedChat }),
    _react2.default.createElement(_ChatWindow2.default, { selectedChat: selectedChat }),
    _react2.default.createElement(_UsersList2.default, null)
  );
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    selectedChat: state.selectedChat
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(App);
});

;require.register("container/ChatWindow.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('actions');

var _MessagesBlock = require('components/MessagesBlock');

var _MessagesBlock2 = _interopRequireDefault(_MessagesBlock);

var _MessageForm = require('components/MessageForm');

var _MessageForm2 = _interopRequireDefault(_MessageForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChatWindow = function ChatWindow(_ref) {
  var selectedChat = _ref.selectedChat;
  var messages = _ref.messages;
  var onChatMessage = _ref.onChatMessage;

  if (selectedChat) {
    return _react2.default.createElement(
      'div',
      { className: 'ChatWindow' },
      _react2.default.createElement(_MessagesBlock2.default, { chatMessages: messages[selectedChat] }),
      _react2.default.createElement(_MessageForm2.default, { chatId: selectedChat, onMessage: onChatMessage })
    );
  } else {
    return _react2.default.createElement('div', { className: 'ChatWindow-empty' });
  }
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    messages: state.messages
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onChatMessage: function onChatMessage(chatId, message) {
      dispatch((0, _actions.addChatMessage)(chatId, message));
    }
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ChatWindow);
});

require.register("container/ChatsList.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('actions');

var _Chat = require('components/Chat');

var _Chat2 = _interopRequireDefault(_Chat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChatList = function ChatList(_ref) {
  var chats = _ref.chats;
  var selectedChat = _ref.selectedChat;
  var onChatSelect = _ref.onChatSelect;

  return _react2.default.createElement(
    'div',
    { className: 'ChatList' },
    chats.map(function (chat) {
      return _react2.default.createElement(_Chat2.default, { chatId: chat.id, selectedChat: selectedChat, onSelect: onChatSelect, key: chat.id });
    })
  );
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    chats: state.chats
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onChatSelect: function onChatSelect(chatId) {
      dispatch((0, _actions.selectChat)(chatId));
      dispatch((0, _actions.loadChatMessages)(chatId));
    }
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ChatList);
});

require.register("container/UsersList.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('actions');

var _User = require('components/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserList = function UserList(_ref) {
  var users = _ref.users;
  var onChatCreate = _ref.onChatCreate;

  return _react2.default.createElement(
    'div',
    { className: 'UsersList' },
    users.map(function (user) {
      return _react2.default.createElement(_User2.default, { username: user.username, onChatCreate: onChatCreate, key: user.username });
    })
  );
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    users: state.users
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onChatCreate: function onChatCreate(username) {
      dispatch((0, _actions.createChat)(username));
    }
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(UserList);
});

require.register("initialize.js", function(exports, require, module) {
'use strict';

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reactRedux = require('react-redux');

require('whatwg-fetch');

var _reducer = require('reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _App = require('container/App');

var _App2 = _interopRequireDefault(_App);

var _actions = require('actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('es6-promise').polyfill();
require('whatwg-fetch');

var store = (0, _redux.createStore)(_reducer2.default, (0, _redux.applyMiddleware)(_reduxThunk2.default));

store.dispatch((0, _actions.initialFetchUsers)());
store.dispatch((0, _actions.initialFetchChats)());

document.addEventListener('DOMContentLoaded', function () {
  var el = document.createElement('div');
  el.id = 'app';
  document.body.appendChild(el);
  _reactDom2.default.render(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(_App2.default, null)
  ), el);
});
});

require.register("reducer.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  var messages = void 0;
  switch (action.type) {
    case 'SELECT_CHAT':
      return Object.assign({}, state, { selectedChat: action.chatId.toString() });
    case 'ADD_CHAT_MESSAGE':
      var chatMessages = Array.from(state.messages[action.chatId]);
      chatMessages.push({ 'text': action.message });
      messages = Object.assign({}, state.messages);
      messages[action.chatId] = chatMessages;
      return Object.assign({}, state, { messages: messages });
    case 'ADD_CHAT':
      var chats = Array.from(state.chats);
      chats.push(action.chat_id);
      return Object.assign({}, state, { chats: chats });
    case 'RECEIVE_CHAT_MESSAGES':
      messages = Object.assign({}, state.messages);
      messages[state.selectedChat] = action.chatMessages;
      return Object.assign({}, state, { messages: messages });
    case 'RECEIVE_USERS':
      return Object.assign({}, state, { users: action.users });
    case 'RECEIVE_CHATS':
      return Object.assign({}, state, { chats: action.chats });
    default:
      return state;
  }
};

var initialState = {
  users: [{ 'username': 'first' }, { 'username': 'second' }, { 'username': 'third' }],
  chats: [{ 'id': '1' }, { 'id': '2' }, { 'id': '3' }],
  selectedChat: '',
  messages: { '2': [{ 'text': 'hello' }, { 'text': 'hello' }, { 'text': 'hello' }, { 'text': 'hello' }, { 'text': 'hello' }, { 'text': 'hello' }, { 'text': 'hello' }, { 'text': 'hello' }, { 'text': 'hello' }] }
};
});

;require.register("utils/apiCalls.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createChat = exports.createChat = function createChat(username) {
  return new Promise(function (resolve, reject) {
    fetch('http://127.0.0.1:8000/chat/create_chat/?username=' + username, {
      method: 'GET',
      credentials: 'same-origin'
    }).then(function (response) {
      response.json().then(function (response) {
        return resolve(response.chat_id);
      });
    });
  });
};

var getAllUsers = exports.getAllUsers = function getAllUsers() {
  return new Promise(function (resolve, reject) {
    fetch('http://127.0.0.1:8000/chat/get_all_users', {
      method: 'GET',
      credentials: 'same-origin'
    }).then(function (response) {
      response.json().then(function (response) {
        return resolve(response.users);
      });
    });
  });
};

var getUserChats = exports.getUserChats = function getUserChats() {
  return new Promise(function (resolve, reject) {
    fetch('http://127.0.0.1:8000/chat/get_user_chats', {
      method: 'GET',
      credentials: 'same-origin'
    }).then(function (response) {
      response.json().then(function (response) {
        return resolve(response.chats);
      });
    });
  });
};

var loadChatMessages = exports.loadChatMessages = function loadChatMessages(chatId) {
  return new Promise(function (resolve, reject) {
    fetch('http://127.0.0.1:8000/chat/load_chat_messages/?chat_id=' + chatId, {
      method: 'GET',
      credentials: 'same-origin'
    }).then(function (response) {
      response.json().then(function (response) {
        return resolve(response.chat_messages);
      });
    });
  });
};
});

;require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map