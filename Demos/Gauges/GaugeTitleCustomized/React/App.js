import React from 'react';
import { CircularGauge, Scale, Title, Font, Margin } from 'devextreme-react/circular-gauge';

class App extends React.Component {

  render() {
    return (
      <CircularGauge
        id="gauge"
        value={7}
      >
        <Scale startValue={0} endValue={10} tickInterval={2} />
        <Title text="Amount of Produced Gold (Kilos)" horizontalAlignment="center" verticalAlignment="bottom">
          <Font size={30} color="#CFB53B" />
          <Margin top={25} />
        </Title>
      </CircularGauge>
    );
  }
}

export default App;
