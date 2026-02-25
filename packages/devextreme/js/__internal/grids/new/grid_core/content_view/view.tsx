/* eslint-disable
  @typescript-eslint/explicit-function-return-type,
  @typescript-eslint/explicit-module-boundary-types
*/
import $ from '@js/core/renderer';
import messageLocalization from '@js/localization/message';
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import type { ScrollEventInfo } from '@js/ui/scroll_view/ui.scrollable';
import { computed, signal } from '@ts/core/state_manager/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { BaseContextMenuController } from '@ts/grids/new/grid_core/context_menu/controller';
import { View } from '@ts/grids/new/grid_core/core/view';
import { DataController } from '@ts/grids/new/grid_core/data_controller/index';
import { ErrorController } from '@ts/grids/new/grid_core/error_controller/error_controller';
import { KeyboardNavigationController } from '@ts/grids/new/grid_core/keyboard_navigation/index';
import { SearchUIController } from '@ts/grids/new/grid_core/search/index';
import { SelectionController } from '@ts/grids/new/grid_core/selection/controller';
import { createRef } from 'inferno';

import { EditingController } from '../editing/controller';
import { ItemsController } from '../items_controller/items_controller';
import { LifeCycleController } from '../lifecycle/controller';
import { OptionsController } from '../options_controller/options_controller';

export abstract class ContentView<TProps extends {}> extends View<TProps> {
  private readonly isNoData = computed(
    () => {
      const { isLoading, items } = this.dataController;
      const isEmptyDataLoaded = !isLoading.value && items.value.length === 0;
      const isNoVisibleColumns = this.columnsController.visibleColumns.value.length === 0;

      return isEmptyDataLoaded || isNoVisibleColumns;
    },
  );

  public readonly scrollableRef = createRef<dxScrollable>();

  public loadingText = this.options.twoWay('loadPanel.message');

  protected readonly viewportHeight = signal(0);

  protected readonly scrollTop = signal(0);

  protected readonly width = signal(0);

  public static dependencies = [
    DataController,
    OptionsController,
    ErrorController,
    ColumnsController,
    SelectionController,
    ItemsController,
    EditingController,
    BaseContextMenuController,
    SearchUIController,
    KeyboardNavigationController,
    LifeCycleController,
  ] as const;

  constructor(
    protected readonly dataController: DataController,
    protected readonly options: OptionsController,
    protected readonly errorController: ErrorController,
    protected readonly columnsController: ColumnsController,
    protected readonly selectionController: SelectionController,
    protected readonly itemsController: ItemsController,
    protected readonly editingController: EditingController,
    protected readonly contextMenuController: BaseContextMenuController,
    protected readonly searchUIController: SearchUIController,
    protected readonly keyboardNavigationController: KeyboardNavigationController,
    protected readonly lifecycle: LifeCycleController,
  ) {
    super();
  }

  protected getBaseProps() {
    const loadPanelConfig = this.options.oneWay('loadPanel');
    const noDataTextConfig = this.options.oneWay('noDataText');
    const noDataTemplateConfig = this.options.template('noDataTemplate');
    const errorRowEnabledConfig = this.options.oneWay('errorRowEnabled');
    const scrollByContent = this.options.oneWay('scrolling.scrollByContent');
    const scrollByThumb = this.options.oneWay('scrolling.scrollByThumb');
    const showScrollbar = this.options.oneWay('scrolling.showScrollbar');
    const useNativeConfig = this.options.oneWay('scrolling.useNative');

    return {
      loadPanelProps: {
        ...loadPanelConfig.value,
        visible: this.dataController.isLoading.value,
      },
      noDataTextProps: {
        text: noDataTextConfig.value ?? messageLocalization.format('dxDataGrid-noDataText'),
        template: noDataTemplateConfig.value,
        visible: this.isNoData.value,
      },
      errorRowProps: {
        enabled: errorRowEnabledConfig.value,
        errors: this.errorController.errors.value,
      },
      onWidthChange: (width: number): void => {
        this.width.value = width;
      },
      onViewportHeightChange: (height: number) => {
        this.viewportHeight.value = height;
      },
      scrollableRef: this.scrollableRef,
      scrollableProps: {
        onScroll: this.onScroll.bind(this),
        direction: 'both' as const,
        scrollTop: this.scrollTop.value,
        scrollByContent: scrollByContent.value,
        scrollByThumb: scrollByThumb.value,
        showScrollbar: showScrollbar.value,
        useNative: useNativeConfig.value === 'auto' ? undefined : useNativeConfig.value,
        // TODO (Scrollable:useKeyboard) -> remove this WA
        //  after ScrollView private option "useKeyboard" will be extended to useNative: true
        // NOTE: Scrollable container focusable by default
        // To prevent scroll container focus in native mode we set tabindex -1 to container
        // In simulated mode focusable behavior prevented by useKeyboard: false private option
        useKeyboard: false,
        // Bad scrollable types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onInitialized: ({ component }: any) => {
          const useKeyboardDisabled = component.option('useKeyboard') === false;
          const useNativeEnabled = component.option('useNative') === true;
          if (useKeyboardDisabled && useNativeEnabled) {
            $(component.container()).attr('tabindex', -1);
          }
        },
        // Bad scrollable types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onOptionChanged: ({ fullName, value, component }: any) => {
          const useKeyboardDisabled = component.option('useKeyboard') === false;
          if (useKeyboardDisabled && fullName === 'useNative' && value === true) {
            $(component.container()).attr('tabindex', -1);
          }
        },
      },
      showContextMenu: this.showContextMenu.bind(this),
      onRendered: () => {
        this.lifecycle.contentRendered.trigger();
      },
    };
  }

  private showContextMenu(e: MouseEvent): void {
    this.contextMenuController.show(e, 'content');
  }

  private onScroll(e: ScrollEventInfo<unknown>): void {
    this.scrollTop.value = e.scrollOffset.top;
  }
}
