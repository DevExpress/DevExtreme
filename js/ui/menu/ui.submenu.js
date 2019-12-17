import $ from '../../core/renderer';
import { noop } from '../../core/utils/common';
import { getPublicElement } from '../../core/utils/dom';
import { setup } from '../../animation/position';
import { extend } from '../../core/utils/extend';
import ContextMenu from '../context_menu';

const DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS = 'dx-context-menu-content-delimiter';
const DX_SUBMENU_CLASS = 'dx-submenu';

class Submenu extends ContextMenu {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            orientation: 'horizontal',
            tabIndex: null,
            onHoverStart: noop
        });
    }

    _initDataAdapter() {
        this._dataAdapter = this.option('_dataAdapter');
        if(!this._dataAdapter) {
            super._initDataAdapter();
        }
    }

    _renderContentImpl() {
        this._renderContextMenuOverlay();
        super._renderContentImpl();

        const node = this._dataAdapter.getNodeByKey(this.option('_parentKey'));
        node && this._renderItems(this._getChildNodes(node));
        this._renderDelimiter();
    }

    _renderDelimiter() {
        this.$contentDelimiter = $('<div>')
            .appendTo(this._itemContainer())
            .addClass(DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS);
    }

    _getOverlayOptions() {
        return extend(super._getOverlayOptions(), {
            onPositioned: this._overlayPositionedActionHandler.bind(this)
        });
    }

    _overlayPositionedActionHandler(arg) {
        this._showDelimiter(arg);
    }

    _hoverEndHandler(e) {
        super._hoverEndHandler(e);
        this._toggleFocusClass(false, e.currentTarget);
    }

    _isMenuHorizontal() {
        return this.option('orientation') === 'horizontal';
    }

    _hoverStartHandler(e) {
        const hoverStartAction = this.option('onHoverStart');
        hoverStartAction(e);

        super._hoverStartHandler(e);
        this._toggleFocusClass(true, e.currentTarget);
    }

    _drawSubmenu($rootItem) {
        this._actions.onShowing({
            rootItem: getPublicElement($rootItem),
            submenu: this
        });
        super._drawSubmenu($rootItem);
        this._actions.onShown({
            rootItem: getPublicElement($rootItem),
            submenu: this
        });
    }

    _hideSubmenu($rootItem) {
        this._actions.onHiding({
            cancel: true,
            rootItem: getPublicElement($rootItem),
            submenu: this
        });
        super._hideSubmenu($rootItem);
        this._actions.onHidden({
            rootItem: getPublicElement($rootItem),
            submenu: this
        });
    }

    // TODO: try to simplify it
    _showDelimiter(arg) {
        if(!this.$contentDelimiter) {
            return;
        }

        const $submenu = this._itemContainer().children(`.${DX_SUBMENU_CLASS}`).eq(0);
        const $rootItem = this.option('position').of;
        const position = {
            of: $submenu
        };
        const containerOffset = arg.position;
        const vLocation = containerOffset.v.location;
        const hLocation = containerOffset.h.location;
        const rootOffset = $rootItem.offset();
        const offsetLeft = Math.round(rootOffset.left);
        const offsetTop = Math.round(rootOffset.top);
        const rootWidth = $rootItem.width();
        const rootHeight = $rootItem.height();
        const submenuWidth = $submenu.width();
        const submenuHeight = $submenu.height();

        this.$contentDelimiter.css('display', 'block');
        this.$contentDelimiter.width(this._isMenuHorizontal() ? (rootWidth < submenuWidth ? rootWidth - 2 : submenuWidth) : 2);
        this.$contentDelimiter.height(this._isMenuHorizontal() ? 2 : (rootHeight < submenuHeight ? rootHeight - 2 : submenuHeight));

        if(this._isMenuHorizontal()) {
            if(vLocation > offsetTop) {
                if(Math.round(hLocation) === offsetLeft) {
                    position.offset = '1 -1';
                    position.at = position.my = 'left top';
                } else {
                    position.offset = '-1 -1';
                    position.at = position.my = 'right top';
                }
            } else {
                this.$contentDelimiter.height(5);
                if(Math.round(hLocation) === offsetLeft) {
                    position.offset = '1 4';
                    position.at = position.my = 'left bottom';
                } else {
                    position.offset = '-1 2';
                    position.at = position.my = 'right bottom';
                }
            }
        } else {
            if(hLocation > offsetLeft) {
                if(Math.round(vLocation) === offsetTop) {
                    position.offset = '-1 1';
                    position.at = position.my = 'left top';
                } else {
                    position.offset = '-1 -1';
                    position.at = position.my = 'left bottom';
                }
            } else {
                if(Math.round(vLocation) === offsetTop) {
                    position.offset = '1 1';
                    position.at = position.my = 'right top';
                } else {
                    position.offset = '1 -1';
                    position.at = position.my = 'right bottom';
                }
            }
        }
        setup(this.$contentDelimiter, position);
    }

    _getContextMenuPosition() {
        return this.option('position');
    }

    isOverlayVisible() {
        return this._overlay.option('visible');
    }

    getOverlayContent() {
        return this._overlay.$content();
    }
}

module.exports = Submenu;
