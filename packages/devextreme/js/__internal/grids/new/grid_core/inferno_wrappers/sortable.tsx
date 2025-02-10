import type { Properties as SortableProperties } from '@js/ui/sortable';
import dxSortable from '@js/ui/sortable';
import { type InfernoNode } from 'inferno';

import { InfernoWrapper } from './widget_wrapper';

export interface Props extends SortableProperties {

}

export class Sortable extends InfernoWrapper<Props, dxSortable> {
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
