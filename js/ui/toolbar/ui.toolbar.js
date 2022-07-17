import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import ToolbarBase from './ui.toolbar.base';
import { toggleItemFocusableElementTabIndex } from './ui.toolbar.utils';
import { MultiLineStrategy } from './strategy/toolbar.multiline';
import { SingleLineStrategy } from './strategy/toolbar.singleline';

// STYLE toolbar

const TOOLBAR_MULTILINE_CLASS = 'dx-toolbar-multiline';


class Toolbar extends ToolbarBase {

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {

            menuItemTemplate: 'menuItem',
            menuContainer: undefined,
            overflowMenuVisible: false,
            multiline: false,

            /**
            * @name dxToolbarOptions.selectedIndex
            * @type number
            * @default -1
            * @hidden
            */

            /**
            * @name dxToolbarOptions.activeStateEnabled
            * @hidden
            */

            /**
            * @name dxToolbarOptions.focusStateEnabled
            * @hidden
            */

            /**
            * @name dxToolbarOptions.accessKey
            * @hidden
            */

            /**
            * @name dxToolbarOptions.tabIndex
            * @hidden
            */

            /**
            * @name dxToolbarOptions.selectedItems
            * @hidden
            */

            /**
            * @name dxToolbarOptions.selectedItemKeys
            * @hidden
            */

            /**
            * @name dxToolbarOptions.keyExpr
            * @hidden
            */

            /**
            * @name dxToolbarOptions.selectedItem
            * @hidden
            */

            /**
            * @name dxToolbarOptions.height
            * @hidden
            */

            /**
            * @name dxToolbarOptions.onSelectionChanged
            * @action
            * @hidden
            */
        });

    }

    _isMultiline() {
        return this.option('multiline');
    }

    _dimensionChanged(dimension) {
        if(dimension === 'height') {
            return;
        }

        super._dimensionChanged();

        this._layoutStrategy._dimensionChanged();
    }

    _initMarkup() {
        super._initMarkup();

        this._updateFocusableItemsTabIndex();

        this._layoutStrategy._initMarkup();
    }

    _renderToolbar() {
        super._renderToolbar();

        this._renderLayoutStrategy();
    }

    _itemContainer() {
        if(this._isMultiline()) {
            return this._$toolbarItemsContainer;
        }

        return super._itemContainer();
    }

    _renderLayoutStrategy() {

        this.$element().toggleClass(TOOLBAR_MULTILINE_CLASS, this._isMultiline());

        this._layoutStrategy = this._isMultiline()
            ? new MultiLineStrategy(this)
            : new SingleLineStrategy(this);
    }

    _renderSections() {
        if(this._isMultiline()) {
            return;
        }

        return super._renderSections();
    }

    _postProcessRenderItems() {
        this._layoutStrategy._hideOverflowItems();
        this._layoutStrategy._updateMenuVisibility();

        super._postProcessRenderItems();

        this._layoutStrategy._renderMenuItems();
    }

    _renderItem(index, item, itemContainer, $after) {
        const itemElement = super._renderItem(index, item, itemContainer, $after);

        this._layoutStrategy._renderItem(item, itemElement);

        return itemElement;
    }

    // for filemanager
    _getItemsWidth() {
        this._layoutStrategy._getItemsWidth();
    }

    // for filemanager
    _getMenuItems() {
        return this._layoutStrategy._getMenuItems();
    }

    _getToolbarItems() {
        return this._layoutStrategy._getToolbarItems();
    }

    _arrangeItems() {
        this._layoutStrategy._arrangeItems();

        if(!this._isMultiline()) {
            super._arrangeItems(); // not call for multiline
        }
    }

    _itemOptionChanged(item, property, value) {
        this._layoutStrategy._itemOptionChanged(item, property, value);

        if(this._isMenuItem(item)) {
            // TODO
        } else if(this._isToolbarItem(item)) {
            super._itemOptionChanged(item, property, value);
        } else {
            super._itemOptionChanged(item, property, value);
        }

        if(property === 'disabled' || property === 'options.disabled') {
            toggleItemFocusableElementTabIndex(this, item);
        }

        if(property === 'location') {
            this.repaint();
        }
    }

    _updateFocusableItemsTabIndex() {
        this._getToolbarItems().forEach(item => toggleItemFocusableElementTabIndex(this, item));
    }

    _isMenuItem(itemData) {
        return itemData.location === 'menu' || itemData.locateInMenu === 'always';
    }

    _isToolbarItem(itemData) {
        return itemData.location === undefined || itemData.locateInMenu === 'never';
    }

    _optionChanged({ name, value }) {
        this._layoutStrategy._optionChanged(name, value);

        switch(name) {
            case 'menuContainer':
            case 'menuItemTemplate':
            case 'overflowMenuVisible':
                break;
            case 'multiline':
                this._invalidate();
                break;
            case 'disabled':
                super._optionChanged.apply(this, arguments);

                this._updateFocusableItemsTabIndex();
                break;
            default:
                super._optionChanged.apply(this, arguments);
        }
    }

    /**
     * @name dxToolbar.registerKeyHandler
     * @publicName registerKeyHandler(key, handler)
     * @hidden
    */

    /**
     * @name dxToolbar.focus
     * @publicName focus()
     * @hidden
    */

    // it is not public
    updateDimensions() {
        this._dimensionChanged();
    }
}

registerComponent('dxToolbar', Toolbar);

export default Toolbar;

/**
 * @name dxToolbarItem
 * @inherits CollectionWidgetItem
 * @type object
 */
