import React from 'react';
import TextBox from 'devextreme-react/text-box';

const nameLabel = { 'aria-label': 'Name' };

export default function Field(data) {
  return (
    <div className="custom-item">
      <img src={data && data.ImageSrc} />
      <TextBox className="product-name"
        inputAttr={nameLabel}
        defaultValue={data && data.Name}
        readOnly={true} />
    </div>
  );
}
