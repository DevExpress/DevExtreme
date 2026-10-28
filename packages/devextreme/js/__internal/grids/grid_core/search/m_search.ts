/* eslint-disable max-classes-per-file */

import messageLocalization from '@js/common/core/localization/message';
import type { SearchPanel } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import type TextBox from '@js/ui/text_box';
import domAdapter from '@ts/core/dom_adapter';
import { toComparable } from '@ts/core/utils/data';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataChange, UserState } from '@ts/grids/grid_core/data_controller/types';
import type { DataFilter, FilterSourceContext } from '@ts/grids/grid_core/filter/types';
import { CLASSES as HEADER_PANEL_CLASSES } from '@ts/grids/grid_core/header_panel/const';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/header_panel';
import modules from '@ts/grids/grid_core/modules/modules';
import type { ModuleType, OptionChanged } from '@ts/grids/grid_core/types';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { ToolbarItem } from '@ts/grids/new/grid_core/toolbar/types';

import { CLASSES, FILTERING_TIMEOUT, SEARCH_PANEL_ITEM_NAME } from './const';
import type {
  SearchCellOptions,
  SearchDataController,
  SearchHighlightParams,
} from './types';
import { allowSearch, createSearchExpression, getFormattedSearchText } from './utils';

const dataController = (
  base: ModuleType<DataController>,
): ModuleType<SearchDataController> => class SearchDataControllerExtender extends base {
  public optionChanged(args: OptionChanged): void {
    switch (args.fullName) {
      case 'searchPanel.text':
      case 'searchPanel':
        this.applyFilter();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  public publicMethods(): string[] {
    return super.publicMethods().concat(['searchByText']);
  }

  public getUserState(): UserState {
    return {
      ...super.getUserState(),
      searchText: this.option('searchPanel.text'),
    };
  }

  public searchByText(text: string | undefined): void {
    this.option('searchPanel.text', text);
  }
};

export class SearchPanelViewController extends modules.ViewController {
  private headerPanel?: HeaderPanel;

  private dataController?: SearchDataController;

  public init(): void {
    this.headerPanel = this.getView('headerPanel');
    this.dataController = this.getController('data') as SearchDataController;

    const isSearchPanelVisible = this.option('searchPanel.visible');

    if (isSearchPanelVisible) {
      const searchPanelToolbarItem = this.getSearchPanelToolbarItem();

      this.headerPanel?.registerToolbarItem(SEARCH_PANEL_ITEM_NAME, searchPanelToolbarItem);
    }
  }

  // Called by FilterController.getAdditionalFilter for each filter source in SOURCE_ORDER
  public isFilterSourceActive(): boolean {
    return true;
  }

  public getFilterExpressions(
    { langParams, columnsController }: FilterSourceContext,
  ): DataFilter[] {
    const columns = this.getColumnsToSearch(columnsController);
    const searchFilter = createSearchExpression(columns, this.option('searchPanel.text'), langParams);

    return searchFilter ? [searchFilter] : [];
  }

  private getColumnsToSearch(
    columnsController: FilterSourceContext['columnsController'],
  ): Column[] {
    const searchVisibleColumnsOnly = this.option('searchPanel.searchVisibleColumnsOnly');

    return columnsController
      ?.getColumns()
      ?.filter((column: Column) => !searchVisibleColumnsOnly || !!column.visible) ?? [];
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
    const isSearchPanelVisible = this.option('searchPanel.visible');

    if (isSearchPanelVisible) {
      const searchPanelToolbarItem = this.getSearchPanelToolbarItem();

      this.headerPanel?.applyToolbarItem(SEARCH_PANEL_ITEM_NAME, searchPanelToolbarItem);
    } else {
      this.headerPanel?.removeToolbarItem(SEARCH_PANEL_ITEM_NAME);
    }
  }

  private getSearchPanelToolbarItem(): ToolbarItem {
    const searchPanelOptions = this.option('searchPanel');

    return {
      template: (_data, _index, container: dxElementWrapper | Element): void => {
        if (this.headerPanel) {
          const $search = $('<div>')
            .addClass(this.headerPanel.addWidgetPrefix(CLASSES.searchPanel))
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

    const headerPanelClass = this.headerPanel.addWidgetPrefix(HEADER_PANEL_CLASSES.headerPanel);
    const $searchPanel = $element
      .find(`.${this.headerPanel.addWidgetPrefix(CLASSES.searchPanel)}`)
      .filter((_, el: Element) => $(el).closest(`.${headerPanelClass}`).is($element));

    if ($searchPanel.length) {
      // @ts-expect-error dxTextBox is added to the renderer at runtime
      return $searchPanel.dxTextBox('instance') as TextBox;
    }

    return null;
  }
}

const rowsView = (
  Base: ModuleType<RowsView>,
): ModuleType<RowsView> => class SearchRowsViewExtender extends Base {
  private _searchParams!: SearchHighlightParams[];

  private _highlightTimer?: ReturnType<typeof setTimeout>;

  public init(): void {
    super.init();
    this._searchParams = [];
    this._dataController = this.getController('data');
  }

  public dispose(): void {
    clearTimeout(this._highlightTimer);
    super.dispose();
  }

  private _getStringNormalizer(): (str: string) => string {
    const isCaseSensitive = this.option('searchPanel.highlightCaseSensitive');
    const dataSource = this.dataSourceController.getDataSource();
    const langParams = dataSource?.loadOptions?.()?.langParams;

    // @ts-expect-error toComparable() returns unknown even for a string
    return (str: string): string => toComparable(str, isCaseSensitive, langParams);
  }

  private getHighlightingElements(
    column: Column | undefined,
    cellElement: dxElementWrapper,
  ): dxElementWrapper {
    const $parent = cellElement.parent();

    if (!$parent.length) {
      return $('<div>').append(cellElement).find('*');
    }

    if (!column) {
      return $parent.find('*');
    }

    if (Number(column.groupIndex) >= 0 && !column.showWhenGrouped) {
      return cellElement;
    }

    const columnIndex = this._columnsController.getVisibleIndex(column.index);
    const $columnElements = $parent.children('td').eq(columnIndex).find('*');

    return $columnElements.length ? $columnElements : $parent.find('*');
  }

  private _findHighlightingTextNodes(
    column: Column | undefined,
    cellElement: dxElementWrapper,
    searchText: string,
  ): Node[] {
    const stringNormalizer = this._getStringNormalizer();
    const normalizedSearchText = stringNormalizer(searchText);
    const resultTextNodes: Node[] = [];

    this.getHighlightingElements(column, cellElement).each((_, element) => {
      const $contents = $(element).contents();
      for (let i = 0; i < $contents.length; i += 1) {
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

  private _highlightSearchTextCore($textNode: dxElementWrapper, searchText: string): void {
    const $searchTextSpan = $('<span>').addClass(this.addWidgetPrefix(CLASSES.searchText));
    const text = $textNode.text();
    const firstContentElement: Node = $textNode[0];
    const stringNormalizer = this._getStringNormalizer();
    const index = stringNormalizer(text).indexOf(stringNormalizer(searchText));

    if (index >= 0) {
      const endIndex = index + searchText.length;

      if (firstContentElement.textContent) {
        firstContentElement.textContent = text.slice(0, index);
      } else {
        firstContentElement.nodeValue = text.slice(0, index);
      }
      $textNode.after($searchTextSpan.text(text.slice(index, endIndex)));

      const $nextTextNode = $(domAdapter.createTextNode(text.slice(endIndex)))
        .insertAfter($searchTextSpan);

      return this._highlightSearchTextCore($nextTextNode, searchText);
    }

    return undefined;
  }

  private _highlightSearchText(
    cellElement: dxElementWrapper,
    isEquals?: boolean,
    column?: Column,
  ): void {
    const stringNormalizer = this._getStringNormalizer();
    const searchPanelText = this.option('searchPanel.text');
    const searchText = isEquals && column && searchPanelText
      ? getFormattedSearchText(column, searchPanelText)
      : searchPanelText;

    if (searchText && this.option('searchPanel.highlightSearchText')) {
      const textNodes = this._findHighlightingTextNodes(column, cellElement, searchText);
      textNodes.forEach((textNode) => {
        if (isEquals) {
          if (stringNormalizer($(textNode).text()) === stringNormalizer(searchText)) {
            $(textNode).replaceWith($('<span>').addClass(this.addWidgetPrefix(CLASSES.searchText)).text($(textNode).text()));
          }
        } else {
          this._highlightSearchTextCore($(textNode), searchText);
        }
      });
    }
  }

  protected _renderCore(change?: DataChange): DeferredObj<unknown> {
    const deferred = super._renderCore(change);

    // T103538
    if (this.option().rowTemplate || this.option('dataRowTemplate')) {
      if (this.option('templatesRenderAsynchronously')) {
        clearTimeout(this._highlightTimer);

        this._highlightTimer = setTimeout(() => {
          // @ts-expect-error the view is rendered here
          this._highlightSearchText(this.getTableElement());
        });
      } else {
        // @ts-expect-error the view is rendered here
        this._highlightSearchText(this.getTableElement());
      }
    }
    return deferred;
  }

  public _updateCell($cell: dxElementWrapper, parameters: SearchCellOptions): void {
    const { column } = parameters;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- '' falls back
    const dataType = column.lookup?.dataType || column.dataType;
    const isEquals = dataType !== 'string';

    if (allowSearch(column) && !parameters.isOnForm) {
      if (this.option('templatesRenderAsynchronously')) {
        if (!this._searchParams.length) {
          clearTimeout(this._highlightTimer);

          this._highlightTimer = setTimeout(() => {
            this._searchParams.forEach((params) => {
              this._highlightSearchText(...params);
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
  defaultOptions(): { searchPanel: SearchPanel } {
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
