import React from 'react';

export default function TooltipTemplate(annotation) {
  const data = annotation.data;

  return (
    <div className='medal-tooltip'>
      <div className='country-name'>{data.country}
        {data.oldCountryName && <br />}{data.oldCountryName}
      </div>
      <div>
        <span className='caption'>Gold</span>: {data.gold}
      </div>
      <div>
        <span className='caption'>Silver</span>: {data.silver}
      </div>
      <div>
        <span className='caption'>Bronze</span>: {data.bronze}
      </div>
    </div>
  );
}
