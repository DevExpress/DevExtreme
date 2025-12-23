import React from 'react';
import type { Company } from './types.ts';

export default function CustomTitle(company: Company) {
  const { CompanyName } = company;

  return (
    <div className='header'>{CompanyName}</div>
  );
}
