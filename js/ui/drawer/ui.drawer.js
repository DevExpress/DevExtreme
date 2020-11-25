import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { isFunction, isDefined } from '../../core/utils/type';
import { getPublicElement } from '../../core/element';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import { getBoundingRect } from '../../core/utils/position';
import Widget from '../widget/ui.widget';
import { EmptyTemplate } from '../../core/templates/empty_template';
import { hasWindow } from '../../core/utils/window';
import PushStrategy from './ui.drawer.rendering.strategy.push';
import ShrinkStrategy from './ui.drawer.rendering.strategy.shrink';
import OverlapStrategy from './ui.drawer.rendering.strategy.overlap';
import { animation } from './ui.drawer.animation';
import { name as CLICK_EVENT_NAME } from '../../events/click';
import fx from '../../animation/fx';
import { Deferred } from '../../core/utils/deferred';
import { triggerResizeEvent } from '../../events/visibility_change';

// STYLE drawer

const DRAWER_CLASS = 'dx-drawer';
const DRAWER_WRAPPER_CLASS = 'dx-drawer-wrapper';
const DRAWER_PANEL_CONTENT_CLASS = 'dx-drawer-panel-content';
const DRAWER_VIEW_CONTENT_CLASS = 'dx-drawer-content';
const DRAWER_SHADER_CLASS = 'dx-drawer-shader';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const OPENED_STATE_CLASS = 'dx-drawer-opened';
const ANONYMOUS_TEMPLATE_NAME = 'content';
const PANEL_TEMPLATE_NAME = 'panel';

