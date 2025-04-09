import type { Properties as ContextMenuProperties } from '@js/ui/context_menu';

import { ContextMenu as ContextMenuComponent } from '../inferno_wrappers/context_menu';

export type ContextMenuProps = ContextMenuProperties;

export function ContextMenu(props: ContextMenuProperties): JSX.Element | null {
  return (
    <ContextMenuComponent { ...props }/>
  );
}
