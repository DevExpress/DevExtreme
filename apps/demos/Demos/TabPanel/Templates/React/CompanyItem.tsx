import React from 'react';
import type { Company } from './types.ts';

interface CompanyItemProps {
  data: Company;
}

function CompanyItem({ data }: CompanyItemProps) {
  const {
    Address,
    City,
    State,
    Zipcode,
    Phone,
    Fax,
    Website,
  } = data;

  return (
    <div>
      <div className="tabpanel-item">
        <div>
          <p>
            <span>{ Address }</span>
          </p>
          <p>
            <span><b>{ City }</b>,&nbsp;</span>
            <span>{ State }&nbsp;</span>
            <span>{ Zipcode }</span>
          </p>
        </div>
        <div>
          <p>
            Phone: <b>{ Phone }</b>
          </p>
          <p>
            Fax: <b>{ Fax }</b>
          </p>
          <p>
            Website: <a
              href={Website}
              rel="noreferrer"
              target="_blank">
              { Website }
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CompanyItem;
