import React, { useCallback } from 'react';

export default function Trademark({ vehicle, onShowInfo }) {
  const { ID, TrademarkName, Name } = vehicle;
  const onKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        onShowInfo(vehicle);
      }
    },
    [onShowInfo, vehicle],
  );
  return (
    <div className="trademark__wrapper">
      <div className="trademark__img-wrapper">
        <img
          className="trademark__img"
          src={`../../../../images/vehicles/image_${ID}.png`}
          alt={`${TrademarkName} ${Name}`}
          tabIndex={0}
          onClick={() => onShowInfo(vehicle)}
          onKeyPress={onKeyPress}
          aria-haspopup="dialog"
          aria-label={`${TrademarkName} ${Name} - press Enter for image info`}
        />
      </div>
      <div className="trademark__text">
        <div className="trademark__text trademark__text--title">{TrademarkName}</div>
        <div className="trademark__text trademark__text--subtitle">{Name}</div>
      </div>
    </div>
  );
}
