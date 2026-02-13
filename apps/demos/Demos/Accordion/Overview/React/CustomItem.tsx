import React from 'react';
import type { Company } from './types.ts';

export default function CustomItem(company: Company) {
  const {
    Address,
    City,
    State,
    Zipcode,
    Phone,
    Fax,
    Website,
  } = company;

  return (
    <div>
      <div>
        <p>
          <b>{City} </b>
          (<span>{State}</span>)
        </p>
        <p>
          <span>{Zipcode} </span>
          <span>{Address}</span>
        </p>
      </div>
      <div>
        <p>
          Phone: <b>{Phone}</b>
        </p>
        <p>
          Fax: <b>{Fax}</b>
        </p>
        <p>
          Website: <span className="accordion-item-link">
            {Website}
          </span>
        </p>
      </div>
    </div>
  );
}
