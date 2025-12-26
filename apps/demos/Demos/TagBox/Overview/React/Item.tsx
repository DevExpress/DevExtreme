import React from 'react';
import type { Product } from './types.ts';

interface ItemProps {
  data: Product;
  getAltText: (text: string) => string;
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
