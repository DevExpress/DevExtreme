import React from 'react';
import { LinearGauge, Geometry, Scale, Title, Font, Export } from 'devextreme-react/linear-gauge';

const customTicks = [0, 10, 25, 50];

class App extends React.Component {

  render() {
    return (
      <LinearGauge
        id="gauge"
        value={35}
      >
        <Geometry orientation="vertical" />
        <Scale startValue={0} endValue={50} customTicks={customTicks} />
        <Title text="Fuel Volume (in Liters)">
          <Font size={28} />
        </Title>
        <Export enabled={true} />
      </LinearGauge>
    );
  }
}

export default App;
