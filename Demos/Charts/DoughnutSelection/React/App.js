import React from 'react';

import PieChart, {
  Legend,
  Series,
  Export,
  HoverStyle
} from 'devextreme-react/pie-chart';

import { olympicMedals } from './data.js';

class App extends React.Component {

  render() {
    return (
      <PieChart
        id="pie"
        type="doughnut"
        title="Olympic Medals in 2008"
        palette="Soft Pastel"
        dataSource={olympicMedals}
        onPointClick={this.pointClickHandler}
      >
        <Series argumentField="country" valueField="medals">
          <HoverStyle color="#ffd700" />
        </Series>
        <Export enabled={true} />
        <Legend
          margin={0}
          horizontalAlignment="right"
          verticalAlignment="top"
        />
      </PieChart>
    );
  }

  pointClickHandler(arg) {
    arg.target.select();
  }
}

export default App;
