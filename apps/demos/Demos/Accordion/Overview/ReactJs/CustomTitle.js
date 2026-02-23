import React from 'react';

export default function CustomTitle(company) {
  const { CompanyName } = company;
  return <div className="header">{CompanyName}</div>;
}
