import React from 'react';

export default function LabelTemplate(iconName) {
  return function template({ text }) {
    return (
      <div>
        <i className={`dx-icon dx-icon-${iconName}`}></i>
        {text}
      </div>
    );
  };
}
