import $ from '../core/renderer';
import { getNavigator } from '../core/utils/window';
const navigator = getNavigator();
import { animation } from '../core/utils/support';
import { current, isMaterial, isGeneric } from './themes';
import { extend } from '../core/utils/extend';
import devices from '../core/devices';
import registerComponent from '../core/component_registrator';
import Widget from './widget/ui.widget';

// STYLE loadIndicator

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
        const themeName = current();

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
                    return isMaterial(themeName);
                },
                options: {
                    _animatingSegmentCount: 2,
                    _animatingSegmentInner: true
                }
            },
            {
                device: function() {
                    return isGeneric(themeName);
                },
                options: {
                    _animatingSegmentCount: 7
                }
            }
        ]);
    },

    _useTemplates: function() {
        return false;
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
        if(animation() && !this.option('viaImage') && !this.option('indicatorSrc')) { // B236922
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
    * @name dxLoadIndicator.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxLoadIndicator.focus
    * @publicName focus()
    * @hidden
    */
});

registerComponent('dxLoadIndicator', LoadIndicator);

export default LoadIndicator;
