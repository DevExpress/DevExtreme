import React from 'react';

function getImagePath(point) {
  return `../../../../images/flags/${point.data.name.replace(/\s/, '').toLowerCase()}.gif`;
}

const formatNumber = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0
}).format;

export default function TooltipTemplate(info) {
  return (
    <div className="state-tooltip">
      <img src={getImagePath(info.point)} /><h4>{info.argument}</h4>
      <div>
        <span className="caption">Capital</span>: {info.point.data.capital}
      </div>
      <div>
        <span className="caption">Population</span>: {formatNumber(info.value)} people
      </div>
      <div>
        <span className="caption">Area</span>: {formatNumber(info.point.data.area)} km<sup>2</sup> ({formatNumber(0.3861 * info.point.data.area)} mi<sup>2</sup>)
      </div>
    </div>
  );
}
