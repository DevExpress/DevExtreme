import React from 'react';

const getImageStyle = (data) => ({ backgroundImage: `url(${data.ImageSrc})` });
export default function RenderHomeItem(data) {
  return (
    <div
      className="tile-image"
      style={getImageStyle(data)}
    />
  );
}
