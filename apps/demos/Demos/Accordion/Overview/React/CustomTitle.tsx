import React from 'react';

interface CustomTitleProps {
  CompanyName: string;
}

export default function CustomTitle(data: CustomTitleProps) {
  return (
    <div className='header'>{data.CompanyName}</div>
  );
}
