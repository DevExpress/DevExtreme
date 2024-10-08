import type { Properties as TreeViewProperties } from '@js/ui/tree_view';
import dxTreeView from '@js/ui/tree_view';

import { InfernoWrapper } from './widget_wrapper';

export class TreeView extends InfernoWrapper<TreeViewProperties, dxTreeView> {
  protected getComponentFabric(): typeof dxTreeView {
    return dxTreeView;
  }
}
