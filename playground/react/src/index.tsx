import React from 'react';
import ReactDOM from 'react-dom';
import './artifacts/css/dx.light.css';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

serviceWorker.unregister();
