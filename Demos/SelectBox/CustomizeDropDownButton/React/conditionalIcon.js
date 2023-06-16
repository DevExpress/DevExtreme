import React from 'react';

export default function ConditionalIcon({ value }) {
  if (value) {
    return (
      <img
        alt='Custom icon'
        src={`../../../../images/icons/${value.IconSrc}`}
        className='custom-icon'
      />
    );
  }
  return (
    <div className='dx-dropdowneditor-icon'></div>
  );
}
