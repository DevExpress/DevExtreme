import React, { useCallback } from 'react';
import { Vehicle } from "./types";

type TrademarkProps = {
  vehicle: Vehicle;
  onShowInfo: (vehicle: Vehicle) => void;
};

export default function Trademark({vehicle, onShowInfo}: TrademarkProps) {

  const {ID, TrademarkName, Name} = vehicle;

  return (
    <div className='trademark__wrapper'>
      <div className='trademark__img-wrapper'>
        <img
          className='trademark__img'
          src={`../../../../images/vehicles/image_${ID}.png`}
          alt={`${TrademarkName} ${Name}`}
          onClick={() => onShowInfo(vehicle)}
        />
      </div>
      <div className='trademark__text-wrapper'>
        <div className='trademark__text trademark__text--title'>{TrademarkName}</div>
        <div className='trademark__text trademark__text--subtitle'>{Name}</div>
      </div>
    </div>
  );
}