import React from 'react';

export function AppointmentMenuTemplate(itemData) {
  return (<div>
    {itemData.color ? <div className="item-badge" style={{ backgroundColor: itemData.color }} /> : ''}
    {itemData.text}
  </div>);
}
