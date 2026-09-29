import React, { useCallback, useMemo } from 'react';

const ColorIcon = ({ color, onClick }) => {
  const handleClick = useCallback(() => onClick(color), [onClick, color]);
  const style = useMemo(() => ({ color: color ?? undefined }), [color]);
  return (
    <i
      onClick={handleClick}
      className="color dx-icon dx-icon-square"
      style={style}
    />
  );
};
export default ColorIcon;
