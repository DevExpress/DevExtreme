import React from 'react';

export default function RenderContactItem({ name, phone, email }) {
  return (
    <div>
      <div>{name}</div>
      <div>{phone}</div>
      <div>{email}</div>
    </div>
  );
}
