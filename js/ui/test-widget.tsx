import config from '../core/config';
import {
    Component,
    Effect,
    Event,
    InternalState,
    Prop,
    React,
    Ref,
    Slot
} from '../component_declaration/common';
import { active, dxClick, hover, keyboard, resize, visibility } from '../events/short';
import { each } from '../core/utils/iterator';
import { extend } from '../core/utils/extend';
import { isFakeClickEvent } from '../events/utils';
import { hasWindow } from '../core/utils/window';
import Action from '../core/action';

const getStyles = ({ width, height, ...other }) => {
    return {
        width: width === null ? '' : width,
        height: height === null ? '' : height,
        ...other
    };
};

const setAttribute = (name, value) => {
    const result = {};

    if (value) {
        const attrName = (name === 'role' || name === 'id') ? name : `aria-${name}`;

        result[attrName] = value.toString() || null;
    }

    return result;
};

const getAria = args => {
    let attrs = {};

    each(args, (name, value) => attrs = { ...attrs, ...setAttribute(name, value) });

    return attrs;
};

const getAttributes = ({ elementAttr, accessKey }) => {
    const attrs = extend({}, elementAttr, accessKey && { accessKey });

    delete attrs.class;

    return attrs;
};

const getCssClasses = (model: Partial<Widget>) => {
    const isFocusable = model.focusStateEnabled && !model.disabled;
    const isHoverable = model.hoverStateEnabled && !model.disabled;
    const className = ['dx-widget'];

    model.className && className.push(model.className);
    model.disabled && className.push('dx-state-disabled');
    !model.visible && className.push('dx-state-invisible');
    model._focused && isFocusable && className.push('dx-state-focused');
    model._active && className.push('dx-state-active');
    model._hovered && isHoverable && !model._active && className.push('dx-state-hover');
    model.rtlEnabled && className.push('dx-rtl');
    model.elementAttr.class && className.push(model.elementAttr.class);

    return className.join(' ');
};

export const viewModelFunction = ({
    _active,
    _focused,
    _hovered,

    accessKey,
    aria,
    children,
    className,
    disabled,
    elementAttr,
    focusStateEnabled,
    height,
    hint,
    hoverStateEnabled,
    rtlEnabled,
    tabIndex,
    visible,
    width,

    widgetRef,
}: Widget) => {
    accessKey = focusStateEnabled && !disabled && accessKey;
    tabIndex = focusStateEnabled && !disabled && tabIndex;

    const styles = getStyles({ width, height });
    const attrsWithoutClass = getAttributes({ elementAttr, accessKey });
    const arias = getAria({ ...aria, disabled, hidden: !visible });
    const cssClasses = getCssClasses({
        disabled, visible, _focused, _active, _hovered, rtlEnabled,
        elementAttr, hoverStateEnabled, focusStateEnabled, className
    });

    return {
        widgetRef,

        attributes: { ...attrsWithoutClass, ...arias },
        children,
        cssClasses,
        disabled,
        focusStateEnabled,
        hoverStateEnabled,
        styles,
        visible,
        tabIndex,
        title: hint,
    };
};

export const viewFunction = (viewModel: any) => {
    return (
        <div
            ref={viewModel.widgetRef}
            {...viewModel.attributes}
            tabIndex={viewModel.tabIndex}
            className={viewModel.cssClasses}
            title={viewModel.title}
            style={viewModel.styles}
            hidden={!viewModel.visible}
        >
            {viewModel.children}
        </div>
    );
};

@Component({
    name: 'Widget',
    components: [],
    viewModel: viewModelFunction,
    view: viewFunction,
})

export default class Widget {
    /** Private properties and callbacks */
    @Prop() name?: string | undefined = '';
    @Prop() className?: string | undefined = '';
    @Prop() clickArgs?: any = {};
    @Prop() aria?: any = {};
    @Prop() activeStateUnit?: string;
    @Prop() hoverStartHandler: (args: any) => any = (() => undefined);
    @Prop() hoverEndHandler: (args: any) => any = (() => undefined);
    @Prop() _dimensionChanged: () => any = (() => undefined);
    @Prop() _visibilityChanged?: (args: any) => undefined;
    @Prop() _feedbackHideTimeout: number = 400;
    @Prop() _feedbackShowTimeout: number = 30;
    @Prop() supportedKeys?: (args: any) => any;
    /** === */

    // == DOMComponent ==
    @Prop() width?: string | number | null = null;
    @Prop() height?: string | number | null = null;
    @Prop() rtlEnabled?: boolean = config().rtlEnabled;
    @Prop() elementAttr?: { [name: string]: any } = {};
    @Prop() disabled?: boolean = false;

