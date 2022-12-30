import React from 'react';
import { Link } from 'react-router-dom';

import './home.css';

function Home() {
  return (
    <div className="link-list">
      <Link to="/radio-group">Radio Group</Link>
      <Link to="/radio-group-compatible">Radio Group Compatible</Link>
      <Link to="/radio-button">Radio Button</Link>
      <Link to="/theme">Theme</Link>
      <Link to="/dynamic-theme">Dynamic theme</Link>
    </div>
  );
}

export { Home };
