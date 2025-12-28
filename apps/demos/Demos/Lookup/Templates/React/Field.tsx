import React from 'react';
import type { Employee } from './types.ts';

export default function Field({
  Picture, Prefix, FirstName, LastName,
}: Employee) {
  return (
    <div className="custom-field">
      <img alt={FirstName} src={Picture} /><div>{`${Prefix} ${FirstName} ${LastName}`}</div>
    </div>
  );
}
