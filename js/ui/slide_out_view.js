const $ = require('../core/renderer');
const eventsEngine = require('../events/core/events_engine');
const noop = require('../core/utils/common').noop;
const fx = require('../animation/fx');
const clickEvent = require('../events/click');
const translator = require('../animation/translator');
const getPublicElement = require('../core/utils/dom').getPublicElement;
const hideTopOverlayCallback = require('../mobile/hide_top_overlay').hideCallback;
const registerComponent = require('../core/component_registrator');
const extend = require('../core/utils/extend').extend;
const AsyncTemplateMixin = require('./shared/async_template_mixin');
const Widget = require('./widget/ui.widget');
const Swipeable = require('../events/gesture/swipeable');
const EmptyTemplate = require('../core/templates/empty_template').EmptyTemplate;
const Deferred = require('../core/utils/deferred').Deferred;
const windowUtils = require('../core/utils/window');

const SLIDEOUTVIEW_CLASS = 'dx-slideoutview';
const SLIDEOUTVIEW_WRAPPER_CLASS = 'dx-slideoutview-wrapper';
const SLIDEOUTVIEW_MENU_CONTENT_CLASS = 'dx-slideoutview-menu-content';
const SLIDEOUTVIEW_CONTENT_CLASS = 'dx-slideoutview-content';
const SLIDEOUTVIEW_SHIELD_CLASS = 'dx-slideoutview-shield';

const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

const ANONYMOUS_TEMPLATE_NAME = 'content';

const ANIMATION_DURATION = 400;


const animation = {
    moveTo: function($element, position, completeAction) {
        fx.animate($element, {
            type: 'slide',
            to: { left: position },
            duration: ANIMATION_DURATION,
            complete: completeAction
        });
    },
    complete: function($element) {
        fx.stop($element, true);
    }
};

