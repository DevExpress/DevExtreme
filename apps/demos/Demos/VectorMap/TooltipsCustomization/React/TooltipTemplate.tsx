import React from 'react';
import { countriesGDP } from './data.ts';
import type { CountriesGDPKey } from './data.ts';

import PieChart from './PieChartComponent.tsx';

const { format } = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
});

function getPieData(name: CountriesGDPKey) {
  const data = countriesGDP[name];
  return data ? [
    { name: 'industry', value: data.industry ?? 0 },
    { name: 'services', value: data.services ?? 0 },
    { name: 'agriculture', value: data.agriculture ?? 0 },
  ] : null;
}

export default function TooltipTemplate(info: { attribute: (name: string) => string; }) {
  const name = info.attribute('name');
  const countryGDPData = countriesGDP[name];
  const total = countryGDPData?.total;
  const pieData = getPieData(name);

  const gdpInfo = total
    ? <div id="nominal">
      {`Nominal GDP: $${format(total)}M`}
    </div>
    : null;

  const graphic = pieData
    ? <PieChart data={pieData}></PieChart>
    : <div>No economic development data</div>;

  return (
    <div>
      <h4>{info.attribute('name')}</h4>
      {gdpInfo}
      {graphic}
    </div>
  );
}
