import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import Popup from '../popup';

import DiagramPanel from './ui.diagram.panel';

const DIAGRAM_MOBILE_POPUP_CLASS = 'dx-diagram-mobile-popup';

class DiagramFloatingPanel extends DiagramPanel {
    _init() {
        super._init();

        this._createOnVisibilityChangedAction();
        this._isVisible = this.option('isVisible');
        this._isMobileView = this.option('isMobileView');
    }
    _initMarkup() {
        super._initMarkup();

        const $parent = this.$element();

        const $popupElement = $('<div>')
            .addClass(this._getPopupClass())
            .addClass(this._isMobileView && DIAGRAM_MOBILE_POPUP_CLASS)
            .appendTo($parent);

        this._popup = this._createComponent($popupElement, Popup, this._getPopupOptions());
        this._updatePopupVisible();
    }
    toggle() {
        this._isVisible = !this._isVisible;
        this._updatePopupVisible();
    }

    _getPopupContent() {
        return this._popup.content();
    }
    _getPointerUpElement() {
        return this._getPopupContent();
    }
    _getVerticalPaddingsAndBorders() {
        const $content = $(this._getPopupContent());
        return $content.outerHeight() - $content.height();
    }
    _getHorizontalPaddingsAndBorders() {
        const $content = $(this._getPopupContent());
        return $content.outerWidth() - $content.width();
    }
    _getPopupClass() {
        return '';
    }
    _getPopupWidth() {
        return Math.max(this.option('width'), this._getPopupMinWidth()) || 'auto';
    }
    _getPopupMinWidth() {
        return 0;
    }
    _getPopupHeight() {
        return Math.max(this.option('height'), this._getPopupMinHeight()) || 'auto';
    }
    _getPopupMinHeight() {
        return 0;
    }
    _getPopupOptions() {
        const that = this;
        return {
            animation: null,
            shading: false,
            focusStateEnabled: false,
            width: this._getPopupWidth(),
            height: this._getPopupHeight(),
            position: this.option('position'),
            onContentReady: function() {
                that._renderPopupContent(that._popup.content());
            },
            onShown: () => {
                this._isVisible = true;
                this._onVisibilityChangedAction({ visible: this._isVisible });
            },
            onHidden: () => {
                this._isVisible = false;
                this._onVisibilityChangedAction({ visible: this._isVisible });
            }
        };
    }
    _renderPopupContent($parent) {
    }
    _updatePopupVisible() {
        this._popup.option('visible', this._isVisible);
    }
    _createOnVisibilityChangedAction() {
        this._onVisibilityChangedAction = this._createActionByOption('onVisibilityChanged');
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'onVisibilityChanged':
                this._createOnVisibilityChangedAction();
                break;
            case 'width':
                this._popup.option('width', this._getPopupWidth());
                break;
            case 'height':
                this._popup.option('height', this._getPopupHeight());
                break;
            case 'isMobileView':
                if(this._isMobileView !== args.value) {
                    this._isMobileView = args.value;
                    this._invalidate();
                }
                break;
            case 'isVisible':
                this._isVisible = args.value;
                this._updatePopupVisible();
                break;
            default:
                super._optionChanged(args);
        }
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            offsetX: 0,
            offsetY: 0
        });
    }
}
module.exports = DiagramFloatingPanel;
