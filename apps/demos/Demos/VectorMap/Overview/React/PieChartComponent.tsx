import React from 'react';
import PieChart, {
  Series,
  Label,
  Legend,
  Connector,
  ILabelProps,
} from 'devextreme-react/pie-chart';

const customizeText: ILabelProps['customizeText'] = (pointInfo) => `${pointInfo.argument[0].toUpperCase()}${pointInfo.argument.slice(1)}: $${pointInfo.value}M`;

function PieChartComponent(props) {
  return (
    <PieChart id="gdp-sectors"
      dataSource={props.data}
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

export default PieChartComponent;
