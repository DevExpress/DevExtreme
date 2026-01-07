import React from 'react';

interface GroupProps {
  key: string;
}

export default function Group({ key }: GroupProps) {
  return (
    <div className="custom-icon">
      <span className="dx-icon-box icon"></span> {key}
    </div>
  );
}
