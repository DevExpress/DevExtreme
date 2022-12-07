import {
  ChangeEventHandler,
  ComponentType,
  forwardRef,
  useContext,
  useId,
  useState,
} from 'react';
import { useCoreState } from '../../internal/hooks';
import { RadioGroupContext } from '../radio-group/radio-group-context';
import {
  CoreBoundRadioButtonProps,
  LabelTemplateProps,
  RadioButtonProps,
  RadioButtonRenderProps,
  RadioButtonRenderType,
  RadioTemplateProps,
} from './types';

function DefaultRadioTemplate({ checked = false }: RadioTemplateProps) {
  return <span>{checked ? '◉' : '◎'}</span>;
}

function DefaultLabelTemplate({ label }: LabelTemplateProps) {
  return <span>{label}</span>;
}

function RadioButtonInternal({
  name,
  value,
  checked,
  defaultChecked,
  onClick,
  onChange,
  label,
  radioTemplate,
  labelTemplate,
  inputId,
  inputRef,
  renderRadioComponent,
}: RadioButtonRenderProps) {
  const RadioComponent = radioTemplate || DefaultRadioTemplate;
  const LabelComponent = labelTemplate || DefaultLabelTemplate;

  return (
    <span>
      <label
        htmlFor={inputId}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          style={{ display: 'none' }}
          type="radio"
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onClick={onClick}
          onChange={onChange}
        />
        {renderRadioComponent ? (
          renderRadioComponent(RadioComponent)
        ) : (
          <RadioComponent checked={checked || false} />
        )}
        {label && <LabelComponent label={label} />}
      </label>
    </span>
  );
}

function withUncontrolledBehavior(RadioButton: RadioButtonRenderType) {
  return ({ defaultChecked, ...props }: RadioButtonRenderProps) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      setInternalChecked(event.target.checked);
      event.preventDefault();
      event.stopPropagation();
      props.onChange?.(event);
    };
    const renderRadioComponent = (
      RadioComponent: ComponentType<RadioTemplateProps>,
    ) => <RadioComponent checked={internalChecked} />;
    return (
      <RadioButton
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        onChange={handleChange}
        renderRadioComponent={renderRadioComponent}
      />
    );
  };
}

function withRadioGroup(RadioButton: RadioButtonRenderType) {
  return ({
    radioGroupCore: { dispatcher, stateManager },
    value,
    ...props
  }: CoreBoundRadioButtonProps) => {
    const coreState = useCoreState(stateManager);

    const checked = coreState.value === value;
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      event.preventDefault();
      event.stopPropagation();
      dispatcher.dispatch('updateValue', {
        value,
      });
    };

    return (
      <RadioButton
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        value={value}
        checked={checked}
        onChange={handleChange}
      />
    );
  };
}

const CoreBoundRadioButton = withRadioGroup(RadioButtonInternal);
const UncontrolledRadioButton = withUncontrolledBehavior(RadioButtonInternal);

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (props, inputRef) => {
    const radioGroupCore = useContext(RadioGroupContext);
    const inputId = useId();

    const RadioButtonComponent = props.checked === undefined
      ? UncontrolledRadioButton
      : RadioButtonInternal;

    return (
      <>
        {radioGroupCore ? (
          <CoreBoundRadioButton
            radioGroupCore={radioGroupCore}
            inputId={inputId}
            inputRef={inputRef}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        ) : (
          <RadioButtonComponent
            inputId={inputId}
            inputRef={inputRef}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        )}
      </>
    );
  },
);
