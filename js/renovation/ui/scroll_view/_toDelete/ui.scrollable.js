import $ from '../../core/renderer';
import registerComponent from '../../core/component_registrator';
import DOMComponent from '../../core/dom_component';

const SCROLLABLE = 'dxScrollable';
const SCROLLABLE_STRATEGY = 'dxScrollableStrategy';
const SCROLLABLE_CLASS = 'dx-scrollable';
const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';
const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal';

const Scrollable = DOMComponent.inherit({
    _render: function() {
        this._renderDisabledState();

        this.callBase();
    },

    _renderStrategy: function() {
        this.$element().data(SCROLLABLE_STRATEGY, this._strategy);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'onStart':
            case 'onEnd':
            case 'onStop':
            case 'onUpdated':
            case 'onScroll':
            case 'onBounce':
                this._createActions();
                break;
            case 'direction':
                this._resetInactiveDirection();
                this._invalidate();
                break;
            case 'useNative':
                this._setUseSimulatedScrollbar();
                this._invalidate();
                break;
            case 'inertiaEnabled':
            case 'scrollByContent':
            case 'scrollByThumb':
            case 'bounceEnabled':
            case 'useKeyboard':
            case 'showScrollbar':
            case 'useSimulatedScrollbar':
            case 'pushBackValue':
                this._invalidate();
                break;
            case 'disabled':
                this._renderDisabledState();
                this._strategy && this._strategy.disabledChanged();
                break;
            case 'updateManually':
                break;
            case 'width':
                this.callBase(args);
                this._updateRtlPosition();
                break;
            default:
                this.callBase(args);
        }
    },

    scrollToElementTopLeft: function(element) {
        const $element = $(element);
        const elementInsideContent = this.$content().find(element).length;
        const elementIsInsideContent = ($element.parents('.' + SCROLLABLE_CLASS).length - $element.parents('.' + SCROLLABLE_CONTENT_CLASS).length) === 0;
        if(!elementInsideContent || !elementIsInsideContent) {
            return;
        }

        const scrollPosition = { top: 0, left: 0 };
        const direction = this.option('direction');

        if(direction !== VERTICAL) {
            const leftPosition = this._elementPositionRelativeToContent($element, 'left');
            scrollPosition.left = this.option('rtlEnabled') === true
                ? leftPosition + $element.width() - this.clientWidth()
                : leftPosition;
        }
        if(direction !== HORIZONTAL) {
            scrollPosition.top = this._elementPositionRelativeToContent($element, 'top');
        }

        this.scrollTo(scrollPosition);
    },
});

registerComponent(SCROLLABLE, Scrollable);

export default Scrollable;
