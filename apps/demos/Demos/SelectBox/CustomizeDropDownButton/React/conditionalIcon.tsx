import React from 'react';

interface ConditionalIconProps {
  value: any;
}

export default function ConditionalIcon({ value }: ConditionalIconProps) {
  if (value) {
    return (
      <img
        alt="Custom icon"
        src={`../../../../images/icons/${value.IconSrc}`}
        className="custom-icon"
      />
    );
  }
  return <div className="dx-dropdowneditor-icon"></div>;
}
