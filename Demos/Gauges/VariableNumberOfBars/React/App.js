import React from 'react';
import { BarGauge, Label } from 'devextreme-react/bar-gauge';
import { CheckBox } from 'devextreme-react/check-box';
import { products } from './data.js';

const format = {
  type: 'fixedPoint',
  precision: 0,
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productsActivity: products.map((p) => p.active),
      values: products.map((p) => p.count),
    };

    this.getValueChangedHandler = (productIndex) => (e) => {
      const productsActivity = this.state.productsActivity.slice();
      productsActivity[productIndex] = e.value;
      this.setState({
        productsActivity,
        values: products
          .map((p, i) => (productsActivity[i] ? p.count : null))
          .filter((c) => c !== null),
      });
    };
  }

  render() {
    return (
      <div>
        <div className="long-title">
          <h3>Sampling by Goods</h3>
        </div>
        <div id="gauge-demo">
          <BarGauge
            id="gauge"
            startValue={0}
            endValue={50}
            values={this.state.values}
          >
            <Label format={format} />
          </BarGauge>
          <div id="panel">
            {this.state.productsActivity.map((p, i) => <CheckBox
              key={i}
              text={products[i].name}
              value={p}
              onValueChanged={this.getValueChangedHandler(i)}
            ></CheckBox>)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
