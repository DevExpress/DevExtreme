import React, { useCallback, useMemo } from 'react';

interface ColorIconProps {
  color: string | null;
  onClick: (color: string | null) => void;
}

const ColorIcon = ({ color, onClick }: ColorIconProps) => {
  const handleClick = useCallback(() => onClick(color), [onClick, color]);
  const style = useMemo(() => ({ color: color ?? undefined }), [color]);

  return <i
    onClick={handleClick}
    className="color dx-icon dx-icon-square"
    style={style}
  />;
};

export default ColorIcon;
