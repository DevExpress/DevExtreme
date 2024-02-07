import React, { useCallback, useRef, useState } from 'react';
import PieChart, {
  Series, Tooltip, Size, Legend, PieChartTypes,
} from 'devextreme-react/pie-chart';
import { SelectBox } from 'devextreme-react/select-box';
import { populationData, regionLabel } from './data.ts';

const customizeTooltip = (pointInfo) => ({
  text: `${pointInfo.argumentText}<br/>${pointInfo.valueText}`,
});

function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const pieChartRef = useRef<PieChart>(null);

  const showTooltip = useCallback((point) => {
    point.showTooltip();
    setSelectedRegion(point.argument);
  }, [setSelectedRegion]);

  const onPointClick = useCallback(({ target: point }: PieChartTypes.PointClickEvent) => {
    showTooltip(point);
  }, [showTooltip]);

  const onRegionChanged = useCallback(({ value }) => {
    const point = pieChartRef.current.instance.getAllSeries()[0].getPointsByArg(value)[0];
    showTooltip(point);
  }, [showTooltip]);

  return (
    <React.Fragment>
      <PieChart
        ref={pieChartRef}
        dataSource={populationData}
        onPointClick={onPointClick}
        type="doughnut"
        palette="Soft Pastel"
        title="The Population of Continents and Regions"
      >
        <Series argumentField="region" />
        <Size height={350} />
        <Tooltip
          enabled={false}
          format="millions"
          customizeTooltip={customizeTooltip}
        />
        <Legend visible={false} />
      </PieChart>
      <div className="controls-pane">
        <SelectBox
          width={250}
          dataSource={populationData}
          inputAttr={regionLabel}
          displayExpr="region"
          valueExpr="region"
          placeholder="Choose region"
          value={selectedRegion}
          onValueChanged={onRegionChanged}
        />
      </div>
    </React.Fragment>
  );
}

export default App;
