/* eslint-disable max-classes-per-file */
import '@ts/ui/list/modules/search';
import '@ts/ui/list/modules/selection';

import type { ChangedOptionInfo, NativeEventInfo } from '@js/common/core/events';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isFunction } from '@js/core/utils/type';
import type dxCheckBox from '@js/ui/check_box';
import type { ValueChangedInfo } from '@js/ui/editor/editor';
import type dxList from '@js/ui/list';
import Popup from '@js/ui/popup/ui.popup';
import type { SearchBoxMixinOptions } from '@js/ui/widget/ui.search_box_mixin';
import type { ColumnStateOptions, IndicatorOptions } from '@ts/grids/grid_core/column_state_mixin/types';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import Modules from '@ts/grids/grid_core/modules/modules';
import type { ModuleType, OptionChanged } from '@ts/grids/grid_core/types';
import type { ColumnsView } from '@ts/grids/grid_core/views/columns_view';
import List from '@ts/ui/list/list.edit.search';
import type { TreeViewBaseProperties } from '@ts/ui/tree_view/tree_view.base';
import TreeView from '@ts/ui/tree_view/tree_view.search';

import gridCoreUtils from '../utils';
import type {
  HeaderFilterGroup,
  HeaderFilterItem,
  HeaderFilterOptions,
  HeaderFilterValues,
  HeaderFilterViewOptions,
} from './types';
import { allowHeaderFiltering } from './utils';

type CheckBoxValueChangedEvent = NativeEventInfo<dxCheckBox> & ValueChangedInfo;
type CheckBoxValueChangedHandler = (event: CheckBoxValueChangedEvent) => void;

const HEADER_FILTER_CLASS = 'dx-header-filter';
const HEADER_FILTER_MENU_CLASS = 'dx-header-filter-menu';

const DEFAULT_SEARCH_EXPRESSION = 'text';
const HANDLER_DECORATED_KEY = Symbol('HANDLER_DECORATED_KEY');

function resetChildrenItemSelection(items: HeaderFilterItem[] | null | undefined): void {
  if (!items) {
    return;
  }

  for (const item of items) {
    item.selected = false;
    resetChildrenItemSelection(item.items);
  }
}

function getSelectAllCheckBox(
  listComponent: Pick<List | TreeView, 'NAME' | '$element'>,
): dxCheckBox | undefined {
  const selector = listComponent.NAME === 'dxTreeView' ? '.dx-treeview-select-all-item' : '.dx-list-select-all-checkbox';
  // @ts-expect-error dxCheckBox is added to the renderer at runtime
  const selectAllCheckBox: dxCheckBox | undefined = listComponent.$element().find(selector).dxCheckBox('instance');

  return selectAllCheckBox;
}

function getListSelectAllValueChangedHandler(
  selectAllCheckBox: dxCheckBox,
  listComponent: dxList,
): CheckBoxValueChangedHandler {
  const originalHandler = selectAllCheckBox.option('onValueChanged') as CheckBoxValueChangedHandler;

  if (originalHandler?.[HANDLER_DECORATED_KEY]) {
    return originalHandler;
  }

  const handler = (originalEvent: CheckBoxValueChangedEvent): void => {
    const { event, value } = originalEvent;
    const isEventFromUI = !!event;

    event?.stopPropagation();

    switch (true) {
      case isEventFromUI && value === true:
        listComponent.selectAll();
        return;
      case isEventFromUI && value === false:
        listComponent.unselectAll();
        return;
      default:
        originalHandler?.(originalEvent);
    }
  };
  handler[HANDLER_DECORATED_KEY] = true;

  return handler;
}

// NOTE: T1284200 fix + after T1293295 regression fix
// We take control of list's select all checkbox on our side
// It's temporary solution, in future we should implement this functionality in list
// or change our HeaderFilter UX behavior
function decorateListSelectAllValueChanged(
  listComponent: dxList,
): void {
  const selectAllCheckBox = getSelectAllCheckBox(listComponent);
  if (!selectAllCheckBox) {
    return;
  }

  const handler = getListSelectAllValueChangedHandler(selectAllCheckBox, listComponent);
  selectAllCheckBox.option('onValueChanged', handler);
}

