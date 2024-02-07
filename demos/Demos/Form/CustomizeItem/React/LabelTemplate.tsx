import React from 'react';

export default function LabelTemplate(iconName: string) {
  return function template(data) {
    return (<div><i className={`dx-icon dx-icon-${iconName}`}></i>{ data.text }</div>);
  };
}
