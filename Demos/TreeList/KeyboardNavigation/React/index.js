import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.js';
import config from 'devextreme-react/core/config';
config({ useLegacyTemplateEngine: false });

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
