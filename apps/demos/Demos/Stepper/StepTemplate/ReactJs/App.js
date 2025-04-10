import React from 'react';
import Stepper from 'devextreme-react/stepper';
import { steps } from './data.js';
import CustomStepShape from './CustomStepShape.js';
import TitleOnly from './TitleOnly.js';
import IconOnly from './IconOnly.js';

export default function App() {
  return (
    <React.Fragment>
      <div
        id="label-customStepShape"
        className="stepper-label"
      >
        Custom Step Shape
      </div>
      <Stepper
        id="customStepShape"
        elementAttr={{ 'aria-labelledby': 'label-customStepShape' }}
        dataSource={steps}
        defaultSelectedIndex={2}
        linear={false}
        itemRender={CustomStepShape}
      />
      <div
        id="label-titleOnly"
        className="stepper-label"
      >
        Title Only
      </div>
      <Stepper
        id="titleOnly"
        elementAttr={{ 'aria-labelledby': 'label-titleOnly' }}
        dataSource={steps}
        defaultSelectedIndex={2}
        linear={false}
        itemRender={TitleOnly}
      />
      <div
        id="label-iconOnly"
        className="stepper-label"
      >
        Icon Only
      </div>
      <Stepper
        id="iconOnly"
        elementAttr={{ 'aria-labelledby': 'label-iconOnly' }}
        dataSource={steps}
        defaultSelectedIndex={2}
        linear={false}
        itemRender={IconOnly}
      />
    </React.Fragment>
  );
}
