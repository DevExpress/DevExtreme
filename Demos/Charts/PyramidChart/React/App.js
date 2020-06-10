import React from 'react';
import { dataSource } from './data.js';

import Funnel, {
  Title,
  Margin,
  Tooltip,
  Item,
  Border,
  Legend,
  Label,
  Font
} from 'devextreme-react/funnel';

function App() {
  return (
    <Funnel id="pyramid"
      dataSource={dataSource}
      sortData={false}
      inverted={true}
      algorithm="dynamicHeight"
      palette="Harmony Light"
      argumentField="level"
      valueField="count"
    >
      <Title text="Team Composition">
        <Margin bottom={30} />
      </Title>
      <Tooltip enabled={true} />
      <Item>
        <Border visible={true} />
      </Item>
      <Legend visible={true} />
      <Label
        visible={true}
        horizontalAlignment="left"
        backgroundColor="none"
      >
        <Font size={16} />
      </Label>
    </Funnel>
  );
}

export default App;
