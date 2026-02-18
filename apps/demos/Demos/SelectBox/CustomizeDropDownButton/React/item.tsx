import React from 'react';

interface ItemProps {
  IconSrc: string;
  Name: string;
}

export default function Item({ IconSrc, Name }: ItemProps) {
  return (
    <div className="custom-item">
      <img
        alt={Name}
        src={`../../../../images/icons/${IconSrc}`}
      />
      <div className="product-name">{Name}</div>
    </div>
  );
}
