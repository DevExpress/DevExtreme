import React from 'react';

const nameLabel = { 'aria-label': 'Name' };
export default function Field(data) {
  return (
    <div className="custom-addon">
      <img
        alt="Product name"
        src={data && data.ImageSrc}
      />
    </div>
  );
}
