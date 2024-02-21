import React, { useCallback, useRef } from 'react';
import Chart, {
  Series,
  Legend,
  Tooltip,
  ArgumentAxis,
  Label,
  ValueAxis,
  VisualRange,
} from 'devextreme-react/chart';
import Button from 'devextreme-react/button';
import { mountains } from './data.js';

function customizeTooltipText(pointInfo) {
  return {
    text: `<span class='title'>${pointInfo.argumentText}</span><br />&nbsp;<br />System: ${pointInfo.point.data.system}<br />Height: ${pointInfo.valueText} m`,
  };
}
function customizeLabelText({ value }) {
  return `${value} m`;
}
function App() {
  const chartRef = useRef(null);
  const printChart = useCallback(() => {
    chartRef.current.instance.print();
  }, []);
  const exportChart = useCallback(() => {
    chartRef.current.instance.exportTo('Example', 'png');
  }, []);
  return (
    <React.Fragment>
      <Chart
        id="chart"
        ref={chartRef}
        dataSource={mountains}
        title="The Highest Mountains"
      >
        <Series
          argumentField="name"
          valueField="height"
          type="bar"
          color="#E55253"
        />
        <ArgumentAxis visible={true} />
        <ValueAxis>
          <VisualRange startValue={8000} />
          <Label customizeText={customizeLabelText} />
        </ValueAxis>
        <Tooltip
          enabled={true}
          customizeTooltip={customizeTooltipText}
        />
        <Legend visible={false} />
      </Chart>
      <div id="buttonGroup">
        <Button
          icon="print"
          text="Print"
          onClick={printChart}
        />
        &nbsp;
        <Button
          icon="export"
          text="Export"
          onClick={exportChart}
        />
      </div>
    </React.Fragment>
  );
}
export default App;
