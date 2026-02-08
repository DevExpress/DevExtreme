import React, { useCallback, useState } from 'react';
import { BarGauge, Label } from 'devextreme-react/bar-gauge';
import { SelectBox } from 'devextreme-react/select-box';
import { colors, colorLabel } from './data.js';

const palette = ['#ff0000', '#00ff00', '#0000ff'];
function getBasicColors(value) {
  const code = Number(`0x${value.slice(1)}`);
  return [(code >> 16) & 0xff, (code >> 8) & 0xff, code & 0xff];
}
function App() {
  const [basis, setBasis] = useState(getBasicColors(colors[0].code));
  const [currentColor, setCurrentColor] = useState(colors[0].code);
  const onSelectionChanged = useCallback(
    ({ selectedItem: { code } }) => {
      setCurrentColor(code);
      setBasis(getBasicColors(code));
    },
    [setCurrentColor, setBasis],
  );
  return (
    <div>
      <div className="long-title">
        <h3>Colors Representation via Basic Colors</h3>
      </div>
      <div id="gauge-demo">
        <BarGauge
          id="gauge"
          startValue={0}
          endValue={255}
          palette={palette}
          values={basis}
        >
          <Label visible={false} />
        </BarGauge>
        <div className="action-container">
          <SelectBox
            id="select-color"
            width={150}
            inputAttr={colorLabel}
            dataSource={colors}
            value={currentColor}
            displayExpr="name"
            valueExpr="code"
            onSelectionChanged={onSelectionChanged}
          />
          <div
            className="color-box"
            style={{ backgroundColor: currentColor }}
          ></div>
        </div>
      </div>
    </div>
  );
}
export default App;
