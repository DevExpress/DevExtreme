import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { RadioGroupExample } from './examples/radio-group/radio-group-example';
import { RadioButtonExample } from './examples/radio-button/radio-button-example';
import { Home } from './home';

import './app.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/radio-group" element={<RadioGroupExample />} />
        <Route path="/radio-button" element={<RadioButtonExample />} />
      </Routes>
    </>
  );
}

export default App;
