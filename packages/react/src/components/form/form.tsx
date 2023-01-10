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

type Rule = {
  validate: (value: unknown) => boolean;
  message: string;
};

type FormValidator = (
  value: unknown,
  rules: Rule[],
  name: string
) => string | string[] | void;

type FormContextValue = {
  validationResult?: FormValidationResult;
  validate: FormValidator;
};

type ChildType =
  | string
  | number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | React.ReactFragment
  | React.ReactPortal;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const isChildOfType = (targetType: JSXElementConstructor<any>) => (
//   child: ChildType,
// ) => (React.isValidElement(child) && child.type === targetType);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// function findChildByType(children: React.ReactNode, targetType: JSXElementConstructor<any>) {
//   const isTargetType = isChildOfType(targetType);
//   return React.Children.toArray(children).find((child) => (
//     isTargetType(child) ? child : null));
// }

function reduceChildrenByTypes(
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

  return React.Children.toArray(children).reduce<Record<string, ChildType[]>>((acc, child) => {
    const section = findChildSection(child);
    if (section) {
      acc[section] = [...(acc[section] || []), child];
    }
    return acc;
  }, {});
}

interface FormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children?: React.ReactElement<FormItemProps>[] | React.ReactElement<FormItemProps>
}
interface FormItemProps extends React.PropsWithChildren {
  name: string;
}

const FormContext = createContext<FormContextValue | undefined>(
  undefined,
);

interface CustomRuleProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/no-unused-prop-types
  validate: (value: any) => boolean,
  // eslint-disable-next-line react/no-unused-prop-types
  message: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CustomRule(_props: CustomRuleProps) {
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CustomRule1(_props: CustomRuleProps) {
  return null;
}

export function FormItemLabel({ children }: PropsWithChildren) {
  return <span>{children}</span>;
}

export function FormItem({ name, children }: FormItemProps) {
  const formContext = useContext(FormContext);
  const sections = useMemo(() => {
    const typesToSectionMapping = {
      label: [FormItemLabel], editor: [RadioGroup], hint: [], rules: [CustomRule, CustomRule1],
    };
    return reduceChildrenByTypes(children, typesToSectionMapping);
  }, [children]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rulesToCheck = useMemo(() => (sections['rules'].map((rule) => ({ message: (rule as any).props.message, validate: (rule as any).props.validate }))), [sections]);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formContext?.validate((sections['editor'] as any)[0].props.value, rulesToCheck, name);
  }, [children]);
  const renderEditor = () => sections['editor'];
  const renderLabel = () => sections['label'];
  const renderValidation = () => <span>{formContext?.validationResult?.[name]}</span>;

  return (
    <div>
      <span>{renderLabel()}</span>
      <span>{renderEditor()}</span>
      <span>{renderValidation()}</span>
    </div>
  );
}

export function Form({ children, onSubmit }: FormProps) {
  const [validationResult, setValidationResult] = useState<FormValidationResult>({ example: ['not so valid', 'definately'] });

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
    // eslint-disable-next-line consistent-return
    return result;
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
