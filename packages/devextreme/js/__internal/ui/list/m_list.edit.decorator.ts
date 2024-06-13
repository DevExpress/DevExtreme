import { getWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { noop } from '../../core/utils/common';
import Class from '../../core/class';
import {
    start as swipeEventStart,
    swipe as swipeEventSwipe,
    end as swipeEventEnd
} from '../../events/swipe';
import { addNamespace } from '../../events/utils/index';


const LIST_EDIT_DECORATOR = 'dxListEditDecorator';
const SWIPE_START_EVENT_NAME = addNamespace(swipeEventStart, LIST_EDIT_DECORATOR);
const SWIPE_UPDATE_EVENT_NAME = addNamespace(swipeEventSwipe, LIST_EDIT_DECORATOR);
const SWIPE_END_EVENT_NAME = addNamespace(swipeEventEnd, LIST_EDIT_DECORATOR);

const EditDecorator = Class.inherit({

    ctor: function(list) {
        this._list = list;

        this._init();
    },

    _init: noop,

    _shouldHandleSwipe: false,

    _attachSwipeEvent: function(config) {
        const swipeConfig = {
            itemSizeFunc: (function() {
                if(this._clearSwipeCache) {
                    this._itemWidthCache = getWidth(this._list.$element());
                    this._clearSwipeCache = false;
                }
                return this._itemWidthCache;
            }).bind(this)
        };

        eventsEngine.on(config.$itemElement, SWIPE_START_EVENT_NAME, swipeConfig, this._itemSwipeStartHandler.bind(this));
        eventsEngine.on(config.$itemElement, SWIPE_UPDATE_EVENT_NAME, this._itemSwipeUpdateHandler.bind(this));
        eventsEngine.on(config.$itemElement, SWIPE_END_EVENT_NAME, this._itemSwipeEndHandler.bind(this));
    },

    _itemSwipeStartHandler: function(e) {
        const $itemElement = $(e.currentTarget);
        if($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
            e.cancel = true;
            return;
        }

        clearTimeout(this._list._inkRippleTimer);

        this._swipeStartHandler($itemElement, e);
    },

    _itemSwipeUpdateHandler: function(e) {
        const $itemElement = $(e.currentTarget);

        this._swipeUpdateHandler($itemElement, e);
    },

    _itemSwipeEndHandler: function(e) {
        const $itemElement = $(e.currentTarget);

        this._swipeEndHandler($itemElement, e);

        this._clearSwipeCache = true;
    },

    beforeBag: noop,

    afterBag: noop,

    _commonOptions: function() {
        return {
            activeStateEnabled: this._list.option('activeStateEnabled'),
            hoverStateEnabled: this._list.option('hoverStateEnabled'),
            focusStateEnabled: this._list.option('focusStateEnabled')
        };
    },

    modifyElement: function(config) {
        if(this._shouldHandleSwipe) {
            this._attachSwipeEvent(config);
            this._clearSwipeCache = true;
        }
    },

    afterRender: noop,

    handleClick: noop,

    handleKeyboardEvents: noop,

    handleEnterPressing: noop,

    handleContextMenu: noop,

    _swipeStartHandler: noop,

    _swipeUpdateHandler: noop,

    _swipeEndHandler: noop,

    visibilityChange: noop,

    getExcludedSelectors: noop,

    dispose: noop

});

export default EditDecorator;
