import React from 'react';

function CompanyItem({ data }) {
  const {
    CompanyName, City, State, Zipcode, Address, Phone, Fax, Website,
  } = data;
  return (
    <div>
      <div className="multiview-item">
        <div className="header">{CompanyName}</div>
        <div>
          <p>
            <b>{City} </b>(<span>{State}</span>)
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
            Website:{' '}
            <a
              href={Website}
              target="_blank"
            >
              {Website}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
export default CompanyItem;
