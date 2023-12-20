import React, { useCallback, useRef } from 'react';
import Chart, { Series, Label, Legend } from 'devextreme-react/chart';
import PieChart, { Series as PieSeries, Label as PieLabel, Connector } from 'devextreme-react/pie-chart';
import { Button } from 'devextreme-react/button';
import { exportWidgets } from 'devextreme/viz/export';
import { allMedals, goldMedals } from './data.ts';

function App() {
  const chartRef = useRef(null);
  const pieChartRef = useRef(null);

  const onClick = useCallback(() => {
    exportWidgets([[chartRef.current.instance, pieChartRef.current.instance]], {
      fileName: 'chart',
      format: 'PNG',
    });
  }, []);

  return (
    <div id="chart-demo">
      <div className="charts">
        <Chart
          id="chart"
          ref={chartRef}
          dataSource={goldMedals}
          rotated={true}
          title="Olympic Gold Medals in 2008"
        >
          <Series
            type="bar"
            argumentField="country"
            valueField="medals"
            color="#f3c40b"
          >
            <Label visible={true} />
          </Series>
          <Legend visible={false} />
        </Chart>
        <PieChart
          id="pieChart"
          ref={pieChartRef}
          dataSource={allMedals}
          palette="Harmony Light"
          title={'Total Olympic Medals\n in 2008'}
        >
          <PieSeries
            argumentField="country"
            valueField="medals"
          >
            <PieLabel visible={true}>
              <Connector visible={true} />
            </PieLabel>
          </PieSeries>
        </PieChart>
      </div>
      <div className="controls-pane">
        <Button
          id="export"
          width={145}
          icon="export"
          text="Export"
          type="default"
          onClick={onClick}
        />
      </div>
    </div>
  );
}

export default App;
