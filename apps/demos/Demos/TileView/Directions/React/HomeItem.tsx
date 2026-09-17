import React from 'react';

const getImageStyle = (data: { ImageSrc: string; }) => ({ backgroundImage: `url(${data.ImageSrc})` });

export default function RenderHomeItem(data: { ImageSrc: string; }) {
  return (
    <div
      className="tile-image"
      style={getImageStyle(data)}
    />
  );
}
