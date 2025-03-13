/* eslint-disable spellcheck/spell-checker */
import type { ColumnChooserMode } from '@js/common/grids';
import messageLocalization from '@js/localization/message';
import type { Properties as ButtonProperties } from '@js/ui/button';
import type { Properties as PopupProperties } from '@js/ui/popup';
import type dxPopup from '@js/ui/popup';
import { current, isGeneric, isMaterial } from '@js/ui/themes';
import type { ContentReadyEvent, OptionChangedEvent, Properties as TreeViewProperties } from '@js/ui/tree_view';
import type { MapMaybeSubscribable, SubsGets } from '@ts/core/reactive/index';
import { combined, computed, state } from '@ts/core/reactive/index';
import { createRef } from 'inferno';

import { ColumnsController } from '../columns_controller/columns_controller';
import { CLASSES as ContentViewClasses } from '../content_view/content_view';
import { View } from '../core/view';
import { OptionsController } from '../options_controller/options_controller';
import { ToolbarController } from '../toolbar/controller';
import type { PredefinedToolbarItem } from '../toolbar/types';
import type { ColumnChooserProps } from './column_chooser';
import { ColumnChooser } from './column_chooser';
import { ColumnChooserController } from './controller';

const COLUMN_CHOOSER_CLASS = 'column-chooser';
const COLUMN_CHOOSER_BUTTON_CLASS = 'column-chooser-button';
const COLUMN_CHOOSER_LIST_CLASS = 'column-chooser-list';
const COLUMN_CHOOSER_PLAIN_CLASS = 'column-chooser-plain';
const COLUMN_CHOOSER_DRAG_CLASS = 'column-chooser-mode-drag';
const COLUMN_CHOOSER_SELECT_CLASS = 'column-chooser-mode-select';

export class ColumnChooserView extends View<ColumnChooserProps> {
  protected override component = ColumnChooser;

  private readonly popupVisible = state(false);

  public readonly popupRef = createRef<dxPopup>();

  private readonly mode: SubsGets<ColumnChooserMode>;

  public static dependencies = [
    ToolbarController, ColumnsController, ColumnChooserController, OptionsController,
  ] as const;

  constructor(
    private readonly toolbarController: ToolbarController,
    private readonly columnChooserController: ColumnChooserController,
    private readonly options: OptionsController,
  ) {
    super();

    this.mode = computed(
      (v) => (v ?? 'select') as ColumnChooserMode,
      [this.options.oneWay('columnChooser.mode')],
    );

    this.toolbarController.addDefaultItem(
      computed(
        (enabled) => ({
          name: 'columnChooserButton',
          widget: 'dxButton',
          options: {
            icon: 'column-chooser',
            onClick: () => { this.popupVisible.update(true); },
            elementAttr: {
              'aria-haspopup': 'dialog',
              class: this.addWidgetPrefix(COLUMN_CHOOSER_BUTTON_CLASS),
            },
          } as ButtonProperties,
          showText: 'inMenu',
          location: 'after',
          locateInMenu: 'auto',
          visible: enabled,
        } as PredefinedToolbarItem),
        [this.options.oneWay('columnChooser.enabled')],
      ),
    );
  }

  public show(): void {
    this.popupVisible.update(true);
  }

  public hide(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.popupRef.current?.hide();
  }

  // TODO: move it to the other place
  private addWidgetPrefix(cssClass: string): string {
    return `dx-cardview-${cssClass}`;
  }

  protected override getProps(): SubsGets<ColumnChooserProps> {
    let treeViewScrollTop = 0;

    return combined({
      popupRef: this.popupRef,
      treeViewRef: this.columnChooserController.treeViewRef,

      visible: this.popupVisible,
      mode: this.mode,

      popupConfig: combined({
        shading: false,
        showCloseButton: this.isMaterialOrGeneric(),
        dragEnabled: true,
        resizeEnabled: true,
        wrapperAttr: { class: this.addWidgetPrefix(COLUMN_CHOOSER_CLASS) },
        _loopFocus: true,

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

        toolbarItems: computed(
          (title) => {
            const items = [
              { text: title, toolbar: 'top', location: this.isMaterialOrGeneric() ? 'before' : 'center' },
            ];

            if (!this.isMaterialOrGeneric()) {
              // @ts-expect-error
              items.push({ shortcut: 'cancel' });
            }

            return items;
          },
          [this.options.oneWay('columnChooser.title')],
        ),

        onShown: () => { this.setPopupAttributes(); },
        onHidden: () => { this.popupVisible.update(false); },
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

        ...this.getTreeViewConfig(),
      } as MapMaybeSubscribable<TreeViewProperties>),
    });
  }

  protected getTreeViewConfig(): MapMaybeSubscribable<TreeViewProperties> {
    const mode = this.mode.unreactive_get();

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

  private isMaterialOrGeneric(): boolean {
    const theme = current();

    return isMaterial(theme) || isGeneric(theme);
  }

  private setPopupAttributes(): void {
    const isSelectMode = this.mode.unreactive_get() === 'select';
    const isBandColumnsUsed = false; // TODO: band columns aren't yet implemented in cardview
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const popup = this.popupRef.current as any;

    popup.setAria({
      role: 'dialog',
      label: messageLocalization.format('dxDataGrid-columnChooserTitle'),
    });

    popup.$wrapper()
      .toggleClass(this.addWidgetPrefix(COLUMN_CHOOSER_DRAG_CLASS), !isSelectMode)
      .toggleClass(this.addWidgetPrefix(COLUMN_CHOOSER_SELECT_CLASS), isSelectMode);

    popup.$content().addClass(this.addWidgetPrefix(COLUMN_CHOOSER_LIST_CLASS));

    if (isSelectMode && !isBandColumnsUsed) {
      popup.$content().addClass(this.addWidgetPrefix(COLUMN_CHOOSER_PLAIN_CLASS));
    }
  }
}
