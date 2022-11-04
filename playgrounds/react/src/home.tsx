import React from 'react';
import {Link} from 'react-router-dom';

import './home.css';

function Home() {
  return (
    <div className="link-list">
      <Link to="/slideToggle">slideToggle example</Link>
      <Link to="/pager">pager example</Link>
    </div>
  )
}

export {Home};
