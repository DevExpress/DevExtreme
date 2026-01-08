import React from 'react';

interface LabelTemplateProps {
  text: string;
}

export default function LabelTemplate(iconName: string) {
  return function template({ text }: LabelTemplateProps) {
    return (<div><i className={`dx-icon dx-icon-${iconName}`}></i>{ text }</div>);
  };
}
