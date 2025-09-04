import React from 'react';
import TextBox from 'devextreme-react/text-box';

const nameLabel = { 'aria-label': 'Name' };

export default function Field(data: { ImageSrc: any; Name: any }) {
  return (
    <div className="custom-addon">
      <img
        alt="Product name"
        src={data && data.ImageSrc}
      />
    </div>
  );
}
