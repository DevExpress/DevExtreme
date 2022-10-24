import React from 'react';

export default function LabelTemplate(iconName) {
  return function template(data) {
    return (<span><i className={`dx-icon dx-icon-${iconName}`}></i>{ data.text }</span>);
  };
}
