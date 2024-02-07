import React from 'react';

const getImagePath = (name) => `../../../../images/flags/${name?.replace(/\s/, '')}.svg`;
const formatNumber = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
}).format;
const AnnotationTemplate = ({
  data: {
    name, capital, population, area,
  },
}) => (
  <svg className="annotation">
    <image
      href={getImagePath(name)}
      width="60"
      height="40"
    />
    <rect
      x={0}
      y={0}
      className="border"
    ></rect>
    <text
      x="70"
      y="25"
      className="state"
    >
      {name}
    </text>
    <text
      x="0"
      y="60"
    >
      <tspan className="caption">Capital:</tspan>
      <tspan
        className="capital"
        dx="5"
      >
        {capital}
      </tspan>
      <tspan
        dy="14"
        x="0"
        className="caption"
      >
        Population:
      </tspan>
      <tspan
        className="population"
        dx="5"
      >
        {formatNumber(population)}
      </tspan>
      <tspan
        dy="14"
        x="0"
        className="caption"
      >
        Area:
      </tspan>
      <tspan
        className="area"
        dx="5"
      >
        {formatNumber(area)}
      </tspan>
      <tspan dx="5">km</tspan>
      <tspan
        className="sup"
        dy="-2"
      >
        2
      </tspan>
    </text>
  </svg>
);
export default AnnotationTemplate;
