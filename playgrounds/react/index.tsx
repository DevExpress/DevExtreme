import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import themes from 'devextreme/ui/themes';

import App from './App';

themes.initialized(() => {
    const root = createRoot(document.getElementById('app')!);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
});
