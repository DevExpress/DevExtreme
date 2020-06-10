import React from 'react';
import { countriesGDP } from './data.js';

import PieChart from './PieChartComponent.js';

const format = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0
}).format;

function getPieData(name) {
  return countriesGDP[name] ? [
    { name: 'industry', value: countriesGDP[name].industry },
    { name: 'services', value: countriesGDP[name].services },
    { name: 'agriculture', value: countriesGDP[name].agriculture }
  ] : null;
}

export default function TooltipTemplate(info) {
  const name = info.attribute('name');
  const countryGDPData = countriesGDP[name];
  const total = countryGDPData && countryGDPData.total;
  const pieData = getPieData(name);

  const gdpInfo = total ?
    <div id="nominal">
      {`Nominal GDP: $${format(total)}M`}
    </div> :
    null;

  const graphic = pieData ?
    <PieChart data={pieData}></PieChart> :
    <div>No economic development data</div>;

  return (
    <div>
      <h4>{info.attribute('name')}</h4>
      {gdpInfo}
      {graphic}
    </div>
  );
}
