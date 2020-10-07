import React from 'react';
import { dataSource, getAnnotationSources } from './data.js';
import TooltipTemplate from './TooltipTemplate.js';

import PieChart, {
  CommonAnnotationSettings,
  Annotation,
  Image,
  Border,
  Shadow,
  Series,
  Label,
  Font,
  Tooltip,
  Legend
} from 'devextreme-react/pie-chart';

const annotationSources = getAnnotationSources();

class App extends React.Component {
  render() {
    return (
      <PieChart
        id="pie"
        palette="Vintage"
        dataSource={dataSource}
        title="Ice Hockey World Championship Gold Medal Winners"
      >
        <CommonAnnotationSettings
          type="image"
          color="transparent"
          paddingLeftRight={0}
          paddingTopBottom={0}
          tooltipRender={TooltipTemplate}
        >
          <Image
            height={60}
            width={90}
          />
          <Border color="transparent" />
        </CommonAnnotationSettings>
        {
          annotationSources.map(item => (
            <Annotation
              key={item.country}
              argument={item.country}
              data={item.data}
              location={item.location}
              offsetX={item.offsetX}
              offsetY={item.offsetY}
              color={item.color}>
              <Image url={item.image} />
              <Border color={item.borderColor} />
              <Shadow opacity={item.shadowOpacity} />
            </Annotation>
          ))
        }
        <Series
          argumentField="country"
          valueField="gold">
          <Label
            visible={true}
            position="inside"
            radialOffset={83}
            backgroundColor="transparent">
            <Font
              size={16}
              weight={600}
            />
          </Label>
        </Series>
        <Tooltip
          paddingLeftRight={12}
          paddingTopBottom={10}
        />
        <Legend visible={false} />
      </PieChart>
    );
  }
}

export default App;
