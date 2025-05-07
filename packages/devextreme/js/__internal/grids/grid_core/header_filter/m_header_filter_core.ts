/* eslint-disable max-classes-per-file */
import '@ts/ui/list/modules/m_search';
import '@ts/ui/list/modules/m_selection';

import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDeferred, isDefined, isFunction } from '@js/core/utils/type';
import type dxCheckBox from '@js/ui/check_box';
import type dxList from '@js/ui/list';
import List from '@js/ui/list_light';
import Popup from '@js/ui/popup/ui.popup';
import TreeView from '@js/ui/tree_view';
import Modules from '@ts/grids/grid_core/m_modules';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import gridCoreUtils from '../m_utils';

const HEADER_FILTER_CLASS = 'dx-header-filter';
const HEADER_FILTER_MENU_CLASS = 'dx-header-filter-menu';

const DEFAULT_SEARCH_EXPRESSION = 'text';

function resetChildrenItemSelection(items) {
  items = items || [];
  for (let i = 0; i < items.length; i++) {
    items[i].selected = false;
    resetChildrenItemSelection(items[i].items);
  }
}

function getSelectAllCheckBox(listComponent): dxCheckBox {
  const selector = listComponent.NAME === 'dxTreeView' ? '.dx-treeview-select-all-item' : '.dx-list-select-all-checkbox';

  return listComponent.$element().find(selector).dxCheckBox('instance');
}

function updateListSelectAllState(
  // NOTE: In runtime dxList's "unselectAll" returns Deferred.
  // But in d.ts dxList has a void return type.
  listComponent: Omit<dxList, 'unselectAll'> & { unselectAll: () => (DeferredObj<void> | void) },
  filterValues: any[],
): void {
  if (listComponent.option('searchValue')) {
    return;
  }

  const selectAllCheckBox = getSelectAllCheckBox(listComponent);

  if (selectAllCheckBox && filterValues?.length) {
    selectAllCheckBox.option('value', undefined);

    // NOTE: T1284200 fix
    // We manually set checkbox state (value) above
    // So, list do nothing because inner list component's "select all" state
    // doesn't react to our manual update.
    // Therefore -> we should handle first "select all" checkbox click manually.
    // And after it return original "onValueChanged" handler back.
    const originalValueChanged = selectAllCheckBox.option('onValueChanged');
    selectAllCheckBox.option('onValueChanged', (event) => {
      selectAllCheckBox.option('onValueChanged', originalValueChanged);

      const deferred = listComponent.unselectAll();

      if (isDeferred(deferred)) {
        (deferred as DeferredObj<void>).always(() => { originalValueChanged?.(event); });
      } else {
        originalValueChanged?.(event);
      }
    });
  }
}

export function updateHeaderFilterItemSelectionState(item, filterValuesMatch, isExcludeFilter) {
  if (filterValuesMatch ^ isExcludeFilter) {
    item.selected = true;

    if (isExcludeFilter && item.items) {
      for (let j = 0; j < item.items.length; j++) {
        if (!item.items[j].selected) {
          item.selected = undefined;
          break;
        }
      }
    }
  } else if (isExcludeFilter || item.selected) {
    item.selected = false;
    resetChildrenItemSelection(item.items);
  }
}

export class HeaderFilterView extends Modules.View {
  private _popupContainer: any;

  private _listComponent: any;

  private getPopupContainer() {
    return this._popupContainer;
  }

  private getListComponent() {
    return this._listComponent;
  }

