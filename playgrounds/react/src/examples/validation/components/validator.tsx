import { ValidationRule } from '@devextreme/interim';
import {
  PropsWithChildren, useContext, useEffect, useMemo, useRef,
} from 'react';
import { EditorContext } from '../contexts/editor-context';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { ValidationGroupContext } from '../contexts/validation-group-context';
import { ValidatorContext } from '../contexts/validator-context';

export function Validator({
  validationGroup: validationGroupProp,
  children,
}: PropsWithChildren & { validationGroup?: string }) {
  const rules = useRef<ValidationRule[]>([]);
  const validationGroupContext = useContext(ValidationGroupContext);
  const editorContext = useContext(EditorContext);
  const validationEngine = useContext(ValidationEngineContext);

  useEffect(() => {
    if (editorContext) {
      const { editorName, editorValue, notifyErrorRaised } = editorContext;
      const validationGroup = validationGroupProp
        ? { name: validationGroupProp } : validationGroupContext;
      console.log(validationGroup);
      const validationResult = validationEngine.validate(editorValue, rules.current, editorName);
      console.log(validationResult);
      notifyErrorRaised(
        validationResult.isValid
          ? [] : validationResult.brokenRules.map((rule: ValidationRule) => rule.message),
      );
    }
  }, [editorContext?.editorName, editorContext?.editorValue]);

  const validatorContextValue = useMemo(() => ({
    registerRule: (rule: ValidationRule) => { rules.current.push(rule); },
  }), []);

  return (
    <ValidatorContext.Provider value={validatorContextValue}>
      {children}
    </ValidatorContext.Provider>
  );
}
