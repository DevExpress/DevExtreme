/* eslint-disable react/require-default-props */
// eslint-disable-next-line rulesdir/no-mixed-import
import React, {
  createContext,
  FormEventHandler,
  JSXElementConstructor,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import { RadioGroup } from '../radio-group/radio-group';

type FormValidationResult = Record<string, string[]>;

type Rule = {
  isValid: (value: unknown) => boolean;
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
const isChildOfType = (targetType: JSXElementConstructor<any>) => (
  child: ChildType,
) => (React.isValidElement(child) && child.type === targetType);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findChildByType(children: React.ReactNode, targetType: JSXElementConstructor<any>) {
  const isTargetType = isChildOfType(targetType);
  return React.Children.toArray(children).find((child) => (
    isTargetType(child) ? child : null));
}
interface FormProps extends React.PropsWithChildren {
  onSubmit?: FormEventHandler<HTMLFormElement>;
}
interface FormItemProps extends React.PropsWithChildren {
  name: string;
}

const FormContext = createContext<FormContextValue | undefined>(
  undefined,
);

export function FormItemLabel({ children }: PropsWithChildren) {
  return <span>{children}</span>;
}

export function FormItem({ name, children }: FormItemProps) {
  const formContext = useContext(FormContext);
  const renderEditor = () => findChildByType(children, RadioGroup);
  const renderLabel = () => {
    const labelComponent = findChildByType(children, FormItemLabel);
    return labelComponent;
  };
  const renderValidation = () => (
    <span>{formContext?.validationResult?.[name]}</span>
  );

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
    if (rules.length) {
      return;
    }
    const result: string[] = [];
    rules.forEach((rule) => {
      if (!rule.isValid(value)) {
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
