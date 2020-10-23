import React from 'react';

export default function TooltipTemplate(annotation) {
  const data = annotation.data;

  return (
    <div className='medal-tooltip'>
      <div className='country-name'>{data.country}
        {data.oldCountryName && <br />}{data.oldCountryName}
      </div>
      <div className='gold'>
        <span className='caption'>Gold</span>: {data.gold}
      </div>
      <div className='silver'>
        <span className='caption'>Silver</span>: {data.silver}
      </div>
      <div className='bronze'>
        <span className='caption'>Bronze</span>: {data.bronze}
      </div>
    </div>
  );
}
