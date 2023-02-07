import { ValidationResult, ValidationRule } from '@devextreme/interim';
import {
  PropsWithChildren, useContext, useEffect, useMemo, useRef,
} from 'react';
import { EditorContext } from '../../common/contexts/editor-context';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { ValidationGroupContext } from '../contexts/validation-group-context';
import { ValidatorContext } from '../contexts/validator-context';
import { ValidationGroupId } from '../types';

interface ValidatorImpl {
  validate: () => ValidationResult,
  validationRules?: ValidationRule[],
  reset: () => void,
  on: (event: string, callback: () => void) => void,
  off: (event: string, callback: () => void) => void,
}

interface ValidatorProps extends PropsWithChildren {
  validationGroup?: ValidationGroupId,
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
  const validator = useRef<ValidatorImpl>({
    validationRules: rules.current,
    validate: () => {},
    reset: () => {},
    on: () => {},
    off: () => {},
  });
  validator.current.validate = editorContext 
    ? () => {
      const { editorName, editorValue, setEditorErrors } = editorContext;
      const validationResult = validationEngine.validate(editorValue, rules.current, editorName);
      setEditorErrors(
        validationResult.isValid
          ? [] : validationResult.brokenRules.map((rule: ValidationRule) => rule.message),
      );
      return validationResult;
    }
    : () => ({ isValid: true });

  useEffect(() => {
    const validationGroup = validationGroupProp ?? validationGroupContext;
    validationEngine.registerValidatorInGroup(validationGroup, validator.current);
    return () => validationEngine.removeRegisteredValidator(validationGroup, validator.current);
  }, [validationGroupProp ?? validationGroupContext]);

  useEffect(() => {
    if (validateOnValueChange) {
      validator.current.validate();
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
