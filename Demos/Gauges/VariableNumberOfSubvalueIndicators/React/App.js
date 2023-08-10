import React from 'react';
import {
  LinearGauge, Scale, Label, Tooltip, Export, Title, Font,
} from 'devextreme-react/linear-gauge';
import { SelectBox } from 'devextreme-react/select-box';
import { dataSource, departmentLabel } from './data.js';

function customizeText({ valueText }) {
  return `${valueText} kW`;
}

function customizeTooltip(arg) {
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
  const [value, setValue] = React.useState(dataSource[0].primary);
  const [subvalues, setSubvalues] = React.useState(dataSource[0].secondary);

  const onValueChanged = React.useCallback(({ newValue }) => {
    setValue(newValue.primary);
    setSubvalues(newValue.secondary);
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
