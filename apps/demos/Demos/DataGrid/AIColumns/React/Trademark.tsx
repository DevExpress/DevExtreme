import React, { useCallback } from 'react';
import { type Vehicle } from './types';

type TrademarkProps = {
  vehicle: Vehicle;
  onShowInfo: (vehicle: Vehicle) => void;
};

export default function Trademark({ vehicle, onShowInfo }: TrademarkProps) {
  const { ID, TrademarkName, Name } = vehicle;

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLImageElement>) => {
    if (event.key === 'Enter') {
      onShowInfo(vehicle);
    }
  }, [onShowInfo, vehicle]);

  return (
    <div className="trademark__wrapper">
      <div className="trademark__img-wrapper">
        <img
          className="trademark__img"
          src={`../../../../images/vehicles/image_${ID}.png`}
          alt={`${TrademarkName} ${Name}`}
          tabIndex={0}
          onClick={() => onShowInfo(vehicle)}
          role="button"
          onKeyDown={onKeyDown}
          aria-haspopup="dialog"
          aria-label={`${TrademarkName} ${Name} - press Enter for image info`}
        />
      </div>
      <div>
        <div className="trademark__text trademark__text--title">{TrademarkName}</div>
        <div className="trademark__text trademark__text--subtitle">{Name}</div>
      </div>
    </div>
  );
}
