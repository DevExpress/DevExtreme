import React from 'react';

import Chart, {
  Series,
  Annotation,
  Legend,
  CommonAnnotationSettings
} from 'devextreme-react/chart';

import { populationData } from './data.js';
import AnnotationTemplate from './AnnotationTemplate.js';

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        dataSource={populationData}
        title="Top 5 Most Populated States in US"
      >
        <Series
          type="bar"
          argumentField="name"
          valueField="population"
          name="Population"
        >
        </Series>
        <CommonAnnotationSettings
          type="custom"
          series="Population"
          render={AnnotationTemplate}
          allowDragging={true}
        >
        </CommonAnnotationSettings>
        {populationData.map(data => {
          return (
            <Annotation
              argument={data.name}
              key={data.name}
              data={data}
            >
            </Annotation>
          ); })}
        <Legend visible={false}></Legend>
      </Chart>
    );
  }
}

export default App;
