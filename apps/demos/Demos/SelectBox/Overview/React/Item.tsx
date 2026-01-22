import React from 'react';

interface ItemProps {
  ImageSrc: string;
  Name: string;
}

export default function Item(data: ItemProps) {
  return (
    <div className="custom-item">
      <img
        alt="Product name"
        src={data.ImageSrc}
      />
      <div className="product-name">{data.Name}</div>
    </div>
  );
}
