import React from 'react';

function CompanyItem({ data }) {
  const company = data;
  return (
    <div>
      <div className="tabpanel-item">
        <div>
          <p>
            <span>{ company.Address }</span>
          </p>
          <p>
            <span><b>{ company.City }</b>,&nbsp;</span>
            <span>{ company.State }&nbsp;</span>
            <span>{ company.Zipcode }</span>
          </p>
        </div>
        <div>
          <p>
            Phone: <b>{ company.Phone }</b>
          </p>
          <p>
            Fax: <b>{ company.Fax }</b>
          </p>
          <p>
            Website: <a
              href={company.Website}
              rel="noreferrer"
              target="_blank">
              { company.Website }
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CompanyItem;
