import React from 'react';
import ReactDOM from 'react-dom';
import '/shared/anti-forgery/frameworks.ts';
import App from './App.tsx';

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
