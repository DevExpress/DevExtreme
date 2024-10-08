import type { Properties as SortableProperties } from '@js/ui/sortable';
import dxSortable from '@js/ui/sortable';
import { type InfernoNode } from 'inferno';

import { InfernoWrapper } from './widget_wrapper';

export class Sortable extends InfernoWrapper<SortableProperties, dxSortable> {
  public render(): InfernoNode {
    return (
      <div ref={this.ref}>
        {this.props.children}
      </div>
    );
  }

  protected getComponentFabric(): typeof dxSortable {
    return dxSortable;
  }
}
