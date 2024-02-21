import React, { useCallback, useState } from 'react';
import SelectBox from 'devextreme-react/select-box';
import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  Export,
  Legend,
  Margin,
  Title,
  Subtitle,
  Tooltip,
  Grid,
} from 'devextreme-react/chart';
import service from './data.js';

const countriesInfo = service.getCountriesInfo();
const energySources = service.getEnergySources();
const types = ['line', 'stackedline', 'fullstackedline'];
const seriesTypeLabel = { 'aria-label': 'Series Type' };
function App() {
  const [type, setType] = useState(types[0]);
  const handleChange = useCallback((e) => {
    setType(e.value);
  }, []);
  return (
    <React.Fragment>
      <Chart
        palette="Violet"
        dataSource={countriesInfo}
      >
        <CommonSeriesSettings
          argumentField="country"
          type={type}
        />
        {energySources.map((item) => (
          <Series
            key={item.value}
            valueField={item.value}
            name={item.name}
          />
        ))}
        <Margin bottom={20} />
        <ArgumentAxis
          valueMarginsEnabled={false}
          discreteAxisDivisionMode="crossLabels"
        >
          <Grid visible={true} />
        </ArgumentAxis>
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
          itemTextPosition="bottom"
        />
        <Export enabled={true} />
        <Title text="Energy Consumption in 2004">
          <Subtitle text="(Millions of Tons, Oil Equivalent)" />
        </Title>
        <Tooltip enabled={true} />
      </Chart>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Series Type </span>
          <SelectBox
            dataSource={types}
            inputAttr={seriesTypeLabel}
            value={type}
            onValueChanged={handleChange}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
export default App;
