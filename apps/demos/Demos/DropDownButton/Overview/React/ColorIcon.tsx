import React from 'react';

interface ColorIconProps {
  color: string | null;
  onClick: (color: string | null) => void;
}

const ColorIcon = ({ color, onClick }: ColorIconProps) => (
  <i
    onClick={() => onClick(color)}
    className="color dx-icon dx-icon-square"
    style={{ color: color ?? undefined }}
  />
);

export default ColorIcon;
