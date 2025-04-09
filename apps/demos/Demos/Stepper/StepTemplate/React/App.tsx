import React from 'react';
import Stepper from 'devextreme-react/stepper';

import { steps } from './data.ts';
import CustomStepShape from './CustomStepShape.tsx';
import TitleOnly from './TitleOnly.tsx';
import IconOnly from './IconOnly.tsx';

export default function App() {
  return (
    <>
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
    </>
  );
}
