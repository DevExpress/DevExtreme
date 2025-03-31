import type { ColumnChooserMode } from '@js/common/grids';
import messageLocalization from '@js/localization/message';
import type { Properties as PopupProperties, ShownEvent, ToolbarItem } from '@js/ui/popup';
import type dxPopup from '@js/ui/popup';
import { current, isGeneric, isMaterial } from '@js/ui/themes';
import type { Properties as TreeViewProperties } from '@js/ui/tree_view';
import type dxTreeView from '@js/ui/tree_view';
import { Component, type RefObject } from 'inferno';

import { Popup } from '../inferno_wrappers/popup';
import { TreeView } from '../inferno_wrappers/tree_view';

export const CLASS = {
  root: 'column-chooser',
  toolbarBtn: 'column-chooser-button',
  list: 'column-chooser-list',
  plain: 'column-chooser-plain',
  dragMode: 'column-chooser-mode-drag',
  selectMode: 'column-chooser-mode-select',
};

export interface ColumnChooserProps {
  popupRef: RefObject<dxPopup>;

  treeViewRef: RefObject<dxTreeView>;

  visible: boolean;

  title: string;

  mode: ColumnChooserMode;

  popupConfig: PopupProperties;

  treeViewConfig: TreeViewProperties;

  treeViewSelectModeConfig: TreeViewProperties;

  treeViewDragAndDropModeConfig: TreeViewProperties;
}

export class ColumnChooser extends Component<ColumnChooserProps> {
  public render(): JSX.Element {
    const {
      visible,
      popupConfig,
      treeViewConfig,
      treeViewSelectModeConfig,
      treeViewDragAndDropModeConfig,
      popupRef,
      treeViewRef,
    } = this.props;

    if (!visible) {
      return <></>;
    }

    return (
      <Popup
        componentRef={popupRef}
        visible={true}
        shading={false}
        dragEnabled={true}
        resizeEnabled={true}
        // @ts-expect-error
        _loopFocus={true}

        showCloseButton={this.isMaterialOrGeneric()}
        toolbarItems={this.getPopupToolbarItems()}
        wrapperAttr={{ class: this.getPopupWrapperClass() }}

        width={popupConfig.width}
        height={popupConfig.height}
        container={popupConfig.container}
        rtlEnabled={popupConfig.rtlEnabled}
        position={popupConfig.position}
        onHidden={popupConfig.onHidden}
        onShown={(e: ShownEvent) => { this.setPopupAttributes(e?.component); }}

      >
        <TreeView
          componentRef={treeViewRef}
          dataStructure='plain'
          activeStateEnabled={true}
          focusStateEnabled={true}
          hoverStateEnabled={true}
          disabled={false}
          rootValue={null}

          rtlEnabled={treeViewConfig.rtlEnabled}
          searchEditorOptions={treeViewConfig.searchEditorOptions}
          searchEnabled={treeViewConfig.searchEnabled}
          searchTimeout={treeViewConfig.searchTimeout}

          {
            ...(
              this.isSelectMode()
                ? treeViewSelectModeConfig
                : treeViewDragAndDropModeConfig
            )
          }
        ></TreeView>
      </Popup>
    );
  }

  private isMaterialOrGeneric(): boolean {
    return isMaterial(current()) || isGeneric(current());
  }

  private isSelectMode(): boolean {
    return this.props.mode === 'select';
  }

  // TODO: move it to the other place
  private addWidgetPrefix(cssClass: string): string {
    return `dx-cardview-${cssClass}`;
  }

  private getPopupToolbarItems(): ToolbarItem[] {
    const items: ToolbarItem[] = [
      {
        text: this.props.title,
        toolbar: 'top',
        location: this.isMaterialOrGeneric() ? 'before' : 'center',
      },
    ];

    if (!this.isMaterialOrGeneric()) {
      // @ts-expect-error
      items.push({ shortcut: 'cancel' });
    }

    return items;
  }

  private getPopupWrapperClass(): string {
    const modeSpecificClass = this.isSelectMode() ? CLASS.selectMode : CLASS.dragMode;

    return [this.addWidgetPrefix(CLASS.root), this.addWidgetPrefix(modeSpecificClass)].join(' ');
  }

  private setPopupAttributes(popup: dxPopup): void {
    // TODO: band columns aren't yet implemented in cardview
    const isBandColumnsUsed = false;

    // @ts-expect-error
    popup.setAria({
      label: messageLocalization.format('dxDataGrid-columnChooserTitle'),
    });

    // @ts-expect-error
    popup.$content().addClass(this.addWidgetPrefix(CLASS.list));

    if (this.isSelectMode() && !isBandColumnsUsed) {
      // @ts-expect-error
      popup.$content().addClass(this.addWidgetPrefix(CLASS.plain));
    }
  }
}
