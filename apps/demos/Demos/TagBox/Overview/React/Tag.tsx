import React, { useCallback } from 'react';
import type { Product } from './types.ts';

interface TagProps {
  product: Product;
  onMouseEnter: (e: React.MouseEvent<HTMLElement>, product: Product) => void;
  getAltText: (text: string) => string;
}

export default function Tag({ product, onMouseEnter, getAltText }: TagProps) {
  const isDisabled = product.Name === 'SuperHD Video Player';
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>): void => onMouseEnter(e, product), [onMouseEnter, product]);
  return (
    <>
      <div
        className={`dx-tag-content ${isDisabled && 'disabled-tag'}`}
        onMouseEnter={handleMouseEnter}
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
