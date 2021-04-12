import $ from '../../core/renderer';
import { hasWindow } from '../../core/utils/window';
import registerComponent from '../../core/component_registrator';
import { noop } from '../../core/utils/common';
import PullDownStrategy from './ui.scroll_view.native.pull_down';
import SwipeDownStrategy from './ui.scroll_view.native.swipe_down';
import SimulatedStrategy from './ui.scroll_view.simulated';
import Scrollable from './ui.scrollable';

const refreshStrategies = {
    pullDown: PullDownStrategy,
    swipeDown: SwipeDownStrategy,
    simulated: SimulatedStrategy
};

const isServerSide = !hasWindow();

const scrollViewServerConfig = {
    finishLoading: noop,
    release: noop,
    refresh: noop,
    _optionChanged: function(args) {
        if(args.name !== 'onUpdated') {
            return this.callBase.apply(this, arguments);
        }
    }
};

const ScrollView = Scrollable.inherit(isServerSide ? scrollViewServerConfig : {
    _init: function() {
        this.callBase();
    },

    _createStrategy: function() {
        const strategyName = this.option('useNative') ? this.option('refreshStrategy') : 'simulated';
        // eslint-disable-next-line no-undef
        const strategyClass = refreshStrategies[strategyName];
        if(!strategyClass) {
            throw Error('E1030', this.option('refreshStrategy'));
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'onPullDown':
            case 'onReachBottom':
                this._createActions();
                break;
            case 'pullingDownText':
            case 'pulledDownText':
            case 'refreshingText':
            case 'refreshStrategy':
                this._invalidate();
                break;
            case 'reachBottomText':
                this._updateReachBottomText();
                break;
            default:
                this.callBase(args);
        }
    },

    release: function(preventReachBottom) {
        if(preventReachBottom !== undefined) {
            this.toggleLoading(!preventReachBottom);
        }
        return this._strategy.release();
    },

    /**
    * @name dxScrollView.toggleLoading
    * @publicName toggleLoading(showOrHide)
    * @param1 showOrHide:boolean
    * @hidden
    */
    toggleLoading: function(showOrHide) {
        this._reachBottomEnable(showOrHide);
    },

    /**
    * @name dxScrollView.isFull
    * @publicName isFull()
    * @return boolean
    * @hidden
    */
    isFull: function() {
        return $(this.content()).height() > this._$container.height();
    },
});

registerComponent('dxScrollView', ScrollView);

export default ScrollView;
