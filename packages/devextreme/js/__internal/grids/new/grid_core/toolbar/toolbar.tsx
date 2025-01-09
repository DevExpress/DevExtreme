import type { InfernoNode } from 'inferno';

import { Toolbar } from '../inferno_wrappers/toolbar';
import type { ToolbarProps } from './types';

export function ToolbarView(props: ToolbarProps): InfernoNode {
  return (
    !!props.visible && <Toolbar {...props}></Toolbar>
  );
}
