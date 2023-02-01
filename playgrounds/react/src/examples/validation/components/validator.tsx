import { ValidationResult, ValidationRule } from '@devextreme/interim';
import {
  PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef,
} from 'react';
import { EditorContext } from '../contexts/editor-context';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { ValidationGroupContext } from '../contexts/validation-group-context';
import { ValidatorContext } from '../contexts/validator-context';

interface ValidatorImpl {
  validate: () => ValidationResult,
  validationRules?: ValidationRule[],
  reset: () => void,
  on: (event: string, callback: () => void) => void,
  off: (event: string, callback: () => void) => void,
}

interface ValidatorProps extends PropsWithChildren {
  validationGroup?: string,
  validateOnValueChange?: boolean
}

export function Validator({
  validationGroup: validationGroupProp,
  validateOnValueChange,
  children,
}: ValidatorProps) {
  const validationGroupContext = useContext(ValidationGroupContext);
  const editorContext = useContext(EditorContext);
  const validationEngine = useContext(ValidationEngineContext);
  const rules = useRef<ValidationRule[]>([]);
  const performValidation = useCallback(() => {
    if (editorContext) {
      const { editorName, editorValue, setEditorErrors } = editorContext;
      const validationResult = validationEngine.validate(editorValue, rules.current, editorName);
      setEditorErrors(
        validationResult.isValid
          ? [] : validationResult.brokenRules.map((rule: ValidationRule) => rule.message),
      );
      return validationResult;
    }
    return null;
  },
  [editorContext?.editorName, editorContext?.editorValue]);

  const validator = useRef<ValidatorImpl>({
    validationRules: rules.current,
    validate: performValidation,
    reset: () => {},
    on: () => {},
    off: () => {},
  });

  useEffect(() => {
    const validationGroup = validationGroupProp ?? validationGroupContext;
    console.log(validationGroup);
    validationEngine.registerValidatorInGroup(validationGroup, validator.current);
    return () => validationEngine.removeRegisteredValidator(validationGroup, validator.current);
  }, [validationGroupProp ?? validationGroupContext]);

  useEffect(() => {
    validator.current.validate = performValidation;
  }, [performValidation]);

  useEffect(() => {
    if (validateOnValueChange) {
      performValidation();
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
