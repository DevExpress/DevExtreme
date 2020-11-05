import $ from '../core/renderer';
import { noop } from '../core/utils/common';
import messageLocalization from '../localization/message';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import LoadIndicator from './load_indicator';
import Overlay from './overlay';
import { Deferred } from '../core/utils/deferred';
import { isMaterial } from './themes';

// STYLE loadPanel

const LOADPANEL_CLASS = 'dx-loadpanel';
const LOADPANEL_WRAPPER_CLASS = 'dx-loadpanel-wrapper';
const LOADPANEL_INDICATOR_CLASS = 'dx-loadpanel-indicator';
const LOADPANEL_MESSAGE_CLASS = 'dx-loadpanel-message';
const LOADPANEL_CONTENT_CLASS = 'dx-loadpanel-content';
const LOADPANEL_CONTENT_WRAPPER_CLASS = 'dx-loadpanel-content-wrapper';
const LOADPANEL_PANE_HIDDEN_CLASS = 'dx-loadpanel-pane-hidden';

const LoadPanel = Overlay.inherit({

    _supportedKeys: function() {
        return extend(this.callBase(), {
            escape: noop
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            message: messageLocalization.format('Loading'),

            width: 222,

            height: 90,


            animation: null,

            /**
            * @name dxLoadPanelOptions.disabled
            * @hidden
            */

            showIndicator: true,

            indicatorSrc: '',

            showPane: true,

            delay: 0,

            templatesRenderAsynchronously: false,

            hideTopOverlayHandler: null,

            /**
            * @name dxLoadPanelOptions.resizeEnabled
            * @hidden
            */
            resizeEnabled: false,

            focusStateEnabled: false

            /**
            * @name dxLoadPanelOptions.dragEnabled
            * @hidden
            */
            /**
            * @name dxLoadPanelOptions.contentTemplate
            * @hidden
            */

            /**
            * @name dxLoadPanelOptions.accessKey
            * @hidden
            */

            /**
            * @name dxLoadPanelOptions.tabIndex
            * @hidden
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: { platform: 'generic' },
                options: {
                    shadingColor: 'transparent'
                }
            },
            {
                device: function() {
                    return isMaterial();
                },
                options: {
                    message: '',

                    width: 60,

                    height: 60,

                    maxHeight: 60,

                    maxWidth: 60
                }
            }
        ]);
    },

    _init: function() {
        this.callBase.apply(this, arguments);
    },

    _render: function() {
        this.callBase();

        this.$element().addClass(LOADPANEL_CLASS);
        this._wrapper().addClass(LOADPANEL_WRAPPER_CLASS);
    },

    _renderContentImpl: function() {
        this.callBase();

        this.$content().addClass(LOADPANEL_CONTENT_CLASS);

        this._$contentWrapper = $('<div>').addClass(LOADPANEL_CONTENT_WRAPPER_CLASS);
        this._$contentWrapper.appendTo(this._$content);

        this._togglePaneVisible();

        this._cleanPreviousContent();
        this._renderLoadIndicator();
        this._renderMessage();
    },

    _show: function() {
        const delay = this.option('delay');

        if(!delay) {
            return this.callBase();
        }

        const deferred = new Deferred();
        const callBase = this.callBase.bind(this);

        this._clearShowTimeout();
        this._showTimeout = setTimeout(function() {
            callBase().done(function() {
                deferred.resolve();
            });
        }, delay);

        return deferred.promise();
    },

    _hide: function() {
        this._clearShowTimeout();
        return this.callBase();
    },

    _clearShowTimeout: function() {
        clearTimeout(this._showTimeout);
    },

    _renderMessage: function() {
        if(!this._$contentWrapper) {
            return;
        }

        const message = this.option('message');

        if(!message) return;

        const $message = $('<div>').addClass(LOADPANEL_MESSAGE_CLASS)
            .text(message);

        this._$contentWrapper.append($message);
    },

    _renderLoadIndicator: function() {
        if(!this._$contentWrapper || !this.option('showIndicator')) {
            return;
        }

        if(!this._$indicator) {
            this._$indicator = $('<div>')
                .addClass(LOADPANEL_INDICATOR_CLASS)
                .appendTo(this._$contentWrapper);
        }

        this._createComponent(this._$indicator, LoadIndicator, {
            indicatorSrc: this.option('indicatorSrc')
        });
    },

    _cleanPreviousContent: function() {
        this.$content().find('.' + LOADPANEL_MESSAGE_CLASS).remove();
        this.$content().find('.' + LOADPANEL_INDICATOR_CLASS).remove();
        delete this._$indicator;
    },

    _togglePaneVisible: function() {
        this.$content().toggleClass(LOADPANEL_PANE_HIDDEN_CLASS, !this.option('showPane'));
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'delay':
                break;
            case 'message':
            case 'showIndicator':
                this._cleanPreviousContent();
                this._renderLoadIndicator();
                this._renderMessage();
                break;
            case 'showPane':
                this._togglePaneVisible();
                break;
            case 'indicatorSrc':
                this._renderLoadIndicator();
                break;
            default:
                this.callBase(args);
        }
    },

    _dispose: function() {
        this._clearShowTimeout();
        this.callBase();
    }

    /**
    * @name dxLoadPanelMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxLoadPanelMethods.focus
    * @publicName focus()
    * @hidden
    */
});

registerComponent('dxLoadPanel', LoadPanel);

export default LoadPanel;
