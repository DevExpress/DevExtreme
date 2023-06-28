import React from 'react';

export default function Item({
  Picture, Prefix, FirstName, LastName,
}) {
  return (
    <div className="custom-item">
      <img alt={FirstName} src={Picture} /><div>{`${Prefix} ${FirstName} ${LastName}`}</div>
    </div>
  );
}
