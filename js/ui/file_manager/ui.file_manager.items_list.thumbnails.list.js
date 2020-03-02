import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { BindableTemplate } from '../../core/templates/bindable_template';

// import CollectionWidget from '../collection/ui.collection_widget.edit';
import CollectionWidget from '../collection/ui.collection_widget.live_update';

// const FILE_MANAGER_THUMBNAILS_ITEM_LIST_CLASS = 'dx-filemanager-thumbnails';
// const FILE_MANAGER_THUMBNAILS_VIEW_PORT_CLASS = 'dx-filemanager-thumbnails-view-port';
// const FILE_MANAGER_THUMBNAILS_ITEM_LIST_CONTAINER_CLASS = 'dx-filemanager-thumbnails-container';
const FILE_MANAGER_THUMBNAILS_ITEM_CLASS = 'dx-filemanager-thumbnails-item';
// const FILE_MANAGER_THUMBNAILS_ITEM_CONTENT_CLASS = 'dx-filemanager-thumbnails-item-content';
const FILE_MANAGER_THUMBNAILS_ITEM_THUMBNAIL_CLASS = 'dx-filemanager-thumbnails-item-thumbnail';
const FILE_MANAGER_THUMBNAILS_ITEM_SPACER_CLASS = 'dx-filemanager-thumbnails-item-spacer';
const FILE_MANAGER_THUMBNAILS_ITEM_NAME_CLASS = 'dx-filemanager-thumbnails-item-name';

const FILE_MANAGER_THUMBNAILS_ITEM_CLASS_DATA_KEY = 'dxFileManagerItemDataKey';

class FileManagerThumbnailListBox extends CollectionWidget {
    _supportedKeys() {
        return extend(super._supportedKeys(), {
            pageUp(e) {
                this._beforeKeyProcessing(e);
                this._processPageChange(true, e);
            },
            pageDown(e) {
                this._beforeKeyProcessing(e);
                this._processPageChange(false, e);
            },
            // enter(e) {
            //     this._beforeKeyProcessing(e);
            //     this.tryOpen();
            // },
            A(e) {
                this._beforeKeyProcessing(e);
                if(e.ctrlKey || e.metaKey) {
                    this.selectAll();
                }
            }
        });
    }

    _beforeKeyProcessing(e) {
        e.preventDefault();
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
        this._templateManager.addDefaultTemplates({
            item: new BindableTemplate(function($container, data, itemModel) {
                const $itemElement = this._getItemTemplate(itemModel, $container);
                $container.append($itemElement);
            }.bind(this), ['fileItem', 'icon', 'getDisplayName'], this.option('integrationOptions.watchMethod'))
        });
    }

    _getItemTemplate(itemData, $itemElement) {
        $('<i>')
            .addClass(`${FILE_MANAGER_THUMBNAILS_ITEM_THUMBNAIL_CLASS} dx-icon`)
            .addClass(`dx-icon-${itemData.icon}`)
            .appendTo($itemElement);
        $('<div>')
            .addClass(FILE_MANAGER_THUMBNAILS_ITEM_SPACER_CLASS)
            .appendTo($itemElement);
        $('<div>')
            .addClass(FILE_MANAGER_THUMBNAILS_ITEM_NAME_CLASS)
            .html(itemData.getDisplayName())
            .appendTo($itemElement);
    }

    _itemSelectHandler(e) {
        const index = this._editStrategy.getNormalizedIndex(e.currentTarget);
        if(index === -1) {
            return;
        }
        let keys = {};
        if(this.option('selectionMode') === 'multiple') {
            if(!this._isDefaultMultipleSelectionMode) {
                this._isDefaultMultipleSelectionMode = e.ctrlKey || e.metaKey || e.shiftKey;
            }
            keys = {
                control: this._isDefaultMultipleSelectionMode,
                shift: e.shiftKey
            };
        }
        this._selection.changeItemSelection(index, keys);
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
            this._isDefaultMultipleSelectionMode = false;
        }
    }

    _getItems() {
        return this.option('items') || [];
    }

    _focusOutHandler() {}

    getSelectedItems() {
        return this._selection.getSelectedItems();
    }

    selectAll() {
        this._selection.selectAll();
    }

    clearSelection() {
        this._selection.deselectAll();
    }

    clearFocus() {
        this.option('focusedElement', null);
    }

}

module.exports = FileManagerThumbnailListBox;
