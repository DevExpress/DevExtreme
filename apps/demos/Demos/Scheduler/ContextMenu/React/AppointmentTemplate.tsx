import React from 'react';

type AppointmentMenuTemplateProps = {
  data: {
    color: string;
    text: string;
  }
};

const AppointmentMenuTemplate = (props: AppointmentMenuTemplateProps) => (
  <div>
    {props.data.color && <div className="item-badge" style={{ backgroundColor: props.data.color }} />}
    {props.data.text}
  </div>
);

export default AppointmentMenuTemplate;
