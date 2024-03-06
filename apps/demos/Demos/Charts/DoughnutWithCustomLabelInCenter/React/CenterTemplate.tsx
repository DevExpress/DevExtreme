import PieChart from 'devextreme-react/pie-chart';
import React from 'react';

const formatNumber = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
}).format;

function calculateTotal(pieChart: PieChart['instance']) {
  return formatNumber(pieChart
    .getAllSeries()[0]
    .getVisiblePoints()
    .reduce((s, p) => s + Number(p.originalValue), 0));
}

function getImagePath(country: string) {
  return `../../../../images/flags/${country.replace(/\s/, '').toLowerCase()}.svg`;
}

export default function TooltipTemplate(pieChart: PieChart['instance']) {
  const { country } = pieChart.getAllSeries()[0].getVisiblePoints()[0].data;
  return (
    <svg>
      <circle cx="100" cy="100" r={pieChart.getInnerRadius() - 6} fill="#eee"></circle>
      <image href={getImagePath(country)} x="70" y="58" width="60" height="40" />
      <text textAnchor="middle" x="100" y="120" style={{ fontSize: 18, fill: '#494949' }}>
        <tspan x="100">{country}</tspan>
        <tspan x="100" dy="20px" style={{ fontWeight: 600 }}>{
          calculateTotal(pieChart)
        }</tspan>
      </text>
    </svg>
  );
}
