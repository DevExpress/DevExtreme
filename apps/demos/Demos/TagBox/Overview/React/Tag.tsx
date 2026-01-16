import React from 'react';
import type { Product } from './types.ts';

interface TagProps {
  product: Product;
  onMouseEnter: (e: React.MouseEvent<HTMLElement>, product: Product) => void;
  getAltText: (text: string) => string;
}

export default function Tag({ product, onMouseEnter, getAltText }: TagProps) {
  const isDisabled = product.Name === 'SuperHD Video Player';
  return (
    <>
      <div
        className={`dx-tag-content ${isDisabled && 'disabled-tag'}`}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>): void => onMouseEnter(e, product)}
        aria-disabled={isDisabled}
      >
        <img
          src={product.ImageSrc}
          alt={getAltText(product.Name)}
          className="tag-img"
        />
        <span>{product.Name}</span>
        {!isDisabled && <div className="dx-tag-remove-button"></div>}
      </div>
    </>
  );
}
