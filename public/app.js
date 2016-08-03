!function(){"use strict";var e="undefined"==typeof window?global:window;if("function"!=typeof e.require){var t={},s={},a={},r={}.hasOwnProperty,n=/^\.\.?(\/|$)/,c=function(e,t){for(var s,a=[],r=(n.test(t)?e+"/"+t:t).split("/"),c=0,u=r.length;c<u;c++)s=r[c],".."===s?a.pop():"."!==s&&""!==s&&a.push(s);return a.join("/")},u=function(e){return e.split("/").slice(0,-1).join("/")},i=function(t){return function(s){var a=c(u(t),s);return e.require(a,t)}},o=function(e,t){var a=null;a=_&&_.createHot(e);var r={id:e,exports:{},hot:a};return s[e]=r,t(r.exports,i(e),r),r.exports},l=function(e){return a[e]?l(a[e]):e},d=function(e,t){return l(c(u(e),t))},h=function(e,a){null==a&&(a="/");var n=l(e);if(r.call(s,n))return s[n].exports;if(r.call(t,n))return o(n,t[n]);throw new Error("Cannot find module '"+e+"' from '"+a+"'")};h.alias=function(e,t){a[t]=e};var f=/\.[^.\/]+$/,p=/\/index(\.[^\/]+)?$/,m=function(e){if(f.test(e)){var t=e.replace(f,"");r.call(a,t)&&a[t].replace(f,"")!==t+"/index"||(a[t]=e)}if(p.test(e)){var s=e.replace(p,"");r.call(a,s)||(a[s]=e)}};h.register=h.define=function(e,a){if("object"==typeof e)for(var n in e)r.call(e,n)&&h.register(n,e[n]);else t[e]=a,delete s[e],m(e)},h.list=function(){var e=[];for(var s in t)r.call(t,s)&&e.push(s);return e};var _=e._hmr&&new e._hmr(d,h,t,s);h._cache=s,h.hmr=_&&_.wrap,h.brunch=!0,e.require=h}}(),function(){var e;window;require.register("actions.js",function(e,t,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.initialFetchChats=e.initialFetchUsers=e.initialFetchCurrentUser=e.loadChatMessages=e.createChat=e.updateChatLastMessage=e.addChatMessage=e.selectChat=void 0;var a=t("utils/apiCalls");e.selectChat=function(e){return{type:"SELECT_CHAT",chat:e}},e.addChatMessage=function(e,t){return{type:"ADD_CHAT_MESSAGE",chatId:e,message:t}},e.updateChatLastMessage=function(e,t){return{type:"UPDATE_CHAT_LAST_MESSAGE",chatId:e,message:t}},e.createChat=function(e){return function(t){(0,a.createChat)(e).then(function(e){t({type:"ADD_CHAT",chatId:e})})}},e.loadChatMessages=function(e){return function(t){(0,a.loadChatMessages)(e).then(function(e){t({type:"RECEIVE_CHAT_MESSAGES",chatMessages:e})})}},e.initialFetchCurrentUser=function(){return function(e){(0,a.getCurrentUser)().then(function(t){e({type:"RECEIVE_CURRENT_USER",user:t})})}},e.initialFetchUsers=function(){return function(e){(0,a.getAllUsers)().then(function(t){e({type:"RECEIVE_USERS",users:t})})}},e.initialFetchChats=function(){return function(e){(0,a.getUserChats)().then(function(t){e({type:"RECEIVE_CHATS",chats:t})})}}}),require.register("components/Chat.jsx",function(e,t,s){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var r=t("react"),n=a(r),c=t("dateformat");e["default"]=n["default"].createClass({displayName:"Chat",propTypes:{chat:n["default"].PropTypes.object.isRequired,selectedChat:n["default"].PropTypes.object.isRequired,onSelect:n["default"].PropTypes.func.isRequired},handleClick:function(){this.props.onSelect(this.props.chat)},render:function(){var e=this.props,t=e.chat,s=e.selectedChat,a=t.chat_id===s.chat_id?"Chat-selected":"Chat",r=c(t.last_message_timestamp,"mmm d");return n["default"].createElement("div",{className:a,onClick:this.handleClick},t.interlocutor_username,t.last_message,r)}})}),require.register("components/MessageForm.jsx",function(e,t,s){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var r=t("react"),n=a(r),c=void 0;e["default"]=n["default"].createClass({displayName:"MessageForm",propTypes:{chat:n["default"].PropTypes.object.isRequired,onMessage:n["default"].PropTypes.func.isRequired},componentWillMount:function(){var e=this.props,t=e.chat,s=e.onMessage;c=new WebSocket("ws://127.0.0.1:8888/tornado_chat/"+t.chat_id+"/"),c.onmessage=function(e){s(t.chat_id,e.data)}},shouldComponentUpdate:function(e){return e.chat.chat_id!==this.props.chat.chat_id},componentWillUpdate:function(e){c.close(),c=new WebSocket("ws://127.0.0.1:8888/tornado_chat/"+e.chat.chat_id+"/"),c.onmessage=function(t){e.onMessage(e.chat.chat_id,t.data)}},handleClick:function(){var e={interlocutorId:this.props.chat.interlocutor_id,message:this.refs.message.value};c.send(JSON.stringify(e)),this.refs.message.value=""},render:function(){return n["default"].createElement("div",{className:"MessageForm"},n["default"].createElement("textarea",{ref:"message",type:"text",placeholder:"Type your text here"}),n["default"].createElement("button",{onClick:this.handleClick},"Send"))}})}),require.register("components/MessagesBlock.jsx",function(e,t,s){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var r=t("react"),n=a(r);e["default"]=n["default"].createClass({displayName:"MessagesBlock",propTypes:{chatMessages:n["default"].PropTypes.array},render:function(){var e=this.props.chatMessages;return e?n["default"].createElement("div",{className:"MessagesBlock"},e.map(function(e,t){return n["default"].createElement("div",{className:"Message",key:t},e.text)})):n["default"].createElement("div",{className:"MessagesBlock"},"There is no messages")}})}),require.register("components/User.jsx",function(e,t,s){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var r=t("react"),n=a(r);e["default"]=n["default"].createClass({displayName:"User",propTypes:{username:n["default"].PropTypes.string.isRequired,onChatCreate:n["default"].PropTypes.func.isRequired},handleClick:function(){this.props.onChatCreate(this.props.username)},render:function(){var e=this.props.username;return n["default"].createElement("div",{className:"User"},n["default"].createElement("div",null,e),n["default"].createElement("button",{onClick:this.handleClick},"Start chat"))}})}),require.register("container/App.jsx",function(e,t,s){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var r=t("react"),n=a(r),c=t("react-redux"),u=t("actions"),i=t("./ChatsList"),o=a(i),l=t("./ChatWindow"),d=a(l),h=t("./UsersList"),f=a(h),p=n["default"].createClass({displayName:"App",shouldComponentUpdate:function(e){return Object.keys(e.currentUser).length},componentWillUpdate:function(e){var t=this.props.onNewChatMessage,s=new WebSocket("ws://127.0.0.1:8888/chat_app/"+e.currentUser.user_id+"/");s.onmessage=function(e){var s=JSON.parse(e.data);t(s.chat_id,s.message)}},render:function(){return n["default"].createElement("div",{className:"Container"},n["default"].createElement(o["default"],{selectedChat:this.props.selectedChat}),n["default"].createElement(d["default"],{selectedChat:this.props.selectedChat}),n["default"].createElement(f["default"],null))}}),m=function(e){return{currentUser:e.currentUser,selectedChat:e.selectedChat,messages:e.messages}},_=function(e){return{onNewChatMessage:function(t,s){e((0,u.updateChatLastMessage)(t,s))}}};e["default"]=(0,c.connect)(m,_)(p)}),require.register("container/ChatWindow.jsx",function(e,t,s){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var r=t("react"),n=a(r),c=t("react-redux"),u=t("actions"),i=t("components/MessagesBlock"),o=a(i),l=t("components/MessageForm"),d=a(l),h=function(e){var t=e.selectedChat,s=e.messages,a=e.onChatMessage;return Object.keys(t).length?n["default"].createElement("div",{className:"ChatWindow"},n["default"].createElement(o["default"],{chatMessages:s[t.chat_id]}),n["default"].createElement(d["default"],{chat:t,onMessage:a})):n["default"].createElement("div",{className:"ChatWindow-empty"})},f=function(e){return{messages:e.messages}},p=function(e){return{onChatMessage:function(t,s){e((0,u.addChatMessage)(t,s)),e((0,u.updateChatLastMessage)(t,s))}}};e["default"]=(0,c.connect)(f,p)(h)}),require.register("container/ChatsList.jsx",function(e,t,s){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var r=t("react"),n=a(r),c=t("react-redux"),u=t("actions"),i=t("components/Chat"),o=a(i),l=function(e){var t=e.chats,s=e.selectedChat,a=e.onChatSelect;return n["default"].createElement("div",{className:"ChatList"},Object.keys(t).sort(function(e,s){return t[e].last_message_timestamp>t[s].last_message_timestamp?-1:t[e].last_message_timestamp<t[s].last_message_timestamp?1:0}).map(function(e){return n["default"].createElement(o["default"],{chat:t[e],selectedChat:s,onSelect:a,key:e})}))},d=function(e){return{chats:e.chats}},h=function(e){return{onChatSelect:function(t){e((0,u.selectChat)(t)),e((0,u.loadChatMessages)(t.chat_id))}}};e["default"]=(0,c.connect)(d,h)(l)}),require.register("container/UsersList.jsx",function(e,t,s){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var r=t("react"),n=a(r),c=t("react-redux"),u=t("actions"),i=t("components/User"),o=a(i),l=function(e){var t=e.users,s=e.onChatCreate;return n["default"].createElement("div",{className:"UsersList"},t.map(function(e){return n["default"].createElement(o["default"],{username:e.username,onChatCreate:s,key:e.username})}))},d=function(e){return{users:e.users}},h=function(e){return{onChatCreate:function(t){e((0,u.createChat)(t))}}};e["default"]=(0,c.connect)(d,h)(l)}),require.register("initialize.js",function(e,t,s){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}var r=t("react-dom"),n=a(r),c=t("react"),u=a(c),i=t("redux"),o=t("redux-thunk"),l=a(o),d=t("react-redux");t("whatwg-fetch");var h=t("reducer"),f=a(h),p=t("container/App"),m=a(p),_=t("actions");t("es6-promise").polyfill(),t("whatwg-fetch");var g=(0,i.createStore)(f["default"],(0,i.applyMiddleware)(l["default"]));g.dispatch((0,_.initialFetchCurrentUser)()),g.dispatch((0,_.initialFetchUsers)()),g.dispatch((0,_.initialFetchChats)()),document.addEventListener("DOMContentLoaded",function(){var e=document.createElement("div");e.id="app",document.body.appendChild(e),n["default"].render(u["default"].createElement(d.Provider,{store:g},u["default"].createElement(m["default"],null)),e)})}),require.register("reducer.js",function(e,t,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=function(){var e=arguments.length<=0||void 0===arguments[0]?a:arguments[0],t=arguments[1],s=void 0,r=void 0;switch(t.type){case"SELECT_CHAT":return Object.assign({},e,{selectedChat:t.chat});case"ADD_CHAT_MESSAGE":var n=Array.from(e.messages[t.chatId]);return n.unshift({text:t.message}),r=Object.assign({},e.messages),r[t.chatId]=n,Object.assign({},e,{messages:r});case"UPDATE_CHAT_LAST_MESSAGE":return s=Object.assign({},e.chats),s[t.chatId].last_message=t.message,Object.assign({},e,{chats:s});case"ADD_CHAT":return s=Array.from(e.chats),s.push(t.chat_id),Object.assign({},e,{chats:s});case"RECEIVE_CHAT_MESSAGES":return r=Object.assign({},e.messages),r[e.selectedChat.chat_id]=t.chatMessages,Object.assign({},e,{messages:r});case"RECEIVE_CURRENT_USER":return Object.assign({},e,{currentUser:t.user});case"RECEIVE_USERS":return Object.assign({},e,{users:t.users});case"RECEIVE_CHATS":return Object.assign({},e,{chats:t.chats});default:return e}};var a={currentUser:{},users:[{username:"first"},{username:"second"},{username:"third"}],chats:{},selectedChat:{},messages:{2:[{text:"hello"},{text:"hello"},{text:"hello"},{text:"hello"},{text:"hello"},{text:"hello"},{text:"hello"}]}}}),require.register("utils/apiCalls.js",function(e,t,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.createChat=function(e){return new Promise(function(t,s){fetch("http://127.0.0.1:8000/chat/create_chat/?username="+e,{method:"GET",credentials:"same-origin"}).then(function(e){e.json().then(function(e){return t(e.chat_id)})})})},e.getCurrentUser=function(){return new Promise(function(e,t){fetch("http://127.0.0.1:8000/chat/get_current_user",{method:"GET",credentials:"same-origin"}).then(function(t){t.json().then(function(t){return e(t)})})})},e.getAllUsers=function(){return new Promise(function(e,t){fetch("http://127.0.0.1:8000/chat/get_all_users",{method:"GET",credentials:"same-origin"}).then(function(t){t.json().then(function(t){return e(t.users)})})})},e.getUserChats=function(){return new Promise(function(e,t){fetch("http://127.0.0.1:8000/chat/get_user_chats",{method:"GET",credentials:"same-origin"}).then(function(t){t.json().then(function(t){return e(t.chats)})})})},e.loadChatMessages=function(e){return new Promise(function(t,s){fetch("http://127.0.0.1:8000/chat/load_chat_messages/?chat_id="+e,{method:"GET",credentials:"same-origin"}).then(function(e){e.json().then(function(e){return t(e.chat_messages)})})})}}),require.alias("process/browser.js","process"),e=require("process"),require.register("___globals___",function(e,t,s){})}(),require("___globals___");