  private applyHeaderFilter(options) {
    const that = this;
    const list = that.getListComponent();
    const searchValue = list.option('searchValue');
    const selectAllCheckBox = getSelectAllCheckBox(list);
    const isAllSelected = !searchValue && !options.isFilterBuilder && selectAllCheckBox?.option('value');
    const filterValues = [];

    const fillSelectedItemKeys = function (filterValues, items, isExclude) {
      each(items, (_, item) => {
        if (item.selected !== undefined && (!!item.selected as any) ^ isExclude) {
          const node = list._getNode(item);
          const hasChildren = list._hasChildren(node);
          const hasChildrenWithSelection = hasChildren && item.items && item.items.some((item) => item.selected);

          if (!searchValue || !hasChildrenWithSelection) {
            filterValues.push(item.value);
            return;
          }
        }

        if (item.items && item.items.length) {
          fillSelectedItemKeys(filterValues, item.items, isExclude);
        }
      });
    };

    if (!isAllSelected) {
      if (options.type === 'tree') {
        if (options.filterType) {
          options.filterType = 'include';
        }

        fillSelectedItemKeys(filterValues, list.option('items'), false);
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

    that.hideHeaderFilterMenu();
  }

  public showHeaderFilterMenu($columnElement, options) {
    const that = this;

    if (options) {
      that._initializePopupContainer(options);

      const popupContainer = that.getPopupContainer();

      that.hideHeaderFilterMenu();
      that.updatePopup($columnElement, options);

      popupContainer.show();
    }
  }

  public hideHeaderFilterMenu() {
    const headerFilterMenu = this.getPopupContainer();

    headerFilterMenu && headerFilterMenu.hide();
  }

  private updatePopup($element, options) {
    const that = this;
    const showColumnLines = this.option('showColumnLines');
    const alignment = ((options.alignment === 'right') as any) ^ (!showColumnLines as any) ? 'left' : 'right';

    that._popupContainer.setAria({
      role: 'dialog',
      label: messageLocalization.format('dxDataGrid-headerFilterLabel'),
    });

    if (that._popupContainer) {
      that._cleanPopupContent();
      that._popupContainer.option('position', {
        my: `${alignment} top`,
        at: `${alignment} bottom`,
        of: $element,
        collision: 'fit fit', // T1156848
      });
    }
  }

  protected _getSearchExpr(options, headerFilterOptions) {
    const { lookup } = options;
    const { useDefaultSearchExpr } = options;

    const headerFilterDataSource = headerFilterOptions.dataSource;
    const filterSearchExpr = headerFilterOptions.search.searchExpr;

    if (filterSearchExpr) {
      return filterSearchExpr;
    }

    if (useDefaultSearchExpr || isDefined(headerFilterDataSource) && !isFunction(headerFilterDataSource)) {
      return DEFAULT_SEARCH_EXPRESSION;
    }

    if (lookup) {
      return lookup.displayExpr || 'this';
    }

    if (options.dataSource) {
      const { group } = options.dataSource;
      if (Array.isArray(group) && group.length > 0) {
        return group[0].selector;
      } if (isFunction(group) && !options.remoteFiltering) {
        return group;
      }
    }

    return options.dataField || options.selector;
  }

  private _cleanPopupContent() {
    this._popupContainer && this._popupContainer.$content().empty();
  }

  private _initializePopupContainer(options) {
    const that = this;
    const $element = that.element();

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
          toolbar: 'bottom',
          location: 'after',
          widget: 'dxButton',
          options: {
            text: headerFilterOptions.texts.ok,
            onClick() {
              that.applyHeaderFilter(options);
            },
          },
        },
        {
          toolbar: 'bottom',
          location: 'after',
          widget: 'dxButton',
          options: {
            text: headerFilterOptions.texts.cancel,
            onClick() {
              that.hideHeaderFilterMenu();
              hidePopupCallback?.();
            },
          },
        },
      ],
      resizeEnabled: true,
      onShowing(e) {
        e.component.$content().parent().addClass('dx-dropdowneditor-overlay');
        that._initializeListContainer(options, headerFilterOptions);
        options.onShowing && options.onShowing(e);
      },
      onShown() {
        that.getListComponent().focus();
      },
      onHidden: options.onHidden,
      onInitialized(e) {
        const { component } = e;
        // T321243
        component.option('animation', component._getDefaultOptions().animation);
      },
      _loopFocus: true,
    };

