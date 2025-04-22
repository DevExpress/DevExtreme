import React from 'react';
import { Stepper, Item } from 'devextreme-react/stepper';
import { steps } from './data.js';

export default function Steppers({
  orientation, navigationMode, selectOnFocus, rtlMode,
}) {
  return (
    <React.Fragment>
      <div className="stepper-wrapper">
        <div
          id="iconsLabel"
          className="stepper-label"
        >
          Icons and Labels
        </div>
        <Stepper
          id="icons"
          elementAttr={{ 'aria-labelledby': 'iconsLabel' }}
          defaultSelectedIndex={2}
          orientation={orientation}
          linear={navigationMode}
          selectOnFocus={selectOnFocus}
          rtlEnabled={rtlMode}
        >
          <Item
            text={steps[0].text}
            label={steps[0].label}
            icon={steps[0].icon}
          />
          <Item
            text={steps[1].text}
            label={steps[1].label}
            icon={steps[1].icon}
          />
          <Item
            text={steps[2].text}
            label={steps[2].label}
            icon={steps[2].icon}
            optional={steps[2].optional}
          />
          <Item
            text={steps[3].text}
            label={steps[3].label}
            icon={steps[3].icon}
          />
          <Item
            text={steps[4].text}
            label={steps[4].label}
            icon={steps[4].icon}
          />
        </Stepper>
      </div>
      <div className="stepper-wrapper">
        <div
          id="numbersLabel"
          className="stepper-label"
        >
          Numbers and Labels
        </div>
        <Stepper
          id="numbers"
          elementAttr={{ 'aria-labelledby': 'numbersLabel' }}
          defaultSelectedIndex={2}
          orientation={orientation}
          linear={navigationMode}
          selectOnFocus={selectOnFocus}
          rtlEnabled={rtlMode}
        >
          <Item label={steps[0].label} />
          <Item label={steps[1].label} />
          <Item
            label={steps[2].label}
            optional={steps[2].optional}
          />
          <Item label={steps[3].label} />
          <Item label={steps[4].label} />
        </Stepper>
      </div>
      <div className="stepper-wrapper">
        <div
          id="customTextLabel"
          className="stepper-label"
        >
          Custom Text
        </div>
        <Stepper
          id="customText"
          elementAttr={{ 'aria-labelledby': 'customTextLabel' }}
          defaultSelectedIndex={2}
          orientation={orientation}
          linear={navigationMode}
          selectOnFocus={selectOnFocus}
          rtlEnabled={rtlMode}
        >
          <Item text={steps[0].text} />
          <Item text={steps[1].text} />
          <Item text={steps[2].text} />
          <Item text={steps[3].text} />
          <Item text={steps[4].text} />
        </Stepper>
      </div>
    </React.Fragment>
  );
}
