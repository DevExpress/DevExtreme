import React from 'react';

export function CloseButton({ onItemClick, data, showCloseButton }) {
  if(!showCloseButton) {
    return null;
  }

  function handleClick(data) {
    return () => onItemClick(data);
  }

  return (
    <i
      className="dx-icon dx-icon-close"
      onClick={handleClick(data)}
    />
  );
}
