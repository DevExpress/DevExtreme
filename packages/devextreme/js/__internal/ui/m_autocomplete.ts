import { isCommandKeyPressed } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import type { Properties } from '@js/ui/autocomplete';
import { isDefined } from '@ts/core/utils/m_type';
import type { OptionChanged } from '@ts/core/widget/types';
import DropDownList from '@ts/ui/drop_down_editor/drop_down_list';

const AUTOCOMPLETE_CLASS = 'dx-autocomplete';
const AUTOCOMPLETE_POPUP_WRAPPER_CLASS = 'dx-autocomplete-popup-wrapper';

export interface AutocompleteProperties extends Omit<Properties, 'onItemClick' | 'onSelectionChanged'> {}

class Autocomplete extends DropDownList<AutocompleteProperties> {
  _supportedKeys(): Record<string, (e: KeyboardEvent) => boolean> {
    let item = this._list ? this._list.option('focusedElement') : null;
    const parent = super._supportedKeys();
    // @ts-expect-error ts-error
    item = item && $(item);

    return {
      ...parent,
      upArrow(e): boolean {
        // @ts-expect-error ts-error
        if (parent.upArrow.apply(this, arguments) && !isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();
          if (item && !this._calcNextItem(-1)) {
            this._clearFocusedItem();
            return false;
          }
        }
        return true;
      },
      downArrow(e): boolean {
        // @ts-expect-error ts-error
        if (parent.downArrow.apply(this, arguments) && !isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();
          if (item && !this._calcNextItem(1)) {
            this._clearFocusedItem();
            return false;
          }
        }
        return true;
      },
      enter(e): boolean {
        if (!item) {
          this.close();
        }
        const { opened } = this.option();
        if (opened) {
          e.preventDefault();
        }
        return opened;
      },
    };
  }

  _getDefaultOptions(): AutocompleteProperties {
    return {
      ...super._getDefaultOptions(),
      minSearchLength: 1,
      maxItemCount: 10,
      noDataText: '',
      showDropDownButton: false,
      searchEnabled: true,
    };
  }

  _initMarkup(): void {
    super._initMarkup();
    this.$element().addClass(AUTOCOMPLETE_CLASS);
  }

  _getAriaAutocomplete(): string {
    const { disabled, readOnly } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const isInputEditable = !(readOnly || disabled);

    return isInputEditable ? 'list' : 'none';
  }

  _displayGetterExpr() {
    return this.option('valueExpr');
  }

  _closeOutsideDropDownHandler({ target }): boolean {
    return !$(target).closest(this.$element()).length;
  }

  _renderDimensions(): void {
    super._renderDimensions();

    this._updatePopupWidth();
    this._updateListDimensions();
  }

  _popupWrapperClass(): string {
    return `${super._popupWrapperClass()} ${AUTOCOMPLETE_POPUP_WRAPPER_CLASS}`;
  }

  _listConfig() {
    return extend(super._listConfig(), {
      pageLoadMode: 'none',
      onSelectionChanged: (e) => {
        this._setSelectedItem(e.addedItems[0]);
      },
    });
  }

  _listItemClickHandler(e) {
    this._saveValueChangeEvent(e.event);
    // @ts-expect-error ts-error
    const value = this._displayGetter(e.itemData);
    this.option('value', value);
    this.close();
  }

  _setListDataSource(): void {
    if (!this._list) {
      return;
    }

    this._list.option('selectedItems', []);
    super._setListDataSource();
  }

  _refreshSelected(): void {}

  _searchCanceled(): void {
    super._searchCanceled();
    this.close();
  }

  _loadItem(value, cache) {
    const selectedItem = this._getItemFromPlain(value, cache);

    return Deferred().resolve(selectedItem).promise();
  }

  _dataSourceOptions() {
    const { maxItemCount } = this.option();
    return {
      paginate: true,
      pageSize: maxItemCount,
    };
  }

  _searchDataSource(searchValue): void {
    const { maxItemCount } = this.option();
    if (isDefined(maxItemCount)) {
      this._dataSource.pageSize(maxItemCount);
    }
    super._searchDataSource(searchValue);
    this._clearFocusedItem();
  }

  _clearFocusedItem(): void {
    if (this._list) {
      this._list.option('focusedElement', null);
      this._list.option('selectedIndex', -1);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _renderValueEventName(): string {
    return 'input keyup';
  }

  _valueChangeEventHandler(e): void {
    const value = this._input().val() || null;
    return super._valueChangeEventHandler(e, value);
  }

  _optionChanged(args: OptionChanged<AutocompleteProperties>): void {
    switch (args.name) {
      case 'readOnly':
      case 'disabled':
        super._optionChanged(args);
        this._setDefaultAria();
        break;
      case 'maxItemCount':
        // @ts-expect-error ts-error
        this._searchDataSource();
        break;
      case 'valueExpr':
        // @ts-expect-error ts-error
        this._compileDisplayGetter();
        this._setListOption('displayExpr', this._displayGetterExpr());
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }

  clear(): void {
    super.clear();
    this.close();
  }

  reset(value = undefined): void {
    if (arguments.length) {
      super.reset(value);
    } else {
      super.reset();
    }

    this.close();
  }
}

registerComponent('dxAutocomplete', Autocomplete);

export default Autocomplete;
