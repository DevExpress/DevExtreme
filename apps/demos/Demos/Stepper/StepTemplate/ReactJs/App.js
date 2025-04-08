import React from 'react';
import Stepper from 'devextreme-react/stepper';
import { steps } from './data.js';
import CustomStepShape from './CustomStepShape.js';
import TitleOnly from './TitleOnly.js';
import IconOnly from './IconOnly.js';

export default function App() {
  return (
    <React.Fragment>
      <div className="stepper-label">Custom Step Shape</div>
      <Stepper
        id="customStepShape"
        dataSource={steps}
        defaultSelectedIndex={2}
        linear={false}
        itemRender={CustomStepShape}
      />
      <div className="stepper-label">Title Only</div>
      <Stepper
        id="titleOnly"
        dataSource={steps}
        defaultSelectedIndex={2}
        linear={false}
        itemRender={TitleOnly}
      />
      <div className="stepper-label">Icon Only</div>
      <Stepper
        id="iconOnly"
        dataSource={steps}
        defaultSelectedIndex={2}
        linear={false}
        itemRender={IconOnly}
      />
    </React.Fragment>
  );
}
