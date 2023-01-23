import { RadioButton, RadioGroup } from '@devextreme/react';
import { useContext, useMemo } from 'react';
import { ValidationContext } from '../form/components/contexts/validation-context';
import { ValidationEngineContext } from '../form/components/contexts/validation-engine-context';
import { CustomRule } from '../form/components/dummy-validation';
import { useValidation } from '../form/components/hooks/use-validation';
import { Validator } from '../form/components/validator';

const OPTIONS = [1, 2, 3, 4, 5];

export function RadioGroupValidatorExample() {
  const validationEngine = useContext(ValidationEngineContext);
  const {
    validationResult,
  } = useValidation(validationEngine);
  const validationContextValue = useMemo(() => ({
    validationResult,
  }), [validationResult]);

  return (
    <div className="example">
      <div className="example__title">Radio group validator example:</div>
      <div className="example__control">
        <ValidationContext.Provider value={validationContextValue}>
          <RadioGroup defaultValue={OPTIONS[3]} name="validation-example">
            {OPTIONS.map((option) => (
              <RadioButton key={option} value={option} />
            ))}
            <Validator name="validation-example">
              <CustomRule
                message="Should be < 3"
                validate={(value) => ((value as number) < 3)}
              />
            </Validator>
          </RadioGroup>
        </ValidationContext.Provider>
      </div>
    </div>
  );
}
