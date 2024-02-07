import React from 'react';
import Funnel, {
  Title,
  Margin,
  Export,
  Tooltip,
  Item,
  Border,
  Label,
} from 'devextreme-react/funnel';
import { dataSource } from './data.js';

const formatLabel = (arg) =>
  `<span class="label">${arg.percentText}</span><br/>${arg.item.argument}`;
function App() {
  return (
    <Funnel
      id="funnel"
      dataSource={dataSource}
      palette="Soft Pastel"
      argumentField="argument"
      valueField="value"
    >
      <Title text="Website Conversions">
        <Margin bottom={30} />
      </Title>
      <Export enabled={true} />
      <Tooltip
        enabled={true}
        format="fixedPoint"
      />
      <Item>
        <Border visible={true} />
      </Item>
      <Label
        visible={true}
        position="inside"
        backgroundColor="none"
        customizeText={formatLabel}
      />
    </Funnel>
  );
}
export default App;