function updateListSelectAllState(
  listComponent: dxList,
  filterValues: HeaderFilterValues | null | undefined,
): void {
  if (listComponent.option('searchValue')) {
    return;
  }

  const selectAllCheckBox = getSelectAllCheckBox(listComponent);

  if (selectAllCheckBox && filterValues?.length) {
    selectAllCheckBox.option('value', undefined);
  }
}

export function updateHeaderFilterItemSelectionState(
  item: HeaderFilterItem,
  filterValuesMatch: boolean,
  isExcludeFilter: boolean,
): void {
  if (filterValuesMatch === isExcludeFilter) {
    if (isExcludeFilter || item.selected) {
      item.selected = false;
      resetChildrenItemSelection(item.items);
    }

    return;
  }

  item.selected = true;

  if (isExcludeFilter && item.items) {
    for (const childItem of item.items) {
      if (!childItem.selected) {
        item.selected = undefined;
        break;
      }
    }
  }
}

export class HeaderFilterView extends Modules.View {
  private _popupContainer?: Popup;

  private _listComponent?: List | TreeView;

  private getPopupContainer(): Popup | undefined {
    return this._popupContainer;
  }

  private getListComponent(): List | TreeView | undefined {
    return this._listComponent;
  }

  private applyHeaderFilter(options: HeaderFilterViewOptions): void {
    // @ts-expect-error the list is created here
    const list: List | TreeView = this.getListComponent();
    const searchValue = (list as List).option('searchValue');
    const selectAllCheckBox = getSelectAllCheckBox(list);
    const isAllSelected = !searchValue && !options.isFilterBuilder && selectAllCheckBox?.option('value');
    const filterValues: HeaderFilterValues = [];

    const fillSelectedItemKeys = (
      selectedValues: HeaderFilterValues,
      items: HeaderFilterItem[] | undefined,
      isExclude: boolean,
    ): void => {
      each(items, (_, item) => {
        if (item.selected !== undefined && !!item.selected !== isExclude) {
          const node = (list as TreeView)._getNode(item);
          // @ts-expect-error every item of the tree has a node
          const hasChildren = (list as TreeView)._hasChildren(node);
          const hasChildrenWithSelection = hasChildren
            && item.items?.some((childItem) => childItem.selected);

          if (!searchValue || !hasChildrenWithSelection) {
            selectedValues.push(item.value);
            return;
          }
        }

        if (item.items?.length) {
          fillSelectedItemKeys(selectedValues, item.items, isExclude);
        }
      });
    };

    if (!isAllSelected) {
      if (options.type === 'tree') {
        if (options.filterType) {
          options.filterType = 'include';
        }

        fillSelectedItemKeys(filterValues, (list as TreeView).option('items'), false);
        options.filterValues = filterValues;
      }
    } else {
      if (options.type === 'tree') {
        options.filterType = 'exclude';
      }

      if (Array.isArray(options.filterValues)) {
        options.filterValues = [];
      }
    }

    if (options.filterValues && !options.filterValues.length) {
      options.filterValues = null; // T500956
    }

    options.apply();

    this.hideHeaderFilterMenu();
  }

  public showHeaderFilterMenu(
    $columnElement: dxElementWrapper,
    options: HeaderFilterViewOptions,
  ): void {
    if (options) {
      this._initializePopupContainer(options);

      // @ts-expect-error the popup is created here
      const popupContainer: Popup = this.getPopupContainer();

      this.hideHeaderFilterMenu();
      this.updatePopup($columnElement, options);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      popupContainer.show();
    }
  }

  public hideHeaderFilterMenu(): void {
    const headerFilterMenu = this.getPopupContainer();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
    headerFilterMenu?.hide();
  }

  private updatePopup($element: dxElementWrapper, options: HeaderFilterViewOptions): void {
    const showColumnLines = this.option('showColumnLines');
    const alignment = (options.alignment === 'right') !== !showColumnLines ? 'left' : 'right';

    if (this._popupContainer) {
      this._popupContainer.setAria({
        role: 'dialog',
        label: messageLocalization.format('dxDataGrid-headerFilterLabel'),
      });

      this._cleanPopupContent();
      this._popupContainer.option('position', {
        my: `${alignment} top`,
        at: `${alignment} bottom`,
        of: $element,
        collision: 'fit fit', // T1156848
      });
    }
  }

