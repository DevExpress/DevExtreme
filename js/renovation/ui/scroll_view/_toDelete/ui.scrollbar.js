import Widget from '../widget/ui.widget';
import { deferRenderer } from '../../core/utils/common';

const Scrollbar = Widget.inherit({
    _toggleVisibility: function(visible) {
        if(this.option('visibilityMode') === 'onScroll') {
            // NOTE: need to relayout thumb and show it instantly
            this._$thumb.css('opacity');
        }
    },

    update: deferRenderer(function() {
        this._adjustVisibility() && this.option('visible', true);
    })
});

export default Scrollbar;
