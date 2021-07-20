import $ from '../../core/renderer';
import devices from '../../core/devices';
import { hasWindow } from '../../core/utils/window';
import messageLocalization from '../../localization/message';
import registerComponent from '../../core/component_registrator';
import { getPublicElement } from '../../core/element';
import { extend } from '../../core/utils/extend';
import { noop } from '../../core/utils/common';
import PullDownStrategy from './ui.scroll_view.native.pull_down';
import SwipeDownStrategy from './ui.scroll_view.native.swipe_down';
import SimulatedStrategy from './ui.scroll_view.simulated';
import Scrollable from './ui.scrollable';
import LoadIndicator from '../load_indicator';
import { isMaterial } from './../themes';
import LoadPanel from '../load_panel';

// STYLE scrollView

const SCROLLVIEW_CLASS = 'dx-scrollview';
const SCROLLVIEW_CONTENT_CLASS = SCROLLVIEW_CLASS + '-content';
const SCROLLVIEW_TOP_POCKET_CLASS = SCROLLVIEW_CLASS + '-top-pocket';
const SCROLLVIEW_BOTTOM_POCKET_CLASS = SCROLLVIEW_CLASS + '-bottom-pocket';
const SCROLLVIEW_PULLDOWN_CLASS = SCROLLVIEW_CLASS + '-pull-down';

const SCROLLVIEW_REACHBOTTOM_CLASS = SCROLLVIEW_CLASS + '-scrollbottom';
const SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS = SCROLLVIEW_REACHBOTTOM_CLASS + '-indicator';
const SCROLLVIEW_REACHBOTTOM_TEXT_CLASS = SCROLLVIEW_REACHBOTTOM_CLASS + '-text';

