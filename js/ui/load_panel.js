var $ = require('../core/renderer'),
    noop = require('../core/utils/common').noop,
    messageLocalization = require('../localization/message'),
    registerComponent = require('../core/component_registrator'),
    extend = require('../core/utils/extend').extend,
    LoadIndicator = require('./load_indicator'),
    Overlay = require('./overlay'),
    Deferred = require('../core/utils/deferred').Deferred,
    themes = require('./themes');

var LOADPANEL_CLASS = 'dx-loadpanel',
    LOADPANEL_WRAPPER_CLASS = 'dx-loadpanel-wrapper',
    LOADPANEL_INDICATOR_CLASS = 'dx-loadpanel-indicator',
    LOADPANEL_MESSAGE_CLASS = 'dx-loadpanel-message',
    LOADPANEL_CONTENT_CLASS = 'dx-loadpanel-content',
    LOADPANEL_CONTENT_WRAPPER_CLASS = 'dx-loadpanel-content-wrapper',
    LOADPANEL_PANE_HIDDEN_CLASS = 'dx-loadpanel-pane-hidden';

var LoadPanel = Overlay.inherit({

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

            closeOnBackButton: false,

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
                    return themes.isMaterial();
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

    _initOptions: function() {
        this.callBase.apply(this, arguments);
        this.option('templatesRenderAsynchronously', false);
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
        var delay = this.option('delay');

        if(!delay) {
            return this.callBase();
        }

        var deferred = new Deferred();
        var callBase = this.callBase.bind(this);

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

        var message = this.option('message');

        if(!message) return;

        var $message = $('<div>').addClass(LOADPANEL_MESSAGE_CLASS)
            .text(message);

        this._$contentWrapper.append($message);
    },

    _renderLoadIndicator: function() {
        if(!this._$contentWrapper || !this.option('showIndicator')) {
            return;
        }

        this._$indicator = $('<div>').addClass(LOADPANEL_INDICATOR_CLASS)
            .appendTo(this._$contentWrapper);

        this._createComponent(this._$indicator, LoadIndicator, {
            indicatorSrc: this.option('indicatorSrc')
        });
    },

    _cleanPreviousContent: function() {
        this.$content().find('.' + LOADPANEL_MESSAGE_CLASS).remove();
        this.$content().find('.' + LOADPANEL_INDICATOR_CLASS).remove();
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
                if(this._$indicator) {
                    this._createComponent(this._$indicator, LoadIndicator, {
                        indicatorSrc: this.option('indicatorSrc')
                    });
                }
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

module.exports = LoadPanel;
