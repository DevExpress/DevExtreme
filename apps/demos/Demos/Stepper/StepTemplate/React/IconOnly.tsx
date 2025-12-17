import React from 'react';

interface IconOnlyProps {
  icon: string;
}

export default function IconOnly({ icon }: IconOnlyProps) {
  return (
    <i className={`dx-icon dx-icon-${icon}`}></i>
  );
}
