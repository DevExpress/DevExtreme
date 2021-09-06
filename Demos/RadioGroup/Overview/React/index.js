import React from 'react';
import ReactDOM from 'react-dom';

import themes from 'devextreme/ui/themes';
import App from './App.js';

themes.initialized(() => {
  ReactDOM.render(
    <App />,
    document.getElementById('app'),
  );
});
