import config from '../core/config';
import {
    Component,
    Effect,
    Event,
    Prop,
    React,
    Ref,
    Slot,
    ComponentInput,
    InternalState,
    JSXComponent
} from 'devextreme-generator/component_declaration/common';

import { active, dxClick, hover, keyboard, resize, visibility } from '../events/short';
import { each } from '../core/utils/iterator';
import { extend } from '../core/utils/extend';
import { isFakeClickEvent } from '../events/utils';
import { hasWindow } from '../core/utils/window';
import Action from '../core/action';

const getStyles = ({ width, height, ...other }) => {
    const computedWidth = typeof width === 'function' ? width() : width;
    const computedHeight = typeof height === 'function' ? height() : height;

    return {
        width: computedWidth ?? void 0,
        height: computedHeight ?? void 0,
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

const getAria = (args) => {
    let attrs = {};

    each(args, (name, value) => attrs = { ...attrs, ...setAttribute(name, value) });

    return attrs;
};

const getAttributes = ({ elementAttr, accessKey }) => {
    const attrs = extend({}, elementAttr, accessKey && { accessKey });

    delete attrs.class;

    return attrs;
};

const getCssClasses = (model: Partial<Widget> & Partial<WidgetInput>) => {
    const className = ['dx-widget'];
    const isFocusable = model.focusStateEnabled && !model.disabled;
    const isHoverable = model.hoverStateEnabled && !model.disabled;

    model.className && className.push(model.className);
    model.disabled && className.push('dx-state-disabled');
    !model.visible && className.push('dx-state-invisible');
    model._focused && isFocusable && className.push('dx-state-focused');
    model._active && className.push('dx-state-active');
    model._hovered && isHoverable && !model._active && className.push('dx-state-hover');
    model.rtlEnabled && className.push('dx-rtl');
    model.elementAttr?.class && className.push(model.elementAttr.class);

    return className.join(' ');
};

export const viewModelFunction = ({
    _active,
    _focused,
    _hovered,

    props: {
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
        width
    },

    widgetRef,
}: Widget) => {
    const styles = getStyles({ width, height });
    const attrsWithoutClass = getAttributes({
        elementAttr,
        accessKey: focusStateEnabled && !disabled && accessKey,
    });
    const arias = getAria({ ...aria, disabled, hidden: !visible });
    const cssClasses = getCssClasses({
        disabled, visible, _focused, _active, _hovered, rtlEnabled,
        elementAttr, hoverStateEnabled, focusStateEnabled, className,
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
        tabIndex: focusStateEnabled && !disabled && tabIndex,
        title: hint,
    };
};

export const viewFunction = (viewModel: any) => {
    return (
        <div
            ref={viewModel.widgetRef}
            {...viewModel.attributes}
            className={viewModel.cssClasses}
            tabIndex={viewModel.tabIndex}
            title={viewModel.title}
            style={viewModel.styles}
            hidden={!viewModel.visible}
        >
            {viewModel.children}
        </div>
    );
};

@ComponentInput()
export class WidgetInput { 
    @Prop() _dimensionChanged?: () => any = (() => undefined);
    @Prop() _feedbackHideTimeout?: number = 400;
    @Prop() _feedbackShowTimeout?: number = 30;
    @Prop() _visibilityChanged?: (args: any) => undefined;
    @Prop() accessKey?: string | null = null;
    @Prop() activeStateEnabled?: boolean = false;
    @Prop() activeStateUnit?: string;
    @Prop() aria?: any = {};
    @Prop() className?: string | undefined = '';
    @Prop() clickArgs?: any = {};
    @Prop() disabled?: boolean = false;
    @Prop() elementAttr?: { [name: string]: any } = {};
    @Prop() focusStateEnabled?: boolean = false;
    @Prop() height?: string | number | null = null;
    @Prop() hint?: string;
    @Prop() hoverEndHandler?: (args: any) => any = (() => undefined);
    @Prop() hoverStartHandler?: (args: any) => any = (() => undefined);
    @Prop() hoverStateEnabled?: boolean = false;
    @Prop() name?: string = '';
    @Prop() onDimensionChanged?: () => any = (() => undefined);
    @Prop() onKeyboardHandled?: (args: any) => any | undefined;
    @Prop() rtlEnabled?: boolean = config().rtlEnabled;
    @Prop() supportedKeys?: (args: any) => any | undefined;
    @Prop() tabIndex?: number = 0;
    @Prop() visible?: boolean = true;
    @Prop() width?: string | number | null = null;

    @Slot() children?: any;

    @Event() onClick?: (e: any) => void = (() => { });
}

@Component({
    name: 'Widget',
    components: [],
    viewModel: viewModelFunction,
    view: viewFunction,
})

export default class Widget extends JSXComponent<WidgetInput> {
    @InternalState() _active: boolean = false;
    @InternalState() _focused: boolean = false;
    @InternalState() _hovered: boolean = false;

    @Ref()
    widgetRef!: HTMLDivElement;

    @Effect()
    visibilityEffect() {
        const namespace = `${this.props.name}VisibilityChange`;

        if (this.props._visibilityChanged !== undefined && hasWindow()) {
            visibility.on(this.widgetRef,
                () => this.props.visible && this.props._visibilityChanged!(true),
                () => this.props.visible && this.props._visibilityChanged!(false),
                { namespace },
            );
        }

        return () => visibility.off(this.widgetRef, { namespace });
    }

    @Effect()
    resizeEffect() {
        const namespace = `${this.props.name}VisibilityChange`;

        this.props.onDimensionChanged &&
            resize.on(this.widgetRef, this.props.onDimensionChanged, { namespace });

        return () => resize.off(this.widgetRef, { namespace });
    }

    @Effect()
    accessKeyEffect() {
        const namespace = 'UIFeedback';
        const isFocusable = this.props.focusStateEnabled && !this.props.disabled;
        const canBeFocusedByKey = isFocusable && this.props.accessKey;

        canBeFocusedByKey && dxClick.on(this.widgetRef, (e) => {
            if (isFakeClickEvent(e)) {
                e.stopImmediatePropagation();
                this._focused = true;
            }
        }, { namespace });

        return () => dxClick.off(this.widgetRef, { namespace });
    }

    @Effect()
    hoverEffect() {
        const namespace = 'UIFeedback';
        const selector = this.props.activeStateUnit;
        const isHoverable = this.props.hoverStateEnabled && !this.props.disabled;

        if (isHoverable) {
            hover.on(this.widgetRef,
                new Action(() => {
                    if (!this._active) {
                        this._hovered = true;
                    }
                }, { excludeValidators: ['readOnly'] }),
                () => { this._hovered = false; },
                { selector, namespace },
            );
        }

        return () => hover.off(this.widgetRef, { selector, namespace });
    }

    @Effect()
    activeEffect() {
        const selector = this.props.activeStateUnit;
        const namespace = 'UIFeedback';

        if (this.props.activeStateEnabled && !this.props.disabled) {
            active.on(this.widgetRef,
                new Action(() => { this._active = true; }),
                new Action(
                    () => { this._active = false; },
                    { excludeValidators: ['disabled', 'readOnly'] },
                ), {
                    showTimeout: this.props._feedbackShowTimeout,
                    hideTimeout: this.props._feedbackHideTimeout,
                    selector,
                    namespace,
                },
            );
        }

        return () => active.off(this.widgetRef, { selector, namespace });
    }

    @Effect()
    clickEffect() {
        const namespace = this.props.name;

        dxClick.on(this.widgetRef,
            () => this.props.onClick!(this.props.clickArgs),
            { namespace },
        );

        return () => dxClick.off(this.widgetRef, { namespace });
    }

    @Effect()
    keyboardEffect() {
        const hasKeyboardEventHandler = !!this.props.onKeyboardHandled;
        const shouldAttach = this.props.focusStateEnabled || hasKeyboardEventHandler;
        let id: string | null = null;

        if (shouldAttach) {
            const keyboardHandler = (options: any) => {
                const { originalEvent, keyName, which } = options;
                const keys = this.props.supportedKeys && this.props.supportedKeys(originalEvent) || {};
                const handler = keys[keyName] || keys[which];

                if (handler) {
                    if (!handler(originalEvent, options)) {
                        return false;
                    }
                }

                return true;
            };

            id = keyboard.on(this.widgetRef, this.widgetRef,
                opts => keyboardHandler(opts),
            );
        }

        return () => keyboard.off(id);
    }
}
