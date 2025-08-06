import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import errors from '@js/ui/widget/ui.errors';
import type { OptionChanged } from '@ts/core/widget/types';
import SearchBoxController, {
  getOperationBySearchMode,
  type SearchBoxControllerOptions,
} from '@ts/ui/collection/search_box_controller';
import type { ListBaseProperties } from '@ts/ui/list/list.base';
import ListEdit from '@ts/ui/list/list.edit';

// STYLE list

const LIST_CLASS_PREFIX = 'dx-list';

class ListSearch extends ListEdit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _dataSource!: any;

  _searchBoxController!: SearchBoxController;

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

  _getDefaultOptions(): ListBaseProperties {
    return {
      ...super._getDefaultOptions(),
      // @ts-expect-error ts-error
      searchMode: '',
      // @ts-expect-error ts-error
      searchExpr: null,
      searchValue: '',
      searchEnabled: false,
      searchEditorOptions: {},
    };
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
    this._searchBoxController = new SearchBoxController();

    super._init();
  }

  _initMarkup(): void {
    this._searchBoxController.render(
      LIST_CLASS_PREFIX,
      this.$element(),
      this._getSearchBoxControllerOptions(),
      this._createComponent.bind(this),
    );
    super._initMarkup();
  }

  _getAriaTarget(): dxElementWrapper {
    const { searchEnabled } = this.option();

    if (searchEnabled) {
      return this._itemContainer();
    }

    return super._getAriaTarget();
  }

  focus(): void {
    const { focusedElement, searchEnabled } = this.option();

    if (!focusedElement && searchEnabled) {
      this._searchBoxController?.focus();
      return;
    }

    super.focus();
  }

  _focusTarget(): dxElementWrapper {
    const { searchEnabled } = this.option();

    if (searchEnabled) {
      return this._itemContainer();
    }

    return super._focusTarget();
  }

  _updateFocusState(e: DxEvent, isFocused: boolean): void {
    const { searchEnabled } = this.option();

    if (searchEnabled) {
      this._toggleFocusClass(isFocused, this.$element());
    }

    super._updateFocusState(e, isFocused);
  }

  _optionChanged(args: OptionChanged<ListBaseProperties>): void {
    const { name, value } = args;

    switch (name) {
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
        if (name === 'searchMode') {
          this._dataSource.searchOperation(getOperationBySearchMode(value));
        } else {
          this._dataSource[name](value);
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
    this._searchBoxController?.resolveValueChange();
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
    this._searchBoxController?.dispose();
    super._dispose();
  }
}

registerComponent('dxList', ListSearch);

export default ListSearch;
