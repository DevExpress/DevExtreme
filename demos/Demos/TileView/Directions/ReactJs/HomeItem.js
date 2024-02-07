import React from 'react';

export default function RenderHomeItem(data) {
  return (
    <div
      className="dx-tile-image"
      style={{ backgroundImage: `url(${data.ImageSrc})` }}
    />
  );
}