  protected _getSearchExpr(
    options: HeaderFilterViewOptions,
    headerFilterOptions: HeaderFilterOptions,
  ): SearchBoxMixinOptions['searchExpr'] {
    const { lookup } = options;
    const { useDefaultSearchExpr } = options;

    const headerFilterDataSource = headerFilterOptions.dataSource;
    const filterSearchExpr = headerFilterOptions.search.searchExpr;

    if (filterSearchExpr) {
      return filterSearchExpr;
    }

    if (
      useDefaultSearchExpr
      || (isDefined(headerFilterDataSource) && !isFunction(headerFilterDataSource))
    ) {
      return DEFAULT_SEARCH_EXPRESSION;
    }

    if (lookup) {
      return lookup.displayExpr || 'this';
    }

    if (options.dataSource) {
      // @ts-expect-error only the header filter's own data source reaches this line
      const { group }: { group: HeaderFilterGroup } = options.dataSource;
      if (Array.isArray(group) && group.length > 0) {
        return group[0].selector;
      } if (isFunction(group) && !options.remoteFiltering) {
        return group;
      }
    }

    return options.dataField || options.selector;
  }

  private _cleanPopupContent(): void {
    this._popupContainer?.$content()?.empty();
  }

  private _initializePopupContainer(options: HeaderFilterViewOptions): void {
    const $element = this.element();

    const headerFilterOptions = this._normalizeHeaderFilterOptions(options);
    const { hidePopupCallback } = options;
    const { height, width } = headerFilterOptions;

    const dxPopupOptions = {
      width,
      height,
      visible: false,
      shading: false,
      showTitle: false,
      showCloseButton: false,
      hideOnParentScroll: false, // T756320
      dragEnabled: false,
      hideOnOutsideClick: true,
      wrapperAttr: { class: HEADER_FILTER_MENU_CLASS },
      focusStateEnabled: false,
      toolbarItems: [
        {
          toolbar: 'bottom' as const,
          location: 'after' as const,
          widget: 'dxButton' as const,
          options: {
            text: headerFilterOptions.texts.ok
              ?? messageLocalization.format('dxDataGrid-headerFilterOK'),
            onClick: (): void => {
              this.applyHeaderFilter(options);
            },
          },
        },
        {
          toolbar: 'bottom' as const,
          location: 'after' as const,
          widget: 'dxButton' as const,
          options: {
            text: headerFilterOptions.texts.cancel
              ?? messageLocalization.format('dxDataGrid-headerFilterCancel'),
            onClick: (): void => {
              this.hideHeaderFilterMenu();
              hidePopupCallback?.();
            },
          },
        },
      ],
      resizeEnabled: true,
      onShowing: (e): void => {
        e.component.$content().parent().addClass('dx-dropdowneditor-overlay');
        this._initializeListContainer(options, headerFilterOptions);
        options.onShowing?.(e);
      },
      onShown: (): void => {
        // @ts-expect-error the list is created here
        this.getListComponent().focus();
      },
      onHidden: options.onHidden,
      onInitialized(e): void {
        const { component } = e;
        // T321243
        component.option('animation', component._getDefaultOptions().animation);
      },
      tabFocusLoopEnabled: true,
    };

    if (!isDefined(this._popupContainer)) {
      // @ts-expect-error the view is rendered here
      this._popupContainer = this._createComponent($element, Popup, dxPopupOptions);
    } else {
      this._popupContainer.option(dxPopupOptions);
    }
  }

