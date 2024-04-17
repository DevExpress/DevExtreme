import React from 'react';

const Avatar: React.FC<{ icon: string }> = ({ icon }) => (
  <div className="button-img-container">
    <div className="button-img-indicator"></div>
    <img className="button-img" src={icon} alt="employee" />
  </div>
);

const ButtonDescription: React.FC<{ text: string; description: string }> = ({ text, description }) => (
  <div className="text-container">
    <div className="button-title">{text}</div>
    <div className="button-row">{description}</div>
  </div>
);

const DropDownButtonTemplate: React.FC = () => (
  <React.Fragment>
    <Avatar icon="../../../../images/employees/51.png" />
    <ButtonDescription text="Olivia Peyton" description="IT Manager" />
  </React.Fragment>
);

export default DropDownButtonTemplate;
