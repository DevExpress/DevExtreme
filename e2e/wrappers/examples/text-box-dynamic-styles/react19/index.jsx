import React, { useState, useCallback } from "react";
import { TextBox as DxTextBox } from "devextreme-react/text-box";

const colors = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 206, 86)',
  'rgb(75, 192, 192)',
  'rgb(153, 102, 255)',
];
let colorIndex = 0;

export default function TextBoxDynamicStyles() {
  const [value, setValue] = useState('');
  const [enableInlineStyles, setEnableInlineStyles] = useState(false);

  const onValueChanged = useCallback((e) => {
    setValue(e.value);
    setEnableInlineStyles(true);
  }, []);

  const getStyle = () => {
    if (enableInlineStyles) {
      const changedStyle = {
        backgroundColor: colors[colorIndex],
      };

      colorIndex = (colorIndex + 1) % colors.length;
      return changedStyle;
    }
    return undefined;
  };
  return (
    <div>
      <DxTextBox
        value={value}
        onValueChanged={onValueChanged}
        style={getStyle()}
      />
    </div>
  );
};

