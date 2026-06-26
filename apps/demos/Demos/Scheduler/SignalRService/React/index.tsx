import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.tsx';
import 'anti-forgery';

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
