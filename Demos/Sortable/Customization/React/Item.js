import React from 'react';

export default function Item({ text, handle, style }) {
  let className = 'item dx-card dx-theme-text-color dx-theme-background-color';
  if(handle) {
    className += ' item-with-handle';
  }
  return (
    <div className={className} style={style}>
      {handle && <i className="handle dx-icon dx-icon-dragvertical" />}
      {text}
    </div>
  );
}
