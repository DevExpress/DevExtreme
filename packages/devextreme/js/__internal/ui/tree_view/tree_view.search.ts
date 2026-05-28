import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SearchBoxControllerOptions } from '@ts/ui/collection/search_box_controller';
import SearchBoxController from '@ts/ui/collection/search_box_controller';
import type { DataAdapterOptions } from '@ts/ui/hierarchical_collection/data_adapter';
import type { InternalNode } from '@ts/ui/hierarchical_collection/data_converter';
import TextBox from '@ts/ui/text_box/text_box';
import type { TreeViewBaseProperties } from '@ts/ui/tree_view/tree_view.base';
import TreeViewBase from '@ts/ui/tree_view/tree_view.base';

export const TREEVIEW_CLASS_PREFIX = 'dx-treeview';
const TREEVIEW_NODE_CONTAINER_CLASS = 'dx-treeview-node-container';

SearchBoxController.setEditorClass(TextBox);

class TreeViewSearch extends TreeViewBase {
  _searchBoxController!: SearchBoxController;

  _getDefaultOptions(): TreeViewBaseProperties {
    return {
      ...super._getDefaultOptions(),
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

  _init(): void {
    this._searchBoxController = new SearchBoxController();
    super._init();
  }

  _initMarkup(): void {
    this._searchBoxController.render(
      TREEVIEW_CLASS_PREFIX,
      this.$element(),
      this._getSearchBoxControllerOptions(),
      this._createComponent.bind(this),
    );
    super._initMarkup();
  }

  _getAriaTarget(): dxElementWrapper {
    const { searchEnabled } = this.option();
    if (searchEnabled) {
      return this._itemContainer(true);
    }
    return super._getAriaTarget();
  }

  getSearchBoxController(): SearchBoxController {
    return this._searchBoxController;
  }

  _optionChanged(args: OptionChanged<TreeViewBaseProperties>): void {
    const { name } = args;

    switch (name) {
      case 'searchEnabled':
      case 'searchEditorOptions':
        this._invalidate();
        break;
      case 'searchValue': {
        if (this._showCheckboxes() && this._isRecursiveSelection()) {
          this._removeSelection();
        }

        this._initDataAdapter();
        this._updateSearch();
        this._repaintContainer();
        this.option('focusedElement', null);
        break;
      }
      case 'searchExpr': {
        this._initDataAdapter();
        this.repaint();
        break;
      }
      case 'searchMode': {
        const { expandNodesRecursive } = this.option();
        if (expandNodesRecursive) {
          this._updateDataAdapter();
        } else {
          this._initDataAdapter();
        }
        this.repaint();
        break;
      }
      case 'searchTimeout':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _updateDataAdapter(): void {
    this._setOptionWithoutOptionChange('expandNodesRecursive', false);

    this._initDataAdapter();

    this._setOptionWithoutOptionChange('expandNodesRecursive', true);
  }

  _getDataAdapterOptions(): Partial<DataAdapterOptions> {
    const {
      searchValue = '',
      searchMode = 'contains',
      searchExpr,
    } = this.option();

    return {
      ...super._getDataAdapterOptions(),
      searchValue,
      searchMode,
      searchExpr,
    };
  }

  _getNodeContainer(): dxElementWrapper {
    return this.$element().find(`.${TREEVIEW_NODE_CONTAINER_CLASS}`).first();
  }

  _updateSearch(): void {
    const searchBoxControllerOptions = this._getSearchBoxControllerOptions();
    this._searchBoxController?.updateEditorOptions(searchBoxControllerOptions);
  }

  _repaintContainer(): void {
    const $container = this._getNodeContainer();
    let rootNodes: InternalNode[] = [];

    if ($container.length) {
      $container.empty();
      rootNodes = this._dataAdapter.getRootNodes();
      this._renderEmptyMessage(rootNodes);
      this._renderNodes(rootNodes, $container);
      this._fireContentReadyAction();
    }
  }

  _updateFocusState(e: DxEvent, isFocused: boolean): void {
    if (this.option('searchEnabled')) {
      this._toggleFocusClass(isFocused, this.$element());
    }
    super._updateFocusState(e, isFocused);
  }

  _focusTarget(): dxElementWrapper {
    const { searchEnabled } = this.option();
    return this._itemContainer(searchEnabled);
  }

  focus(): void {
    if (!this.option('focusedElement') && this.option('searchEnabled')) {
      this._searchBoxController?.focus();
      return;
    }
    super.focus();
  }

  _cleanItemContainer(): void {
    this._searchBoxController?.remove();
    this.$element().empty();
  }

  _itemContainer(isSearchMode?: boolean, selectAllEnabled?: boolean): dxElementWrapper {
    const isSelectAllEnabled = selectAllEnabled ?? this._selectAllEnabled();

    const { items = [] } = this.option();
    if (isSelectAllEnabled && items.length) {
      return this._getNodeContainer();
    }

    if (this.getScrollable() && isSearchMode) {
      return $(this.getScrollable().content());
    }

    return super._itemContainer();
  }

  _applyToAllItemContainers(callback: (itemsContainer: dxElementWrapper) => void): void {
    if (this.getScrollable()) {
      callback($(this.getScrollable().content()));
    }

    const nodeContainer = this._getNodeContainer();
    if (nodeContainer.length) {
      callback(nodeContainer);
    }

    callback(this.$element());
  }

  _attachClickEvent(): void {
    if (this._selectAllEnabled()) {
      this._applyToAllItemContainers((itemsContainer) => {
        this._detachClickEvent(itemsContainer);
      });
    }

    super._attachClickEvent();
  }

  _attachHoldEvent(): void {
    if (this._selectAllEnabled()) {
      this._applyToAllItemContainers((itemsContainer) => {
        this._detachHoldEvent(itemsContainer);
      });
    }

    super._attachHoldEvent();
  }

  _attachContextMenuEvent(): void {
    if (this._selectAllEnabled()) {
      this._applyToAllItemContainers((itemsContainer) => {
        this._detachContextMenuEvent(itemsContainer);
      });
    }

    super._attachContextMenuEvent();
  }

  _addWidgetClass(): void {
    this.$element().addClass(this._widgetClass());
  }

  _cleanAria(): void {
    const $element = this.$element();

    this.setAria({
      role: null,
      activedescendant: null,
    }, $element);

    $element.attr('tabIndex', null);
  }

  _refresh(): void {
    this._searchBoxController?.resolveValueChange();
    super._refresh();
  }

  _clean(): void {
    this._cleanAria();
    super._clean();
  }

  dispose(): void {
    this._searchBoxController?.dispose();
    super.dispose();
  }
}

registerComponent('dxTreeView', TreeViewSearch);

export default TreeViewSearch;
