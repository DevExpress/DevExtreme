import React, { useCallback } from 'react';

export default function Tag({ product, onMouseEnter, getAltText }) {
  const isDisabled = product.Name === 'SuperHD Video Player';
  const handleMouseEnter = useCallback((e) => onMouseEnter(e, product), [onMouseEnter, product]);
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
