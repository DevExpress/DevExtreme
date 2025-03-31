/* eslint-disable spellcheck/spell-checker */
import type { ColumnChooserMode } from '@js/common/grids';
import type { Properties as ButtonProperties } from '@js/ui/button';
import type { Properties as PopupProperties } from '@js/ui/popup';
import type dxPopup from '@js/ui/popup';
import type { Properties as TreeViewProperties } from '@js/ui/tree_view';
import type dxTreeView from '@js/ui/tree_view';
import type { MapMaybeSubscribable, SubsGets } from '@ts/core/reactive/index';
import {
  combined, computed, state,
} from '@ts/core/reactive/index';
import { createRef } from 'inferno';

import { CLASSES as ContentViewClasses } from '../content_view/content_view';
import { View } from '../core/view';
import { OptionsController } from '../options_controller/options_controller';
import { ToolbarController } from '../toolbar/controller';
import type { PredefinedToolbarItem } from '../toolbar/types';
import { addWidgetPrefix } from '../utils';
import type { ColumnChooserProps } from './column_chooser';
import { CLASS, ColumnChooser } from './column_chooser';
import { ColumnChooserController } from './controller';
import { DxElement } from '@js/core/element';

export class ColumnChooserView extends View<ColumnChooserProps> {
  protected override component = ColumnChooser;

  private readonly popupVisible = state(false);

  public readonly popupRef = createRef<dxPopup>();

  public readonly treeViewRef = createRef<dxTreeView>();

  private readonly mode: SubsGets<ColumnChooserMode>;

  private toolbarButtonElement: DxElement | undefined = undefined;

  public static dependencies = [
    ToolbarController, ColumnChooserController, OptionsController,
  ] as const;

  constructor(
    private readonly toolbarController: ToolbarController,
    private readonly columnChooserController: ColumnChooserController,
    private readonly options: OptionsController,
  ) {
    super();

    this.mode = this.options.oneWay('columnChooser.mode');

    this.toolbarController.addDefaultItem(
      {
        name: 'columnChooserButton',
        widget: 'dxButton',
        options: {
          icon: 'column-chooser',
          onContentReady: ({ element }) => {
            this.toolbarButtonElement = element;
          },
          onClick: () => { this.popupVisible.update(true); },
          elementAttr: {
            'aria-haspopup': 'dialog',
            class: addWidgetPrefix(CLASS.toolbarBtn),
          },
        } as ButtonProperties,
        showText: 'inMenu',
        location: 'after',
        locateInMenu: 'auto',
        visible: true,
      } as PredefinedToolbarItem,
      this.options.oneWay('columnChooser.enabled'),
    );
  }

  public show(): void {
    this.popupVisible.update(true);
  }

  public hide(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.popupRef.current?.hide();
  }

  protected override getProps(): SubsGets<ColumnChooserProps> {
    return combined({
      popupRef: this.popupRef,
      treeViewRef: this.treeViewRef,

      visible: this.popupVisible,
      mode: this.mode,
      title: this.options.oneWay('columnChooser.title'),

      popupConfig: combined({
        width: this.options.oneWay('columnChooser.width'),
        height: this.options.oneWay('columnChooser.height'),
        container: this.options.oneWay('columnChooser.container'),
        rtlEnabled: this.options.oneWay('rtlEnabled'),

        position: computed(
          (v) => v ?? {
            my: 'right bottom',
            at: 'right bottom',
            of: ContentViewClasses.contentView,
            collision: 'fit',
            offset: '-2 -2',
            boundaryOffset: '2 2',
          },
          [this.options.oneWay('columnChooser.position')],
        ),

        onHidden: () => {
          this.popupVisible.update(false);
          this.toolbarButtonElement?.focus();
        },
      } as MapMaybeSubscribable<PopupProperties>),

      treeViewConfig: combined({
        rtlEnabled: this.options.oneWay('rtlEnabled'),

        searchEditorOptions: this.options.oneWay('columnChooser.search.editorOptions'),
        searchEnabled: this.options.oneWay('columnChooser.search.enabled'),
        searchTimeout: this.options.oneWay('columnChooser.search.timeout'),
      } as MapMaybeSubscribable<TreeViewProperties>),

      treeViewSelectModeConfig: this.getSelectModeConfig(),
      treeViewDragAndDropModeConfig: this.getDragAndDropModeConfig(),
    });
  }

  private getSelectModeConfig(): SubsGets<TreeViewProperties> {
    const controller = this.columnChooserController;

    return combined({
      items: controller.items,
      showCheckBoxesMode: computed(
        (v) => (v ? 'selectAll' : 'normal'),
        [this.options.oneWay('columnChooser.selection.allowSelectAll')],
      ),
      selectByClick: this.options.oneWay('columnChooser.selection.selectByClick'),
      onSelectionChanged: controller.onSelectionChanged.bind(controller),
    });
  }

  private getDragAndDropModeConfig(): SubsGets<TreeViewProperties> {
    return combined({});
  }
}
