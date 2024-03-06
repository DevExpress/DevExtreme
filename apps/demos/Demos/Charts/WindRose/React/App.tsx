import React, { useCallback, useState } from 'react';
import SelectBox from 'devextreme-react/select-box';
import {
  PolarChart,
  CommonSeriesSettings,
  Series,
  ArgumentAxis,
  ValueAxis,
  Margin,
  Export,
} from 'devextreme-react/polar-chart';
import { windSources, windRoseData, periodLabel } from './data.ts';

function onLegendClick({ target: series }) {
  if (series.isVisible()) {
    series.hide();
  } else {
    series.show();
  }
}

function App() {
  const [periodValues, setPeriodValues] = useState(windRoseData[0].values);

  const handleChange = useCallback(({ value }) => {
    setPeriodValues(value);
  }, [setPeriodValues]);

  return (
    <div id="chart-demo">
      <PolarChart
        id="radarChart"
        palette="Soft"
        dataSource={periodValues}
        onLegendClick={onLegendClick}
        title="Wind Rose, Philadelphia PA"
      >
        <CommonSeriesSettings type="stackedbar" />
        {windSources.map((item) => (
          <Series key={item.value} valueField={item.value} name={item.name} />
        ))}
        <Margin bottom={50} left={100} />
        <ArgumentAxis discreteAxisDivisionMode="crossLabels" firstPointOnStartAngle={true} />
        <ValueAxis valueMarginsEnabled={false} />
        <Export enabled={true} />
      </PolarChart>
      <div className="center">
        <SelectBox
          width="300"
          dataSource={windRoseData}
          inputAttr={periodLabel}
          displayExpr="period"
          valueExpr="values"
          value={periodValues}
          onValueChanged={handleChange}
        />
      </div>
    </div>
  );
}

export default App;
