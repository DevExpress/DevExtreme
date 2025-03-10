import type { ColumnChooserMode } from '@js/common/grids';
import type { Properties as PopupProperties } from '@js/ui/popup';
import type { Properties as TreeViewProperties } from '@js/ui/tree_view';
import type dxTreeView from '@js/ui/tree_view';
import type { RefObject } from 'inferno';

import type { Column } from '../columns_controller/types';
import { Popup } from '../inferno_wrappers/popup';
import { TreeView } from '../inferno_wrappers/tree_view';
import dxPopup from '@js/ui/popup';

export interface ColumnChooserProps {
  popupRef: RefObject<dxPopup>;

  treeViewRef: RefObject<dxTreeView>;

  columns: Column[];

  visible: boolean;

  mode: ColumnChooserMode;

  popupConfig: PopupProperties;

  treeViewConfig: TreeViewProperties;
}

export function ColumnChooser(props: ColumnChooserProps): JSX.Element | null {
  const {
    visible, treeViewConfig, popupConfig, popupRef, treeViewRef,
  } = props;

  if (!visible) {
    return null;
  }

  return (
    <Popup
      visible={visible}
      componentRef={popupRef}
      { ...popupConfig }
    >
      <TreeView
        componentRef={treeViewRef}
        { ...treeViewConfig }
      ></TreeView>
    </Popup>
  );
}
