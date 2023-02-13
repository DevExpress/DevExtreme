/* eslint-disable react/jsx-props-no-spreading, import/exports-last */
import {
  forwardRef,
  memo,
  Ref,
} from 'react';
import { withEditor } from '../common';

import { RadioGroupInternal } from './radio-group-internal';
import type { RadioGroupProps, RadioGroupRef } from './types';

//* Component={"name":"RadioGroupInternalForwardRef", "hasApiMethod":true}
const RadioGroupInternalForwardRef = forwardRef(RadioGroupInternal);

//* Component={"name":"RadioGroupWithEditor"}
const RadioGroupWithEditor = withEditor(RadioGroupInternalForwardRef);

type RadioGroupType = <T>(p: RadioGroupProps<T> & { ref?: Ref<RadioGroupRef> }) => JSX.Element;
export const RadioGroup = memo(forwardRef(RadioGroupWithEditor)) as RadioGroupType;
