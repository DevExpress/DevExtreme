import React, { useCallback, useState } from 'react';
import { BarGauge, Label } from 'devextreme-react/bar-gauge';
import { CheckBox } from 'devextreme-react/check-box';
import { products } from './data.js';

const format = {
  type: 'fixedPoint',
  precision: 0,
};
function App() {
  const [productsActivity, setProductsActivity] = useState(products.map((p) => p.active));
  const [values, setValues] = useState(products.map((p) => p.count));
  const getValueChangedHandler = useCallback(
    (productIndex) => (e) => {
      const updatedProductsActivity = [...productsActivity];
      updatedProductsActivity[productIndex] = e.value;
      setProductsActivity(updatedProductsActivity);
      setValues(
        products
          .map((p, i) => (updatedProductsActivity[i] ? p.count : null))
          .filter((c) => c !== null),
      );
    },
    [productsActivity, setProductsActivity, setValues],
  );
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
          values={values}
        >
          <Label format={format} />
        </BarGauge>
        <div id="panel">
          {productsActivity.map((p, i) => (
            <CheckBox
              key={i}
              text={products[i].name}
              value={p}
              onValueChanged={getValueChangedHandler(i)}
            ></CheckBox>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;
