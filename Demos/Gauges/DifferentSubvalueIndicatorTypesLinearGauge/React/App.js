import React from 'react';
import { LinearGauge, Scale, Label, SubvalueIndicator } from 'devextreme-react/linear-gauge';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="long-title">
          <h3>Current Price (with Min and Max)</h3>
        </div>
        <div id="gauge-demo">
          <LinearGauge
            id="c1"
            value={24}
            subvalues={[18, 43]}
          >
            <Scale
              startValue={10}
              endValue={50}
              tickInterval={10}
            >
              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <SubvalueIndicator
              type="rectangle"
              color="#9B870C"
            ></SubvalueIndicator>
          </LinearGauge>
          <LinearGauge
            id="c2"
            value={38}
            subvalues={[18, 43]}
          >
            <Scale
              startValue={10}
              endValue={50}
              tickInterval={10}
            >
              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <SubvalueIndicator
              type="rhombus"
              color="#779ECB"
            ></SubvalueIndicator>
          </LinearGauge>
          <LinearGauge
            id="c3"
            value={21}
            subvalues={[18, 43]}
          >
            <Scale
              startValue={10}
              endValue={50}
              tickInterval={10}
            >
              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <SubvalueIndicator
              type="circle"
              color="#8FBC8F"
            ></SubvalueIndicator>
          </LinearGauge>
          <LinearGauge
            id="c4"
            value={42}
            subvalues={[18, 43]}
          >
            <Scale
              startValue={10}
              endValue={50}
              tickInterval={10}
            >
              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <SubvalueIndicator
              type="textCloud"
              color="#734F96"
            ></SubvalueIndicator>
          </LinearGauge>
          <LinearGauge id="c5"
            value={28}
            subvalues={[18, 43]}
          >
            <Scale
              startValue={10}
              endValue={50}
              tickInterval={10}
            >
              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <SubvalueIndicator
              type="triangleMarker"
              color="#f05b41"
            ></SubvalueIndicator>
          </LinearGauge>
        </div>
      </div>
    );
  }

  customizeText({ valueText }) {
    return `$${valueText}`;
  }
}

export default App;
