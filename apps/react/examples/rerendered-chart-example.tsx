import * as React from 'react';
import DataSource from 'devextreme/data/data_source';

import {
  Chart,
  ArgumentAxis,
  Label,
  Series,
} from 'devextreme-react/chart';

const data = [
  { date: '2017-03-24T21:00:00.000Z', minTemp: 2, maxTemp: 5 },
  { date: '2017-03-25T21:00:00.000Z', minTemp: 0, maxTemp: 7 },
  { date: '2017-03-26T21:00:00.000Z', minTemp: 8, maxTemp: 13 },
  { date: '2017-03-27T21:00:00.000Z', minTemp: 5, maxTemp: 10 },
  { date: '2017-03-28T21:00:00.000Z', minTemp: 4, maxTemp: 7 },
  { date: '2017-03-29T21:00:00.000Z', minTemp: 1, maxTemp: 2 },
  { date: '2017-03-30T21:00:00.000Z', minTemp: 2, maxTemp: 3 },
  { date: '2017-03-31T21:00:00.000Z', minTemp: 3, maxTemp: 7 },
  { date: '2017-04-01T21:00:00.000Z', minTemp: 3, maxTemp: 10 },
  { date: '2017-04-02T21:00:00.000Z', minTemp: 3, maxTemp: 7 },
  { date: '2017-04-03T21:00:00.000Z', minTemp: 7, maxTemp: 10 },
  { date: '2017-04-04T21:00:00.000Z', minTemp: 5, maxTemp: 10 },
  { date: '2017-04-05T21:00:00.000Z', minTemp: 5, maxTemp: 6 },
  { date: '2017-04-06T21:00:00.000Z', minTemp: 0, maxTemp: 4 },
  { date: '2017-04-07T21:00:00.000Z', minTemp: 2, maxTemp: 11 },
  { date: '2017-04-08T21:00:00.000Z', minTemp: 5, maxTemp: 13 },
  { date: '2017-04-09T21:00:00.000Z', minTemp: 11, maxTemp: 18 },
  { date: '2017-04-10T21:00:00.000Z', minTemp: 8, maxTemp: 13 },
  { date: '2017-04-11T21:00:00.000Z', minTemp: 6, maxTemp: 10 },
  { date: '2017-04-12T21:00:00.000Z', minTemp: 5, maxTemp: 8 },
  { date: '2017-04-13T21:00:00.000Z', minTemp: 3, maxTemp: 10 },
  { date: '2017-04-14T21:00:00.000Z', minTemp: 6, maxTemp: 11 },
  { date: '2017-04-15T21:00:00.000Z', minTemp: 13, maxTemp: 17 },
  { date: '2017-04-16T21:00:00.000Z', minTemp: 6, maxTemp: 10 },
  { date: '2017-04-17T21:00:00.000Z', minTemp: 3, maxTemp: 8 },
  { date: '2017-04-18T21:00:00.000Z', minTemp: 7, maxTemp: 12 },
  { date: '2017-04-19T21:00:00.000Z', minTemp: 4, maxTemp: 7 },
  { date: '2017-04-20T21:00:00.000Z', minTemp: 6, maxTemp: 8 },
  { date: '2017-04-21T21:00:00.000Z', minTemp: 4, maxTemp: 10 },
  { date: '2017-04-22T21:00:00.000Z', minTemp: 4, maxTemp: 15 },
  { date: '2017-04-23T21:00:00.000Z', minTemp: 5, maxTemp: 7 },
  { date: '2017-04-24T21:00:00.000Z', minTemp: 5, maxTemp: 7 },
  { date: '2017-04-25T21:00:00.000Z', minTemp: 8, maxTemp: 11 },
  { date: '2017-04-26T21:00:00.000Z', minTemp: 9, maxTemp: 17 },
  { date: '2017-04-27T21:00:00.000Z', minTemp: 10, maxTemp: 15 },
  { date: '2017-04-28T21:00:00.000Z', minTemp: 8, maxTemp: 16 },
  { date: '2017-04-29T21:00:00.000Z', minTemp: 3, maxTemp: 5 },
  { date: '2017-04-30T21:00:00.000Z', minTemp: 8, maxTemp: 11 },
  { date: '2017-05-01T21:00:00.000Z', minTemp: 8, maxTemp: 9 },
  { date: '2017-05-02T21:00:00.000Z', minTemp: 5, maxTemp: 12 },
  { date: '2017-05-03T21:00:00.000Z', minTemp: 5, maxTemp: 7 },
  { date: '2017-05-04T21:00:00.000Z', minTemp: 6, maxTemp: 7 },
  { date: '2017-05-05T21:00:00.000Z', minTemp: 5, maxTemp: 7 },
  { date: '2017-05-06T21:00:00.000Z', minTemp: 3, maxTemp: 8 },
];

function LabelTemplate(value) {
  console.log(value.valueText);
  return (
    <svg overflow="visible">
      <text className="template-text" x="30" y="59" textAnchor="middle">
        {value.valueText}
      </text>
    </svg>
  );
}

const chartDataSource = new DataSource({
  store: [],
  paginate: false,
});

let handleClick = (): void => {
  const items = chartDataSource.items();
  if (!items.length) {
    const dataSource = chartDataSource;

    setTimeout(() => {
      const dataFrame = data.map((item) => ({
        date: new Date(item.date),
        minTemp: item.minTemp,
        maxTemp: item.maxTemp,
      }));

      const componentStorage = dataSource.store();
      dataFrame.forEach((item) => componentStorage.insert(item));
      dataSource.reload();
    });
  }
};

class NewChartExample extends React.Component {
  constructor(props) {
    super(props);

    handleClick = handleClick.bind(this);
  }

  render(): React.ReactNode {
    return (
      <>
        <Chart id="chart" dataSource={chartDataSource}>
          <Series argumentField="date" valueField="minTemp" />
          <ArgumentAxis argumentType="datetime">
            <Label render={LabelTemplate} />
          </ArgumentAxis>
        </Chart>
        <button onClick={handleClick}>Click Me</button>
      </>
    );
  }
}

export default NewChartExample;
