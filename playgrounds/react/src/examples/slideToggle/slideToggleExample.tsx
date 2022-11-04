import React from 'react';

import '@devexpress/react/slideToggle.css';
import {ControlledSlideToggleExample} from './controlledSlideToggleExample';
import {CustomizationExample} from './customizationExample';
import {UncontrolledSlideToggleExample} from './uncontrolledSlideToggleExample';

function SlideToggleExample() {
  return <React.Fragment>
    <ControlledSlideToggleExample/>
    <UncontrolledSlideToggleExample/>
    <CustomizationExample/>
  </React.Fragment>
}

export {
  SlideToggleExample,
}
