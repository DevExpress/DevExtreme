import {
  forwardRef,
  useContext,
} from 'react';
import { useId } from '../../internal/hooks';
import { RadioGroupContext } from '../radio-group/radio-group-context';
import { CoreBoundRadioButton, UncontrolledRadioButton } from './radio-button-hocs';
import { RadioButtonInternal } from './radio-button-internal';
import {
  RadioButtonProps,
} from './types';

//* Component={"name":"RadioButton", "jQueryRegistered":true, "hasApiMethod":true}
const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (props, inputRef) => {
    const radioGroupCore = useContext(RadioGroupContext);
    const inputId = useId('radio-button');

    const RadioButtonComponent = props.checked === undefined
      ? UncontrolledRadioButton
      : RadioButtonInternal;
    if (radioGroupCore) {
      return (
        <CoreBoundRadioButton
          radioGroupCore={radioGroupCore}
          inputId={inputId}
          inputRef={inputRef}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        />
      );
    }
    return (
      <RadioButtonComponent
        inputId={inputId}
        inputRef={inputRef}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    );
  },
);

RadioButton.displayName = 'RadioButton';

export { RadioButton };
