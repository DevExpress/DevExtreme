import * as React from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import { TextBox } from 'devextreme-react/text-box';

const Field = (props) => {
  const label = props.data?.text ?? "";
  debugger
  return <TextBox value={label} placeholder="Search..." />;
};

const items = [
  {
    value: 0,
    text: "Item 0",
  },
];

const items2 = [
  {
    value: 0,
    text: "Item 0",
  },
];

export default (): React.ReactElement | null => {

  const [value, setValue] = React.useState<number | null>(0);

  const [switched, setSwitched] = React.useState(false);
  const onSwitch = () => {
    setValue(null);
    setSwitched((prev) => !prev);
  };
  const onReset = () => setValue(null);

  return (
  <div>
    <button type="button" onClick={onSwitch}>
      Reset and switch DS
    </button>
    <button type="button" onClick={onReset}>
      Reset Value
    </button>
    <SelectBox
      dataSource={switched ? items2 : items}
      displayExpr="text"
      valueExpr="value"
      fieldComponent={Field}
      value={value}
      showClearButton={true}
      onValueChange={setValue}
    />
  </div>
  );
};
