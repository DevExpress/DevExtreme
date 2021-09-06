import React from 'react';
import ReactDOM from 'react-dom';

import config from 'devextreme-react/core/config';
import App from './App.js';

config({ useLegacyTemplateEngine: false });

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
