import React from 'react';

interface CustomItemData {
  City: string;
  State: string;
  Zipcode: string;
  Address: string;
  Phone: string;
  Fax: string;
  Website: string;
}

export default function CustomItem(data: CustomItemData) {
  return (
    <div>
      <div>
        <p>
          <b>{data.City} </b>
          (<span>{data.State}</span>)
        </p>
        <p>
          <span>{data.Zipcode} </span>
          <span>{data.Address}</span>
        </p>
      </div>
      <div>
        <p>
          Phone: <b>{data.Phone}</b>
        </p>
        <p>
          Fax: <b>{data.Fax}</b>
        </p>
        <p>
          Website: <a href={data.Website} target="_blank">
            {data.Website}
          </a>
        </p>
      </div>
    </div>
  );
}
