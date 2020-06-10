import React from 'react';

import PieChart, {
  Series,
  Legend,
  Label,
  Connector
} from 'devextreme-react/pie-chart';

import { data } from './data.js';
import CenterTemplate from './CenterTemplate.js';
const countries = Array.from(new Set(data.map(item => item.country)));

class App extends React.Component {

  customizeLabel(e) {
    return `${e.argumentText}\n${e.valueText}`;
  }

  render() {
    const pies = countries.map(country => (
      <PieChart
        id="pie-chart"
        key={country}
        dataSource={data.filter(i => i.country === country)}
        resolveLabelOverlapping="shift"
        sizeGroup="piesGroup"
        innerRadius={0.65}
        centerRender={CenterTemplate}
        type="doughnut"
      >
        <Series
          argumentField="commodity"
          valueField="total"
        >
          <Label visible={true}
            format="fixedPoint"
            customizeText={this.customizeLabel}
            backgroundColor="none">
            <Connector visible={true}></Connector>
          </Label>
        </Series>
        <Legend visible={false}></Legend>
      </PieChart>
    ));

    return (
      <div>
        <div className="long-title"><h3>Energy Production (GWh, 2016)</h3></div>
        <div className="pies-container">
          {pies}
        </div>
      </div>
    );
  }
}

export default App;
