const $ = require('../core/renderer');
const windowUtils = require('../core/utils/window');
const navigator = windowUtils.getNavigator();
const support = require('../core/utils/support');
const themes = require('./themes');
const extend = require('../core/utils/extend').extend;
const devices = require('../core/devices');
const registerComponent = require('../core/component_registrator');
const Widget = require('./widget/ui.widget');

const LOADINDICATOR_CLASS = 'dx-loadindicator';
const LOADINDICATOR_WRAPPER_CLASS = 'dx-loadindicator-wrapper';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
const LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';
const LOADINDICATOR_IMAGE_CLASS = 'dx-loadindicator-image';

const LoadIndicator = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            indicatorSrc: '',

            /**
            * @name dxLoadIndicatorOptions.disabled
            * @hidden
            */

            /**
            * @name dxLoadIndicatorOptions.activeStateEnabled
            * @hidden
            */
            activeStateEnabled: false,

            /**
             * @name dxLoadIndicatorOptions.hoverStateEnabled
             * @default false
             * @hidden
            */
            hoverStateEnabled: false,

            /**
            * @name dxLoadIndicatorOptions.focusStateEnabled
            * @hidden
            */

            /**
            * @name dxLoadIndicatorOptions.accessKey
            * @hidden
            */

            /**
            * @name dxLoadIndicatorOptions.tabIndex
            * @hidden
            */

            _animatingSegmentCount: 1,
            _animatingSegmentInner: false

        });
    },

    _defaultOptionsRules: function() {
        const themeName = themes.current();

        return this.callBase().concat([
            {
                device: function() {
                    const realDevice = devices.real();
                    const obsoleteAndroid = realDevice.platform === 'android' && !(/chrome/i.test(navigator.userAgent));
                    return obsoleteAndroid;
                },
                options: {
                    viaImage: true
                }
            },
            {
                device: function() {
                    return themes.isIos7(themeName);
                },
                options: {
                    _animatingSegmentCount: 11
                }
            },
            {
                device: function() {
                    return themes.isMaterial(themeName);
                },
                options: {
                    _animatingSegmentCount: 2,
                    _animatingSegmentInner: true
                }
            },
            {
                device: function() {
                    return themes.isGeneric(themeName);
                },
                options: {
                    _animatingSegmentCount: 7
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();

        this.$element().addClass(LOADINDICATOR_CLASS);
    },

    _initMarkup: function() {
        this.callBase();
        this._renderWrapper();
        this._renderIndicatorContent();
        this._renderMarkup();
    },

    _renderWrapper: function() {
        this._$wrapper = $('<div>').addClass(LOADINDICATOR_WRAPPER_CLASS);
        this.$element().append(this._$wrapper);
    },

    _renderIndicatorContent: function() {
        this._$content = $('<div>').addClass(LOADINDICATOR_CONTENT_CLASS);
        this._$wrapper.append(this._$content);
    },

    _renderMarkup: function() {
        if(support.animation() && !this.option('viaImage') && !this.option('indicatorSrc')) { // B236922
            this._renderMarkupForAnimation();
        } else {
            this._renderMarkupForImage();
        }
    },

    _renderMarkupForAnimation: function() {
        const animatingSegmentInner = this.option('_animatingSegmentInner');

        this._$indicator = $('<div>').addClass(LOADINDICATOR_ICON_CLASS);
        this._$content.append(this._$indicator);

        // Indicator markup
        for(let i = this.option('_animatingSegmentCount'); i >= 0; --i) {
            const $segment = $('<div>')
                .addClass(LOADINDICATOR_SEGMENT_CLASS)
                .addClass(LOADINDICATOR_SEGMENT_CLASS + i);

            if(animatingSegmentInner) {
                $segment.append($('<div>').addClass(LOADINDICATOR_SEGMENT_INNER_CLASS));
            }

            this._$indicator.append($segment);
        }
    },

    _renderMarkupForImage: function() {
        const indicatorSrc = this.option('indicatorSrc');

        this._$wrapper.addClass(LOADINDICATOR_IMAGE_CLASS);

        if(indicatorSrc) {
            this._$wrapper.css('backgroundImage', 'url(' + indicatorSrc + ')');
        }
    },

    _renderDimensions: function() {
        this.callBase();
        this._updateContentSizeForAnimation();
    },

    _updateContentSizeForAnimation: function() {
        if(!this._$indicator) {
            return;
        }

        let width = this.option('width');
        let height = this.option('height');

        if(width || height) {
            width = this.$element().width();
            height = this.$element().height();
            const minDimension = Math.min(height, width);

            this._$wrapper.css({
                height: minDimension,
                width: minDimension,
                fontSize: minDimension
            });
        }
    },

    _clean: function() {
        this.callBase();

        this._removeMarkupForAnimation();
        this._removeMarkupForImage();
    },

    _removeMarkupForAnimation: function() {
        if(!this._$indicator) {
            return;
        }

        this._$indicator.remove();
        delete this._$indicator;
    },

    _removeMarkupForImage: function() {
        this._$wrapper.css('backgroundImage', 'none');
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case '_animatingSegmentCount':
            case '_animatingSegmentInner':
            case 'indicatorSrc':
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    }

    /**
    * @name dxLoadIndicatorMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxLoadIndicatorMethods.focus
    * @publicName focus()
    * @hidden
    */
});

registerComponent('dxLoadIndicator', LoadIndicator);

module.exports = LoadIndicator;
