import type { Properties as ContextMenuProperties } from '@js/ui/context_menu';
import type dxContextMenu from '@js/ui/context_menu';
import type { RefObject } from 'inferno';

import { CLASSES } from '../const';
import { ContextMenu as ContextMenuComponent } from '../inferno_wrappers/context_menu';

export type ContextMenuProps = ContextMenuProperties & {
  componentRef: RefObject<dxContextMenu>;
};

export function ContextMenu(props: ContextMenuProps): JSX.Element | null {
  return (
    <div className={CLASSES.excludeFlexBox}>
      <ContextMenuComponent
        showEvent={undefined}
        componentRef={props.componentRef}
        cssClass={props.cssClass}
        onInitialized={props.onInitialized}
        onPositioning={props.onPositioning}
        onItemClick={props.onItemClick}
      />
    </div>
  );
}
