import type { Properties as SortableProperties } from '@js/ui/sortable';
import dxSortable from '@js/ui/sortable';
import { type InfernoNode } from 'inferno';

import { InfernoWrapper } from './widget_wrapper';

export interface Props extends SortableProperties {
  className?: string;
  // NOTE: private option
  placeholderClassName?: string;
}

export class Sortable extends InfernoWrapper<Props, dxSortable> {
  public render(): InfernoNode {
    return (
      <div className={this.props.className} ref={this.ref}>
        {this.props.children}
      </div>
    );
  }

  protected getComponentFabric(): typeof dxSortable {
    return dxSortable;
  }
}
