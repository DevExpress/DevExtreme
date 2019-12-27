const $ = require('../core/renderer');
const noop = require('../core/utils/common').noop;
const messageLocalization = require('../localization/message');
const registerComponent = require('../core/component_registrator');
const extend = require('../core/utils/extend').extend;
const LoadIndicator = require('./load_indicator');
const Overlay = require('./overlay');
const Deferred = require('../core/utils/deferred').Deferred;
const themes = require('./themes');

const LOADPANEL_CLASS = 'dx-loadpanel';
const LOADPANEL_WRAPPER_CLASS = 'dx-loadpanel-wrapper';
const LOADPANEL_INDICATOR_CLASS = 'dx-loadpanel-indicator';
const LOADPANEL_MESSAGE_CLASS = 'dx-loadpanel-message';
const LOADPANEL_CONTENT_CLASS = 'dx-loadpanel-content';
const LOADPANEL_CONTENT_WRAPPER_CLASS = 'dx-loadpanel-content-wrapper';
const LOADPANEL_PANE_HIDDEN_CLASS = 'dx-loadpanel-pane-hidden';

/**
* @name dxLoadPanel
* @inherits dxOverlay
* @module ui/load_panel
* @export default
*/
const LoadPanel = Overlay.inherit({

    _supportedKeys: function() {
        return extend(this.callBase(), {
            escape: noop
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxLoadPanelOptions.message
            * @type string
            * @default "Loading ..."
            */
            message: messageLocalization.format('Loading'),

            /**
            * @name dxLoadPanelOptions.width
            * @default 222
            */
            width: 222,

            /**
            * @name dxLoadPanelOptions.height
            * @default 90
            */
            height: 90,

            /**
            * @name dxLoadPanelOptions.position
            * @type Enums.PositionAlignment|positionConfig|function
            */

            /**
            * @name dxLoadPanelOptions.container
            * @type string|Node|jQuery
            * @default undefined
            */

            /**
            * @name dxLoadPanelOptions.animation
            * @type object
            * @default null
            */
            /**
            * @name dxLoadPanelOptions.animation.show
            * @type animationConfig
            * @default null
            */
            /**
            * @name dxLoadPanelOptions.animation.hide
            * @type animationConfig
            * @default null
            */
            animation: null,

            /**
            * @name dxLoadPanelOptions.disabled
            * @hidden
            */

            /**
            * @name dxLoadPanelOptions.showIndicator
            * @type boolean
            * @default true
            */
            showIndicator: true,

            /**
            * @name dxLoadPanelOptions.indicatorSrc
            * @type string
            * @default ""
            */
            indicatorSrc: '',

            /**
            * @name dxLoadPanelOptions.showPane
            * @type boolean
            * @default true
            */
            showPane: true,

            /**
            * @name dxLoadPanelOptions.delay
            * @type Number
            * @default 0
            */
            delay: 0,

            closeOnBackButton: false,

            /**
            * @name dxLoadPanelOptions.resizeEnabled
            * @hidden
            */
            resizeEnabled: false,

            /**
            * @name dxLoadPanelOptions.focusStateEnabled
            * @type boolean
            * @default false
            */
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
                /**
                * @name dxLoadPanelOptions.shadingColor
                * @default 'transparent'
                * @default '' @for Android|iOS
                */
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
                    /**
                    * @name dxLoadPanelOptions.message
                    * @default "" @for Material
                    */
                    message: '',

                    /**
                    * @name dxLoadPanelOptions.width
                    * @default 60 @for Material
                    */
                    width: 60,

                    /**
                    * @name dxLoadPanelOptions.height
                    * @default 60 @for Material
                    */
                    height: 60,

                    /**
                    * @name dxLoadPanelOptions.maxHeight
                    * @default 60 @for Material
                    */
                    maxHeight: 60,

                    /**
                    * @name dxLoadPanelOptions.maxWidth
                    * @default 60 @for Material
                    */
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
