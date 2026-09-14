import React, { useMemo } from 'react';

export default function RenderHomeItem(data) {
  const style = useMemo(() => ({ backgroundImage: `url(${data.ImageSrc})` }), [data.ImageSrc]);
  return (
    <div
      className="tile-image"
      style={style}
    />
  );
}
