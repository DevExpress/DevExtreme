import { setOuterWidth, getOuterWidth, setOuterHeight, getOuterHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import modules from './ui.grid_core.modules';
import { name as clickEventName } from '../../events/click';
import pointerEvents from '../../events/pointer';
import positionUtils from '../../animation/position';
import { addNamespace, normalizeKeyName } from '../../events/utils/index';
import browser from '../../core/utils/browser';
import { extend } from '../../core/utils/extend';
import { getBoundingRect } from '../../core/utils/position';
import EditorFactoryMixin from '../shared/ui.editor_factory_mixin';
import gridCoreUtils from './ui.grid_core.utils';

const EDITOR_INLINE_BLOCK = 'dx-editor-inline-block';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const FOCUS_OVERLAY_CLASS = 'focus-overlay';
const CONTENT_CLASS = 'content';
const FOCUSED_ELEMENT_CLASS = 'dx-focused';
const ROW_CLASS = 'dx-row';
const MODULE_NAMESPACE = 'dxDataGridEditorFactory';
const UPDATE_FOCUS_EVENTS = addNamespace([pointerEvents.down, 'focusin', clickEventName].join(' '), MODULE_NAMESPACE);
const DX_HIDDEN = 'dx-hidden';

const EditorFactory = modules.ViewController.inherit({
    _getFocusedElement: function($dataGridElement) {
        const rowSelector = this.option('focusedRowEnabled') ? 'tr[tabindex]:focus' : 'tr[tabindex]:not(.dx-data-row):focus';
        const focusedElementSelector = `td[tabindex]:focus, ${rowSelector}, input:focus, textarea:focus, .dx-lookup-field:focus, .dx-checkbox:focus, .dx-switch:focus, .dx-dropdownbutton .dx-buttongroup:focus, .dx-adaptive-item-text:focus`;

        // T181706
        const $focusedElement = $dataGridElement.find(focusedElementSelector);

        return this.elementIsInsideGrid($focusedElement) && $focusedElement;
    },

    _getFocusCellSelector: function() {
        return '.dx-row > td';
    },

    _updateFocusCore: function() {
        const $dataGridElement = this.component && this.component.$element();

        if($dataGridElement) {
            // this selector is specific to IE
            let $focus = this._getFocusedElement($dataGridElement);

            if($focus && $focus.length) {
                let isHideBorder;

                if(!$focus.hasClass(CELL_FOCUS_DISABLED_CLASS) && !$focus.hasClass(ROW_CLASS)) {
                    const $focusCell = $focus.closest(this._getFocusCellSelector() + ', .' + CELL_FOCUS_DISABLED_CLASS);

                    if($focusCell.get(0) !== $focus.get(0)) {
                        isHideBorder = this._needHideBorder($focusCell);
                        $focus = $focusCell;
                    }
                }

                if($focus.length && !$focus.hasClass(CELL_FOCUS_DISABLED_CLASS)) {
                    this.focus($focus, isHideBorder);
                    return;
                }
            }
        }

        this.loseFocus();
    },

    _needHideBorder($element) {
        return $element.hasClass(EDITOR_INLINE_BLOCK);
    },

    _updateFocus: function(e) {
        const that = this;
        const isFocusOverlay = e && e.event && $(e.event.target).hasClass(that.addWidgetPrefix(FOCUS_OVERLAY_CLASS));

        that._isFocusOverlay = that._isFocusOverlay || isFocusOverlay;

        clearTimeout(that._updateFocusTimeoutID);

        that._updateFocusTimeoutID = setTimeout(function() {
            delete that._updateFocusTimeoutID;
            if(!that._isFocusOverlay) {
                that._updateFocusCore();
            }
            that._isFocusOverlay = false;
        });
    },

    _updateFocusOverlaySize: function($element, position) {
        $element.hide();

        const location = positionUtils.calculate($element, extend({ collision: 'fit' }, position));

        if(location.h.oversize > 0) {
            setOuterWidth($element, getOuterWidth($element) - location.h.oversize);
        }

        if(location.v.oversize > 0) {
            setOuterHeight($element, getOuterHeight($element) - location.v.oversize);
        }

        $element.show();
    },

    callbackNames: function() {
        return ['focused'];
    },

    focus: function($element, isHideBorder) {
        const that = this;

        if($element === undefined) {
            return that._$focusedElement;
        } else if($element) {
            // To prevent overlay flicking
            if(!$element.is(that._$focusedElement)) {
                // TODO: this code should be before timeout else focus is not will move to adaptive form by shift + tab key
                that._$focusedElement && that._$focusedElement.removeClass(FOCUSED_ELEMENT_CLASS);
            }
            that._$focusedElement = $element;

            clearTimeout(that._focusTimeoutID);
            that._focusTimeoutID = setTimeout(function() {
                delete that._focusTimeoutID;

                that.renderFocusOverlay($element, isHideBorder);

                $element.addClass(FOCUSED_ELEMENT_CLASS);
                that.focused.fire($element);
            });
        }
    },

    refocus: function() {
        const $focus = this.focus();
        this.focus($focus);
    },

    renderFocusOverlay: function($element, isHideBorder) {
        const that = this;

        if(!gridCoreUtils.isElementInCurrentGrid(this, $element)) {
            return;
        }

        if(!that._$focusOverlay) {
            that._$focusOverlay = $('<div>').addClass(that.addWidgetPrefix(FOCUS_OVERLAY_CLASS));
        }

        if(isHideBorder) {
            that._$focusOverlay.addClass(DX_HIDDEN);
        } else if($element.length) {
            // align "right bottom" for Mozilla
            const align = browser.mozilla ? 'right bottom' : 'left top';
            const $content = $element.closest('.' + that.addWidgetPrefix(CONTENT_CLASS));
            const elemCoord = getBoundingRect($element.get(0));

            that._$focusOverlay
                .removeClass(DX_HIDDEN)
                .appendTo($content);
            setOuterHeight(that._$focusOverlay, elemCoord.bottom - elemCoord.top + 1);
            setOuterWidth(that._$focusOverlay, elemCoord.right - elemCoord.left + 1);

            const focusOverlayPosition = {
                precise: true,
                my: align,
                at: align,
                of: $element,
                boundary: $content.length && $content
            };

            that._updateFocusOverlaySize(that._$focusOverlay, focusOverlayPosition);
            positionUtils.setup(that._$focusOverlay, focusOverlayPosition);

            that._$focusOverlay.css('visibility', 'visible'); // for ios
        }
    },

    resize: function() {
        const $focusedElement = this._$focusedElement;

        if($focusedElement) {
            this.focus($focusedElement);
        }
    },

    loseFocus: function() {
        this._$focusedElement && this._$focusedElement.removeClass(FOCUSED_ELEMENT_CLASS);
        this._$focusedElement = null;
        this._$focusOverlay && this._$focusOverlay.addClass(DX_HIDDEN);
    },

    init: function() {
        this.createAction('onEditorPreparing', { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' });
        this.createAction('onEditorPrepared', { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' });

        this._updateFocusHandler = this._updateFocusHandler || this.createAction(this._updateFocus.bind(this));
        eventsEngine.on(domAdapter.getDocument(), UPDATE_FOCUS_EVENTS, this._updateFocusHandler);

        this._attachContainerEventHandlers();
    },

    _attachContainerEventHandlers: function() {
        const that = this;
        const $container = that.component && that.component.$element();

        if($container) {
            // T179518
            eventsEngine.on($container, addNamespace('keydown', MODULE_NAMESPACE), function(e) {
                if(normalizeKeyName(e) === 'tab') {
                    that._updateFocusHandler(e);
                }
            });
        }
    },

    dispose: function() {
        clearTimeout(this._focusTimeoutID);
        clearTimeout(this._updateFocusTimeoutID);
        eventsEngine.off(domAdapter.getDocument(), UPDATE_FOCUS_EVENTS, this._updateFocusHandler);
    }
}).include(EditorFactoryMixin);

export const editorFactoryModule = {
    defaultOptions: function() {
        return {


        };
    },
    controllers: {
        editorFactory: EditorFactory
    }
};
