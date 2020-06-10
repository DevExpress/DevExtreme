import React from 'react';
import { TextBox } from 'devextreme-react';

export default function Field(data) {
  return (
    <div className="custom-item">
      <img src={data && data.ImageSrc} />
      <TextBox className="product-name"
        defaultValue={data && data.Name}
        readOnly={true} />
    </div>
  );
}
