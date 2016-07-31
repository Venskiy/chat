!function(){"use strict";var e="undefined"==typeof window?global:window;if("function"!=typeof e.require){var t={},r={},n={},s={}.hasOwnProperty,a=/^\.\.?(\/|$)/,c=function(e,t){for(var r,n=[],s=(a.test(t)?e+"/"+t:t).split("/"),c=0,u=s.length;c<u;c++)r=s[c],".."===r?n.pop():"."!==r&&""!==r&&n.push(r);return n.join("/")},u=function(e){return e.split("/").slice(0,-1).join("/")},i=function(t){return function(r){var n=c(u(t),r);return e.require(n,t)}},o=function(e,t){var n=null;n=C&&C.createHot(e);var s={id:e,exports:{},hot:n};return r[e]=s,t(s.exports,i(e),s),s.exports},l=function(e){return n[e]?l(n[e]):e},d=function(e,t){return l(c(u(e),t))},f=function(e,n){null==n&&(n="/");var a=l(e);if(s.call(r,a))return r[a].exports;if(s.call(t,a))return o(a,t[a]);throw new Error("Cannot find module '"+e+"' from '"+n+"'")};f.alias=function(e,t){n[t]=e};var h=/\.[^.\/]+$/,p=/\/index(\.[^\/]+)?$/,m=function(e){if(h.test(e)){var t=e.replace(h,"");s.call(n,t)&&n[t].replace(h,"")!==t+"/index"||(n[t]=e)}if(p.test(e)){var r=e.replace(p,"");s.call(n,r)||(n[r]=e)}};f.register=f.define=function(e,n){if("object"==typeof e)for(var a in e)s.call(e,a)&&f.register(a,e[a]);else t[e]=n,delete r[e],m(e)},f.list=function(){var e=[];for(var r in t)s.call(t,r)&&e.push(r);return e};var C=e._hmr&&new e._hmr(d,f,t,r);f._cache=r,f.hmr=C&&C.wrap,f.brunch=!0,e.require=f}}(),function(){var e;window;require.register("actions.js",function(e,t,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.initialFetchChats=e.initialFetchUsers=e.initialFetchCurrentUser=e.loadChatMessages=e.createChat=e.addChatMessage=e.selectChat=void 0;var n=t("utils/apiCalls");e.selectChat=function(e){return{type:"SELECT_CHAT",chatId:e}},e.addChatMessage=function(e,t){return{type:"ADD_CHAT_MESSAGE",chatId:e,message:t}},e.createChat=function(e){return function(t){(0,n.createChat)(e).then(function(e){t({type:"ADD_CHAT",chatId:e})})}},e.loadChatMessages=function(e){return function(t){(0,n.loadChatMessages)(e).then(function(e){t({type:"RECEIVE_CHAT_MESSAGES",chatMessages:e})})}},e.initialFetchCurrentUser=function(){return function(e){(0,n.getCurrentUser)().then(function(t){e({type:"RECEIVE_CURRENT_USER",user:t})})}},e.initialFetchUsers=function(){return function(e){(0,n.getAllUsers)().then(function(t){e({type:"RECEIVE_USERS",users:t})})}},e.initialFetchChats=function(){return function(e){(0,n.getUserChats)().then(function(t){e({type:"RECEIVE_CHATS",chats:t})})}}}),require.register("components/Chat.jsx",function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var s=t("react"),a=n(s);e["default"]=a["default"].createClass({displayName:"Chat",propTypes:{chatId:a["default"].PropTypes.string.isRequired,selectedChat:a["default"].PropTypes.string.isRequired,onSelect:a["default"].PropTypes.func.isRequired},handleClick:function(){this.props.onSelect(this.props.chatId)},render:function(){var e=this.props,t=e.chatId,r=e.selectedChat,n=t===r?"Chat-selected":"Chat";return a["default"].createElement("div",{className:n,onClick:this.handleClick},t)}})}),require.register("components/MessageForm.jsx",function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var s=t("react"),a=n(s),c=void 0;e["default"]=a["default"].createClass({displayName:"MessageForm",propTypes:{chatId:a["default"].PropTypes.string.isRequired,onMessage:a["default"].PropTypes.func.isRequired},componentWillMount:function(){var e=this.props,t=e.chatId,r=e.onMessage;c=new WebSocket("ws://127.0.0.1:8888/tornado_chat/"+t+"/"),c.onmessage=function(e){r(t,e.data)}},shouldComponentUpdate:function(e){return e.chatId!==this.props.chatId},componentWillUpdate:function(e){c.close(),c=new WebSocket("ws://127.0.0.1:8888/tornado_chat/"+e.chatId+"/"),c.onmessage=function(t){e.onMessage(e.chatId,t.data)}},handleClick:function(){var e=this.refs.message.value;c.send(e),this.refs.message.value=""},render:function(){return a["default"].createElement("div",{className:"MessageForm"},a["default"].createElement("textarea",{ref:"message",type:"text",placeholder:"Type your text here"}),a["default"].createElement("button",{onClick:this.handleClick},"Send"))}})}),require.register("components/MessagesBlock.jsx",function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var s=t("react"),a=n(s);e["default"]=a["default"].createClass({displayName:"MessagesBlock",propTypes:{chatMessages:a["default"].PropTypes.array},render:function(){var e=this.props.chatMessages;return e?a["default"].createElement("div",{className:"MessagesBlock"},e.map(function(e,t){return a["default"].createElement("div",{className:"Message",key:t},e.text)})):a["default"].createElement("div",{className:"MessagesBlock"},"There is no messages")}})}),require.register("components/User.jsx",function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var s=t("react"),a=n(s);e["default"]=a["default"].createClass({displayName:"User",propTypes:{username:a["default"].PropTypes.string.isRequired,onChatCreate:a["default"].PropTypes.func.isRequired},handleClick:function(){this.props.onChatCreate(this.props.username)},render:function(){var e=this.props.username;return a["default"].createElement("div",{className:"User"},a["default"].createElement("div",null,e),a["default"].createElement("button",{onClick:this.handleClick},"Start chat"))}})}),require.register("container/App.jsx",function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var s=t("react"),a=n(s),c=t("react-redux"),u=t("./ChatsList"),i=n(u),o=t("./ChatWindow"),l=n(o),d=t("./UsersList"),f=n(d),h=function(e){var t=e.selectedChat;return a["default"].createElement("div",{className:"Container"},a["default"].createElement(i["default"],{selectedChat:t}),a["default"].createElement(l["default"],{selectedChat:t}),a["default"].createElement(f["default"],null))},p=function(e){return{selectedChat:e.selectedChat}};e["default"]=(0,c.connect)(p)(h)}),require.register("container/ChatWindow.jsx",function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var s=t("react"),a=n(s),c=t("react-redux"),u=t("actions"),i=t("components/MessagesBlock"),o=n(i),l=t("components/MessageForm"),d=n(l),f=function(e){var t=e.selectedChat,r=e.messages,n=e.onChatMessage;return t?a["default"].createElement("div",{className:"ChatWindow"},a["default"].createElement(o["default"],{chatMessages:r[t]}),a["default"].createElement(d["default"],{chatId:t,onMessage:n})):a["default"].createElement("div",{className:"ChatWindow-empty"})},h=function(e){return{messages:e.messages}},p=function(e){return{onChatMessage:function(t,r){e((0,u.addChatMessage)(t,r))}}};e["default"]=(0,c.connect)(h,p)(f)}),require.register("container/ChatsList.jsx",function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var s=t("react"),a=n(s),c=t("react-redux"),u=t("actions"),i=t("components/Chat"),o=n(i),l=function(e){var t=e.chats,r=e.selectedChat,n=e.onChatSelect;return a["default"].createElement("div",{className:"ChatList"},t.map(function(e){return a["default"].createElement(o["default"],{chatId:e.id.toString(),selectedChat:r,onSelect:n,key:e.id})}))},d=function(e){return{chats:e.chats}},f=function(e){return{onChatSelect:function(t){e((0,u.selectChat)(t)),e((0,u.loadChatMessages)(t))}}};e["default"]=(0,c.connect)(d,f)(l)}),require.register("container/UsersList.jsx",function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var s=t("react"),a=n(s),c=t("react-redux"),u=t("actions"),i=t("components/User"),o=n(i),l=function(e){var t=e.users,r=e.onChatCreate;return a["default"].createElement("div",{className:"UsersList"},t.map(function(e){return a["default"].createElement(o["default"],{username:e.username,onChatCreate:r,key:e.username})}))},d=function(e){return{users:e.users}},f=function(e){return{onChatCreate:function(t){e((0,u.createChat)(t))}}};e["default"]=(0,c.connect)(d,f)(l)}),require.register("initialize.js",function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}var s=t("react-dom"),a=n(s),c=t("react"),u=n(c),i=t("redux"),o=t("redux-thunk"),l=n(o),d=t("react-redux");t("whatwg-fetch");var f=t("reducer"),h=n(f),p=t("container/App"),m=n(p),C=t("actions");t("es6-promise").polyfill(),t("whatwg-fetch");var g=(0,i.createStore)(h["default"],(0,i.applyMiddleware)(l["default"]));g.dispatch((0,C.initialFetchCurrentUser)()),g.dispatch((0,C.initialFetchUsers)()),g.dispatch((0,C.initialFetchChats)()),document.addEventListener("DOMContentLoaded",function(){var e=document.createElement("div");e.id="app",document.body.appendChild(e),a["default"].render(u["default"].createElement(d.Provider,{store:g},u["default"].createElement(m["default"],null)),e)})}),require.register("reducer.js",function(e,t,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=function(){var e=arguments.length<=0||void 0===arguments[0]?n:arguments[0],t=arguments[1],r=void 0;switch(t.type){case"SELECT_CHAT":return Object.assign({},e,{selectedChat:t.chatId.toString()});case"ADD_CHAT_MESSAGE":var s=Array.from(e.messages[t.chatId]);return s.unshift({text:t.message}),r=Object.assign({},e.messages),r[t.chatId]=s,Object.assign({},e,{messages:r});case"ADD_CHAT":var a=Array.from(e.chats);return a.push(t.chat_id),Object.assign({},e,{chats:a});case"RECEIVE_CHAT_MESSAGES":return r=Object.assign({},e.messages),r[e.selectedChat]=t.chatMessages,Object.assign({},e,{messages:r});case"RECEIVE_CURRENT_USER":return console.log(t.user),Object.assign({},e,{currentUser:t.user});case"RECEIVE_USERS":return Object.assign({},e,{users:t.users});case"RECEIVE_CHATS":return Object.assign({},e,{chats:t.chats});default:return e}};var n={currentUser:{},users:[{username:"first"},{username:"second"},{username:"third"}],chats:[{id:"1"},{id:"2"},{id:"3"}],selectedChat:"",messages:{2:[{text:"hello"},{text:"hello"},{text:"hello"},{text:"hello"},{text:"hello"},{text:"hello"},{text:"hello"}]}}}),require.register("utils/apiCalls.js",function(e,t,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.createChat=function(e){return new Promise(function(t,r){fetch("http://127.0.0.1:8000/chat/create_chat/?username="+e,{method:"GET",credentials:"same-origin"}).then(function(e){e.json().then(function(e){return t(e.chat_id)})})})},e.getCurrentUser=function(){return new Promise(function(e,t){fetch("http://127.0.0.1:8000/chat/get_current_user",{method:"GET",credentials:"same-origin"}).then(function(t){t.json().then(function(t){return e(t)})})})},e.getAllUsers=function(){return new Promise(function(e,t){fetch("http://127.0.0.1:8000/chat/get_all_users",{method:"GET",credentials:"same-origin"}).then(function(t){t.json().then(function(t){return e(t.users)})})})},e.getUserChats=function(){return new Promise(function(e,t){fetch("http://127.0.0.1:8000/chat/get_user_chats",{method:"GET",credentials:"same-origin"}).then(function(t){t.json().then(function(t){return e(t.chats)})})})},e.loadChatMessages=function(e){return new Promise(function(t,r){fetch("http://127.0.0.1:8000/chat/load_chat_messages/?chat_id="+e,{method:"GET",credentials:"same-origin"}).then(function(e){e.json().then(function(e){return t(e.chat_messages)})})})}}),require.alias("process/browser.js","process"),e=require("process"),require.register("___globals___",function(e,t,r){})}(),require("___globals___");