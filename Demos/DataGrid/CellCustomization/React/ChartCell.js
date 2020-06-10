import React from 'react';
import Sparkline, { Size, Tooltip } from 'devextreme-react/sparkline';

export default function ChartCell(cellData) {
  return (
    <div className="chart-cell">
      <Sparkline
        dataSource={cellData.data.dayClose}
        argumentField="date"
        valueField="close"
        type="line"
        showMinMax={true}
        minColor="#f00"
        maxColor="#2ab71b"
        pointSize={6}>
        <Size width={290} height={40} />
        <Tooltip enabled={false} />
      </Sparkline>
    </div>
  );
}
