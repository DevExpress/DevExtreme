import React from 'react';
import { BarGauge, Label } from 'devextreme-react/bar-gauge';
import { SelectBox } from 'devextreme-react/select-box';
import { colors, colorLabel } from './data.js';

const palette = ['#ff0000', '#00ff00', '#0000ff'];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      basis: this.getBasicColors(colors[0].code),
      currentColor: colors[0].code,
    };

    this.onSelectionChanged = ({ selectedItem: { code } }) => {
      this.setState({
        currentColor: code,
        basis: this.getBasicColors(code),
      });
    };
  }

  render() {
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
            values={this.state.basis}
          >
            <Label visible={false} />
          </BarGauge>
          <div className="action-container">
            <SelectBox
              id="select-color"
              width={150}
              inputAttr={colorLabel}
              dataSource={colors}
              value={this.state.currentColor}
              displayExpr="name"
              valueExpr="code"
              onSelectionChanged={this.onSelectionChanged}
            />
            <div className="color-box"
              style={{ backgroundColor: this.state.currentColor }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  getBasicColors(value) {
    const code = Number(`0x${value.slice(1)}`);
    return [
      (code >> 16) & 0xff,
      (code >> 8) & 0xff,
      code & 0xff,
    ];
  }
}

export default App;
