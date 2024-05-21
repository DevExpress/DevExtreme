import React from 'react';

interface ItemProps {
  data: any;
  getAltText: any;
}

export default function Item({ data, getAltText }: ItemProps) {
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