  private _initializeListContainer(
    options: HeaderFilterViewOptions,
    headerFilterOptions: HeaderFilterOptions,
  ): void {
    const $content: dxElementWrapper = $(this._popupContainer?.content());
    const needShowSelectAllCheckbox = !options.isFilterBuilder
      && headerFilterOptions.allowSelectAll;
    const widgetOptions = {
      searchEnabled: headerFilterOptions.search.enabled,
      searchTimeout: headerFilterOptions.search.timeout,
      searchEditorOptions: headerFilterOptions.search.editorOptions,
      searchMode: headerFilterOptions.search.mode ?? '',
      dataSource: options.dataSource,
      onContentReady: (): void => {
        this.renderCompleted.fire();
      },
      itemTemplate(data, _, element): dxElementWrapper {
        const $element = $(element);
        if (options.encodeHtml !== false) {
          return $element.text(data.text);
        }

        return $element.html(data.text);
      },
    };

    const shouldChangeSelectAllCheckBoxVisibility = (): boolean | undefined => (
      needShowSelectAllCheckbox
      && this.option('headerFilter.hideSelectAllOnSearch') !== false
    );

    const onTreeViewOptionChanged = (
      event: ChangedOptionInfo & {
        component: TreeView;
      },
    ): void => {
      switch (true) {
        case event.fullName === 'searchValue' && shouldChangeSelectAllCheckBoxVisibility():
          event.component.option('showCheckBoxesMode', event.value ? 'normal' : 'selectAll');
          break;
        // TODO TreeView: remove this WA after Navigation squad re-render fix
        // NOTE: WA for TreeView re-render after changing the "showCheckBoxesMode" option
        // After this option change the whole TreeView re-render and search input loose the focus
        case event.fullName === 'showCheckBoxesMode':
          // NOTE: the TreeView render is async
          // So we should focus the searchEditor only after render will be completed
          Promise.resolve()
            .then(() => {
              event.component.getSearchBoxController().focus();
            })
            .catch(() => {});
          break;
        default:
          break;
      }
    };

    const onListOptionChanged = (
      event: ChangedOptionInfo & {
        component: dxList;
      },
    ): void => {
      if (event.fullName === 'searchValue' && shouldChangeSelectAllCheckBoxVisibility()) {
        event.component.option('selectionMode', event.value ? 'multiple' : 'all');
      }
    };

    if (options.type === 'tree') {
      const treeViewOptions: Pick<
        TreeViewBaseProperties,
        'showCheckBoxesMode' | 'onOptionChanged' | 'keyExpr'
      > = {
        showCheckBoxesMode: needShowSelectAllCheckbox ? 'selectAll' : 'normal',
        // @ts-expect-error the handler takes the internal TreeView, not the public one
        onOptionChanged: onTreeViewOptionChanged,
        keyExpr: 'id',
      };

      this._listComponent = this._createComponent(
        $('<div>').appendTo($content),
        TreeView,
        // @ts-expect-error the data source loads header filter items, an unset searchMode is ''
        extend(widgetOptions, treeViewOptions),
      );
    } else {
      this._listComponent = this._createComponent(
        $('<div>').appendTo($content),
        List,
        // @ts-expect-error the data source loads header filter items, an unset searchMode is ''
        extend(widgetOptions, {
          searchExpr: this._getSearchExpr(options, headerFilterOptions),
          pageLoadMode: 'scrollBottom' as const,
          showSelectionControls: true,
          selectionMode: needShowSelectAllCheckbox ? 'all' as const : 'multiple' as const,
          onOptionChanged: onListOptionChanged,
          onSelectionChanged(event) {
            const { component: listComponent } = event;
            const items = listComponent.option('items');
            const selectedItems = listComponent.option('selectedItems');

            if (!listComponent._selectedItemsUpdating && !listComponent.option('searchValue') && !options.isFilterBuilder) {
              const filterValues = options.filterValues ?? [];
              const isExclude = options.filterType === 'exclude';
              if (
                selectedItems.length === 0
                && items.length
                && (
                  filterValues.length <= 1
                  || (isExclude && filterValues.length === items.length - 1)
                )
              ) {
                options.filterType = 'include';
                options.filterValues = [];
              } else if (selectedItems.length === items.length) {
                options.filterType = 'exclude';
                options.filterValues = [];
              }
            }

            each(items, (index, item) => {
              const selected = gridCoreUtils.getIndexByKey(item, selectedItems, null) >= 0;
              const oldSelected = !!item.selected;

              if (oldSelected !== selected) {
                item.selected = selected;
                options.filterValues ??= [];
                const filterValueIndex = gridCoreUtils.getIndexByKey(
                  item.value,
                  options.filterValues,
                  null,
                );

                if (filterValueIndex >= 0) {
                  options.filterValues.splice(filterValueIndex, 1);
                }

                const isExcludeFilterType = options.filterType === 'exclude';

                if (selected !== isExcludeFilterType) {
                  options.filterValues.push(item.value);
                }
              }
            });

            updateListSelectAllState(listComponent, options.filterValues);
          },
          onContentReady(e) {
            const { component: listComponent } = e;
            const items = listComponent.option('items');
            const selectedItems: HeaderFilterItem[] = [];

            each(items, (_, item) => {
              if (item.selected) {
                selectedItems.push(item);
              }
            });

            listComponent._selectedItemsUpdating = true;
            listComponent.option('selectedItems', selectedItems);
            listComponent._selectedItemsUpdating = false;

            decorateListSelectAllValueChanged(listComponent);
            updateListSelectAllState(listComponent, options.filterValues);
          },
        }),
      );
    }
  }

