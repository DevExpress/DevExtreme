import type { dxElementWrapper } from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import errors from '@js/ui/widget/ui.errors';
import type { SearchBoxMixinOptions } from '@js/ui/widget/ui.search_box_mixin';
import type { OptionChanged } from '@ts/core/widget/types';
import SearchBoxController, {
  getOperationBySearchMode,
  type SearchBoxControllerOptions,
} from '@ts/ui/collection/m_search_box_mixin';
import type { ListBaseProperties } from '@ts/ui/list/m_list.base';

import ListEdit from './m_list.edit';

export type ListSearchProperties = ListBaseProperties & SearchBoxMixinOptions;

const LIST_CLASS_PREFIX = 'dx-list';

class ListSearch extends ListEdit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _dataSource!: any;

  _searchController!: SearchBoxController;

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  _getCombinedFilter() {
    const dataController = this._dataController;
    // @ts-expect-error ts-error
    const storeLoadOptions = { filter: dataController.filter() };
    dataController.addSearchFilter(storeLoadOptions);
    const { filter } = storeLoadOptions;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return filter;
  }

  _getDefaultOptions(): ListSearchProperties {
    return {
      ...super._getDefaultOptions(),
      searchMode: '',
      searchExpr: null,
      searchValue: '',
      searchEnabled: false,
      searchEditorOptions: {},
    } as ListSearchProperties;
  }

  _getSearchBoxControllerOptions(): SearchBoxControllerOptions {
    const {
      tabIndex,
      searchEnabled,
      searchValue,
      searchTimeout,
      searchEditorOptions,
    } = this.option();

    return {
      tabIndex,
      searchEnabled,
      searchValue,
      searchTimeout,
      searchEditorOptions,
      onValueChanged: (value: string): void => {
        this.option('searchValue', value);
      },
    };
  }

  _initDataSource(): void {
    const { searchValue, searchExpr, searchMode } = this.option();

    super._initDataSource();

    const dataController = this._dataController;

    if (searchValue?.length) {
      dataController.searchValue(searchValue);
    }

    if (searchMode?.length) {
      dataController.searchOperation(getOperationBySearchMode(searchMode));
    }

    if (searchExpr) {
      dataController.searchExpr(searchExpr);
    }
  }

  _init(): void {
    this._searchController = new SearchBoxController({
      createEditor: (
        $element: dxElementWrapper,
        component: any,
        options: Record<string, unknown>,
      ) => this._createComponent($element, component, options),
      widgetPrefix: LIST_CLASS_PREFIX,
    });
    super._init();
  }

  _initMarkup(): void {
    this._searchController.render(this.$element(), this._getSearchBoxControllerOptions());
    super._initMarkup();
  }

  _getAriaTarget(): dxElementWrapper {
    if (this.option('searchEnabled')) {
      return this._itemContainer();
    }
    return super._getAriaTarget();
  }

  focus(): void {
    if (!this.option('focusedElement') && this.option('searchEnabled')) {
      this._searchController?.focus();
      return;
    }
    super.focus();
  }

  _focusTarget(): dxElementWrapper {
    if (this.option('searchEnabled')) {
      return this._itemContainer();
    }

    return super._focusTarget();
  }

  _updateFocusState(e: DxEvent, isFocused: boolean): void {
    if (this.option('searchEnabled')) {
      this._toggleFocusClass(isFocused, this.$element());
    }
    super._updateFocusState(e, isFocused);
  }

  _optionChanged(args: OptionChanged<ListSearchProperties>): void {
    switch (args.name) {
      case 'searchEnabled':
      case 'searchEditorOptions':
        this._invalidate();
        break;
      case 'searchExpr':
      case 'searchMode':
      case 'searchValue':
        if (!this._dataSource) {
          errors.log('W1009');
          return;
        }
        if (args.name === 'searchMode') {
          this._dataSource.searchOperation(getOperationBySearchMode(args.value));
        } else {
          this._dataSource[args.name](args.value);
        }
        this._dataSource.load();
        break;
      case 'searchTimeout':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _refresh(): void {
    this._searchController?.resolveValueChange();
    super._refresh();
  }

  _cleanAria(): void {
    const $element = this.$element();

    this.setAria({
      role: null,
      activedescendant: null,
    }, $element);

    $element.attr('tabIndex', null);
  }

  _clean(): void {
    this._cleanAria();
    super._clean();
  }

  _dispose(): void {
    this._searchController?.dispose();
    super._dispose();
  }
}

export default ListSearch;
