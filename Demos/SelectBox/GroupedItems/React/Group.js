import React from 'react';

export default function Group({ key }) {
  return (
    <div className="custom-icon">
      <span className="dx-icon-box icon"></span>{' '}
      {key}
    </div>
  );
}
