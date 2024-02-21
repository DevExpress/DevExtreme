import React from 'react';

export default function Item(data) {
  return (
    <div className="custom-item">
      <img src={data.ImageSrc} />
      <div className="product-name">{data.Name}</div>
    </div>
  );
}
