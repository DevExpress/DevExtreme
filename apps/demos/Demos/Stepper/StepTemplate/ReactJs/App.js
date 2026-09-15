import React from 'react';
import Stepper from 'devextreme-react/stepper';
import { steps } from './data.js';
import CustomStepShape from './CustomStepShape.js';
import LabelOnly from './LabelOnly.js';
import IconOnly from './IconOnly.js';

const customStepShapeElementAttr = { 'aria-labelledby': 'label-customStepShape' };
const labelOnlyElementAttr = { 'aria-labelledby': 'label-labelOnly' };
const iconOnlyElementAttr = { 'aria-labelledby': 'label-iconOnly' };
export default function App() {
  return (
    <>
      <div
        id="label-customStepShape"
        className="stepper-label"
      >
        Custom Step Shape
      </div>
      <Stepper
        id="customStepShape"
        elementAttr={customStepShapeElementAttr}
        dataSource={steps}
        defaultSelectedIndex={2}
        linear={false}
        itemRender={CustomStepShape}
      />
      <div
        id="label-labelOnly"
        className="stepper-label"
      >
        Label Only
      </div>
      <Stepper
        id="labelOnly"
        elementAttr={labelOnlyElementAttr}
        dataSource={steps}
        defaultSelectedIndex={2}
        linear={false}
        itemRender={LabelOnly}
      />
      <div
        id="label-iconOnly"
        className="stepper-label"
      >
        Icon Only
      </div>
      <Stepper
        id="iconOnly"
        elementAttr={iconOnlyElementAttr}
        dataSource={steps}
        defaultSelectedIndex={2}
        linear={false}
        itemRender={IconOnly}
      />
    </>
  );
}
