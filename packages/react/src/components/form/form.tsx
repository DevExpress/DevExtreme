/* eslint-disable react/require-default-props */
// eslint-disable-next-line rulesdir/no-mixed-import
import React, {
  createContext,
  FormEventHandler,
  JSXElementConstructor,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { RadioGroup } from '../radio-group/radio-group';

type FormValidationResult = Record<string, string[]>;

interface Rule {
  validate: (value: unknown) => boolean;
  message: string;
}

type CustomRuleProps = Rule;

type FormValidator = (
  value: unknown,
  rules: Rule[],
  name: string
) => string | string[] | void;

interface FormContextValue {
  validationResult?: FormValidationResult;
  validate: FormValidator;
}

interface FormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children?: React.ReactElement<FormItemProps>[] | React.ReactElement<FormItemProps>
}

interface FormItemProps extends React.PropsWithChildren {
  name: string;
}

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

const FormContext = createContext<FormContextValue | undefined>(
  undefined,
);

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

  const rulesToCheck = useMemo<Rule[]>(() => (
    sections.rules.map(
      (rule) => {
        const props = (rule as React.ReactElement).props as CustomRuleProps;
        return props;
      },
    )
  ),
  [sections]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formContext?.validate((sections.editor as any).props.value, rulesToCheck, name);
  }, [children]);

  const renderEditor = () => sections.editor;
  const renderLabel = () => sections.label;
  const renderHint = () => sections.hint;
  const renderValidation = () => <span>{formContext?.validationResult?.[name]?.join('. ')}</span>;

  return (
    <div>
      <span>{renderHint()}</span>
      <span>{renderLabel()}</span>
      <span>{renderEditor()}</span>
      <span>{renderValidation()}</span>
    </div>
  );
}

export function Form({ children, onSubmit }: FormProps) {
  const [validationResult, setValidationResult] = useState<FormValidationResult>({});

  const defaultValidator: FormValidator = (value, rules, name) => {
    if (!rules.length) {
      return;
    }
    const result: string[] = [];
    rules.forEach((rule) => {
      if (!rule.validate(value)) {
        result.push(rule.message);
      }
    });
    setValidationResult((previousResult) => ({
      ...previousResult,
      [name]: result,
    }));
  };

  const formContextValue = useMemo(
    () => ({
      validate: defaultValidator,
      validationResult,
    }),
    [defaultValidator, validationResult],
  );

  return (
    <FormContext.Provider value={formContextValue}>
      <form onSubmit={onSubmit}>
        {children}
        <input type="submit" value="Submit" />
      </form>
    </FormContext.Provider>
  );
}
