import registerComponent from '@js/core/component_registrator'; // couldn't change import due inconsistent typings for registerComponent
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DataSourceOptions } from '@js/data/data_source';
import type { DxEvent, PointerInteractionEvent } from '@js/events/events.types';
import type { Properties } from '@js/ui/autocomplete';
import type { ItemClickEvent, PageLoadMode } from '@js/ui/list';
import { Deferred } from '@ts/core/utils/m_deferred';
import { isDefined } from '@ts/core/utils/m_type';
import type { OptionChanged } from '@ts/core/widget/types';
import { isCommandKeyPressed } from '@ts/events/utils/index';
import DropDownList from '@ts/ui/drop_down_editor/drop_down_list';
import type { ListBaseProperties } from '@ts/ui/list/list.base';

const AUTOCOMPLETE_CLASS = 'dx-autocomplete';
const AUTOCOMPLETE_POPUP_WRAPPER_CLASS = 'dx-autocomplete-popup-wrapper';

export interface AutocompleteProperties extends Omit<
  Properties, 'onItemClick' | 'onSelectionChanged'
> {

}

class Autocomplete extends DropDownList<AutocompleteProperties> {
  _supportedKeys(): Record<string, (e: KeyboardEvent) => boolean> {
    let item: dxElementWrapper | null = null;
    if (this._list) {
      const { focusedElement } = this._list.option();
      item = focusedElement ? $(focusedElement) : null;
    }
    const parent = super._supportedKeys();

    return {
      ...parent,
      upArrow: (e): boolean => {
        if (parent.upArrow.call(this, e) && !isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();
          if (item && !this._calcNextItem(-1)) {
            this._clearFocusedItem();
            return false;
          }
        }
        return true;
      },
      downArrow: (e): boolean => {
        if (parent.downArrow.call(this, e) && !isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();
          if (item && !this._calcNextItem(1)) {
            this._clearFocusedItem();
            return false;
          }
        }
        return true;
      },
      enter: (e): boolean => {
        if (!item) {
          this.close();
        }
        const { opened } = this.option();
        if (opened) {
          e.preventDefault();
        }
        return Boolean(opened);
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

    const isInputEditable = !(readOnly ?? disabled);

    return isInputEditable ? 'list' : 'none';
  }

  _displayGetterExpr(): undefined | string | ((item: unknown) => string | number | boolean) {
    const { valueExpr } = this.option();
    return valueExpr;
  }

  _closeOutsideDropDownHandler({ target }: DxEvent<PointerInteractionEvent>): boolean {
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

  _listConfig(): ListBaseProperties {
    return {
      ...super._listConfig(),
      pageLoadMode: 'none' as PageLoadMode,
      onSelectionChanged: (e): void => {
        this._setSelectedItem(e.addedItems[0]);
      },
    };
  }

  _listItemClickHandler(e: ItemClickEvent): void {
    this._saveValueChangeEvent(e.event);
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

  // eslint-disable-next-line class-methods-use-this
  _refreshSelected(): void {
    // Autocomplete has no persistent selection state — suppress parent behavior
    // _refreshSelected is called in parent, so we need to override here
    // hence we don't need this functionality in Autocomplete
  }

  _searchCanceled(): void {
    super._searchCanceled();
    this.close();
  }

  _loadItem(value: unknown, cache: Record<string, unknown>): ReturnType<typeof Deferred> {
    const selectedItem = this._getItemFromPlain(value, cache) as unknown;

    return Deferred().resolve(selectedItem).promise();
  }

  _dataSourceOptions(): DataSourceOptions {
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

  _valueChangeEventHandler(e: KeyboardEvent): void {
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
        this._searchDataSource(this._searchValue());
        break;
      case 'valueExpr':
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
