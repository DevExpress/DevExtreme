import React from 'react';

export default function Item({ data, getAltText }) {
  return (
    <div className="custom-item">
      <img
        src={data.ImageSrc}
        alt={getAltText(data.Name)}
      />
      <div className="product-name">{data.Name}</div>
    </div>
  );
}
