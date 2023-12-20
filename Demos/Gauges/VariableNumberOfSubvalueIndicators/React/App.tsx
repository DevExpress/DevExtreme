import React, { useCallback, useState } from 'react';
import {
  LinearGauge, Scale, Label, Tooltip, Export, Title, Font,
} from 'devextreme-react/linear-gauge';
import { SelectBox, SelectBoxTypes } from 'devextreme-react/select-box';
import { dataSource, departmentLabel } from './data.ts';

function customizeText({ valueText }) {
  return `${valueText} kW`;
}

function customizeTooltip(arg: { valueText: string; index?: number; }) {
  let result = `${arg.valueText} kW`;
  if (arg.index >= 0) {
    result = `Secondary ${(arg.index + 1)}: ${result}`;
  } else {
    result = `Primary: ${result}`;
  }
  return {
    text: result,
  };
}

function App() {
  const [value, setValue] = useState(dataSource[0].primary);
  const [subvalues, setSubvalues] = useState(dataSource[0].secondary);

  const onValueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setValue(e.value.primary);
    setSubvalues(e.value.secondary);
  }, [setValue, setSubvalues]);

  return (
    <div id="gauge-demo">
      <LinearGauge
        id="gauge"
        value={value}
        subvalues={subvalues}
      >
        <Scale startValue={0} endValue={10} tickInterval={2}>
          <Label customizeText={customizeText} />
        </Scale>
        <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
        <Export enabled={true} />
        <Title text="Power of Air Conditioners in Store Departments (kW)">
          <Font size={28} />
        </Title>
      </LinearGauge>
      <SelectBox
        id="selectbox"
        dataSource={dataSource}
        inputAttr={departmentLabel}
        defaultValue={dataSource[0]}
        width={200}
        displayExpr="name"
        onValueChanged={onValueChanged}
      />
    </div>
  );
}

export default App;
