import React from 'react';

var markerPath = {
  'Original Signal': 'M 0 8 C 2 4 7 4 9.5 8 C 11 12 16 12 18 8 L 18 10 C 16 14 11 14 8.5 10 C 7 6 2 6 0 10 Z',
  'Noisy Signal': 'M 18 8 L 12 12 L 7 3 L 0 7.4 L 0 10 L 6 6 L 11 15 L 18 10.6 Z'
};

export default function MarkerTemplate(item) {
  var color = item.series.isVisible() ? item.marker.fill : '#888';
  return (
    <svg>
      <rect x={0} y={0} width={18} height={18} fill={color} opacity={0.3}></rect>
      <path d={markerPath[item.series.name]} fill={color}></path>
    </svg>
  );
}
