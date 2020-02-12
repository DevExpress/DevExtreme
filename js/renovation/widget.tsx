import config from '../core/config';
import {
    Component,
    ComponentBindings,
    Effect,
    Event,
    InternalState,
    JSXComponent,
    OneWay,
    React,
    Ref,
    Slot,
} from 'devextreme-generator/component_declaration/common';
import { active, dxClick, hover, keyboard, resize, visibility } from '../events/short';
import { each } from '../core/utils/iterator';
import { extend } from '../core/utils/extend';
import { isFakeClickEvent } from '../events/utils';
import { hasWindow } from '../core/utils/window';
import Action from '../core/action';

const getStyles = ({ width, height }) => {
    const computedWidth = typeof width === 'function' ? width() : width;
    const computedHeight = typeof height === 'function' ? height() : height;

    return {
        width: computedWidth ?? void 0,
        height: computedHeight ?? void 0,
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
        width,
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
        attributes: { ...attrsWithoutClass, ...arias },
        children,
        cssClasses,
        disabled,
        focusStateEnabled,
        hoverStateEnabled,
        styles,
        tabIndex: focusStateEnabled && !disabled && tabIndex,
        title: hint,
        visible,
        widgetRef,
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

@ComponentBindings()
export class WidgetInput {
    @OneWay() _feedbackHideTimeout?: number = 400;
    @OneWay() _feedbackShowTimeout?: number = 30;
    @OneWay() _visibilityChanged?: (args: any) => undefined;
    @OneWay() accessKey?: string | null = null;
    @OneWay() activeStateEnabled?: boolean = false;
    @OneWay() activeStateUnit?: string;
    @OneWay() aria?: any = {};
    @OneWay() className?: string | undefined = '';
    @OneWay() clickArgs?: any = {};
    @OneWay() disabled?: boolean = false;
    @OneWay() elementAttr?: { [name: string]: any } = {};
    @OneWay() focusStateEnabled?: boolean = false;
    @OneWay() height?: string | number | null = null;
    @OneWay() hint?: string;
    @OneWay() hoverStateEnabled?: boolean = false;
    @OneWay() name?: string = '';
    @OneWay() onActive?: (e: any) => any = (() => undefined);
    @OneWay() onDimensionChanged?: () => any = (() => undefined);
    @OneWay() onInactive?: (e: any) => any = (() => undefined);
    @OneWay() onKeyPress?: (e: any, options: any) => any = (() => undefined);
    @OneWay() onKeyboardHandled?: (args: any) => any | undefined;
    @OneWay() rtlEnabled?: boolean = config().rtlEnabled;
    @OneWay() tabIndex?: number = 0;
    @OneWay() visible?: boolean = true;
    @OneWay() width?: string | number | null = null;

    @Slot() children?: any;

    @Event() onClick?: (e: any) => void = (() => { });
}

// tslint:disable-next-line: max-classes-per-file
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
        const { name, _visibilityChanged, visible } = this.props;
        const namespace = `${name}VisibilityChange`;

        if (_visibilityChanged !== undefined && hasWindow()) {
            visibility.on(this.widgetRef,
                () => visible && _visibilityChanged!(true),
                () => visible && _visibilityChanged!(false),
                { namespace },
            );

            return () => visibility.off(this.widgetRef, { namespace });
        }

        return null;
    }

    @Effect()
    resizeEffect() {
        const namespace = `${this.props.name}VisibilityChange`;
        const { onDimensionChanged } = this.props;

        if (onDimensionChanged) {
            resize.on(this.widgetRef, onDimensionChanged, { namespace });

            return () => resize.off(this.widgetRef, { namespace });
        }

        return null;
    }

    @Effect()
    accessKeyEffect() {
        const namespace = 'UIFeedback';
        const { accessKey, focusStateEnabled, disabled } = this.props;
        const isFocusable = focusStateEnabled && !disabled;
        const canBeFocusedByKey = isFocusable && accessKey;

        if (canBeFocusedByKey) {
            dxClick.on(this.widgetRef, (e) => {
                if (isFakeClickEvent(e)) {
                    e.stopImmediatePropagation();
                    this._focused = true;
                }
            }, { namespace });

            return () => dxClick.off(this.widgetRef, { namespace });
        }

        return null;
    }

    @Effect()
    hoverEffect() {
        const namespace = 'UIFeedback';
        const { activeStateUnit, hoverStateEnabled, disabled } = this.props;
        const selector = activeStateUnit;
        const isHoverable = hoverStateEnabled && !disabled;

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

            return () => hover.off(this.widgetRef, { selector, namespace });
        }

        return null;
    }

    @Effect()
    activeEffect() {
        const {
            activeStateEnabled, activeStateUnit, disabled, onInactive,
            _feedbackShowTimeout, _feedbackHideTimeout, onActive,
        } = this.props;
        const selector = activeStateUnit;
        const namespace = 'UIFeedback';

        if (activeStateEnabled && !disabled) {
            active.on(this.widgetRef,
                new Action(({ event }) => {
                    this._active = true;
                    onActive?.(event);
                }),
                new Action(({ event }) => {
                    this._active = false;
                    onInactive?.(event);
                },
                { excludeValidators: ['disabled', 'readOnly'] },
                ), {
                    showTimeout: _feedbackShowTimeout,
                    hideTimeout: _feedbackHideTimeout,
                    selector,
                    namespace,
                },
            );

            return () => active.off(this.widgetRef, { selector, namespace });
        }

        return null;
    }

    @Effect()
    clickEffect() {
        const { name, clickArgs } = this.props;
        const namespace = name;

        dxClick.on(this.widgetRef, () => this.props.onClick!(clickArgs), { namespace });

        return () => dxClick.off(this.widgetRef, { namespace });
    }

    @Effect()
    keyboardEffect() {
        const { focusStateEnabled, onKeyPress } = this.props;

        if (focusStateEnabled || onKeyPress) {
            const id = keyboard.on(this.widgetRef, this.widgetRef,
                options => onKeyPress?.(options.originalEvent, options));

            return () => keyboard.off(id);
        }

        return null;
    }
}