    if (!isDefined(that._popupContainer)) {
      that._popupContainer = that._createComponent($element, Popup, dxPopupOptions);
    } else {
      that._popupContainer.option(dxPopupOptions);
    }
  }

  private _initializeListContainer(options, headerFilterOptions) {
    const that = this;
    const $content = that._popupContainer.$content();
    const needShowSelectAllCheckbox = !options.isFilterBuilder && headerFilterOptions.allowSelectAll;
    const widgetOptions = {
      searchEnabled: headerFilterOptions.search.enabled,
      searchTimeout: headerFilterOptions.search.timeout,
      searchEditorOptions: headerFilterOptions.search.editorOptions,
      searchMode: headerFilterOptions.search.mode || '',
      dataSource: options.dataSource,
      onContentReady() {
        that.renderCompleted.fire();
      },
      itemTemplate(data, _, element) {
        const $element = $(element);
        if (options.encodeHtml) {
          return $element.text(data.text);
        }

        return $element.html(data.text);
      },
    };

    function onOptionChanged(e) {
      // T835492, T833015
      if (e.fullName === 'searchValue' && needShowSelectAllCheckbox && that.option('headerFilter.hideSelectAllOnSearch') !== false) {
        if (options.type === 'tree') {
          e.component.option('showCheckBoxesMode', e.value ? 'normal' : 'selectAll');
          e.component.option('focusedElement', this._searchEditor.element());
        } else {
          e.component.option('selectionMode', e.value ? 'multiple' : 'all');
        }
      }
    }

    if (options.type === 'tree') {
      that._listComponent = that._createComponent(
        $('<div>').appendTo($content),
        TreeView,
        extend(widgetOptions, {
          showCheckBoxesMode: needShowSelectAllCheckbox ? 'selectAll' : 'normal',
          onOptionChanged,
          keyExpr: 'id',
        }),
      );
    } else {
      that._listComponent = that._createComponent(
        $('<div>').appendTo($content),
        List,
        extend(widgetOptions, {
          searchExpr: that._getSearchExpr(options, headerFilterOptions),
          pageLoadMode: 'scrollBottom',
          showSelectionControls: true,
          selectionMode: needShowSelectAllCheckbox ? 'all' : 'multiple',
          onOptionChanged,
          onSelectionChanged(event) {
            const { component: listComponent } = event;
            const items = listComponent.option('items');
            const selectedItems = listComponent.option('selectedItems');

            if (!listComponent._selectedItemsUpdating && !listComponent.option('searchValue') && !options.isFilterBuilder) {
              const filterValues = options.filterValues || [];
              const isExclude = options.filterType === 'exclude';
              if (selectedItems.length === 0 && items.length && (filterValues.length <= 1 || isExclude && filterValues.length === items.length - 1)) {
                options.filterType = 'include';
                options.filterValues = [];
              } else if (selectedItems.length === items.length) {
                options.filterType = 'exclude';
                options.filterValues = [];
              }
            }

            each(items, (index, item) => {
              const selected: any = gridCoreUtils.getIndexByKey(item, selectedItems, null) >= 0;
              const oldSelected = !!item.selected;

              if (oldSelected !== selected) {
                item.selected = selected;
                options.filterValues = options.filterValues || [];
                const filterValueIndex = gridCoreUtils.getIndexByKey(item.value, options.filterValues, null);

                if (filterValueIndex >= 0) {
                  options.filterValues.splice(filterValueIndex, 1);
                }

                const isExcludeFilterType: any = options.filterType === 'exclude';
                if (selected ^ isExcludeFilterType) {
                  options.filterValues.push(item.value);
                }
              }
            });

            updateListSelectAllState(listComponent, options.filterValues);
          },
          onContentReady(e) {
            const { component: listComponent } = e;
            const items = listComponent.option('items');
            const selectedItems: any = [];

            each(items, function () {
              if (this.selected) {
                selectedItems.push(this);
              }
            });

            listComponent._selectedItemsUpdating = true;
            listComponent.option('selectedItems', selectedItems);
            listComponent._selectedItemsUpdating = false;

            updateListSelectAllState(listComponent, options.filterValues);
          },
        }),
      );
    }
  }

  private _normalizeHeaderFilterOptions(options) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const generalHeaderFilter = this.option('headerFilter') || {};
    const specificHeaderFilter = options.headerFilter || {};

    const generalDeprecated = {
      search: {
        enabled: generalHeaderFilter.allowSearch,
        timeout: generalHeaderFilter.searchTimeout,
      },
    };

    const specificDeprecated = {
      search: {
        enabled: specificHeaderFilter.allowSearch,
        mode: specificHeaderFilter.searchMode,
        timeout: specificHeaderFilter.searchTimeout,
      },
    };

    return extend(true, {}, generalHeaderFilter, generalDeprecated, specificHeaderFilter, specificDeprecated);
  }

  protected _renderCore() {
    this.element().addClass(HEADER_FILTER_MENU_CLASS);
  }
}

export const allowHeaderFiltering = function (column) {
  return isDefined(column.allowHeaderFiltering) ? column.allowHeaderFiltering : column.allowFiltering;
};

// TODO Fix types of this mixin
export const headerFilterMixin = <T extends ModuleType<any>>(Base: T) => class HeaderFilterMixin extends Base {
  public optionChanged(args) {
    if (args.name === 'headerFilter') {
      const requireReady = this.name === 'columnHeadersView';
      this._invalidate(requireReady, requireReady);
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  protected _applyColumnState(options) {
    let $headerFilterIndicator;
    const { rootElement } = options;
    const { column } = options;

    if (options.name === 'headerFilter') {
      rootElement.find(`.${HEADER_FILTER_CLASS}`).remove();

      if (allowHeaderFiltering(column)) {
        $headerFilterIndicator = super._applyColumnState(options).toggleClass('dx-header-filter-empty', this._isHeaderFilterEmpty(column));
        if (!this.option('useLegacyKeyboardNavigation')) {
          $headerFilterIndicator.attr('tabindex', this.option('tabindex') || 0);
        }

        const indicatorLabel = (messageLocalization.format as any)('dxDataGrid-headerFilterIndicatorLabel', column.caption);

        $headerFilterIndicator.attr('aria-label', indicatorLabel);
        $headerFilterIndicator.attr('aria-haspopup', 'dialog');
        $headerFilterIndicator.attr('role', 'button');
      }

      return $headerFilterIndicator;
    }

    return super._applyColumnState(options);
  }

  private _isHeaderFilterEmpty(column) {
    return !column.filterValues || !column.filterValues.length;
  }

  protected _getIndicatorClassName(name) {
    if (name === 'headerFilter') {
      return HEADER_FILTER_CLASS;
    }
    return super._getIndicatorClassName(name);
  }

  protected _renderIndicator(options) {
    const $container = options.container;
    const $indicator = options.indicator;

    if (options.name === 'headerFilter') {
      const rtlEnabled = this.option('rtlEnabled');
      if ($container.children().length && (!rtlEnabled && options.columnAlignment === 'right' || rtlEnabled && options.columnAlignment === 'left')) {
        $container.prepend($indicator);
        return;
      }
    }

    super._renderIndicator(options);
  }
};
