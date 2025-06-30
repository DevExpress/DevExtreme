import React from 'react';

export default function RenderHomeItem(data: { ImageSrc: string; }) {
  return (
    <div
      className="tile-image"
      style={{ backgroundImage: `url(${data.ImageSrc})` }}
    />
  );
}