const SCROLLVIEW_LOADPANEL = SCROLLVIEW_CLASS + '-loadpanel';

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

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            pullingDownText: messageLocalization.format('dxScrollView-pullingDownText'),

            pulledDownText: messageLocalization.format('dxScrollView-pulledDownText'),

            refreshingText: messageLocalization.format('dxScrollView-refreshingText'),

            reachBottomText: messageLocalization.format('dxScrollView-reachBottomText'),

            onPullDown: null,

            onReachBottom: null,

            refreshStrategy: 'pullDown'
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    const realDevice = devices.real();
                    return realDevice.platform === 'android';
                },
                options: {
                    refreshStrategy: 'swipeDown'
                }
            },
            {
                device: function() {
                    return isMaterial();
                },
                options: {
                    pullingDownText: '',

                    pulledDownText: '',

                    refreshingText: '',

                    reachBottomText: ''
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();
        this._loadingIndicatorEnabled = true;
    },

    _initScrollableMarkup: function() {
        this.callBase();
        this.$element().addClass(SCROLLVIEW_CLASS);

        this._initContent();
        this._initTopPocket();
        this._initBottomPocket();
        this._initLoadPanel();
    },

    _initContent: function() {
        const $content = $('<div>').addClass(SCROLLVIEW_CONTENT_CLASS);
        this._$content.wrapInner($content);
    },

    _initTopPocket: function() {
        const $topPocket = this._$topPocket = $('<div>').addClass(SCROLLVIEW_TOP_POCKET_CLASS);
        const $pullDown = this._$pullDown = $('<div>').addClass(SCROLLVIEW_PULLDOWN_CLASS);
        $topPocket.append($pullDown);
        this._$content.prepend($topPocket);
    },

    _initBottomPocket: function() {
        const $bottomPocket = this._$bottomPocket = $('<div>').addClass(SCROLLVIEW_BOTTOM_POCKET_CLASS);
        const $reachBottom = this._$reachBottom = $('<div>').addClass(SCROLLVIEW_REACHBOTTOM_CLASS);
        const $loadContainer = $('<div>').addClass(SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS);
        const $loadIndicator = new LoadIndicator($('<div>')).$element();
        const $text = this._$reachBottomText = $('<div>').addClass(SCROLLVIEW_REACHBOTTOM_TEXT_CLASS);

        this._updateReachBottomText();

        $reachBottom
            .append($loadContainer.append($loadIndicator))
            .append($text);

        $bottomPocket.append($reachBottom);

        this._$content.append($bottomPocket);
    },

    _initLoadPanel: function() {
        const $loadPanelElement = $('<div>')
            .addClass(SCROLLVIEW_LOADPANEL)
            .appendTo(this.$element());

        const loadPanelOptions = {
            shading: false,
            delay: 400,
            message: this.option('refreshingText'),
            position: {
                of: this.$element()
            }
        };

        this._loadPanel = this._createComponent($loadPanelElement, LoadPanel, loadPanelOptions);
    },

    _updateReachBottomText: function() {
        this._$reachBottomText.text(this.option('reachBottomText'));
    },

    _createStrategy: function() {
        const strategyName = this.option('useNative') ? this.option('refreshStrategy') : 'simulated';
        const strategyClass = refreshStrategies[strategyName];

        this._strategy = new strategyClass(this);
        this._strategy.pullDownCallbacks.add(this._pullDownHandler.bind(this));
        this._strategy.releaseCallbacks.add(this._releaseHandler.bind(this));
        this._strategy.reachBottomCallbacks.add(this._reachBottomHandler.bind(this));
    },

    _createActions: function() {
        this.callBase();
        this._pullDownAction = this._createActionByOption('onPullDown');
        this._reachBottomAction = this._createActionByOption('onReachBottom');
        this._tryRefreshPocketState();
    },

    _tryRefreshPocketState: function() {
        this._pullDownEnable(this.hasActionSubscription('onPullDown'));
        this._reachBottomEnable(this.hasActionSubscription('onReachBottom'));

    },

    on: function(eventName) {
        const result = this.callBase.apply(this, arguments);

        if(eventName === 'pullDown' || eventName === 'reachBottom') {
            this._tryRefreshPocketState();
        }

        return result;
    },

    _pullDownEnable: function(enabled) {
        if(arguments.length === 0) {
            return this._pullDownEnabled;
        }

        if(this._$pullDown && this._strategy) {
            this._$pullDown.toggle(enabled);
            this._strategy.pullDownEnable(enabled);
            this._pullDownEnabled = enabled;
        }
    },

    _reachBottomEnable: function(enabled) {
        if(arguments.length === 0) {
            return this._reachBottomEnabled;
        }

        if(this._$reachBottom && this._strategy) {
            this._$reachBottom.toggle(enabled);
            this._strategy.reachBottomEnable(enabled);
            this._reachBottomEnabled = enabled;
        }
    },

    _pullDownHandler: function() {
        this._loadingIndicator(false);
        this._pullDownLoading();
    },

    _loadingIndicator: function(value) {
        if(arguments.length < 1) {
            return this._loadingIndicatorEnabled;
        }
        this._loadingIndicatorEnabled = value;
    },

    _pullDownLoading: function() {
        this.startLoading();
        this._pullDownAction();
    },

    _reachBottomHandler: function() {
        this._loadingIndicator(false);
        this._reachBottomLoading();
    },

    _reachBottomLoading: function() {
        this.startLoading();
        this._reachBottomAction();
    },

    _releaseHandler: function() {
        this.finishLoading();
        this._loadingIndicator(true);
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

    content: function() {
        return getPublicElement(this._$content.children().eq(1));
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

    refresh: function() {
        if(!this.hasActionSubscription('onPullDown')) {
            return;
        }

        this._strategy.pendingRelease();
        this._pullDownLoading();
    },

    startLoading: function() {
        if(this._loadingIndicator() && this.$element().is(':visible')) {
            this._loadPanel.show();
        }
        this._lock();
    },

    finishLoading: function() {
        this._loadPanel.hide();
        this._unlock();
    },

    _dispose: function() {
        this._strategy.dispose();
        this.callBase();

        if(this._loadPanel) {
            this._loadPanel.$element().remove();
        }
    }
});

registerComponent('dxScrollView', ScrollView);

export default ScrollView;
