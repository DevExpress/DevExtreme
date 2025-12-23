import React from 'react';

interface AvatarProps {
  icon: string;
}

const Avatar = ({ icon }: AvatarProps) => (
  <div className="button-img-container">
    <div className="button-img-indicator"></div>
    <img className="button-img" src={icon} alt="employee" />
  </div>
);

interface ButtonDescriptionProps {
  text: string;
  description: string;
}

const ButtonDescription = ({ text, description }: ButtonDescriptionProps) => (
  <div className="text-container">
    <div className="button-title">{text}</div>
    <div className="button-row">{description}</div>
  </div>
);

const DropDownButtonTemplate = () => (
  <>
    <Avatar icon="../../../../images/employees/51.png" />
    <ButtonDescription text="Olivia Peyton" description="IT Manager" />
  </>
);

export default DropDownButtonTemplate;
