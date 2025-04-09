import { Toolbar } from '../inferno_wrappers/toolbar';
import type { ToolbarProps } from './types';

export function ToolbarView(props: ToolbarProps): JSX.Element {
  if (!props.visible) {
    return <></>;
  }

  return (
    <Toolbar
      elementRef={props.containerRef}
      visible={props.visible}
      items={props.items}
      disabled={props.disabled}
    />
  );
}
