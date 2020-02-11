import $ from '../../core/renderer';
import Widget from '../widget/ui.widget';
import Popup from '../popup';

class DiagramFloatingPanel extends Widget {
    _initMarkup() {
        super._initMarkup();

        const $parent = this.$element();

        const $popupElement = $('<div>')
            .addClass(this._getPopupClass())
            .appendTo($parent);

        this._popup = this._createComponent($popupElement, Popup, this._getPopupOptions());
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
            }
        };
    }
    _renderPopupContent($parent) {
    }
}
module.exports = DiagramFloatingPanel;
