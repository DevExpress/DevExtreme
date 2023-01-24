import { Route, Routes } from 'react-router-dom';

import { FormExample } from './examples/form/form-example';
import { RadioButtonExample } from './examples/radio-button/radio-button-example';
import { RadioGroupCompatibleExample } from './examples/radio-group-compatible/radio-group-compatible-example';
import { RadioGroupExample } from './examples/radio-group/radio-group-example';
import { DynamicThemeExample } from './examples/themes/dynamic-theme-example';
import { ThemeExample } from './examples/themes/theme-example';
import { Home } from './home';

import '@devextreme/styles/lib/themes/material-blue-light.css';
import './app.css';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/radio-group" element={<RadioGroupExample />} />
      <Route path="/radio-group-compatible" element={<RadioGroupCompatibleExample />} />
      <Route path="/radio-button" element={<RadioButtonExample />} />
      <Route path="/theme" element={<ThemeExample />} />
      <Route path="/dynamic-theme" element={<DynamicThemeExample />} />
      <Route path="/form" element={<FormExample />} />
    </Routes>
  );
}
