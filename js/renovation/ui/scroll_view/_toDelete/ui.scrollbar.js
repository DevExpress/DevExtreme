import eventsEngine from '../../events/core/events_engine';
import { move } from '../../animation/translator';
import Widget from '../widget/ui.widget';
import { deferRenderer } from '../../core/utils/common';
import { isPlainObject } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';

const SCROLLBAR = 'dxScrollbar';
const THUMB_MIN_SIZE = 15;

const SCROLLBAR_VISIBLE = {
    onScroll: 'onScroll',
    onHover: 'onHover',
    always: 'always',
    never: 'never'
};

const Scrollbar = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            direction: null,
            visible: false,
            containerSize: 0,
            contentSize: 0,
            scaleRatio: 1
        });
    },

    _init: function() {
        this.callBase();
    },

    _render: function() {
        this.callBase();

        this._update();
    },

    isThumb: function($element) {
        return !!this.$element().find($element).length;
    },

    _renderDimensions: function() {
        this._$thumb.css({
            width: this.option('width'),
            height: this.option('height')
        });
    },

    _toggleVisibility: function(visible) {
        if(this.option('visibilityMode') === SCROLLBAR_VISIBLE.onScroll) {
            // NOTE: need to relayout thumb and show it instantly
            this._$thumb.css('opacity');
        }

    },

    moveTo: function(location) {
        if(this._isHidden()) {
            return;
        }

        if(isPlainObject(location)) {
            location = location[this._prop] || 0;
        }

        const scrollBarLocation = {};
        scrollBarLocation[this._prop] = this._calculateScrollBarPosition(location);
        move(this._$thumb, scrollBarLocation);
    },

    _calculateScrollBarPosition: function(location) {
        return -location * this._thumbRatio;
    },


    _update: function() {
        const containerSize = Math.round(this.option('containerSize'));
        const contentSize = Math.round(this.option('contentSize'));
        let baseContainerSize = Math.round(this.option('baseContainerSize'));
        let baseContentSize = Math.round(this.option('baseContentSize'));

        // NOTE: if current scrollbar's using outside of scrollable
        if(isNaN(baseContainerSize)) {
            baseContainerSize = containerSize;
            baseContentSize = contentSize;
        }

        this._baseContainerToContentRatio = (baseContentSize ? baseContainerSize / baseContentSize : baseContainerSize);
        this._realContainerToContentRatio = (contentSize ? containerSize / contentSize : containerSize);
        const thumbSize = Math.round(Math.max(Math.round(containerSize * this._realContainerToContentRatio), THUMB_MIN_SIZE));
        this._thumbRatio = (containerSize - thumbSize) / (this.option('scaleRatio') * (contentSize - containerSize));

        this.option(this._dimension, thumbSize / this.option('scaleRatio'));
    },

    containerToContentRatio: function() {
        return this._realContainerToContentRatio;
    },

    _normalizeSize: function(size) {
        return isPlainObject(size) ? size[this._dimension] || 0 : size;
    },

    _clean: function() {
        this.callBase();

        eventsEngine.off(this._$thumb, '.' + SCROLLBAR);
    },

    _optionChanged: function(args) {
        if(this._isHidden()) {
            return;
        }

        switch(args.name) {
            case 'containerSize':
            case 'contentSize':
                this.option()[args.name] = this._normalizeSize(args.value);
                this._update();
                break;
            case 'baseContentSize':
            case 'baseContainerSize':
                this._update();
                break;
            case 'visibilityMode':
            case 'direction':
                this._invalidate();
                break;
            case 'scaleRatio':
                this._update();
                break;
            default:
                this.callBase.apply(this, arguments);
        }
    },

    update: deferRenderer(function() {
        this._adjustVisibility() && this.option('visible', true);
    })
});

export default Scrollbar;
