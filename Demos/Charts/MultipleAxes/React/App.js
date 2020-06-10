import React from 'react';
import Chart, {
  CommonSeriesSettings,
  Series,
  ValueAxis,
  Export,
  Legend,
  Tooltip,
  Title,
  Grid,
  Format
} from 'devextreme-react/chart';
import { continentSources, populationData } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        palette="Vintage"
        dataSource={populationData}
      >
        <CommonSeriesSettings
          argumentField="year"
          type="fullstackedbar"
        />
        {
          continentSources.map(function(item) {
            return <Series key={item.value} valueField={item.value} name={item.name} />;
          })
        }
        <Series
          axis="total"
          type="spline"
          valueField="total"
          name="Total"
          color="#008fd8"
        />

        <ValueAxis>
          <Grid visible={true} />
        </ValueAxis>
        <ValueAxis
          name="total"
          position="right"
          title="Total Population, billions"
        >
          <Grid visible={true} />
        </ValueAxis>

        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        />
        <Export enabled={true} />
        <Tooltip
          enabled={true}
          shared={true}
          customizeTooltip={customizeTooltip}
        >
          <Format
            type="largeNumber"
            precision={1}
          />
        </Tooltip>
        <Title text="Evolution of Population by Continent" />
      </Chart>
    );
  }
}

function customizeTooltip(pointInfo) {
  const items = pointInfo.valueText.split('\n');
  const color = pointInfo.point.getColor();

  items.forEach((item, index) => {
    if(item.indexOf(pointInfo.seriesName) === 0) {
      const element = document.createElement('span');

      element.textContent = item;
      element.style.color = color;
      element.className = 'active';

      items[index] = element.outerHTML;
    }
  });

  return { text: items.join('\n') };
}

export default App;