    // == Widget ==
    @Prop() visible?: boolean = true;
    @Prop() hint?: string | undefined = undefined;
    @Prop() tabIndex?: number = 0;
    @Prop() accessKey?: string | null = null;
    @Prop() activeStateEnabled?: boolean = false;
    @Prop() activeStateUnit?: string | undefined = undefined;
    @Prop() aria?: any = {};
    @Prop() className?: string | undefined = '';
    @Prop() clickArgs?: any = {};
    @Prop() disabled?: boolean = false;
    @Prop() elementAttr?: { [name: string]: any } = {};
    @Prop() focusStateEnabled?: boolean = false;
    @Prop() height?: string | number | null = null;
    @Prop() hint?: string | undefined = undefined;
    @Prop() hoverStateEnabled?: boolean = false;
    @Prop() name?: string | undefined = '';
    @Prop() onDimensionChanged: () => any = (() => undefined);
    @Prop() onKeyboardHandled?: (args: any) => any | undefined = undefined;
    @Prop() rtlEnabled?: boolean = config().rtlEnabled;
    @Prop() supportedKeys?: (args: any) => any | undefined = undefined;
    @Prop() tabIndex?: number = 0;
    @Prop() visible?: boolean = true;
    @Prop() width?: string | number | null = null;

    @Slot() children: any;

    @Event() onClick?: (e: any) => void = (() => { });

    @InternalState() _hovered: boolean = false;
    @InternalState() _active: boolean = false;
    @InternalState() _focused: boolean = false;
    @InternalState() _keyboardListenerId: string | null = null;

    @Ref()
    widgetRef!: HTMLDivElement;

    @Effect()
    visibilityEffect() {
        const namespace = `${this.name}VisibilityChange`;

        if(this._visibilityChanged !== undefined && hasWindow()) {
            visibility.on(this.widgetRef,
                () => this.visible && this._visibilityChanged!(true),
                () => this.visible && this._visibilityChanged!(false),
                { namespace }
            );
        }

        return () => visibility.off(this.widgetRef, { namespace });
    }

    @Effect()
    resizeEffect() {
        const namespace = `${this.name}VisibilityChange`;

        this.onDimensionChanged &&
            resize.on(this.widgetRef, this.onDimensionChanged, { namespace });

        return () => resize.off(this.widgetRef, { namespace });
    }

    @Effect()
    clickEffect() {
        const namespace = 'UIFeedback';
        const isFocusable = this.focusStateEnabled && !this.disabled;
        const canBeFocusedByKey = isFocusable && this.accessKey;

        canBeFocusedByKey && dxClick.on(this.widgetRef, e => {
            if(isFakeClickEvent(e)) {
                e.stopImmediatePropagation();
                this._focused = true;
            }
            this.onClick!(this.clickArgs);
        }, { namespace });

        return () => dxClick.off(this.widgetRef, { namespace });
    }

    @Effect()
    hoverEffect() {
        const namespace = 'UIFeedback';
        const selector = this.activeStateUnit;
        const isHoverable = this.hoverStateEnabled && !this.disabled;

        if(isHoverable) {
            hover.on(this.widgetRef,
                new Action(() => {
                    if (!this._active) {
                        this._hovered = true;
                    }
                }, { excludeValidators: ['readOnly'] }),
                () => { this._hovered = false; },
                { selector, namespace }
            );
        }

        return () => hover.off(this.widgetRef, { selector, namespace });
    }

    @Effect()
    activeEffect() {
        const selector = this.activeStateUnit;
        const namespace = 'UIFeedback';

        if(this.activeStateEnabled) {
            active.on(this.widgetRef,
                new Action(() => { this._active = true; }),
                new Action(
                    () => { this._active = false; },
                    { excludeValidators: ['disabled', 'readOnly'] }
                ), {
                    showTimeout: this._feedbackShowTimeout,
                    hideTimeout: this._feedbackHideTimeout,
                    selector,
                    namespace
                }
            );
        }

        return () => active.off(this.widgetRef, { selector, namespace });
    }

    @Effect()
    keyboardEffect() {
        const hasKeyboardEventHandler = !!this.onKeyboardHandled;
        const shouldAttach = this.focusStateEnabled || hasKeyboardEventHandler;

        if(shouldAttach) {
            const keyboardHandler = (options: any) => {
                const { originalEvent, keyName, which } = options;
                const keys = this.supportedKeys && this.supportedKeys(originalEvent) || {};
                const func = keys[keyName] || keys[which];

                if(func !== undefined) {
                    const handler = func.bind(this);
                    const result = handler(originalEvent, options);

                    if(!result) {
                        return false;
                    }
                }
                return true;
            }

            keyboard.on(
                this.widgetRef,
                this.widgetRef,
                opts => keyboardHandler(opts),
            );
        }

        return () => keyboard.off(this._keyboardListenerId);
    }
}
