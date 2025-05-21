import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ComponentView from './pages/ComponentView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/examples/:examplePath" element={<ComponentView />} />
        <Route path="*" element={
          <div className="not-found">
            <h1>404</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
