import React from 'react';
import { CircularGauge, Scale, Tick, MinorTick, RangeContainer, Title, Font, Export } from 'devextreme-react/circular-gauge';

class App extends React.Component {

  render() {
    return (
      <CircularGauge
        id="gauge"
        value={750}
      >
        <Scale startValue={0} endValue={1000} tickInterval={100} minorTickInterval={25}>
          <Tick color="#9c9c9c" />
          <MinorTick visible={true} color="#9c9c9c" />
        </Scale>
        <RangeContainer backgroundColor="none" />
        <Title text="Fan Speed (in rpm)">
          <Font size={28} />
        </Title>
        <Export enabled={true} />
      </CircularGauge>
    );
  }
}

export default App;
