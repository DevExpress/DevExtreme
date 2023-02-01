import {
  CustomRule, RadioButton,
  RadioGroup, RangeRule, ValidationEngineContext, ValidationGroup, Validator,
} from '@devextreme/react';
import { useCallback, useContext } from 'react';

const OPTIONS = [1, 2, 3, 4, 5];

export function RadioGroupValidatorExample() {
  const validationEngine = useContext(ValidationEngineContext);
  const performValidation = useCallback(() => {
    validationEngine.validateGroup('first-group');
  }, [validationEngine]);
  return (
    <>
      <div className="example">
        <div className="example__title">Standalone editor validating on value change:</div>
        <div className="example__control">
          <RadioGroup defaultValue={OPTIONS[3]} name="validation-example">
            {OPTIONS.map((option) => (
              <RadioButton key={option} value={option} />
            ))}
            <Validator validateOnValueChange>
              <RangeRule
                message="Should be > 1"
                min={2}
              />
              <CustomRule
                message="Should be < 3"
                validationCallback={({ value }: { value: unknown }) => (value as number) < 3}
              />
            </Validator>
          </RadioGroup>
        </div>
      </div>
      <div className="example">
        <div className="example__title">Validation group validating on button click:</div>
        <div className="example__control">
          <ValidationGroup id="first-group">
            <RadioGroup defaultValue={OPTIONS[1]} name="validation-example-1">
              {OPTIONS.map((option) => (
                <RadioButton key={option} value={option} />
              ))}
              <Validator>
                <CustomRule
                  message="Should be > 2"
                  validationCallback={({ value }: { value: unknown }) => (value as number) > 2}
                />
              </Validator>
            </RadioGroup>
            <RadioGroup defaultValue={OPTIONS[2]} name="validation-example-2">
              {OPTIONS.map((option) => (
                <RadioButton key={option} value={option} />
              ))}
              <Validator>
                <CustomRule
                  message="Should be < 4"
                  validationCallback={({ value }: { value: unknown }) => (value as number) < 4}
                />
                <CustomRule
                  message="Should be < 3"
                  validationCallback={({ value }: { value: unknown }) => (value as number) < 3}
                />
              </Validator>
            </RadioGroup>
          </ValidationGroup>
        </div>
        <button type="button" onClick={performValidation}>Validate group</button>
      </div>
    </>
  );
}
