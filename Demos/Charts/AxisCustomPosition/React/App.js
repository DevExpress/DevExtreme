import React from 'react';
import NumberBox from 'devextreme-react/number-box';
import {
  Chart,
  CommonSeriesSettings,
  Series,
  Point,
  ArgumentAxis,
  ValueAxis,
  Legend,
} from 'devextreme-react/chart';
import { generateDataSource, customPositionLabel, offsetLabel } from './data.js';

const dataSource = generateDataSource();
const defaultVisualRange = [-20, 20];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      argumentCustomPosition: 0,
      argumentOffset: 0,
      valueCustomPosition: 0,
      valueOffset: 0,
    };
    this.changeArgumentPosition = (e) => {
      this.setState({ argumentCustomPosition: e.value });
    };
    this.changeArgumentOffset = (e) => {
      this.setState({ argumentOffset: e.value });
    };
    this.changeValuePosition = (e) => {
      this.setState({ valueCustomPosition: e.value });
    };
    this.changeValueOffset = (e) => {
      this.setState({ valueOffset: e.value });
    };
  }

  render() {
    const {
      argumentCustomPosition,
      argumentOffset,
      valueCustomPosition,
      valueOffset,
    } = this.state;
    return (
      <div>
        <Chart
          id="chart"
          dataSource={dataSource}
        >
          <CommonSeriesSettings type='scatter' />
          <Series argumentField='x1' valueField='y1' />
          <Series argumentField='x2' valueField='y2'>
            <Point symbol='triangleDown' />
          </Series>
          <ArgumentAxis
            defaultVisualRange={defaultVisualRange}
            customPosition={argumentCustomPosition}
            offset={argumentOffset}
          />
          <ValueAxis
            defaultVisualRange={defaultVisualRange}
            customPosition={valueCustomPosition}
            offset={valueOffset}
            endOnTick={false}
          />
          <Legend visible={false} />
        </Chart>
        <div className='options'>
          <div className='caption'>Options</div>
          <div className="common">
            <div className='block left'>
              <span>Argument Axis</span>
              <div className='option'>
                <span>Custom position:</span>
                <NumberBox
                  value={argumentCustomPosition}
                  showSpinButtons={true}
                  inputAttr={customPositionLabel}
                  onValueChanged={this.changeArgumentPosition} />
              </div>
              <div className='option'>
                <span>Offset:</span>
                <NumberBox
                  value={argumentOffset}
                  showSpinButtons={true}
                  inputAttr={offsetLabel}
                  onValueChanged={this.changeArgumentOffset} />
              </div>
            </div>
            <div className='block right'>
              <span>Value Axis</span>
              <div className='option'>
                <span>Custom position:</span>
                <NumberBox
                  value={valueCustomPosition}
                  showSpinButtons={true}
                  inputAttr={customPositionLabel}
                  onValueChanged={this.changeValuePosition} />
              </div>
              <div className='option'>
                <span>Offset:</span>
                <NumberBox
                  value={valueOffset}
                  showSpinButtons={true}
                  inputAttr={offsetLabel}
                  onValueChanged={this.changeValueOffset} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
