import React from 'react';

interface IconOnlyData {
  icon: string;
}

export default function IconOnly(data: IconOnlyData) {
  return (
    <i className={`dx-icon dx-icon-${data.icon}`}></i>
  );
}
