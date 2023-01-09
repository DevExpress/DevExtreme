import { Route, Routes } from 'react-router-dom';

import { FormExample } from './examples/form/form-example';
import { RadioButtonExample } from './examples/radio-button/radio-button-example';
import { RadioGroupCompatibleExample } from './examples/radio-group-compatible/radio-group-compatible-example';
import { RadioGroupExample } from './examples/radio-group/radio-group-example';
import { Home } from './home';

import './app.css';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/radio-group" element={<RadioGroupExample />} />
      <Route path="/radio-group-compatible" element={<RadioGroupCompatibleExample />} />
      <Route path="/radio-button" element={<RadioButtonExample />} />
      <Route path="/form" element={<FormExample />} />
    </Routes>
  );
}
