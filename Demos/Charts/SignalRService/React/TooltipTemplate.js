import React from 'react';

const formatCurrency = new Intl.NumberFormat('en-US',
  { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }
).format;

const formatNumber = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0
}).format;

export default function TooltipTemplate(pointInfo) {
  const volume = pointInfo.points.filter(point => point.seriesName === 'Volume')[0];
  const prices = pointInfo.points.filter(point => point.seriesName !== 'Volume')[0];

  return (
    <div className="tooltip-template">
      <div>{ pointInfo.argumentText }</div>
      <div><span>Open: </span>
        { formatCurrency(prices.openValue) }
      </div>
      <div><span>High: </span>
        { formatCurrency(prices.highValue) }
      </div>
      <div><span>Low: </span>
        { formatCurrency(prices.lowValue) }
      </div>
      <div><span>Close: </span>
        { formatCurrency(prices.closeValue) }
      </div>
      <div><span>Volume: </span>
        { formatNumber(volume.value) }
      </div>
    </div>
  );
}
