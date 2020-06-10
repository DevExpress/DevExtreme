import React from 'react';
import PieChart, {
  Series,
  Label,
  Legend,
  Connector
} from 'devextreme-react/pie-chart';

function PieChartComponent({ data = [] }) {
  return (
    <PieChart id="gdp-sectors"
      dataSource={data}
      animation={false}
    >
      <Series
        argumentField="name"
        valueField="value">
        <Label
          visible={true}
          customizeText={customizeText}
        >
          <Connector
            visible={true}
            width={1}
          ></Connector>
        </Label>
      </Series>
      <Legend visible={false}></Legend>
    </PieChart>
  );
}

function customizeText(pointInfo) {
  return `${pointInfo.argument[0].toUpperCase()}${
    pointInfo.argument.slice(1)
  }: $${pointInfo.value}M`;
}

export default PieChartComponent;
