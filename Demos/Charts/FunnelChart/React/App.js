import React from 'react';
import { dataSource } from './data.js';

import Funnel, {
  Title,
  Margin,
  Export,
  Tooltip,
  Item,
  Border,
  Label
} from 'devextreme-react/funnel';

function App() {
  return (
    <Funnel id="funnel"
      dataSource={dataSource}
      palette="Soft Pastel"
      argumentField="argument"
      valueField="value"
    >
      <Title text="Website Conversions">
        <Margin bottom={30} />
      </Title>
      <Export enabled={true} />
      <Tooltip enabled={true} format="fixedPoint" />
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

function formatLabel(arg) {
  return `<span class="label">${arg.percentText}</span><br/>${arg.item.argument}`;
}

export default App;
