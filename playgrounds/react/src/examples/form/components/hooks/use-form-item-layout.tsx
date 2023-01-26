import {
  Children,
  JSXElementConstructor,
  ReactNode,
  useMemo,
} from 'react';
import { FormItemHint, FormItemLabel } from '../form-item-parts';
import { findNodeByTypes } from '../utils';

export interface FormItemChildrenInfo {
  editor: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  rest?: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFormItemLayout(children: ReactNode, editorTypes: JSXElementConstructor<any>[]) {
  const resultingLayout = useMemo<FormItemChildrenInfo>(() => {
    const childrenArray = Children.toArray(children);
    const label = findNodeByTypes(childrenArray, [FormItemLabel]);
    const editor = findNodeByTypes(childrenArray, editorTypes);
    const hint = findNodeByTypes(childrenArray, [FormItemHint]);
    const rest = childrenArray.filter(
      child => child !== label && child !== editor && child !== hint,
    );
    return {
      label,
      hint,
      editor,
      rest,
    };
  }, [children]);
  return resultingLayout;
}
