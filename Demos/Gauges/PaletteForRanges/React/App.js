import React from 'react';
import { CircularGauge, Scale, Label, RangeContainer, Range, Title, Font, Export } from 'devextreme-react/circular-gauge';

class App extends React.Component {

  render() {
    return (
      <CircularGauge
        id="gauge"
        value={105}
      >
        <Scale startValue={50} endValue={150} tickInterval={10}>
          <Label useRangeColors={true} />
        </Scale>
        <RangeContainer palette="pastel">
          <Range startValue={50} endValue={90} />
          <Range startValue={90} endValue={130} />
          <Range startValue={130} endValue={150} />
        </RangeContainer>
        <Title text="Temperature of the Liquid in the Boiler">
          <Font size={28} />
        </Title>
        <Export enabled={true} />
      </CircularGauge>
    );
  }
}

export default App;
