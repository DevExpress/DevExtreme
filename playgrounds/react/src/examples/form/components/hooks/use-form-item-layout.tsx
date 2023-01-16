import {
  Children,
  ComponentType,
  isValidElement,
  JSXElementConstructor,
  ReactNode,
  useMemo,
} from 'react';
import { CustomRule, CustomRule1 } from '../dummy-validation';
import { FormItemHint, FormItemLabel } from '../form-item-parts';

type ChildrenArray = ReturnType<typeof Children.toArray>;

const isNodeOfTypes = (types: ComponentType[]) => (node: ReactNode) => isValidElement(node)
 && types.some((type) => node.type === type);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findNodeByTypes(nodes: ChildrenArray, types: JSXElementConstructor<any>[]) {
  return nodes.find(isNodeOfTypes(types));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterNodesByTypes(nodes: ChildrenArray, types: JSXElementConstructor<any>[]) {
  return nodes.filter(isNodeOfTypes(types));
}

export interface FormItemChildrenInfo {
  editor: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  rules: ReactNode[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFormItemLayout(children: ReactNode, editorTypes: JSXElementConstructor<any>[]) {
  const {
    label, hint, editor, rules,
  } = useMemo<FormItemChildrenInfo>(() => {
    const childrenArray = Children.toArray(children);

    return {
      label: findNodeByTypes(childrenArray, [FormItemLabel]),
      editor: findNodeByTypes(childrenArray, editorTypes),
      hint: findNodeByTypes(childrenArray, [FormItemHint]),
      rules: filterNodesByTypes(childrenArray, [CustomRule, CustomRule1]) || [],
    };
  }, [children]);

  return {
    label,
    hint,
    editor,
    rules,
  };
}
