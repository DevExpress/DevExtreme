import Widget from '../widget/ui.widget';
import { deferRenderer } from '../../core/utils/common';

const SCROLLBAR_VISIBLE = {
    onScroll: 'onScroll',
    onHover: 'onHover',
    always: 'always',
    never: 'never'
};

const Scrollbar = Widget.inherit({
    _render: function() {
        this.callBase();

        this._update();
    },

    _toggleVisibility: function(visible) {
        if(this.option('visibilityMode') === SCROLLBAR_VISIBLE.onScroll) {
            // NOTE: need to relayout thumb and show it instantly
            this._$thumb.css('opacity');
        }
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
    },

    _optionChanged: function(args) {
        if(this._isHidden()) {
            return;
        }

        switch(args.name) {
            case 'containerSize':
            case 'contentSize':
                this.option(args.name, args.value);
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
