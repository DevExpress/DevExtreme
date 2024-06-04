import { createRoot } from 'react-dom/client';
import React from 'react';

import themes from 'devextreme/ui/themes';
import App from './App.tsx';

themes.initialized(() => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />);
});
