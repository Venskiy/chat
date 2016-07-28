import ReactDOM from 'react-dom';
import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import reducer from 'reducer';
import App from 'container/App';

const store = createStore(reducer);

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
