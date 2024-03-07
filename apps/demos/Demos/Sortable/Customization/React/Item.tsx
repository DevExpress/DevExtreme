
import React from 'react';

interface ItemProps {
  key?: any;
  text: any;
  handle?: any;
  style?: { width: number; padding: number; fontWeight: string; };
}

export default function Item({ text, handle, style }: ItemProps) {
  let className = 'item dx-card dx-theme-text-color dx-theme-background-color';
  if (handle) {
    className += ' item-with-handle';
  }
  return (
    <div className={className} style={style}>
      {handle && <i className="handle dx-icon dx-icon-dragvertical" />}
      {text}
    </div>
  );
}
