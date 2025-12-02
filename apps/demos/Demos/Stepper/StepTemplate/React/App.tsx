import React from 'react';
import Stepper from 'devextreme-react/stepper';

import { steps } from './data.ts';
import CustomStepShape from './CustomStepShape.tsx';
import LabelOnly from './LabelOnly.tsx';
import IconOnly from './IconOnly.tsx';

export default function App() {
  return (
    <React.Fragment>
      <div id="label-customStepShape" className="stepper-label">Custom Step Shape</div>
      <Stepper
        id="customStepShape"
        elementAttr={{ 'aria-labelledby': 'label-customStepShape' }}
        dataSource={steps}
        defaultSelectedIndex={2}
        linear={false}
        itemRender={CustomStepShape}
      />
      <div id="label-labelOnly" className="stepper-label">Label Only</div>
      <Stepper
        id="labelOnly"
        elementAttr={{ 'aria-labelledby': 'label-labelOnly' }}
        dataSource={steps}
        defaultSelectedIndex={2}
        linear={false}
        itemRender={LabelOnly}
      />
      <div id="label-iconOnly" className="stepper-label">Icon Only</div>
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
