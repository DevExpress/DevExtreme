import React from 'react';
import {
  Chart,
  Title,
  CommonSeriesSettings,
  Series,
  Legend,
  ArgumentAxis,
  ValueAxis,
  CommonAnnotationSettings,
  Font,
  Image,
  Annotation,
} from 'devextreme-react/chart';
import { dataSource, annotationSources } from './data.js';

const customizeTooltip = (annotation) => ({
  html: `<div class='tooltip'>${annotation.description}</div>`,
});
function App() {
  return (
    <Chart
      id="chart"
      dataSource={dataSource}
    >
      <Title
        text="Apple Stock Price"
        subtitle="AAPL"
      />
      <CommonSeriesSettings
        argumentField="date"
        type="line"
      />
      <Series
        valueField="close"
        name="AAPL"
      />
      <Legend visible={false} />
      <ArgumentAxis argumentType="datetime" />
      <ValueAxis position="right" />
      <CommonAnnotationSettings
        series="AAPL"
        type="image"
        customizeTooltip={customizeTooltip}
      >
        <Font
          size={16}
          weight={600}
        />
        <Image
          width={50.5}
          height={105.75}
        />
      </CommonAnnotationSettings>
      {annotationSources.map((item) => (
        <Annotation
          key={item.description}
          argument={item.date}
          type={item.type}
          text={item.text}
          description={item.description}
          paddingTopBottom={item.padding}
          offsetY={item.offset}
        >
          <Image url={item.image} />
        </Annotation>
      ))}
    </Chart>
  );
}
export default App;
