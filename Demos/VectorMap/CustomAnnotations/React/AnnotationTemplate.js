import React from 'react';

function getImagePath(data) {
  return `../../../../images/flags/${data.name.replace(/\s/, '')}.svg`;
}

const formatNumber = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0
}).format;

export default function AnnotationTemplate(annotation) {
  const data = annotation.data;
  return (
    <svg className="annotation">
      <image href={getImagePath(data)} width="60" height="40" />
      <rect x={0} y={0} className="border"></rect>
      <text x="70" y="25" className="state">{data.name}</text>
      <text x="0" y="60">
        <tspan className="caption">Capital:</tspan>
        <tspan className="capital" dx="5">{data.capital}</tspan>
        <tspan dy="14" x="0" className="caption">Population:</tspan>
        <tspan className="population" dx="5">{formatNumber(data.population)}</tspan>
        <tspan dy="14" x="0" className="caption">Area:</tspan>
        <tspan className="area" dx="5">{formatNumber(data.area)}</tspan>
        <tspan dx="5">km</tspan>
        <tspan className="sup" dy="-2">2</tspan>
      </text>
    </svg>
  );
}
