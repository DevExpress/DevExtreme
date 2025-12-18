import React from 'react';

interface ColorIconProps {
  color: string;
  onClick: Function;
}

const ColorIcon = ({ color, onClick }: ColorIconProps) => (
  <i
    onClick={() => onClick(color)}
    className="color dx-icon dx-icon-square"
    style={{ color }}
  />
);

export default ColorIcon;
