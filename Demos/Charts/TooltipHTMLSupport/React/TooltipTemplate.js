import React from 'react';

function getImagePath(point) {
  return `../../../../images/flags/${point.data.name.replace(/\s/, '')}.svg`;
}

const formatNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
}).format;

export default function TooltipTemplate(info) {
  return (
    <div className="state-tooltip">
      <img src={getImagePath(info.point)} /><h4 className="state">{info.argument}</h4>
      <div className="capital">
        <span className="caption">Capital</span>: {info.point.data.capital}
      </div>
      <div className="population">
        <span className="caption">Population</span>: {formatNumber(info.value)} people
      </div>
      <div>
        <span className="caption">Area</span>: <span className="area-km">{formatNumber(info.point.data.area)}</span> km<sup>2</sup> (<span className="area-mi">{formatNumber(0.3861 * info.point.data.area)}</span> mi<sup>2</sup>)
      </div>
    </div>
  );
}
