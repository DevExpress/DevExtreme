import React from 'react';

interface AnnotationData {
  country: string,
  oldCountryName: string,
  gold: number,
  silver: number,
  bronze: number,
}

export default function TooltipTemplate(annotation: { data: AnnotationData; }) {
  const { data } = annotation;

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
