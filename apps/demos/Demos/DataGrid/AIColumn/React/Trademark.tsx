import React from 'react';
import { Vehicle } from "./types";
import { type DataGridTypes } from 'devextreme-react/data-grid';

export default function Trademark(props: DataGridTypes.ColumnCellTemplateData<Vehicle>) {

  const {ID, TrademarkName, Name} = props.data;

  return (
    <div className='trademark__wrapper'>
      <div className='trademark__img-wrapper'>
        <img
          className='trademark__img'
          src={`../../../../images/vehicles/image_${ID}.png`}
          alt={`${TrademarkName} ${Name}`}
        />
      </div>
      <div className='trademark__text-wrapper'>
        <div className='trademark__text trademark__text--title'>{TrademarkName}</div>
        <div className='trademark__text trademark__text--subtitle'>{Name}</div>
      </div>
    </div>
  );
}