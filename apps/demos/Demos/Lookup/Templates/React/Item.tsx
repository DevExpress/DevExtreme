import React from 'react';
import type { Employee } from './types.ts';

export default function Item({
  Picture, Prefix, FirstName, LastName,
}: Employee) {
  return (
    <div className="custom-item">
      <img alt={FirstName} src={Picture} /><div>{`${Prefix} ${FirstName} ${LastName}`}</div>
    </div>
  );
}
