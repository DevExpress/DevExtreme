import React from 'react';

export default function RenderHomeItem(data) {
  return (
    <div
      className="tile-image"
      style={{ backgroundImage: `url(${data.ImageSrc})` }}
    />
  );
}
