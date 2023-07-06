import React from 'react';

export default function Tag({ product, onMouseEnter }) {
  const isDisabled = product.Name === 'SuperHD Video Player';
  return (
    <React.Fragment>
      <div
        className={`dx-tag-content ${isDisabled && 'disabled-tag'}`}
        onMouseEnter={(e) => onMouseEnter(e, product)}
        aria-disabled={isDisabled}
      >
        <img src={product.ImageSrc} className="tag-img" />
        <span>{product.Name}</span>
        {!isDisabled && <div className="dx-tag-remove-button"></div>}
      </div>

    </React.Fragment>
  );
}
