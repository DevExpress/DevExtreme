import {
  CustomRule, RadioButton,
  RadioGroup, RangeRule, ValidationEngineContext, ValidationGroup, Validator,
} from '@devextreme/react';
import { useContext } from 'react';

const OPTIONS = [1, 2, 3, 4, 5];

export function RadioGroupValidatorExample() {
  const validationEngine = useContext(ValidationEngineContext);
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
        <div className="example__title">Standalone editors validating with default group:</div>
        <div className="example__control">
          <RadioGroup defaultValue={OPTIONS[4]} name="validation-example-1">
            {OPTIONS.map((option) => (
              <RadioButton key={option} value={option} />
            ))}
            <Validator>
              <RangeRule
                message="Should be between 2 and 4"
                min={2}
                max={4}
              />
            </Validator>
          </RadioGroup>
          <RadioGroup defaultValue={OPTIONS[1]} name="validation-example-1">
            {OPTIONS.map((option) => (
              <RadioButton key={option} value={option} />
            ))}
            <Validator>
              <RangeRule
                message="Should be between 3 and 5"
                min={3}
                max={5}
              />
            </Validator>
          </RadioGroup>
        </div>
        <button type="button" onClick={() => validationEngine.validateGroup()}>Validate default group</button>
      </div>
      <div className="example">
        <div className="example__title">Validation group validating on button click:</div>
        <div className="example__control">
          <ValidationGroup id="first-group">
            <RadioGroup defaultValue={OPTIONS[1]} name="validation-example-2">
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
            <RadioGroup defaultValue={OPTIONS[2]} name="validation-example-3">
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
        <button type="button" onClick={() => validationEngine.validateGroup('first-group')}>Validate group</button>
      </div>
    </>
  );
}