const Drawer = Widget.inherit({

    _getDefaultOptions() {
        return extend(this.callBase(), {
            position: 'left',
            opened: false,
            minSize: null,
            maxSize: null,
            shading: false,
            template: PANEL_TEMPLATE_NAME,
            openedStateMode: 'shrink',
            revealMode: 'slide',
            animationEnabled: true,
            animationDuration: 400,
            closeOnOutsideClick: false,

            /**
            * @name dxDrawerOptions.contentTemplate
            * @type_function_param1 contentElement:dxElement
            * @type template|function
            * @hidden
            * @default "content"
            */
            contentTemplate: ANONYMOUS_TEMPLATE_NAME,

            target: undefined,

            /**
            * @name dxDrawerOptions.onContentReady
            * @hidden true
            * @action
            */

            /**
            * @name dxDrawerOptions.focusStateEnabled
            * @hidden
            */

            /**
            * @name dxDrawerOptions.accessKey
            * @hidden
            */

            /**
            * @name dxDrawerOptions.tabIndex
            * @hidden
            */
        });
    },

    _setDeprecatedOptions() {
        this.callBase();

        extend(this._deprecatedOptions, {
            'target': { since: '20.1', message: 'Functionality associated with this option is not intended for the Drawer widget.' }
        });
    },

    _init() {
        this.callBase();

        this._initStrategy();

        this.$element().addClass(DRAWER_CLASS);

        this._animations = [];
        this._whenAnimationCompleted = undefined;
        this._whenPanelContentRendered = undefined;
        this._whenPanelContentRefreshed = undefined;

        this._$wrapper = $('<div>').addClass(DRAWER_WRAPPER_CLASS);

        this._$viewContentWrapper = $('<div>').addClass(DRAWER_VIEW_CONTENT_CLASS);
        this._$wrapper.append(this._$viewContentWrapper);

        this.$element().append(this._$wrapper);
    },

    _initStrategy() {
        switch(this.option('openedStateMode')) {
            case 'push':
                this._strategy = new PushStrategy(this);
                break;
            case 'shrink':
                this._strategy = new ShrinkStrategy(this);
                break;
            case 'overlap':
                this._strategy = new OverlapStrategy(this);
                break;
            default:
                this._strategy = new PushStrategy(this);
        }
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _initTemplates() {
        const defaultTemplates = {};
        defaultTemplates[PANEL_TEMPLATE_NAME] = new EmptyTemplate();
        defaultTemplates[ANONYMOUS_TEMPLATE_NAME] = new EmptyTemplate();
        this._templateManager.addDefaultTemplates(defaultTemplates);

        this.callBase();
    },

    _viewContentWrapperClickHandler(e) {
        let closeOnOutsideClick = this.option('closeOnOutsideClick');

        if(isFunction(closeOnOutsideClick)) {
            closeOnOutsideClick = closeOnOutsideClick(e);
        }

        if(closeOnOutsideClick && this.option('opened')) {
            this.stopAnimations();

            if(this.option('shading')) {
                e.preventDefault();
            }

            this.hide();
        }
    },

    _initMarkup() {
        this.callBase();

        this._toggleOpenedStateClass(this.option('opened'));
        this._renderPanelContentWrapper();

        this._refreshOpenedStateModeClass();
        this._refreshRevealModeClass();
        this._renderShader();

        this._whenPanelContentRendered = new Deferred();
        this._strategy.renderPanelContent(this._whenPanelContentRendered);
        this._strategy.onPanelContentRendered();

        this._renderViewContent();

        eventsEngine.off(this._$viewContentWrapper, CLICK_EVENT_NAME);
        eventsEngine.on(this._$viewContentWrapper, CLICK_EVENT_NAME, this._viewContentWrapperClickHandler.bind(this));

        this._refreshPositionClass();
        this._refreshWrapperChildrenOrder();
    },

    _render() {
        this._initMinMaxSize();

        this.callBase();

        this._whenPanelContentRendered.always(() => {
            ///#DEBUG
            if(this.option('__debugWhenPanelContentRendered')) {
                this.option('__debugWhenPanelContentRendered')({ drawer: this });
            }
            ///#ENDDEBUG

            this._initMinMaxSize();
            this._strategy.refreshPanelElementSize(this.option('revealMode') === 'slide' || !this.isHorizontalDirection());

            this._renderPosition(this.option('opened'), false);
            this._removePanelManualPosition();
        });
    },

    _removePanelManualPosition() {
        if(this._$panelContentWrapper.attr('manualposition')) {
            this._$panelContentWrapper.removeAttr('manualPosition');
            this._$panelContentWrapper.css({ position: '', top: '', left: '', right: '', bottom: '' });
        }
    },

    _renderPanelContentWrapper() {
        this._$panelContentWrapper = $('<div>').addClass(DRAWER_PANEL_CONTENT_CLASS);
        const position = this.calcTargetPosition();
        if(this.option('openedStateMode') === 'push' && ['top', 'bottom'].indexOf(position) > -1) {
            this._$panelContentWrapper.addClass(DRAWER_PANEL_CONTENT_CLASS + '-push-top-or-bottom');
        }
        if(this.option('openedStateMode') !== 'overlap' && !this.option('opened') && !this.option('minSize')) {
            this._$panelContentWrapper.attr('manualposition', true);
            this._$panelContentWrapper.css({ position: 'absolute', top: '-10000px', left: '-10000px', right: 'auto', bottom: 'auto' });
        }
        this._$wrapper.append(this._$panelContentWrapper);
    },

    _refreshOpenedStateModeClass(prevOpenedStateMode) {
        if(prevOpenedStateMode) {
            this.$element().removeClass(DRAWER_CLASS + '-' + prevOpenedStateMode);
        }

        this.$element().addClass(DRAWER_CLASS + '-' + this.option('openedStateMode'));
    },

    _refreshPositionClass(prevPosition) {
        if(prevPosition) {
            this.$element().removeClass(DRAWER_CLASS + '-' + prevPosition);
        }

        this.$element().addClass(DRAWER_CLASS + '-' + this.calcTargetPosition());
    },

    _refreshWrapperChildrenOrder() {
        const position = this.calcTargetPosition();
        if(this._strategy.isViewContentFirst(position, this.option('rtlEnabled'))) {
            this._$wrapper.prepend(this._$viewContentWrapper);
        } else {
            this._$wrapper.prepend(this._$panelContentWrapper);
        }
    },

    _refreshRevealModeClass(prevRevealMode) {
        if(prevRevealMode) {
            this.$element().removeClass(DRAWER_CLASS + '-' + prevRevealMode);
        }

        this.$element().addClass(DRAWER_CLASS + '-' + this.option('revealMode'));
    },

    _renderViewContent() {
        const contentTemplateOption = this.option('contentTemplate');
        const contentTemplate = this._getTemplate(contentTemplateOption);

        if(contentTemplate) {
            const $viewTemplate = contentTemplate.render({
                container: this.viewContent(),
                noModel: true,
                transclude: (this._templateManager.anonymousTemplateName === contentTemplateOption)
            });

            if($viewTemplate.hasClass('ng-scope')) { // T864419
                $(this._$viewContentWrapper)
                    .children()
                    .not(`.${DRAWER_SHADER_CLASS}`)
                    .replaceWith($viewTemplate);
            }
        }
    },

    _renderShader() {
        this._$shader = this._$shader || $('<div>').addClass(DRAWER_SHADER_CLASS);
        this._$shader.appendTo(this.viewContent());

        this._toggleShaderVisibility(this.option('opened'));
    },

    _initSize() { // TODO: keep for ui.file_manager.adaptivity.js
        this._initMinMaxSize();
    },

    _initMinMaxSize() {
        const realPanelSize = this.isHorizontalDirection() ? this.getRealPanelWidth() : this.getRealPanelHeight();

        this._maxSize = this.option('maxSize') || realPanelSize;
        this._minSize = this.option('minSize') || 0;
    },

    calcTargetPosition() {
        const position = this.option('position');
        const rtl = this.option('rtlEnabled');
        let result = position;

        if(position === 'before') {
            result = rtl ? 'right' : 'left';
        } else if(position === 'after') {
            result = rtl ? 'left' : 'right';
        }
        return result;
    },

    getOverlayTarget() {
        return this._options.silent('target') || this._$wrapper;
    },

    getOverlay() {
        return this._overlay;
    },

    getMaxSize() {
        return this._maxSize;
    },

    getMinSize() {
        return this._minSize;
    },

    getRealPanelWidth() {
        if(hasWindow()) {
            if(isDefined(this.option('templateSize'))) {
                return this.option('templateSize'); // number is expected
            } else {
                return getBoundingRect(this._getPanelTemplateElement()).width;
            }
        } else {
            return 0;
        }
    },

    getRealPanelHeight() {
        if(hasWindow()) {
            if(isDefined(this.option('templateSize'))) {
                return this.option('templateSize'); // number is expected
            } else {
                return getBoundingRect(this._getPanelTemplateElement()).height;
            }
        } else {
            return 0;
        }
    },

    _getPanelTemplateElement() {
        let $result = this._strategy.getPanelContent();

        if($result.children().length) {
            $result = $result.children().eq(0);
            if($result.hasClass('dx-template-wrapper') && $result.children().length) { // For Angular, T948509
                $result = $result.children().eq(0);
            }
        }

        return $result.get(0);
    },

    isHorizontalDirection() {
        const position = this.calcTargetPosition();

        return position === 'left' || position === 'right';
    },

    stopAnimations(jumpToEnd) {
        fx.stop(this._$shader, jumpToEnd);
        fx.stop($(this.content()), jumpToEnd);
        fx.stop($(this.viewContent()), jumpToEnd);

        const overlay = this.getOverlay();
        if(overlay) {
            fx.stop($(overlay.$content()), jumpToEnd);
        }
    },

    setZIndex(zIndex) {
        this._$shader.css('zIndex', zIndex - 1);
        this._$panelContentWrapper.css('zIndex', zIndex);
    },

    resizeContent() { // TODO: keep for ui.file_manager.adaptivity.js
        this.resizeViewContent;
    },

    resizeViewContent() {
        triggerResizeEvent(this.viewContent());
    },

    _isInvertedPosition() {
        const position = this.calcTargetPosition();

        return position === 'right' || position === 'bottom';
    },

    _renderPosition(isDrawerOpened, animate, jumpToEnd) {
        this.stopAnimations(jumpToEnd);

        this._animations = [];

        if(!hasWindow()) {
            return;
        }

        animate = isDefined(animate) ? animate && this.option('animationEnabled') : this.option('animationEnabled');

        if(isDrawerOpened) {
            this._toggleShaderVisibility(isDrawerOpened);
        }

        this._strategy.renderPosition(isDrawerOpened, animate);

        this._strategy.renderShaderVisibility(isDrawerOpened, animate, this.option('animationDuration'));
    },

    _animationCompleteHandler() {
        this.resizeViewContent();

        if(this._whenAnimationCompleted) {
            this._whenAnimationCompleted.resolve();
            this._animations = [];
        }
    },

    _getPositionCorrection() {
        return this._isInvertedPosition() ? -1 : 1;
    },

    _dispose() {
        animation.complete($(this.viewContent()));
        this.callBase();
    },

    _visibilityChanged(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _dimensionChanged() {
        this._initMinMaxSize();
        this._strategy.refreshPanelElementSize(this.option('revealMode') === 'slide');
        this._renderPosition(this.option('opened'), false);
    },

    _toggleShaderVisibility(visible) {
        if(this.option('shading')) {
            this._$shader.toggleClass(INVISIBLE_STATE_CLASS, !visible);
            this._$shader.css('visibility', visible ? 'visible' : 'hidden');
        } else {
            this._$shader.toggleClass(INVISIBLE_STATE_CLASS, true);
        }
    },

    _toggleOpenedStateClass(opened) {
        this.$element().toggleClass(OPENED_STATE_CLASS, opened);
    },

    _refreshPanel() {
        // TODO: removeAttr('style')?
        $(this.viewContent()).css('paddingLeft', 0);
        $(this.viewContent()).css('paddingRight', 0);
        $(this.viewContent()).css('paddingTop', 0);
        $(this.viewContent()).css('paddingBottom', 0);
        $(this.viewContent()).css('left', 0);
        $(this.viewContent()).css('transform', 'translate(0px, 0px)');
        $(this.viewContent()).removeClass('dx-theme-background-color');

        this._removePanelContentWrapper();
        this._removeOverlay();

        this._renderPanelContentWrapper();
        this._refreshWrapperChildrenOrder();

        this._whenPanelContentRefreshed = new Deferred();
        this._strategy.renderPanelContent(this._whenPanelContentRefreshed);
        this._strategy.onPanelContentRendered();

        if(hasWindow()) {
            this._whenPanelContentRefreshed.always(() => {
                this._strategy.refreshPanelElementSize(this.option('revealMode') === 'slide');
                this._renderPosition(this.option('opened'), false, true);
                this._removePanelManualPosition();
            });
        }
    },

    _clean() {
        this._cleanFocusState();

        this._removePanelContentWrapper();
        this._removeOverlay();
    },

    _removePanelContentWrapper() {
        if(this._$panelContentWrapper) {
            this._$panelContentWrapper.remove();
        }
    },

    _removeOverlay() {
        if(this._overlay) {
            this._overlay.dispose();
            delete this._overlay;
            delete this._$panelContentWrapper; // TODO: move to _removePanelContentWrapper?
        }
    },

    _optionChanged(args) {
        switch(args.name) {
            case 'width':
                this.callBase(args);
                this._dimensionChanged();
                break;
            case 'opened':
                this._renderPosition(args.value);
                this._toggleOpenedStateClass(args.value);
                break;
            case 'position':
                this._refreshPositionClass(args.previousValue);
                this._refreshWrapperChildrenOrder();
                this._invalidate();
                break;
            case 'contentTemplate':
            case 'template':
                this._invalidate();
                break;
            case 'openedStateMode':
            case 'target':
                this._initStrategy();
                this._refreshOpenedStateModeClass(args.previousValue);

                this._refreshPanel();
                break;
            case 'minSize':
            case 'maxSize':
                this._initMinMaxSize();
                this._renderPosition(this.option('opened'), false);
                break;
            case 'revealMode':
                this._refreshRevealModeClass(args.previousValue);

                this._refreshPanel();
                break;
            case 'shading':
                this._toggleShaderVisibility(this.option('opened'));
                break;
            case 'animationEnabled':
            case 'animationDuration':
            case 'closeOnOutsideClick':
                break;
            default:
                this.callBase(args);
        }
    },


    content() {
        return getPublicElement(this._$panelContentWrapper);
    },

    /**
    * @name dxDrawerMethods.viewContent
    * @publicName viewContent()
    * @return dxElement
    * @hidden
    */
    viewContent() {
        return getPublicElement(this._$viewContentWrapper);
    },

    show() {
        return this.toggle(true);
    },

    hide() {
        return this.toggle(false);
    },

    toggle(opened) {
        const targetOpened = opened === undefined ? !this.option('opened') : opened;

        this._whenAnimationCompleted = new Deferred();
        this.option('opened', targetOpened);

        return this._whenAnimationCompleted.promise();
    }

    /**
    * @name dxDrawerMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxDrawerMethods.focus
    * @publicName focus()
    * @hidden
    */
});

registerComponent('dxDrawer', Drawer);

export default Drawer;

