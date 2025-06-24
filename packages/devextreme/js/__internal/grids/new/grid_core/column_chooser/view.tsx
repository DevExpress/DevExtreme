import type { ColumnChooserMode } from '@js/common/grids';
import type { DxElement } from '@js/core/element';
import type { Properties as ButtonProperties } from '@js/ui/button';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import type dxPopup from '@js/ui/popup';
import type { Properties as TreeViewProperties } from '@js/ui/tree_view';
import type dxTreeView from '@js/ui/tree_view';
import type { ReadonlySignal } from '@ts/core/reactive/index';
import { computed, signal } from '@ts/core/reactive/index';
import { createRef } from 'inferno';

import type { Props as ColumnSortableProps } from '../../card_view/header_panel/column_sortable';
import { ColumnsController } from '../columns_controller/index';
import { View } from '../core/view';
import { OptionsController } from '../options_controller/options_controller';
import { ToolbarController } from '../toolbar/controller';
import type { DefaultToolbarItem } from '../toolbar/types';
import { addWidgetPrefix } from '../utils/common';
import type { ColumnChooserProps } from './column_chooser';
import { CLASS, ColumnChooser } from './column_chooser';
import { ColumnChooserController } from './controller';

export class ColumnChooserView extends View<ColumnChooserProps> {
  protected override component = ColumnChooser;

  private readonly popupVisible = signal(false);

  public readonly popupRef = createRef<dxPopup>();

  public readonly treeViewRef = createRef<dxTreeView>();

  public readonly mode: ReadonlySignal<ColumnChooserMode>;

  public dragModeOpened: ReadonlySignal<boolean>;

  private toolbarButtonElement: DxElement | undefined = undefined;

  private readonly selectModeConfig: ReadonlySignal<TreeViewProperties> = computed(() => ({
    showCheckBoxesMode: this.options.oneWay('columnChooser.selection.allowSelectAll').value
      ? 'selectAll'
      : 'normal',
    selectByClick: this.options.oneWay('columnChooser.selection.selectByClick').value,
    onSelectionChanged: this.columnChooserController.onSelectionChanged.bind(
      this.columnChooserController,
    ),
  }));

  private readonly dragAndDropModeConfig: ReadonlySignal<TreeViewProperties> = computed(() => ({
    noDataText: this.options.oneWay('columnChooser.emptyPanelText').value,
    activeStateEnabled: false,
  }));

  private readonly popupToolbarItems: ReadonlySignal<ToolbarItem[]> = computed(() => {
    const title = this.options.oneWay('columnChooser.title').value;
    const items = [
      { text: title, toolbar: 'top', location: 'before' },
    ] as ToolbarItem[];

    return items;
  });

  public static dependencies = [
    ToolbarController, ColumnChooserController, ColumnsController, OptionsController,
  ] as const;

  constructor(
    private readonly toolbarController: ToolbarController,
    private readonly columnChooserController: ColumnChooserController,
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
  ) {
    super();

    this.mode = this.options.oneWay('columnChooser.mode');

    this.dragModeOpened = computed(
      () => this.popupVisible.value && this.mode.value === 'dragAndDrop',
    );

    this.toolbarController.addDefaultItem(
      signal({
        name: 'columnChooserButton',
        widget: 'dxButton',
        options: {
          icon: 'column-chooser',
          onContentReady: ({ element }) => {
            this.toolbarButtonElement = element;
          },
          onClick: () => { this.popupVisible.value = true; },
          elementAttr: {
            'aria-haspopup': 'dialog',
            class: addWidgetPrefix(CLASS.toolbarBtn),
          },
        } as ButtonProperties,
        showText: 'inMenu',
        location: 'after',
        locateInMenu: 'auto',
        visible: true,
      } as DefaultToolbarItem),
      this.options.oneWay('columnChooser.enabled'),
    );
  }

  public show(): void {
    this.popupVisible.value = true;
  }

  public hide(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.popupRef.current?.hide();
  }

  protected override getProps(): ReadonlySignal<ColumnChooserProps> {
    return computed(() => ({
      popupRef: this.popupRef,
      treeViewRef: this.treeViewRef,

      visible: this.popupVisible.value,
      mode: this.mode.value,
      title: this.options.oneWay('columnChooser.title').value,
      chooserColumns: this.columnChooserController.chooserColumns.value,
      visibleColumns: this.columnsController.visibleColumns.value,
      // TODO: band columns aren't yet implemented in cardview
      isBandColumnsUsed: false,

      onColumnMove: this.columnChooserController.onColumnMove,

      popupConfig: {
        width: this.options.oneWay('columnChooser.width').value,
        height: this.options.oneWay('columnChooser.height').value,
        container: this.options.oneWay('columnChooser.container').value,
        position: this.options.oneWay('columnChooser.position').value,
        toolbarItems: this.popupToolbarItems.value,

        onHidden: () => {
          this.popupVisible.value = false;
          this.toolbarButtonElement?.focus();
        },
      } as PopupProperties,

      treeViewConfig: {
        searchEditorOptions: this.options.oneWay('columnChooser.search.editorOptions').value,
        searchEnabled: this.options.oneWay('columnChooser.search.enabled').value,
        searchTimeout: this.options.oneWay('columnChooser.search.timeout').value,

        items: this.columnChooserController.items.value,
      } as TreeViewProperties,

      treeViewSelectModeConfig: this.selectModeConfig.value,
      treeViewDragAndDropModeConfig: this.dragAndDropModeConfig.value,

      sortableConfig: {
        isColumnDraggable: this.columnChooserController.isColumnDraggable,
        onDragStart: this.columnChooserController.onDragStart,
        onDragEnd: this.columnChooserController.onDragEnd,
        onPlaceholderPrepared: this.columnChooserController.onPlaceholderPrepared,
      } as Partial<ColumnSortableProps>,
    }));
  }
}
