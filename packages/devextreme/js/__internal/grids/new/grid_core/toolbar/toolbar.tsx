import { Toolbar } from '../inferno_wrappers/toolbar';
import type { ToolbarProps } from './types';

export function ToolbarView(props: ToolbarProps): JSX.Element {
  return (
    props.visible ? <Toolbar {...props}/> : <></>
  );
}
