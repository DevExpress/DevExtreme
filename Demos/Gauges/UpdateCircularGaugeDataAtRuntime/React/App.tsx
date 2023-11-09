import React from 'react';
import {
  CircularGauge, Scale, Label, RangeContainer, Range, Tooltip, Title, Font,
} from 'devextreme-react/circular-gauge';
import { SelectBox } from 'devextreme-react/select-box';
import { dataSource, seasonLabel } from './data.ts';

function customizeText({ valueText }) {
  return `${valueText} °C`;
}

function App() {
  const [value, setValue] = React.useState(dataSource[0].mean);
  const [subvalues, setSubvalues] = React.useState([dataSource[0].min, dataSource[0].max]);

  const onSelectionChanged = React.useCallback(({ selectedItem }) => {
    setValue(selectedItem.mean);
    setSubvalues([selectedItem.min, selectedItem.max]);
  }, [setValue, setSubvalues]);

  return (
    <div id="gauge-demo">
      <CircularGauge
        id="gauge"
        value={value}
        subvalues={subvalues}
      >
        <Scale startValue={10} endValue={40} tickInterval={5}>
          <Label customizeText={customizeText} />
        </Scale>
        <RangeContainer>
          <Range startValue={10} endValue={20} color="#0077BE" />
          <Range startValue={20} endValue={30} color="#E6E200" />
          <Range startValue={30} endValue={40} color="#77DD77" />
        </RangeContainer>
        <Tooltip enabled={true} />
        <Title text="Temperature in the Greenhouse">
          <Font size={28} />
        </Title>
      </CircularGauge>
      <SelectBox
        id="seasons"
        width={150}
        inputAttr={seasonLabel}
        dataSource={dataSource}
        defaultValue={dataSource[0]}
        displayExpr="name"
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  );
}

export default App;