const SlideOutView = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            menuPosition: 'normal',

            menuVisible: false,

            swipeEnabled: true,

            menuTemplate: 'menu',

            contentTemplate: 'content',

            /**
            * @name dxSlideOutViewOptions.contentOffset
            * @hidden
            */
            contentOffset: 45

            /**
            * @name dxSlideOutViewOptions.onContentReady
            * @hidden true
            * @action
            */

            /**
            * @name dxSlideOutViewOptions.focusStateEnabled
            * @hidden
            */

            /**
            * @name dxSlideOutViewOptions.accessKey
            * @hidden
            */

            /**
            * @name dxSlideOutViewOptions.tabIndex
            * @hidden
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: {
                    android: true
                },
                options: {
                    contentOffset: 54
                }
            },
            {
                device: function(device) {
                    return device.platform === 'generic' && device.deviceType !== 'desktop';
                },
                options: {
                    contentOffset: 56
                }
            },
            {
                device: {
                    win: true,
                    phone: false
                },
                options: {
                    contentOffset: 76
                }
            }
        ]);
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _init: function() {
        this.callBase();
        this.$element().addClass(SLIDEOUTVIEW_CLASS);

        this._whenAnimationComplete = undefined;
        this._whenMenuRendered = undefined;
        this._initHideTopOverlayHandler();
    },

    _initHideTopOverlayHandler: function() {
        this._hideMenuHandler = this.hideMenu.bind(this);
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates['menu'] = new EmptyTemplate();
        this._defaultTemplates['content'] = new EmptyTemplate();
    },

    _initMarkup: function() {
        this.callBase();

        this._renderMarkup();
        this._whenMenuRendered = new Deferred();

        const menuTemplate = this._getTemplate(this.option('menuTemplate'));
        menuTemplate && menuTemplate.render({
            container: this.menuContent(),
            onRendered: () => {
                this._whenMenuRendered.resolve();
            }
        });

        const contentTemplateOption = this.option('contentTemplate');
        const contentTemplate = this._getTemplate(contentTemplateOption);
        const transclude = this._getAnonymousTemplateName() === contentTemplateOption;

        contentTemplate && contentTemplate.render({
            container: this.content(),
            noModel: true,
            transclude
        });

        this._renderShield();
        this._toggleMenuPositionClass();
    },

    _render: function() {
        this.callBase();
        this._whenMenuRendered.always(() => {
            this._initSwipeHandlers();
            this._dimensionChanged();
        });
    },

    _renderMarkup: function() {
        const $wrapper = $('<div>').addClass(SLIDEOUTVIEW_WRAPPER_CLASS);
        this._$menu = $('<div>').addClass(SLIDEOUTVIEW_MENU_CONTENT_CLASS);
        this._$container = $('<div>').addClass(SLIDEOUTVIEW_CONTENT_CLASS);

        $wrapper.append(this._$menu);
        $wrapper.append(this._$container);
        this.$element().append($wrapper);

        // NOTE: B251455
        eventsEngine.on(this._$container, 'MSPointerDown', noop);
    },

    _renderShield: function() {
        this._$shield = this._$shield || $('<div>').addClass(SLIDEOUTVIEW_SHIELD_CLASS);
        this._$shield.appendTo(this.content());
        eventsEngine.off(this._$shield, clickEvent.name);
        eventsEngine.on(this._$shield, clickEvent.name, this.hideMenu.bind(this));
        this._toggleShieldVisibility(this.option('menuVisible'));
    },

    _initSwipeHandlers: function() {
        this._createComponent($(this.content()), Swipeable, {
            disabled: !this.option('swipeEnabled'),
            elastic: false,
            itemSizeFunc: this._getMenuWidth.bind(this),
            onStart: this._swipeStartHandler.bind(this),
            onUpdated: this._swipeUpdateHandler.bind(this),
            onEnd: this._swipeEndHandler.bind(this)
        });
    },

    _isRightMenuPosition: function() {
        const invertedPosition = this.option('menuPosition') === 'inverted';
        const rtl = this.option('rtlEnabled');

        return (rtl && !invertedPosition) || (!rtl && invertedPosition);
    },

    _swipeStartHandler: function(e) {
        animation.complete($(this.content()));
        const event = e.event;
        const menuVisible = this.option('menuVisible');
        const rtl = this._isRightMenuPosition();

        event.maxLeftOffset = +(rtl ? !menuVisible : menuVisible);
        event.maxRightOffset = +(rtl ? menuVisible : !menuVisible);

        this._toggleShieldVisibility(true);
    },

    _swipeUpdateHandler: function(e) {
        const event = e.event;
        let offset = this.option('menuVisible') ? event.offset + 1 * this._getRTLSignCorrection() : event.offset;

        offset *= this._getRTLSignCorrection();
        this._renderPosition(offset, false);
    },

    _swipeEndHandler: function(e) {
        const targetOffset = e.event.targetOffset * this._getRTLSignCorrection() + this.option('menuVisible');
        const menuVisible = targetOffset !== 0;

        if(this.option('menuVisible') === menuVisible) {
            this._renderPosition(this.option('menuVisible'), true);
        } else {
            this.option('menuVisible', menuVisible);
        }
    },

    _toggleMenuPositionClass: function() {
        const left = SLIDEOUTVIEW_CLASS + '-left';
        const right = SLIDEOUTVIEW_CLASS + '-right';
        const menuPosition = this._isRightMenuPosition() ? 'right' : 'left';

        this._$menu.removeClass(left + ' ' + right);
        this._$menu.addClass(SLIDEOUTVIEW_CLASS + '-' + menuPosition);
    },

    _renderPosition: function(offset, animate) {
        if(!windowUtils.hasWindow()) return;

        const pos = this._calculatePixelOffset(offset) * this._getRTLSignCorrection();

        this._toggleHideMenuCallback(offset);

        if(animate) {
            this._toggleShieldVisibility(true);
            animation.moveTo($(this.content()), pos, this._animationCompleteHandler.bind(this));
        } else {
            translator.move($(this.content()), { left: pos });
        }
    },

    _calculatePixelOffset: function(offset) {
        offset = offset || 0;
        return offset * this._getMenuWidth();
    },

    _getMenuWidth: function() {
        if(!this._menuWidth) {
            const maxMenuWidth = this.$element().width() - this.option('contentOffset');
            const menuContent = $(this.menuContent());
            menuContent.css('maxWidth', maxMenuWidth < 0 ? 0 : maxMenuWidth);
            const currentMenuWidth = menuContent.width();

            this._menuWidth = Math.min(currentMenuWidth, maxMenuWidth);
        }

        return this._menuWidth;
    },

    _animationCompleteHandler: function() {
        this._toggleShieldVisibility(this.option('menuVisible'));

        if(this._whenAnimationComplete) {
            this._whenAnimationComplete.resolveWith(this);
        }
    },

    _toggleHideMenuCallback: function(subscribe) {
        if(subscribe) {
            hideTopOverlayCallback.add(this._hideMenuHandler);
        } else {
            hideTopOverlayCallback.remove(this._hideMenuHandler);
        }
    },

    _getRTLSignCorrection: function() {
        return this._isRightMenuPosition() ? -1 : 1;
    },

    _dispose: function() {
        animation.complete($(this.content()));
        this._toggleHideMenuCallback(false);
        this.callBase();
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _dimensionChanged: function() {
        delete this._menuWidth;
        this._renderPosition(this.option('menuVisible'), false);
    },

    _toggleShieldVisibility: function(visible) {
        this._$shield.toggleClass(INVISIBLE_STATE_CLASS, !visible);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'width':
                this.callBase(args);
                this._dimensionChanged();
                break;
            case 'contentOffset':
                this._dimensionChanged();
                break;
            case 'menuVisible':
                this._renderPosition(args.value, true);
                break;
            case 'menuPosition':
                this._renderPosition(this.option('menuVisible'), true);
                this._toggleMenuPositionClass();
                break;
            case 'swipeEnabled':
                this._initSwipeHandlers();
                break;
            case 'contentTemplate':
            case 'menuTemplate':
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    menuContent: function() {
        return getPublicElement(this._$menu);
    },

    content: function() {
        return getPublicElement(this._$container);
    },

    showMenu: function() {
        return this.toggleMenuVisibility(true);
    },

    hideMenu: function() {
        return this.toggleMenuVisibility(false);
    },

    toggleMenuVisibility: function(showing) {
        showing = showing === undefined ? !this.option('menuVisible') : showing;

        this._whenAnimationComplete = new Deferred();
        this.option('menuVisible', showing);

        return this._whenAnimationComplete.promise();
    }

    /**
    * @name dxSlideOutViewMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxSlideOutViewMethods.focus
    * @publicName focus()
    * @hidden
    */
}).include(AsyncTemplateMixin);

registerComponent('dxSlideOutView', SlideOutView);

module.exports = SlideOutView;

///#DEBUG
module.exports.animation = animation;
///#ENDDEBUG