  private _normalizeHeaderFilterOptions(options: HeaderFilterViewOptions): HeaderFilterOptions {
    const generalHeaderFilter = this.option('headerFilter') ?? {};
    const specificHeaderFilter = options.headerFilter ?? {};

    // @ts-expect-error search is set below, the default options provide texts
    const headerFilterOptions: HeaderFilterOptions = extend(
      true,
      {},
      generalHeaderFilter,
      specificHeaderFilter,
    );

    headerFilterOptions.search ??= {};

    return headerFilterOptions;
  }

  protected _renderCore(): void {
    // @ts-expect-error the view is rendered here
    this.element().addClass(HEADER_FILTER_MENU_CLASS);
  }
}

export const headerFilterMixin = <T extends ModuleType<ColumnsView>>(
  Base: T,
): T => class HeaderFilterMixin extends Base {
  public optionChanged(args: OptionChanged): void {
    if (args.name === 'headerFilter') {
      const requireReady = this.name === 'columnHeadersView';
      this._invalidate(requireReady, requireReady);
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  protected _applyColumnState(options: ColumnStateOptions): dxElementWrapper | undefined {
    const { rootElement } = options;
    const { column } = options;

    if (options.name === 'headerFilter') {
      rootElement.find(`.${HEADER_FILTER_CLASS}`).remove();

      if (!allowHeaderFiltering(column)) {
        return undefined;
      }

      // @ts-expect-error the base _applyColumnState always returns the indicator
      const $headerFilterIndicator: dxElementWrapper = super._applyColumnState(options);

      $headerFilterIndicator.toggleClass('dx-header-filter-empty', this._isHeaderFilterEmpty(column));
      if (!this.option('useLegacyKeyboardNavigation')) {
        $headerFilterIndicator.attr('tabindex', this.option('tabindex') || 0);
      }

      const indicatorLabel = messageLocalization.format('dxDataGrid-headerFilterIndicatorLabel', column.caption);

      this.setAria('label', indicatorLabel, $headerFilterIndicator);
      this.setAria('haspopup', 'dialog', $headerFilterIndicator);
      this.setAria('role', 'button', $headerFilterIndicator);

      return $headerFilterIndicator;
    }

    return super._applyColumnState(options);
  }

  private _isHeaderFilterEmpty(column: Column): boolean {
    return !column.filterValues?.length;
  }

  protected _getIndicatorClassName(name: string): string | undefined {
    if (name === 'headerFilter') {
      return HEADER_FILTER_CLASS;
    }
    return super._getIndicatorClassName(name);
  }

  protected _renderIndicator(options: IndicatorOptions): void {
    const $container = options.container;
    const $indicator = options.indicator;

    if (options.name === 'headerFilter') {
      const endAlignment = this.option('rtlEnabled') ? 'left' : 'right';

      if ($container.children().length && options.columnAlignment === endAlignment) {
        $container.prepend($indicator);
        return;
      }
    }

    super._renderIndicator(options);
  }
};
