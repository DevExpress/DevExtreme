/* eslint-disable no-nested-ternary */
/* eslint-disable import/exports-last */
import { EditorValidationAdapter, ValidationRule } from '@devextreme/interim';
import {
  PropsWithChildren, useContext, useEffect, useMemo, useRef,
} from 'react';
import { EditorContext } from '../../common/contexts/editor-context';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { ValidationGroupContext } from '../contexts/validation-group-context';
import { ValidatorContext } from '../contexts/validator-context';
import { ValidationGroupId, ValidatorImpl } from '../types';
import { LegacyEditorConnector } from './legacy-editor-connector';

interface ValidatorProps extends PropsWithChildren {
  validationGroup?: ValidationGroupId,
  validateOnValueChange?: boolean
}

const emptyValidatonResult = { isValid: true };

export function Validator({
  validationGroup: validationGroupProp,
  validateOnValueChange,
  children,
}: ValidatorProps) {
  const validationGroupContext = useContext(ValidationGroupContext);
  const editorContext = useContext(EditorContext);
  const validationEngine = useContext(ValidationEngineContext);
  const rules = useRef<ValidationRule[]>([]);
  const legacyEditorAdapter = useRef<EditorValidationAdapter | null>(null);
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
    : () => emptyValidatonResult;

  const setLegacyEditorAdapter = (adapter: EditorValidationAdapter) => {
    legacyEditorAdapter.current = adapter;
    validator.current.validate = () => {
      if (legacyEditorAdapter.current) {
        const validationResult = validationEngine.validate(
          legacyEditorAdapter.current.getValue(),
          rules.current, legacyEditorAdapter.current.getName(),
        );
        legacyEditorAdapter.current.applyValidationResults(validationResult);
        return validationResult;
      }
      return emptyValidatonResult;
    };
  };

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
      {!editorContext && (
        <LegacyEditorConnector
          validator={validator.current}
          setEditorAdapter={setLegacyEditorAdapter}
        />
      )}
      {children}
    </ValidatorContext.Provider>
  );
}
