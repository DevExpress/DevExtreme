import { Route, Routes } from 'react-router-dom';

import { FormExample } from './examples/form/form-example';
import { RadioButtonExample } from './examples/radio-button/radio-button-example';
import { RadioGroupCompatibleExample } from './examples/radio-group-compatible/radio-group-example';
import { RadioGroupExample } from './examples/radio-group/radio-group-example';
import { ThemesExample } from './examples/themes/themes-example';
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
      <Route path="/themes" element={<ThemesExample />} />
      <Route path="/form" element={<FormExample />} />
    </Routes>
  );
}
