import type { ColumnChooserMode } from '@js/common/grids';
import messageLocalization from '@js/localization/message';
import type {
  Properties as PopupProperties, ShowingEvent,
} from '@js/ui/popup';
import type dxPopup from '@js/ui/popup';
import type { Properties as TreeViewProperties } from '@js/ui/tree_view';
import type dxTreeView from '@js/ui/tree_view';
import {
  Component, type RefObject,
} from 'inferno';

import type { Props as ColumnSortableProps } from '../../card_view/header_panel/column_sortable';
import { ColumnSortable } from '../../card_view/header_panel/column_sortable';
import { Item } from '../../card_view/header_panel/item';
import type { Column, VisibleColumn } from '../columns_controller/types';
import { CLASSES as ROOT_CLASSES } from '../const';
import { Popup } from '../inferno_wrappers/popup';
import { TreeView } from '../inferno_wrappers/tree_view';

export const CLASS = {
  excludeFlexBox: ROOT_CLASSES.excludeFlexBox,
  root: 'column-chooser',
  toolbarBtn: 'column-chooser-button',
  list: 'column-chooser-list',
  plain: 'column-chooser-plain',
  dragMode: 'column-chooser-mode-drag',
  selectMode: 'column-chooser-mode-select',

  treeviewItem: 'dx-treeview-item',
  treeviewExpanderIcon: 'dx-treeview-expander-icon-stub',
};

export interface ColumnChooserProps {
  popupRef: RefObject<dxPopup>;

  treeViewRef: RefObject<dxTreeView>;

  visible: boolean;

  title: string;

  mode: ColumnChooserMode;

  chooserColumns: Column[];

  visibleColumns: VisibleColumn[];

  isBandColumnsUsed: boolean;

  onColumnMove: (column: Column) => void;

  popupConfig: PopupProperties;

  treeViewConfig: TreeViewProperties;

  treeViewSelectModeConfig: TreeViewProperties;

  treeViewDragAndDropModeConfig: TreeViewProperties;

  sortableConfig: Partial<ColumnSortableProps>;
}

export class ColumnChooser extends Component<ColumnChooserProps> {
  public render(): JSX.Element {
    const {
      visible, popupConfig, popupRef, sortableConfig, title,
    } = this.props;

    if (!visible) {
      return <></>;
    }

    const treeView = this.getTreeView();

    const actualTitle = title || messageLocalization.format('dxDataGrid-columnChooserTitle');
    const toolbarItems = [
      { text: actualTitle, toolbar: 'top' as const, location: 'before' as const },
    ];

    return (
      <div className={CLASS.excludeFlexBox}>
        <Popup
          componentRef={popupRef}
          visible={true}
          shading={false}
          dragEnabled={true}
          resizeEnabled={true}
          showCloseButton={true}
          // @ts-expect-error
          _loopFocus={true}

          toolbarItems={toolbarItems}
          wrapperAttr={{ class: this.getPopupWrapperClass() }}

          width={popupConfig.width}
          height={popupConfig.height}
          container={popupConfig.container}
          position={popupConfig.position}
          onHidden={popupConfig.onHidden}
          onShowing={this.onShowing}
        >
          <ColumnSortable
            height='100%'
            source='column-chooser'
            filter={`.${CLASS.treeviewItem}`}
            getColumnByIndex={this.getColumnByIndex}
            isColumnDraggable={sortableConfig.isColumnDraggable}
            visibleColumns={this.props.visibleColumns}
            allowDragging={!this.isSelectMode()}
            columnDragTemplate={Item}
            onColumnMove={this.props.onColumnMove}
            onDragStart={sortableConfig.onDragStart}
            onDragEnd={sortableConfig.onDragEnd}
            onPlaceholderPrepared={sortableConfig.onPlaceholderPrepared}
          >
            { treeView }
          </ColumnSortable>
        </Popup>
      </div>
    );
  }

  private isSelectMode(): boolean {
    return this.props.mode === 'select';
  }

  // TODO: move it to the other place
  private addWidgetPrefix(cssClass: string): string {
    return `dx-cardview-${cssClass}`;
  }

  private getPopupWrapperClass(): string {
    const modeSpecificClass = this.isSelectMode() ? CLASS.selectMode : CLASS.dragMode;

    return [this.addWidgetPrefix(CLASS.root), this.addWidgetPrefix(modeSpecificClass)].join(' ');
  }

  private readonly onShowing = (e: ShowingEvent): void => {
    const popup = e.component;

    if (this.props.popupConfig.position === undefined) {
      popup.option('position', {
        my: 'right top',
        at: 'right bottom',
        // TODO: replace with content view element
        of: '.dx-cardview-column-chooser-button',
        collision: 'fit',
        offset: '-2 -2',
        boundaryOffset: '2 2',
      });
    }

    this.setPopupAttributes(popup);
  };

  private setPopupAttributes(popup: dxPopup): void {
    // @ts-expect-error
    popup.setAria({
      label: messageLocalization.format('dxDataGrid-columnChooserTitle'),
    });

    // @ts-expect-error
    popup.$content().addClass(this.addWidgetPrefix(CLASS.list));

    // @ts-expect-error
    popup.$content().toggleClass(this.addWidgetPrefix(CLASS.plain), !this.props.isBandColumnsUsed);
  }

  private getTreeView(): JSX.Element {
    const {
      treeViewRef,
      treeViewConfig,
      treeViewSelectModeConfig,
      treeViewDragAndDropModeConfig,
    } = this.props;

    return (
      <TreeView
        componentRef={treeViewRef}
        dataStructure='plain'
        activeStateEnabled={true}
        focusStateEnabled={true}
        hoverStateEnabled={true}
        rootValue={null}

        searchEditorOptions={treeViewConfig.searchEditorOptions}
        searchEnabled={treeViewConfig.searchEnabled}
        searchTimeout={treeViewConfig.searchTimeout}
        noDataText={treeViewConfig.noDataText}

        items={treeViewConfig.items}
        {
          ...(
            this.isSelectMode()
              ? treeViewSelectModeConfig
              : treeViewDragAndDropModeConfig
          )
        }
      ></TreeView>
    );
  }

  private readonly getColumnByIndex = (index: number): Column => {
    const treeView = this.props.treeViewRef.current;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const column = treeView!.getNodes()[index].itemData!.column as Column;

    return column;
  };
}
