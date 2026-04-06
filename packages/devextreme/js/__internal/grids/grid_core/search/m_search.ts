/* eslint-disable max-classes-per-file */

import messageLocalization from '@js/common/core/localization/message';
import type { LangParams } from '@js/common/data';
import dataQuery from '@js/common/data/query';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { compileGetter, toComparable } from '@js/core/utils/data';
import type TextBox from '@js/ui/text_box';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { ToolbarItem } from '@ts/grids/new/grid_core/toolbar/types';

import type { DataController, Filter } from '../data_controller/m_data_controller';
import type { HeaderPanel } from '../header_panel/m_header_panel';
import modules from '../m_modules';
import type { ModuleType, OptionChanged } from '../m_types';
import gridCoreUtils from '../m_utils';
import type { RowsView } from '../views/m_rows_view';

const SEARCH_PANEL_CLASS = 'search-panel';
const SEARCH_TEXT_CLASS = 'search-text';
const HEADER_PANEL_CLASS = 'header-panel';
const FILTERING_TIMEOUT = 700;
const SEARCH_PANEL_ITEM_NAME = 'searchPanel';

function allowSearch(column: Column): boolean {
  return !!(column.allowSearch ?? column.allowFiltering);
}

function parseValue(column: Column, text: string): unknown {
  const { lookup } = column;

  if (!column.parseValue) {
    return text;
  }

  if (lookup) {
    return column.parseValue.call(lookup, text);
  }

  return column.parseValue(text);
}

