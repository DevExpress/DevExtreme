/* eslint-disable spellcheck/spell-checker */
import type { ColumnChooserMode } from '@js/common/grids';
import type { Properties as ButtonProperties } from '@js/ui/button';
import type { Properties as PopupProperties } from '@js/ui/popup';
import type { ContentReadyEvent, OptionChangedEvent, Properties as TreeViewProperties } from '@js/ui/tree_view';
import type { MapMaybeSubscribable, SubsGets } from '@ts/core/reactive/index';
import { combined, computed, state } from '@ts/core/reactive/index';

import { ColumnsController } from '../columns_controller/columns_controller';
import { View } from '../core/view';
import { OptionsController } from '../options_controller/options_controller';
import { ToolbarController } from '../toolbar/controller';
import type { ColumnChooserProps } from './column_chooser';
import { ColumnChooser } from './column_chooser';
import { ColumnChooserController } from './controller';

export class ColumnChooserView extends View<ColumnChooserProps> {
  protected override component = ColumnChooser;

  public readonly visible = state(false);

  public static dependencies = [
    ToolbarController, ColumnsController, ColumnChooserController, OptionsController,
  ] as const;

  constructor(
    private readonly toolbarController: ToolbarController,
    private readonly columnsController: ColumnsController,
    private readonly columnChooserController: ColumnChooserController,
    private readonly options: OptionsController,
  ) {
    super();

    this.toolbarController.addDefaultItem({
      name: 'columnChooserButton',
      widget: 'dxButton',
      options: {
        icon: 'column-chooser',
        onClick: () => { this.visible.updateFunc((value) => !value); },
        elementAttr: { 'aria-haspopup': 'dialog' },
      } as ButtonProperties,
      showText: 'inMenu',
      location: 'after',
      locateInMenu: 'auto',
    });
  }

  protected override getProps(): SubsGets<ColumnChooserProps> {
    const mode = computed(
      (v) => (v ?? 'select') as ColumnChooserMode,
      [this.options.oneWay('columnChooser.mode')],
    );

    let treeViewScrollTop = 0;

    return combined({
      treeViewRef: this.columnChooserController.treeViewRef,

      visible: this.visible,
      columns: this.columnsController.columns,

      mode,

      popupConfig: combined({
        shading: false,
        showCloseButton: true,
        dragEnabled: true,
        resizeEnabled: true,
        _loopFocus: true,

        width: this.options.oneWay('columnChooser.width'),
        height: this.options.oneWay('columnChooser.height'),
        container: this.options.oneWay('columnChooser.container'),
        rtlEnabled: this.options.oneWay('rtlEnabled'),

        // position: computed(
        //   (v) => v ?? {
        //     my: 'right bottom',
        //     at: 'right bottom',
        //     of: this.contentView.containerRef?.current,
        //     collision: 'fit',
        //     offset: '-2 -2',
        //     boundaryOffset: '2 2',
        //   },
        //   [this.options.oneWay('columnChooser.position')],
        // ),

        toolbarItems: computed(
          (title) => [
            { text: title, toolbar: 'top', location: 'center' },
          ],
          [this.options.oneWay('columnChooser.title')],
        ),

        onHidden: this.onPopupHidden.bind(this),
      } as MapMaybeSubscribable<PopupProperties>),

      treeViewConfig: combined({
        dataStructure: 'plain',
        activeStateEnabled: true,
        focusStateEnabled: true,
        hoverStateEnabled: true,
        rootValue: null,

        searchEditorOptions: this.options.oneWay('columnChooser.search.editorOptions'),
        searchEnabled: this.options.oneWay('columnChooser.search.enabled'),
        searchTimeout: this.options.oneWay('columnChooser.search.timeout'),

        onOptionChanged: (e: OptionChangedEvent) => {
          if (e.fullName === 'items') {
            treeViewScrollTop = e.component.getScrollable().scrollTop();
          }
        },
        onContentReady: (e: ContentReadyEvent) => {
          e.component.getScrollable().scrollTo({ top: treeViewScrollTop });
        },

        ...this.getTreeViewConfig(mode.unreactive_get()),
      } as MapMaybeSubscribable<TreeViewProperties>),
    });
  }

  protected getTreeViewConfig(mode: ColumnChooserMode): MapMaybeSubscribable<TreeViewProperties> {
    if (mode === 'select') {
      const controller = this.columnChooserController;

      return {
        items: controller.items,
        showCheckBoxesMode: computed(
          (v) => (v ? 'selectAll' : 'normal'),
          [this.options.oneWay('columnChooser.selection.allowSelectAll')],
        ),
        selectByClick: this.options.oneWay('columnChooser.selection.selectByClick'),
        onSelectionChanged: controller.onSelectionChanged.bind(controller),
      };
    }

    return {};
  }

  private onPopupHidden(): void {
    this.visible.update(false);
  }
}
