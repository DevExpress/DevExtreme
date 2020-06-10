import React from 'react';
import { CircularGauge, Scale, Tooltip, Font, Export, Title } from 'devextreme-react/circular-gauge';

const subvalues = [8, 18];

class App extends React.Component {

  render() {
    return (
      <CircularGauge
        id="gauge"
        value={12}
        subvalues={subvalues}
      >
        <Scale startValue={0} endValue={20} tickInterval={5} />
        <Tooltip enabled={true} customizeTooltip={this.customizeTooltip}>
          <Font size={40} color="#DCD0FF" />
        </Tooltip>
        <Export enabled={true} />
        <Title text="Rheostat Resistance">
          <Font size={28} />
        </Title>
      </CircularGauge>
    );
  }

  customizeTooltip({ valueText }) {
    return {
      text: `${valueText} ohm`
    };
  }
}

export default App;
