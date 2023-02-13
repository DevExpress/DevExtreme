import { HookContainer } from '@devextreme/runtime/inferno-hooks';
import { forwardRef} from '@devextreme/runtime/inferno-hooks';
import { RadioGroupInternal } from './radio-group-internal';
import { withEditor } from '../common';
import '@devextreme/styles/src/radio-group/radio-group.scss';
const ReactRadioGroupInternalWrapper = RadioGroupInternal;
function HooksRadioGroupInternalWrapper(props, ref) {
    return (<HookContainer renderFn={ReactRadioGroupInternalWrapper} renderProps={props} renderRef={ref}/>);
}
const RadRadioGroupInternalForwardRef = forwardRef(HooksRadioGroupInternalWrapper);

const RadioGroupWithEditor = withEditor(RadRadioGroupInternalForwardRef);

function HooksRadioGroupWithEditor(props, ref) {
  return (<HookContainer renderFn={RadioGroupWithEditor} renderProps={props} renderRef={ref}/>);
}

export const RadioGroup = forwardRef(HooksRadioGroupWithEditor);
