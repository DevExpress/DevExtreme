import React from 'react';

import PieChart, {
  Series,
  Legend
} from 'devextreme-react/pie-chart';
import SelectBox from 'devextreme-react/select-box';
import { paletteCollection, paletteExtensionModes, dataSource } from './data.js';
import palette from 'devextreme/viz/palette';
const { getPalette } = palette;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      palette: paletteCollection[0],
      extensionMode: paletteExtensionModes[1]
    };

    this.setPalette = this.setPalette.bind(this);
    this.setExtensionMode = this.setExtensionMode.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex-container">
          <PieChart
            id="pie"
            dataSource={dataSource}
            palette={this.state.palette}
            paletteExtensionMode={this.state.extensionMode.toLowerCase()}
          >
            <Legend visible={false} />
            <Series />
          </PieChart>

          <div className="palette-container flex-block">
            {getPalette(this.state.palette).simpleSet.map(color => (
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
          <div className="option">
            <span>Palette </span>
            <SelectBox
              items={paletteCollection}
              defaultValue={this.state.palette}
              onValueChanged={this.setPalette}
            />
          </div>
          &nbsp;
          <div className="option">
            <span>Palette Extension Mode </span>
            <SelectBox
              items={paletteExtensionModes}
              defaultValue={this.state.extensionMode}
              onValueChanged={this.setExtensionMode}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  setPalette(e) {
    this.setState({
      palette: e.value
    });
  }

  setExtensionMode(e) {
    this.setState({
      extensionMode: e.value
    });
  }
}

export default App;
