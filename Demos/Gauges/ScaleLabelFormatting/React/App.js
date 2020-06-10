import React from 'react';
import { CircularGauge, Scale, Label, RangeContainer, Range, Export, Title, Font } from 'devextreme-react/circular-gauge';

class App extends React.Component {

  render() {
    return (
      <CircularGauge
        id="gauge"
        value={45}
      >
        <Scale startValue={0} endValue={100} tickInterval={10}>
          <Label customizeText={this.customizeText} />
        </Scale>
        <RangeContainer>
          <Range startValue={0} endValue={20} color="#CE2029" />
          <Range startValue={20} endValue={50} color="#FFD700" />
          <Range startValue={50} endValue={100} color="#228B22" />
        </RangeContainer>
        <Export enabled={true} />
        <Title text="Battery Charge">
          <Font size={28} />
        </Title>
      </CircularGauge>
    );
  }

  customizeText({ valueText }) {
    return `${valueText} %`;
  }
}

export default App;
