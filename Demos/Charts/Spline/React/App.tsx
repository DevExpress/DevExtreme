import React from 'react';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  ICommonSeriesSettingsProps,
  CommonAxisSettings,
  Grid,
  Export,
  Legend,
  Margin,
  Tooltip,
  Label,
  Format,
} from 'devextreme-react/chart';
import { architectureSources, sharingStatisticsInfo, seriesTypeLabel } from './data.ts';

const types: (ICommonSeriesSettingsProps['type'])[] = ['spline', 'stackedspline', 'fullstackedspline'];

function App() {
  const [type, setType] = React.useState(types[0]);

  const handleChange = React.useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setType(e.value);
  }, [setType]);

  return (
    <React.Fragment>
      <Chart
        palette="Violet"
        dataSource={sharingStatisticsInfo}
        title="Architecture Share Over Time (Count)"
      >
        <CommonSeriesSettings
          argumentField="year"
          type={type}
        />
        <CommonAxisSettings>
          <Grid visible={true} />
        </CommonAxisSettings>
        {
          architectureSources.map((item) => <Series
            key={item.value}
            valueField={item.value}
            name={item.name} />)
        }
        <Margin bottom={20} />
        <ArgumentAxis
          allowDecimals={false}
          axisDivisionFactor={60}
        >
          <Label>
            <Format type="decimal" />
          </Label>
        </ArgumentAxis>
        <Legend
          verticalAlignment="top"
          horizontalAlignment="right"
        />
        <Export enabled={true} />
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
