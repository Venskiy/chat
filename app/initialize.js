require('es6-promise').polyfill();
require('whatwg-fetch');

import ReactDOM from 'react-dom';
import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {Provider} from 'react-redux';
import 'whatwg-fetch';

import reducer from 'reducer';
import App from 'container/App';

import {initialFetchCurrentUser, initialFetchUsers, initialFetchChats} from 'actions';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

store.dispatch(initialFetchCurrentUser());
store.dispatch(initialFetchUsers());
store.dispatch(initialFetchChats());

document.addEventListener('DOMContentLoaded', () => {
  const el = document.createElement('div');
  el.id = 'app';
  document.body.appendChild(el);
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    el
  );
});
