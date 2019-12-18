import { extend } from '../../core/utils/extend';
import { name as dblClickName } from '../../events/double_click';
import { addNamespace } from '../../events/utils';
import eventsEngine from '../../events/core/events_engine';
import { getImageContainer } from '../../core/utils/icon';

import Widget from '../widget/ui.widget';

const FILE_MANAGER_FILES_VIEW_CLASS = 'dx-filemanager-files-view';
const FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE = 'dxFileManager_open';

class FileManagerItemListBase extends Widget {

    _initMarkup() {
        this._initActions();

        this.$element().addClass(FILE_MANAGER_FILES_VIEW_CLASS);

        const dblClickEventName = addNamespace(dblClickName, FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE);
        eventsEngine.on(this.$element(), dblClickEventName, this._getItemSelector(), this._onItemDblClick.bind(this));

        super._initMarkup();
    }

    _initActions() {
        this._actions = {
            onError: this._createActionByOption('onError'),
            onSelectionChanged: this._createActionByOption('onSelectionChanged'),
            onSelectedItemOpened: this._createActionByOption('onSelectedItemOpened')
        };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            selectionMode: 'single',
            contextMenu: null,
            getItems: null,
            getItemThumbnail: null,
            onError: null,
            onSelectionChanged: null,
            onSelectedItemOpened: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'selectionMode':
            case 'contextMenu':
            case 'getItems':
            case 'getItemThumbnail':
                this.repaint();
                break;
            case 'onError':
            case 'onSelectedItemOpened':
            case 'onSelectionChanged':
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    _getItems() {
        const itemsGetter = this.option('getItems');
        return itemsGetter ? itemsGetter() : [];
    }

    _raiseOnError(error) {
        this._actions.onError({ error });
    }

    _raiseSelectionChanged() {
        this._actions.onSelectionChanged();
    }

    _raiseSelectedItemOpened(fileItemInfo) {
        this._actions.onSelectedItemOpened({ fileItemInfo });
    }

    _getItemThumbnail(fileInfo) {
        const itemThumbnailGetter = this.option('getItemThumbnail');
        return itemThumbnailGetter ? itemThumbnailGetter(fileInfo) : { thumbnail: '' };
    }

    _getItemThumbnailContainer(fileInfo) {
        const { thumbnail, cssClass } = this._getItemThumbnail(fileInfo);

        const $itemThumbnail = getImageContainer(thumbnail)
            .addClass(this._getItemThumbnailCssClass());

        if(cssClass) {
            $itemThumbnail.addClass(cssClass);
        }

        return $itemThumbnail;
    }

    _getItemThumbnailCssClass() {
        return '';
    }

    _getItemSelector() {

    }

    _onItemDblClick(e) {

    }

    _showContextMenu(items, element, offset) {
        this._contextMenu.showAt(items, element, offset);
    }

    get _contextMenu() {
        return this.option('contextMenu');
    }

    refresh() {

    }

    getSelectedItems() {

    }

    clearSelection() {

    }

    selectItem() {

    }

}

module.exports = FileManagerItemListBase;
