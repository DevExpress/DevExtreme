import {
  PropsWithChildren, useContext, useEffect, useMemo, useRef,
} from 'react';
import { EditorContext } from '../contexts/editor-context';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { ValidationGroupContext } from '../contexts/validation-group-context';
import { ValidatorContext } from '../contexts/validator-context';
import { Rule } from '../types';

export function Validator({
  validationGroup: validationGroupProp,
  children,
}: PropsWithChildren & { validationGroup?: string }) {
  const rules = useRef<Rule[]>([]);
  const validationGroupContext = useContext(ValidationGroupContext);
  const editorContext = useContext(EditorContext);
  const validationEngine = useContext(ValidationEngineContext);

  useEffect(() => {
    if (editorContext) {
      const { editorName, editorValue, notifyErrorRaised } = editorContext;
      const validationGroup = validationGroupProp
        ? { name: validationGroupProp } : validationGroupContext;
      validationEngine.initializeEditorRules(editorName, rules.current, validationGroup);
      const validationResult = validationEngine.validateEditorValue(editorName, editorValue);
      notifyErrorRaised(validationResult);
    }
  }, [editorContext?.editorName, editorContext?.editorValue]);

  const validatorContextValue = useMemo(() => ({
    registerRule: (rule: Rule) => { rules.current.push(rule); },
  }), []);

  return (
    <ValidatorContext.Provider value={validatorContextValue}>
      {children}
    </ValidatorContext.Provider>
  );
}
