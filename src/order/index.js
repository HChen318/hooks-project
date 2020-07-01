import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import APP from './App.jsx';
import store from './store';
import 'normalize.css/normalize.css';
import './index.css';

ReactDOM.render(
    <Provider store={store}>
        <APP />
    </Provider>,
    document.getElementById('root')
);
