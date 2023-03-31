import React from 'react';
import {
  CircularGauge, Scale, Title, Font, Margin, MinorTick,
  Export, RangeContainer, ValueIndicator,
} from 'devextreme-react/circular-gauge';

function CenterTemplate(gauge) {
  return (
    <svg>
      <rect y="0" x="0" width="200" height="200" fill="transparent"></rect>

      <g transform="translate(50 0)">
        <rect x="0" y="0" width="100" height="70" rx="8" fill="#f2f2f2"></rect>
        <text textAnchor="middle" y="27" x="50" fill="#000" fontSize="20">
          <tspan x="50">{gauge.value()}</tspan>
          <tspan x="50" dy="30">kg</tspan>
        </text>
      </g>

      <g transform="translate(43 140)">
        <rect className="description" x="0" y="0" width="114" height="56" rx="8" fill="#fff"></rect>
        <text textAnchor="start" y="23" x="15" fill="#000" fontSize="12">
          <tspan x="15">Capacity: 10 kg</tspan>
          <tspan x="15" dy="20">Graduation: 10 g</tspan>
        </text>
      </g>

    </svg>
  );
}

class App extends React.Component {
  render() {
    return (
      <CircularGauge
        id="gauge"
        value={7.78}
        centerRender={CenterTemplate}
      >
        <Scale startValue={0} endValue={10} tickInterval={1}>
          <MinorTick visible />
        </Scale>
        <Export enabled />
        <RangeContainer backgroundColor="#03a9f4" />
        <ValueIndicator color="#03a9f4" />
        <Title text="Gold Production (in Kilograms)" verticalAlignment="bottom">
          <Font size={25} />
          <Margin top={25} />
        </Title>
      </CircularGauge>
    );
  }
}

export default App;
