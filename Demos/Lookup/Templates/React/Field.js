import React from 'react';

export default function Field({
  Picture, Prefix, FirstName, LastName,
}) {
  return (
    <div className="custom-field">
      <img src={Picture} /><div>{`${Prefix} ${FirstName} ${LastName}`}</div>
    </div>
  );
}
