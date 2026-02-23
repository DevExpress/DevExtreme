import React from 'react';

const ColorIcon = ({ color, onClick }) => (
  <i
    onClick={() => onClick(color)}
    className="color dx-icon dx-icon-square"
    style={{ color: color ?? undefined }}
  />
);
export default ColorIcon;
