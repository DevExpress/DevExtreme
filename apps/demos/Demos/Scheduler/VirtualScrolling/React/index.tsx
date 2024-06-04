import { createRoot } from 'react-dom/client';
import React from 'react';

import App from './App.tsx';

const root = createRoot(document.getElementById('scheduler'));
root.render(<App />);
