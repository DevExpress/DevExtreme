import React from 'react';

export default function IconOnly({ icon, label }) {
  return (
    <i
      className={`dx-icon dx-icon-${icon}`}
      role="img"
      aria-label={label}
    ></i>
  );
}
