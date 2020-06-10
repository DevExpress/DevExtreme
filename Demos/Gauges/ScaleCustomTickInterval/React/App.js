import React from 'react';
import { LinearGauge, Scale, MinorTick, Export, Title, Font } from 'devextreme-react/linear-gauge';

class App extends React.Component {

  render() {
    return (
      <LinearGauge
        id="gauge"
        value={4.3}
      >
        <Scale startValue={0} endValue={5} tickInterval={2.5} minorTickInterval={0.625}>
          <MinorTick visible={true} />
        </Scale>
        <Export enabled={true} />
        <Title text="TV Show Rating">
          <Font size={28} />
        </Title>
      </LinearGauge>
    );
  }
}

export default App;
