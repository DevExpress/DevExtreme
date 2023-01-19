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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFormItemLayout(children: ReactNode, editorTypes: JSXElementConstructor<any>[]) {
  const { label, hint, editor } = useMemo<FormItemChildrenInfo>(() => {
    const childrenArray = Children.toArray(children);

    return {
      label: findNodeByTypes(childrenArray, [FormItemLabel]),
      editor: findNodeByTypes(childrenArray, editorTypes),
      hint: findNodeByTypes(childrenArray, [FormItemHint]),
    };
  }, [children]);

  return {
    label,
    hint,
    editor,
  };
}
