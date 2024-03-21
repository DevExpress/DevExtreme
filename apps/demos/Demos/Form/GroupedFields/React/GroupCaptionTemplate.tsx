import React from 'react';

export default function GroupCaption(iconName: string) {
  return function template(data) {
    return (`<i class='dx-icon dx-icon-${iconName}'></i><span>${data.caption}</span>`);
  };
}
