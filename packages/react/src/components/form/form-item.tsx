// eslint-disable-next-line rulesdir/no-mixed-import
import React, {
  JSXElementConstructor, PropsWithChildren, useContext, useEffect, useMemo,
} from 'react';
import { RadioGroup } from '../radio-group';
import { FormContext } from './form-context';
import { Rule } from './types';

type CustomRuleProps = Rule;

interface FormItemChildrenInfo {
  editor: React.ReactNode,
  label?: React.ReactNode,
  hint?: React.ReactNode,
  rules: React.ReactNode[],
}

function groupChildrenByTypes(
  children: React.ReactNode,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  targetTypes: Record<string, JSXElementConstructor<any>[]>,
) {
  const findChildSection = (child: React.ReactNode) => {
    if (React.isValidElement(child)) {
      for (const [section, types] of Object.entries(targetTypes)) {
        if (types.some(type => child.type === type)) {
          return section;
        }
      }
    }
    return null;
  };

  return React.Children.toArray(children)
    .reduce<Record<string, React.ReactNode[]>>((acc, child) => {
    const section = findChildSection(child);
    if (section) {
      acc[section] = [...(acc[section] || []), child];
    }
    return acc;
  }, {});
}

export interface FormItemProps extends React.PropsWithChildren {
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CustomRule(_props: CustomRuleProps) {
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CustomRule1(_props: CustomRuleProps) {
  return null;
}

export function FormItemHint({ children }: { children: string }) {
  return (<span>{children}</span>);
}

export function FormItemLabel({ children }: PropsWithChildren) {
  return <span>{children}</span>;
}

export function FormItem({ name, children }: FormItemProps) {
  const formContext = useContext(FormContext);

  const typesToSectionMapping = {
    label: [FormItemLabel],
    editor: [RadioGroup],
    hint: [FormItemHint],
    rules: [CustomRule, CustomRule1],
  };

  const sections = useMemo<FormItemChildrenInfo>(() => {
    const childrenByTypes = groupChildrenByTypes(children, typesToSectionMapping);
    return {
      label: childrenByTypes['label'][0],
      editor: childrenByTypes['editor'][0],
      hint: childrenByTypes['hint'][0],
      rules: childrenByTypes['rules'] || [],
    };
  }, [children]);

  const validationRules = useMemo<Rule[]>(() => (
    sections.rules.map(
      (rule) => {
        const props = (rule as React.ReactElement).props as CustomRuleProps;
        return props;
      },
    )
  ),
  [sections]);

  useEffect(() => {
    formContext?.onValidationRulesInitialized(name, validationRules);
  }, [children]);

  const renderValidation = () => <span>{formContext?.validationResult?.[name]?.join('. ')}</span>;

  return (
    <div>
      <span>{sections.label}</span>
      <span>{sections.editor}</span>
      <span>{sections.hint}</span>
      <span>{renderValidation()}</span>
    </div>
  );
}
