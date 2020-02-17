import $ from '../../core/renderer';
import DiagramPanel from './ui.diagram.panel';
import Popup from '../popup';

class DiagramFloatingPanel extends DiagramPanel {
    _init() {
        super._init();

        this._createOnVisibilityChangedAction();
        this._isVisible = this.option('isVisible');
    }
    _initMarkup() {
        super._initMarkup();

        const $parent = this.$element();

        const $popupElement = $('<div>')
            .addClass(this._getPopupClass())
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
    _getPopupOptions() {
        const that = this;
        return {
            animation: null,
            shading: false,
            focusStateEnabled: false,
            height: this.option('height') || 'auto',
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
            case 'isVisible':
                this._isVisible = args.value;
                this._updatePopupVisible();
                break;
            default:
                super._optionChanged(args);
        }
    }
}
module.exports = DiagramFloatingPanel;
