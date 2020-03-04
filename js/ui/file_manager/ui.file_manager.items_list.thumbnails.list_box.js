import { extend } from '../../core/utils/extend';
import { BindableTemplate } from '../../core/templates/bindable_template';

import CollectionWidget from '../collection/ui.collection_widget.edit';

const FILE_MANAGER_THUMBNAILS_ITEM_CLASS = 'dx-filemanager-thumbnails-item';

const FILE_MANAGER_THUMBNAILS_ITEM_CLASS_DATA_KEY = 'dxFileManagerItemDataKey';

class FileManagerThumbnailListBox extends CollectionWidget {

    _supportedKeys() {
        return extend(super._supportedKeys(), {
            upArrow(e) {
                this._beforeKeyProcessing(e);
                this._processMoveArrow(-1, false, e);
            },
            downArrow(e) {
                this._beforeKeyProcessing(e);
                this._processMoveArrow(1, false, e);
            },
            home(e) {
                this._beforeKeyProcessing(e);
                this._processHomeEndKeys(0, true, e);
            },
            end(e) {
                this._beforeKeyProcessing(e);
                this._processHomeEndKeys(this.getItems().length - 1, true, e);
            },
            pageUp(e) {
                this._beforeKeyProcessing(e);
                this._processPageChange(true, e);
            },
            pageDown(e) {
                this._beforeKeyProcessing(e);
                this._processPageChange(false, e);
            },
            enter(e) {
                this._beforeKeyProcessing(e);
                this._onItemEnterKeyPressed();
            },
            A(e) {
                this._beforeKeyProcessing(e);
                if(e.ctrlKey || e.metaKey) {
                    this.selectAll();
                }
            }
        });
    }

    _initActions() {
        this._getDefaultItemTemplate = this.option('defaultItemTemplate');
        this._onItemEnterKeyPressed = this._createActionByOption('onItemEnterKeyPressed');
        this._beforeKeyProcessing = this.option('beforeKeyProcessing');
        this._processMoveArrow = this.option('processMoveArrow');
        this._processHomeEndKeys = this.option('processHomeEndKeys');
        this._processPageChange = this.option('processPageChange');
    }

    _itemContainer() {
        return this.$element();
    }

    _itemClass() {
        return FILE_MANAGER_THUMBNAILS_ITEM_CLASS;
    }

    _itemDataKey() {
        return FILE_MANAGER_THUMBNAILS_ITEM_CLASS_DATA_KEY;
    }

    _initTemplates() {
        super._initTemplates();
        this._initActions();
        this._templateManager.addDefaultTemplates({
            item: new BindableTemplate(function($container, data, itemModel) {
                const $itemElement = this._getDefaultItemTemplate(itemModel, $container);
                $container.append($itemElement);
            }.bind(this), ['fileItem'], this.option('integrationOptions.watchMethod'))
        });
    }

    _itemSelectHandler(e) {
        const index = this.getIndexByItemElement(e.currentTarget);
        if(index === -1) {
            return;
        }
        let options = {};
        if(this.option('selectionMode') === 'multiple') {
            if(!this._isPreserveSelectionMode) {
                this._isPreserveSelectionMode = e.ctrlKey || e.metaKey || e.shiftKey;
            }
            options = {
                control: this._isPreserveSelectionMode,
                shift: e.shiftKey
            };
        }
        this._selection.changeItemSelection(index, options);
    }

    _updateSelection(addedSelection, removedSelection) {
        for(let i = 0; i < removedSelection.length; i++) {
            this._removeSelection(removedSelection[i]);
        }
        for(let i = 0; i < addedSelection.length; i++) {
            this._addSelection(addedSelection[i]);
        }
        const selectedItemsCount = this.getSelectedItems().length;
        if(selectedItemsCount === 0) {
            this._isPreserveSelectionMode = false;
        }
    }

    _focusOutHandler() {}

    getItems() {
        return this.option('items') || [];
    }

    getSelectedItems() {
        return this._selection.getSelectedItems();
    }

    getItemElementByItem(item) {
        return this._findItemElementByItem(item);
    }

    getItemByItemElement(itemElement) {
        return this.getItemByIndex(this.getIndexByItemElement(itemElement));
    }

    getIndexByItemElement(itemElement) {
        return this._editStrategy.getNormalizedIndex(itemElement);
    }

    getIndexByItem(item) {
        return this._getIndexByItem(item);
    }

    getItemByIndex(index) {
        return this.getItems()[index];
    }

    getFocusedItem() {
        return this.getItemByItemElement(this.option('focusedElement'));
    }

    setFocusedItem(item) {
        this.option('focusedElement', this.getItemElementByItem(item));
    }

    selectAll() {
        this._selection.selectAll();
        this._isPreserveSelectionMode = true;
    }

    selectItemConditionally(itemElement) {
        this._selection.changeItemSelection(this.getIndexByItemElement(itemElement), { control: this._isPreserveSelectionMode });
    }

    clearSelection() {
        this._selection.deselectAll();
    }

    clearFocus() {
        this.option('focusedElement', null);
    }

}

module.exports = FileManagerThumbnailListBox;
