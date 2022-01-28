import $ from '../../core/renderer';

import Widget from '../widget/ui.widget';
import Popover from '../popover';

import { getDiagram } from './diagram.importer';
import { hasWindow, getWindow } from '../../core/utils/window';

const DIAGRAM_CONTEXT_TOOLBOX_TARGET_CLASS = 'dx-diagram-context-toolbox-target';
const DIAGRAM_CONTEXT_TOOLBOX_CLASS = 'dx-diagram-context-toolbox';
const DIAGRAM_TOUCH_CONTEXT_TOOLBOX_CLASS = 'dx-diagram-touch-context-toolbox';
const DIAGRAM_CONTEXT_TOOLBOX_CONTENT_CLASS = 'dx-diagram-context-toolbox-content';

class DiagramContextToolbox extends Widget {
    _init() {
        super._init();

        this._onShownAction = this._createActionByOption('onShown');
        this._popoverPositionData = [
            {
                my: { x: 'center', y: 'top' },
                at: { x: 'center', y: 'bottom' },
                offset: { x: 0, y: 5 }
            },
            {
                my: { x: 'right', y: 'center' },
                at: { x: 'left', y: 'center' },
                offset: { x: -5, y: 0 }
            },
            {
                my: { x: 'center', y: 'bottom' },
                at: { x: 'center', y: 'top' },
                offset: { x: 0, y: -5 }
            },
            {
                my: { x: 'left', y: 'center' },
                at: { x: 'right', y: 'center' },
                offset: { x: 5, y: 0 }
            }
        ];
    }
    _initMarkup() {
        super._initMarkup();

        this._$popoverTargetElement = $('<div>')
            .addClass(DIAGRAM_CONTEXT_TOOLBOX_TARGET_CLASS)
            .appendTo(this.$element());

        const $popoverElement = $('<div>')
            .appendTo(this.$element());

        let popoverClass = DIAGRAM_CONTEXT_TOOLBOX_CLASS;
        if(this._isTouchMode()) {
            popoverClass += ' ' + DIAGRAM_TOUCH_CONTEXT_TOOLBOX_CLASS;
        }
        this._popoverInstance = this._createComponent($popoverElement, Popover, {
            hideOnOutsideClick: false,
            container: this.$element()
        });
        this._popoverInstance.$element().addClass(popoverClass);
    }
    _isTouchMode() {
        const { Browser } = getDiagram();
        if(Browser.TouchUI) {
            return true;
        }
        if(!hasWindow()) {
            return false;
        }
        const window = getWindow();
        return window.navigator && window.navigator.maxTouchPoints > 0;
    }
    _show(x, y, side, category, callback) {
        this._popoverInstance.hide();

        const $content = $('<div>')
            .addClass(DIAGRAM_CONTEXT_TOOLBOX_CONTENT_CLASS);
        if(this.option('toolboxWidth') !== undefined) {
            $content.css('width', this.option('toolboxWidth'));
        }
        this._$popoverTargetElement
            .css({
                left: x + this._popoverPositionData[side].offset.x,
                top: y + this._popoverPositionData[side].offset.y
            })
            .show();

        // correct offset when parent has position absolute, relative, etc (T1010677)
        const window = getWindow();
        const targetDiv = this._$popoverTargetElement.get(0);
        this._$popoverTargetElement.css({
            left: targetDiv.offsetLeft - ((targetDiv.getBoundingClientRect().left + window.scrollX) - targetDiv.offsetLeft),
            top: targetDiv.offsetTop - ((targetDiv.getBoundingClientRect().top + window.scrollY) - targetDiv.offsetTop)
        });

        this._popoverInstance.option({
            position: {
                my: this._popoverPositionData[side].my,
                at: this._popoverPositionData[side].at,
                of: this._$popoverTargetElement
            },
            contentTemplate: $content,
            onContentReady: function() {
                const $element = this.$element().find('.' + DIAGRAM_CONTEXT_TOOLBOX_CONTENT_CLASS);
                this._onShownAction({ category, callback, $element, hide: () => this._popoverInstance.hide() });
            }.bind(this)
        });
        this._popoverInstance.show();
    }
    _hide() {
        this._$popoverTargetElement.hide();
        this._popoverInstance.hide();
    }
}

export default DiagramContextToolbox;
