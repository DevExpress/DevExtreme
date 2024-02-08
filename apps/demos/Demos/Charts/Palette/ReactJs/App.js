import React, { useCallback, useState } from 'react';
import PieChart, { Series, Legend } from 'devextreme-react/pie-chart';
import SelectBox from 'devextreme-react/select-box';
import { getPalette } from 'devextreme/viz/palette';
import {
  paletteCollection,
  paletteExtensionModes,
  dataSource,
  paletteLabel,
  paletteExtensionLabel,
} from './data.js';

function App() {
  const [palette, setPalette] = useState(paletteCollection[0]);
  const [extensionMode, setExtensionMode] = useState(paletteExtensionModes[1]);
  const handlePaletteChange = useCallback(
    (e) => {
      setPalette(e.value);
    },
    [setPalette],
  );
  const handleExtensionModeChange = useCallback(
    (e) => {
      setExtensionMode(e.value);
    },
    [setExtensionMode],
  );
  return (
    <React.Fragment>
      <div className="flex-container">
        <PieChart
          id="pie"
          dataSource={dataSource}
          palette={palette}
          paletteExtensionMode={extensionMode}
        >
          <Legend visible={false} />
          <Series />
        </PieChart>

        <div className="palette-container flex-block">
          {getPalette(palette).simpleSet.map((color) => (
            <div
              className="palette-item"
              style={{ backgroundColor: color }}
              key={color}
            />
          ))}
        </div>
      </div>

      <div className="options">
        <div className="caption">Options</div>
        <div className="options-container">
          <div className="option">
            <span>Palette </span>
            <SelectBox
              items={paletteCollection}
              inputAttr={paletteLabel}
              defaultValue={palette}
              onValueChanged={handlePaletteChange}
            />
          </div>
          <div className="option">
            <span>Palette Extension Mode </span>
            <SelectBox
              items={paletteExtensionModes}
              inputAttr={paletteExtensionLabel}
              defaultValue={extensionMode}
              onValueChanged={handleExtensionModeChange}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default App;
