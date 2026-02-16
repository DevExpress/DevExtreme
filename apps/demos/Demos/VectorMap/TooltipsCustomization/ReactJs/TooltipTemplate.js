import React from 'react';
import { countriesGDP } from './data.js';
import PieChart from './PieChartComponent.js';

const { format } = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
});
function getPieData(name) {
  const data = countriesGDP[name];
  return data
    ? [
      { name: 'industry', value: data.industry ?? 0 },
      { name: 'services', value: data.services ?? 0 },
      { name: 'agriculture', value: data.agriculture ?? 0 },
    ]
    : null;
}
export default function TooltipTemplate(info) {
  const name = info.attribute('name');
  const countryGDPData = countriesGDP[name];
  const total = countryGDPData?.total;
  const pieData = getPieData(name);
  const gdpInfo = total ? <div id="nominal">{`Nominal GDP: $${format(total)}M`}</div> : null;
  const graphic = pieData ? (
    <PieChart data={pieData}></PieChart>
  ) : (
    <div>No economic development data</div>
  );
  return (
    <div>
      <h4>{info.attribute('name')}</h4>
      {gdpInfo}
      {graphic}
    </div>
  );
}
