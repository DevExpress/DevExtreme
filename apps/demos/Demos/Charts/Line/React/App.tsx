import React, { useCallback, useState } from 'react';
import SelectBox from 'devextreme-react/select-box';
import type { SelectBoxTypes } from 'devextreme-react/select-box';
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
import type { Properties as ChartPropsType } from 'devextreme/viz/chart';

import service from './data.ts';

const countriesInfo = service.getCountriesInfo();
const energySources = service.getEnergySources();

const types: (NonNullable<ChartPropsType['commonSeriesSettings']>['type'])[] = ['line', 'stackedline', 'fullstackedline'];
const seriesTypeLabel = { 'aria-label': 'Series Type' };

function App() {
  const [type, setType] = useState(types[0]);

  const handleChange = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setType(e.value);
  }, []);

  return (
    <>
      <Chart palette="Violet" dataSource={countriesInfo}>
        <CommonSeriesSettings argumentField="country" type={type} />
        {energySources.map((item) => (
          <Series key={item.value} valueField={item.value} name={item.name} />
        ))}
        <Margin bottom={20} />
        <ArgumentAxis valueMarginsEnabled={false} discreteAxisDivisionMode="crossLabels">
          <Grid visible={true} />
        </ArgumentAxis>
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
          itemTextPosition="bottom"
        />
        <Export enabled={true} />
        <Title text="Energy Consumption in 2024">
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
    </>
  );
}

export default App;
