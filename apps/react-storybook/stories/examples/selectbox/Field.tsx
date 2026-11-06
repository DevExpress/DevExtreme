import React from 'react';

export default function Field(data: { ImageSrc: any; Name: any }) {
  return (
    <div className="custom-addon">
      <img
        alt="Product name"
        src={data?.ImageSrc}
      />
    </div>
  );
}
