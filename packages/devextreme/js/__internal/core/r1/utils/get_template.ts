/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return  */
import type { VNode } from 'inferno';
import { createComponentVNode, normalizeProps } from 'inferno';

// NOTE: React vs Inferno type conflict here
export const getTemplate = <P>(
  TemplateProp: any,
): ((props: P) => VNode) => TemplateProp
  && (TemplateProp.defaultProps
    ? (props: P): VNode => normalizeProps(createComponentVNode(2, TemplateProp, { ...props }))
    : TemplateProp);
