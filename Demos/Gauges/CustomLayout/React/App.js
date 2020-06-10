import React from 'react';
import { CircularGauge, Scale, Tick, Label, RangeContainer, Range, ValueIndicator, SubvalueIndicator, Title, Font, Export } from 'devextreme-react/circular-gauge';

const subvalues = [40, 90];

class App extends React.Component {

  render() {
    return (
      <CircularGauge
        id="gauge"
        value={85}
        subvalues={subvalues}
      >
        <Scale startValue={0} endValue={100} tickInterval={10}>
          <Tick color="#536878" />
          <Label indentFromTick={3} />
        </Scale>
        <RangeContainer offset={10}>
          <Range startValue={0} endValue={30} color="#92000A" />
          <Range startValue={30} endValue={70} color="#E6E200" />
          <Range startValue={70} endValue={100} color="#77DD77" />
        </RangeContainer>
        <ValueIndicator offset={50} />
        <SubvalueIndicator offset={-25} />
        <Title text="Amount of Tickets Sold (with Min and Max Expected)">
          <Font size={28} />
        </Title>
        <Export enabled={true} />
      </CircularGauge>
    );
  }
}

export default App;
