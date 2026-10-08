import React from 'react';

interface IconOnlyProps {
  icon: string;
  label: string;
}

export default function IconOnly({ icon, label }: IconOnlyProps) {
  return (
    <i className={`dx-icon dx-icon-${icon}`} role="img" aria-label={label}></i>
  );
}
