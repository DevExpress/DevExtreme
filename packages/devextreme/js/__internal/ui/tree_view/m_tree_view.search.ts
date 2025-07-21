import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import type dxTextBox from '@js/ui/text_box';
import type { SearchBoxMixinOptions } from '@js/ui/widget/ui.search_box_mixin';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SearchBoxControllerOptions } from '@ts/ui/collection/m_search_box_mixin';
import SearchBoxController from '@ts/ui/collection/m_search_box_mixin';
import type { InternalNode } from '@ts/ui/hierarchical_collection/data_converter';

import type { DataAdapterOptions } from '../hierarchical_collection/data_adapter';
import type { TreeViewBaseProperties } from './m_tree_view.base';
import TreeViewBase from './m_tree_view.base';

const TREEVIEW_CLASS_PREFIX = 'dx-treeview';
const TREEVIEW_NODE_CONTAINER_CLASS = `${TREEVIEW_CLASS_PREFIX}-node-container`;

type TreeViewSearchProperties = TreeViewBaseProperties & SearchBoxMixinOptions;

class TreeViewSearch extends TreeViewBase {
  _searchController!: SearchBoxController;

  _getDefaultOptions(): TreeViewSearchProperties {
    return {
      ...super._getDefaultOptions(),
      searchValue: '',
      searchEnabled: false,
      searchEditorOptions: {},
    } as TreeViewSearchProperties;
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
    this._searchController = new SearchBoxController({
      createEditor: (
        $element: dxElementWrapper,
        component: typeof dxTextBox,
        options: Record<string, unknown>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ): dxTextBox<any> => this._createComponent($element, component, options),
      widgetPrefix: TREEVIEW_CLASS_PREFIX,
    });
    super._init();
  }

  _initMarkup(): void {
    const searchBoxControllerOptions = this._getSearchBoxControllerOptions();

    this._searchController.render(this.$element(), searchBoxControllerOptions);
    super._initMarkup();
  }

  _getAriaTarget(): dxElementWrapper {
    const { searchEnabled } = this.option();
    if (searchEnabled) {
      return this._itemContainer(true);
    }
    return super._getAriaTarget();
  }

  _optionChanged(args: OptionChanged<TreeViewSearchProperties>): void {
    switch (args.name) {
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
    const { searchValue, searchMode, searchExpr } = this.option();
    return {
      ...super._getDataAdapterOptions(),
      searchValue,
      searchMode: searchMode ?? 'contains',
      // @ts-expect-error ts-error
      searchExpr,
    };
  }

  _getNodeContainer(): dxElementWrapper {
    return this.$element().find(`.${TREEVIEW_NODE_CONTAINER_CLASS}`).first();
  }

  _updateSearch(): void {
    const searchBoxControllerOptions = this._getSearchBoxControllerOptions();
    this._searchController?.updateEditorOptions(searchBoxControllerOptions);
  }

  _repaintContainer(): void {
    const $container = this._getNodeContainer();
    let rootNodes: InternalNode[] = [];

    if ($container.length) {
      $container.empty();
      rootNodes = this._dataAdapter.getRootNodes();
      this._renderEmptyMessage(rootNodes);
      this._renderItems($container, rootNodes);
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
      this._searchController?.focus();
      return;
    }
    super.focus();
  }

  _cleanItemContainer(): void {
    this._searchController?.remove();
    this.$element().empty();
  }

  _itemContainer(isSearchMode?: boolean, selectAllEnabled?: boolean): dxElementWrapper {
    // eslint-disable-next-line
    selectAllEnabled ??= this._selectAllEnabled();

    if (selectAllEnabled) {
      return this._getNodeContainer();
    }

    if (this._scrollable && isSearchMode) {
      return $(this._scrollable.content());
    }

    return super._itemContainer();
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
    this._searchController?.resolveValueChange();
    super._refresh();
  }

  _clean(): void {
    this._cleanAria();
    super._clean();
  }

  dispose(): void {
    this._searchController?.dispose();
    super.dispose();
  }
}

registerComponent('dxTreeView', TreeViewSearch);

export default TreeViewSearch;
