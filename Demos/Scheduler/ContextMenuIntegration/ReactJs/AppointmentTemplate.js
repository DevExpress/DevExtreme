import React from 'react';

const AppointmentMenuTemplate = ({ data }) => (
  <div>
    {data.color ? (
      <div
        className="item-badge"
        style={{ backgroundColor: data.color }}
      />
    ) : (
      ''
    )}
    {data.text}
  </div>
);
export default AppointmentMenuTemplate;
