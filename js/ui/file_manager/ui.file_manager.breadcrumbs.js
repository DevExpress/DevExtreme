import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import eventsEngine from '../../events/core/events_engine';
import { addNamespace } from '../../events/utils';

import Widget from '../widget/ui.widget';
import Menu from '../menu/ui.menu';

import { getPathParts, getParentPath, getName } from './ui.file_manager.utils';

const FILE_MANAGER_BREADCRUMBS_CLASS = 'dx-filemanager-breadcrumbs';
const FILE_MANAGER_BREADCRUMBS_PARENT_FOLDER_ITEM_CLASS = FILE_MANAGER_BREADCRUMBS_CLASS + '-parent-folder-item';
const FILE_MANAGER_BREADCRUMBS_SEPARATOR_ITEM_CLASS = FILE_MANAGER_BREADCRUMBS_CLASS + '-separator-item';
const FILE_MANAGER_BREADCRUMBS_PATH_SEPARATOR_ITEM_CLASS = FILE_MANAGER_BREADCRUMBS_CLASS + '-path-separator-item';
const MENU_ITEMS_CONTAINER_CLASS = 'dx-menu-items-container';

const FILE_MANAGER_BREADCRUMBS_EVENT_NAMESPACE = 'dxFileManager_breadcrubms';

class FileManagerBreadcrumbs extends Widget {

    _initMarkup() {
        super._initMarkup();

        this._initActions();

        const $menu = $('<div>').appendTo(this.$element());
        this._menu = this._createComponent($menu, Menu, {
            dataSource: this._getMenuItems(),
            onItemClick: this._onItemClick.bind(this),
            onItemRendered: this._onItemRendered.bind(this)
        });

        const clickEvent = addNamespace('click', FILE_MANAGER_BREADCRUMBS_EVENT_NAMESPACE);
        eventsEngine.on($menu, clickEvent, this._onClick.bind(this));

        this.$element().addClass(FILE_MANAGER_BREADCRUMBS_CLASS);
    }

    _getMenuItems() {
        const path = this.option('path');
        const parts = path ? getPathParts(path, true) : [];
        const rootFolder = this.option('rootFolderDisplayName');
        rootFolder && parts.unshift(rootFolder);

        const result = [
            {
                icon: 'arrowup',
                path: getParentPath(path),
                isPathItem: true,
                cssClass: FILE_MANAGER_BREADCRUMBS_PARENT_FOLDER_ITEM_CLASS
            },
            {
                cssClass: FILE_MANAGER_BREADCRUMBS_SEPARATOR_ITEM_CLASS
            }
        ];

        for(let i = 0; i < parts.length; i++) {
            const part = parts[i];

            result.push({
                text: getName(part),
                path: i === 0 ? '' : part,
                isPathItem: true
            });

            if(i !== parts.length - 1) {
                result.push({
                    icon: 'spinnext',
                    cssClass: FILE_MANAGER_BREADCRUMBS_PATH_SEPARATOR_ITEM_CLASS
                });
            }
        }

        return result;
    }

    _onItemClick({ itemData }) {
        if(!itemData.isPathItem) {
            return;
        }

        const path = this.option('path');
        const newPath = itemData.path;

        if(newPath !== path) {
            this._raisePathChanged(newPath);
        }
    }

    _onClick({ target }) {
        const $item = $(target).closest(`.${MENU_ITEMS_CONTAINER_CLASS}`);
        if($item.length === 0) {
            this._raiseOutsideClick();
        }
    }

    _onItemRendered({ itemElement, itemData }) {
        if(itemData.cssClass) {
            $(itemElement).addClass(itemData.cssClass);
        }
    }

    _initActions() {
        this._actions = {
            onPathChanged: this._createActionByOption('onPathChanged'),
            onOutsideClick: this._createActionByOption('onOutsideClick')
        };
    }

    _raisePathChanged(newPath) {
        this._actions.onPathChanged({ newPath });
    }

    _raiseOutsideClick() {
        this._actions.onOutsideClick();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            rootFolderDisplayName: 'Files',
            path: '',
            onPathChanged: null,
            onOutsideClick: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'rootFolderDisplayName':
            case 'path':
                this.repaint();
                break;
            case 'onPathChanged':
            case 'onOutsideClick':
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

}

module.exports = FileManagerBreadcrumbs;
