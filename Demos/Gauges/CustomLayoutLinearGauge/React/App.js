import React from 'react';
import { LinearGauge, Scale, Tick, Label, RangeContainer, Range, ValueIndicator, SubvalueIndicator, Export, Title, Font } from 'devextreme-react/linear-gauge';

class App extends React.Component {

  render() {
    return (
      <LinearGauge
        id="gauge"
        value={17}
        subvalues={[5, 25]}
      >
        <Scale startValue={0} endValue={30} tickInterval={5}>
          <Tick color="#536878" />
          <Label indentFromTick={-3} />
        </Scale>
        <RangeContainer offset={10}>
          <Range startValue={0} endValue={5} color="#92000A" />
          <Range startValue={5} endValue={20} color="#E6E200" />
          <Range startValue={20} endValue={30} color="#77DD77" />
        </RangeContainer>
        <ValueIndicator offset={20} />
        <SubvalueIndicator offset={-15} />
        <Export enabled={true} />
        <Title text="Issues Closed (with Min and Max Expected)">
          <Font size={28} />
        </Title>
      </LinearGauge>
    );
  }
}

export default App;