const dataController = (
  base: ModuleType<DataController>,
) => class SearchDataControllerExtender extends base {
  public optionChanged(args): void {
    switch (args.fullName) {
      case 'searchPanel.text':
      case 'searchPanel':
        this._applyFilter();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  public publicMethods(): string[] {
    return super.publicMethods().concat(['searchByText']);
  }

  protected _calculateAdditionalFilter(): Filter {
    const dataSource = this._dataController?.getDataSource?.();
    const langParams = dataSource?.loadOptions?.()?.langParams;

    const filter = super._calculateAdditionalFilter();
    const searchFilter = this.calculateSearchFilter(this.option('searchPanel.text'), langParams);

    return gridCoreUtils.combineFilters([filter, searchFilter]);
  }

  public searchByText(text: string | undefined): void {
    this.option('searchPanel.text', text);
  }

  private calculateSearchFilter(text: string | undefined, langParams?: LangParams): Filter {
    let column;
    const columns = this._columnsController.getColumns();
    const searchVisibleColumnsOnly = this.option('searchPanel.searchVisibleColumnsOnly');
    let lookup;
    const filters: any[] = [];

    if (!text) return null;

    function onQueryDone(items): void {
      const valueGetter = compileGetter(lookup.valueExpr);

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < items.length; i++) {
        // @ts-expect-error
        const value = valueGetter(items[i]);
        filters.push(column.createFilterExpression(value, null, 'search'));
      }
    }

    for (let i = 0; i < columns.length; i++) {
      column = columns[i];

      if (searchVisibleColumnsOnly && !column.visible) continue;

      if (allowSearch(column) && column.calculateFilterExpression) {
        lookup = column.lookup;
        const filterValue = parseValue(column, text);

        if (lookup?.items) {
          // @ts-expect-error
          dataQuery(lookup.items, { langParams })
            // @ts-expect-error
            .filter(
              column.createFilterExpression.call(
                {
                  dataField: lookup.displayExpr,
                  dataType: lookup.dataType,
                  calculateFilterExpression: column.calculateFilterExpression,
                },
                filterValue,
                null,
                'search',
              ),
            )
            .enumerate()
            .done(onQueryDone);
        } else if (filterValue !== undefined) {
          filters.push(column.createFilterExpression(filterValue, null, 'search'));
        }
      }
    }

    if (filters.length === 0) {
      return ['!'];
    }

    return gridCoreUtils.combineFilters(filters, 'or');
  }
};

type SearchDataControllerExtender = InstanceType<ReturnType<typeof dataController>>;

export class SearchPanelViewController extends modules.ViewController {
  private headerPanel?: HeaderPanel;

  private dataController?: SearchDataControllerExtender;

  public init(): void {
    this.headerPanel = this.getView('headerPanel');
    this.dataController = this.getController('data') as SearchDataControllerExtender;

    this.syncSearchPanelItem();
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'searchPanel') {
      if (args.fullName === 'searchPanel.text') {
        const editor = this.getSearchTextEditor();
        if (editor) {
          editor.option('value', args.value);
        }
      } else {
        this.syncSearchPanelItem();
      }

      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  private syncSearchPanelItem(): void {
    if (!this.headerPanel) {
      return;
    }

    const searchPanelOptions = this.option('searchPanel');

    if (searchPanelOptions && searchPanelOptions.visible) {
      const searchPanelToolbarItem = this.getSearchPanelToolbarItem();

      if (searchPanelToolbarItem) {
        this.headerPanel.setToolbarItem(SEARCH_PANEL_ITEM_NAME, searchPanelToolbarItem);
      }
    } else {
      this.headerPanel.removeToolbarItem(SEARCH_PANEL_ITEM_NAME);
    }
  }

  private getSearchPanelToolbarItem(): ToolbarItem {
    const searchPanelOptions = this.option('searchPanel');

    return {
      template: (_data, _index, container: dxElementWrapper | Element): void => {
        if (this.headerPanel) {
          const $search = $('<div>')
            .addClass(this.headerPanel.addWidgetPrefix(SEARCH_PANEL_CLASS))
            .appendTo(container);

          this.getController('editorFactory').createEditor($search, {
            width: searchPanelOptions?.width,
            placeholder: searchPanelOptions?.placeholder,
            parentType: 'searchPanel',
            value: this.option('searchPanel.text'),
            updateValueTimeout: FILTERING_TIMEOUT,
            setValue: (value: string | undefined): void => {
              this.dataController?.searchByText(value);
            },
            editorOptions: {
              inputAttr: {
                'aria-label': messageLocalization.format(`${this.component.NAME}-ariaSearchInGrid`),
              },
            },
          });

          this.headerPanel.resize();
        }
      },
      name: SEARCH_PANEL_ITEM_NAME,
      location: 'after',
      locateInMenu: 'never',
      sortIndex: 50,
    };
  }

  public getSearchTextEditor(): TextBox | null {
    const $element = this.headerPanel?.element();

    if (!this.headerPanel || !$element) {
      return null;
    }

    const headerPanelClass = this.headerPanel.addWidgetPrefix(HEADER_PANEL_CLASS);
    const $searchPanel = $element
      .find(`.${this.headerPanel.addWidgetPrefix(SEARCH_PANEL_CLASS)}`)
      .filter((_, el: HTMLElement) => $(el).closest(`.${headerPanelClass}`).is($element));

    if ($searchPanel.length) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return $searchPanel.dxTextBox('instance');
    }

    return null;
  }
}

const rowsView = (
  Base: ModuleType<RowsView>,
) => class SearchRowsViewExtender extends Base {
  private _searchParams: any;

  private _highlightTimer: any;

  public init() {
    super.init.apply(this, arguments as any);
    this._searchParams = [];
    this._dataController = this.getController('data');
  }

  public dispose() {
    clearTimeout(this._highlightTimer);
    super.dispose();
  }

  private _getFormattedSearchText(column, searchText) {
    const value = parseValue(column, searchText);
    const formatOptions = gridCoreUtils.getFormatOptionsByColumn(column, 'search');
    return gridCoreUtils.formatValue(value, formatOptions);
  }

  private _getStringNormalizer() {
    const isCaseSensitive = this.option('searchPanel.highlightCaseSensitive');
    const dataSource = this._dataController?.getDataSource?.();
    const langParams = dataSource?.loadOptions?.()?.langParams;

    return (str: string): string => toComparable(str, isCaseSensitive, langParams);
  }

  private _findHighlightingTextNodes(column, cellElement, searchText) {
    const that = this;
    let $parent = cellElement.parent();
    let $items;
    const stringNormalizer = this._getStringNormalizer();
    const normalizedSearchText = stringNormalizer(searchText);
    const resultTextNodes: any[] = [];

    if (!$parent.length) {
      $parent = $('<div>').append(cellElement);
    } else if (column) {
      if (column.groupIndex >= 0 && !column.showWhenGrouped) {
        $items = cellElement;
      } else {
        const columnIndex = that._columnsController.getVisibleIndex(column.index);
        $items = $parent.children('td').eq(columnIndex).find('*');
      }
    }
    $items = $items?.length ? $items : $parent.find('*');
    $items.each((_, element) => {
      const $contents = $(element).contents();
      for (let i = 0; i < $contents.length; i++) {
        const node = $contents.get(i);
        if (node.nodeType === 3) {
          const normalizedText = stringNormalizer(node.textContent ?? node.nodeValue ?? '');
          if (normalizedText.includes(normalizedSearchText)) {
            resultTextNodes.push(node);
          }
        }
      }
    });

    return resultTextNodes;
  }

  private _highlightSearchTextCore($textNode, searchText) {
    const that = this;
    const $searchTextSpan = $('<span>').addClass(that.addWidgetPrefix(SEARCH_TEXT_CLASS));
    const text = $textNode.text();
    const firstContentElement = $textNode[0];
    const stringNormalizer = this._getStringNormalizer();
    const index = stringNormalizer(text).indexOf(stringNormalizer(searchText));

    if (index >= 0) {
      if (firstContentElement.textContent) {
        firstContentElement.textContent = text.substr(0, index);
      } else {
        firstContentElement.nodeValue = text.substr(0, index);
      }
      $textNode.after($searchTextSpan.text(text.substr(index, searchText.length)));

      $textNode = $(domAdapter.createTextNode(text.substr(index + searchText.length))).insertAfter($searchTextSpan);

      return that._highlightSearchTextCore($textNode, searchText);
    }
  }

  private _highlightSearchText(cellElement, isEquals?, column?) {
    const that = this;
    const stringNormalizer = this._getStringNormalizer();
    let searchText = that.option('searchPanel.text');

    if (isEquals && column) {
      searchText = searchText && that._getFormattedSearchText(column, searchText);
    }

    if (searchText && that.option('searchPanel.highlightSearchText')) {
      const textNodes = that._findHighlightingTextNodes(column, cellElement, searchText);
      textNodes.forEach((textNode) => {
        if (isEquals) {
          if (stringNormalizer($(textNode).text()) === stringNormalizer(searchText ?? '')) {
            $(textNode).replaceWith($('<span>').addClass(that.addWidgetPrefix(SEARCH_TEXT_CLASS)).text($(textNode).text()));
          }
        } else {
          that._highlightSearchTextCore($(textNode), searchText);
        }
      });
    }
  }

  protected _renderCore() {
    const deferred = super._renderCore.apply(this, arguments as any);

    // T103538
    if (this.option().rowTemplate || this.option('dataRowTemplate')) {
      if (this.option('templatesRenderAsynchronously')) {
        clearTimeout(this._highlightTimer);

        this._highlightTimer = setTimeout(() => {
          this._highlightSearchText(this.getTableElement());
        });
      } else {
        this._highlightSearchText(this.getTableElement());
      }
    }
    return deferred;
  }

  public _updateCell($cell, parameters) {
    const { column } = parameters;
    const dataType = column.lookup && column.lookup.dataType || column.dataType;
    const isEquals = dataType !== 'string';

    if (allowSearch(column) && !parameters.isOnForm) {
      if (this.option('templatesRenderAsynchronously')) {
        if (!this._searchParams.length) {
          clearTimeout(this._highlightTimer);

          this._highlightTimer = setTimeout(() => {
            this._searchParams.forEach((params) => {
              this._highlightSearchText.apply(this, params);
            });

            this._searchParams = [];
          });
        }
        this._searchParams.push([$cell, isEquals, column]);
      } else {
        this._highlightSearchText($cell, isEquals, column);
      }
    }

    super._updateCell($cell, parameters);
  }
};

export const searchModule = {
  defaultOptions() {
    return {
      searchPanel: {
        visible: false,
        width: 160,
        placeholder: messageLocalization.format('dxDataGrid-searchPanelPlaceholder'),
        highlightSearchText: true,
        highlightCaseSensitive: false,
        text: '',
        searchVisibleColumnsOnly: false,
      },
    };
  },
  controllers: {
    searchPanel: SearchPanelViewController,
  },
  extenders: {
    controllers: {
      data: dataController,
    },
    views: {
      rowsView,
    },
  },
};
