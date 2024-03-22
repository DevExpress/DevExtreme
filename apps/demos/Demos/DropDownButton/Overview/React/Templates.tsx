import React from 'react';

const Avatar = ({ icon }) => (
  <div className="button-img-container">
    <div className="button-img-indicator"></div>
    <img className="button-img" src={icon} alt="employee" />
  </div>
);

const ButtonDescription = ({ text, description }) => (
  <div className="text-container">
    <div className="button-title">{text}</div>
    <div className="button-row">{description}</div>
  </div>
);

const DropDownButtonTemplate = ({ data }) => (
  <React.Fragment>
    <Avatar icon={data.icon} />
    <ButtonDescription text={data.text} description="IT Manager" />
  </React.Fragment>
);

export default DropDownButtonTemplate;
