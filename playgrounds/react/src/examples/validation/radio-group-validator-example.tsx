import { RadioButton } from '@devextreme/react';
import { CustomRule } from './components/dummy-validation';
import { RadioGroupEditor as RadioGroup } from './components/radio-group-with-validation';
import { ValidationGroup } from './components/validation-group';
import { Validator } from './components/validator';

const OPTIONS = [1, 2, 3, 4, 5];

export function RadioGroupValidatorExample() {
  return (
    <>
      <div className="example">
        <div className="example__title">Standalone validator example:</div>
        <div className="example__control">
          <RadioGroup defaultValue={OPTIONS[3]} name="validation-example">
            {OPTIONS.map((option) => (
              <RadioButton key={option} value={option} />
            ))}
            <Validator editorName="validation-example">
              <CustomRule
                message="Should be < 3"
                validate={(value) => (value as number) < 3}
              />
            </Validator>
          </RadioGroup>
        </div>
      </div>
      <div className="example">
        <div className="example__title">Validation group example:</div>
        <div className="example__control">
          <ValidationGroup>
            <RadioGroup defaultValue={OPTIONS[1]} name="validation-example-1">
              {OPTIONS.map((option) => (
                <RadioButton key={option} value={option} />
              ))}
              <Validator editorName="validation-example-1">
                <CustomRule
                  message="Should be > 2"
                  validate={(value) => (value as number) > 2}
                />
              </Validator>
            </RadioGroup>
            <RadioGroup defaultValue={OPTIONS[2]} name="validation-example-2">
              {OPTIONS.map((option) => (
                <RadioButton key={option} value={option} />
              ))}
              <Validator editorName="validation-example-2">
                <CustomRule
                  message="Should be > 2"
                  validate={(value) => (value as number) > 2}
                />
              </Validator>
            </RadioGroup>
          </ValidationGroup>
        </div>
      </div>
    </>
  );
}
