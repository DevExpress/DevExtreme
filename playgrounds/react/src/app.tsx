import { Route, Routes } from 'react-router-dom';

import { RadioButtonExample } from './examples/radio-button/radio-button-example';
import { RadioGroupExample } from './examples/radio-group/radio-group-example';
import { Home } from './home';

import './app.css';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/radio-group" element={<RadioGroupExample />} />
      <Route path="/radio-button" element={<RadioButtonExample />} />
    </Routes>
  );
}
