import {
  PropsWithChildren, useContext, useEffect, useMemo, useRef,
} from 'react';
import { EditorContext } from '../contexts/editor-context';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { ValidationGroupContext } from '../contexts/validation-group-context';
import { ValidatorContext } from '../contexts/validator-context';
import { Rule } from '../types';

export function Validator({
  validationGroup,
  children,
}: PropsWithChildren & { validationGroup?: string }) {
  const rules = useRef<Rule[]>([]);
  const validationGroupContext = useContext(ValidationGroupContext);
  const editorContext = useContext(EditorContext);
  const validationEngine = useContext(ValidationEngineContext);

  useEffect(() => {
    if (editorContext) {
      const { editorName, editorValue } = editorContext;
      validationEngine.initializeEditorRules(editorName, rules.current);
      validationEngine.validateEditorValue(editorName, editorValue);
    }
  }, [editorContext?.editorName, editorContext?.editorValue]);

  const validatorContextValue = useMemo(() => ({
    registerRule: (rule: Rule) => { rules.current.push(rule); },
  }), []);

  const validationGroupName = validationGroup || validationGroupContext?.groupName;
  console.log(validationGroupName);

  return (
    <ValidatorContext.Provider value={validatorContextValue}>
      {children}
    </ValidatorContext.Provider>
  );
}
