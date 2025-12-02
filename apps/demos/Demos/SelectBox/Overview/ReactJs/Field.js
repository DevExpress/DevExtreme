import React from 'react';

export default function Field(data) {
  return (
    <div className="custom-addon">
      <img
        alt="Product name"
        src={data?.ImageSrc}
      />
    </div>
  );
}
