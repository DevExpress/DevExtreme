import { Component, Prop, Event, InternalState, Listen, React, Slot, Ref, Effect, State } from "../component_declaration/common";
import config from '../core/config';
import { getDocument } from '../core/dom_adapter';
import Action from '../core/action';
import { isFakeClickEvent } from '../events/utils';
import { each } from '../core/utils/iterator';
import { extend } from '../core/utils/extend';
import { hasWindow } from '../core/utils/window';
import { dxClick, hover, resize, visibility, active, keyboard } from '../events/short';
// const document = getDocument();

const getStyles = ({ width, height }: any) => {
    return {
        width: width === null ? '' : width,
        height: height === null ? '' : height,
    }
}

const setAttribute = (name, value) => {
    if (!value) return {};
    const attrName = (name === 'role' || name === 'id') ? name : `aria-${name}`;
    const attrValue = value && value.toString() || null;

    return { [attrName]: attrValue };
};

const getAria = (args) => {
    let attrs = {};
    each(args, (name, value) => {
        attrs = { ...attrs, ...setAttribute(name, value) };
    });
    return attrs;
};

const getAttributes = ({ elementAttr, accessKey }: any) => {
    const attrs = extend({}, elementAttr, accessKey && { accessKey });
    delete attrs.class;

    return attrs;
};

const getCssClasses = (model: Partial<Widget>) => {
    const className = ['dx-widget'];

    if (!!model.className) {
        className.push(model.className);
    }
    if (model.disabled) {
        className.push('dx-state-disabled');
    }
    if (!model.visible) {
        className.push('dx-state-invisible');
    }
    // should we remove `focusStateEnabled` and use it only in events?
    if (model._focused && model.focusStateEnabled && !model.disabled) {
        className.push('dx-state-focused');
    }
    if (model._active) {
        className.push('dx-state-active');
    }
    // should we remove `hoverStateEnabled` and use it only in events?
    if (model._hovered && model.hoverStateEnabled && !model.disabled && !model._active) {
        className.push('dx-state-hover');
    }

    // DOMComponent
    if (model.rtlEnabled) {
        className.push('dx-rtl');
    }
    // if (model.visibilityChanged && hasWindow()) {
    //     className.push('dx-visibility-change-handler');
    // }
    if (model.elementAttr.class) {
        className.push(model.elementAttr.class);
    }

    return className.join(' ');
};

export const viewModelFunction = ({
    disabled,
    visible,
    hint,
    tabIndex,
    width,
    height,
    _focused,
    _active,
    _hovered,
    rtlEnabled,
    elementAttr,
    accessKey,
    children,
    className,

    focusStateEnabled,
    hoverStateEnabled,
    aria,

    widgetRef,
}: Widget) => {
    const style = getStyles({ width, height });
    const cssClasses = getCssClasses({
        disabled, visible, _focused, _active, _hovered, rtlEnabled, elementAttr, hoverStateEnabled,
        focusStateEnabled, className,
    });
    const attrsWithoutClass = getAttributes({ elementAttr, disabled, visible, accessKey });
    const arias = getAria({ ...aria, disabled, hidden: !visible });

    return {
        widgetRef,

        children,
        style,
        attributes: { ...attrsWithoutClass, ...arias },
        disabled,
        visible,
        title: hint,
        tabIndex,
        cssClasses,

        focusStateEnabled,
        hoverStateEnabled,
    };
};

export const viewFunction = (viewModel: any) => {
    return (
        <div
            ref={viewModel.widgetRef}
            {...viewModel.attributes}
            {...viewModel.focusStateEnabled && !viewModel.disabled ? { tabIndex: viewModel.tabIndex } : {}}
            className={viewModel.cssClasses}
            title={viewModel.title}
            style={viewModel.style}
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
    @Prop() activeStateUnit?: string | undefined = undefined;
    @Prop() hoverStartHandler: (args: any) => any = (() => undefined);
    @Prop() hoverEndHandler: (args: any) => any = (() => undefined);
    @Prop() _dimensionChanged: () => any = (() => undefined);
    @Prop() _visibilityChanged: (args: any) => any | undefined = undefined;
    @Prop() _feedbackHideTimeout: number = 400;
    @Prop() _feedbackShowTimeout: number = 30;
    @Prop() supportedKeys?: (args: any) => any | undefined = undefined;
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
    @Prop() focusStateEnabled?: boolean = false;
    @Prop() hoverStateEnabled?: boolean = false;
    @Prop() activeStateEnabled?: boolean = false;
    @Prop() onKeyboardHandled?: (args: any) => any | undefined = undefined;

    @Slot() children: any;

    @Event() onClick?: (e: any) => void = (() => { });

    @State() hoveredElement: HTMLDivElement | null = null;
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
                () => this.visible && this._visibilityChanged(true),
                () => this.visible && this._visibilityChanged(false),
                { namespace }
            );
        }

        return () => visibility.off(this.widgetRef, { namespace });
    }

    @Effect()
    resizeEffect() {
        const namespace = `${this.name}VisibilityChange`;
        if (this._dimensionChanged) {

            resize.on(this.widgetRef, () => this._dimensionChanged(), { namespace });
        }

        return () => resize.off(this.widgetRef, { namespace });
    }

    @Effect()
    clickEffect() {
        const namespace = 'UIFeedback';
        this.accessKey && dxClick.on(this.widgetRef, e => {
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

        if(this.hoverStateEnabled) {
            hover.on(this.widgetRef, new Action(({ event, element }) => {
                this.hoverStartHandler(event);
                this.hoveredElement = this.widgetRef;
                this._hovered = true;
            }, { excludeValidators: ['readOnly'] }), event => {
                this.hoveredElement = null;
                this._hovered = false;
                this.hoverEndHandler(event);
            }, { selector, namespace });
        }

        return () => hover.off(this.widgetRef, { selector, namespace });
    }

    @Effect()
    activeEffect() {
        const selector = this.activeStateUnit;
        const namespace = 'UIFeedback';

        // active.off(this.widgetRef, { namespace, selector }); // We should add empty array to useEffect(..., [])

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

        return () => hover.off(this.widgetRef, { selector, namespace });
    }

    @Effect()
    keyboardEffect() {
        // keyboard.off();
        // this._keyboardListenerId = null;

        const hasKeyboardEventHandler = !!this.onKeyboardHandled;
        const shouldAttach = this.focusStateEnabled || hasKeyboardEventHandler;

        if(shouldAttach) {
            const keyboardHandler = (options: any) => {
                const { originalEvent, keyName, which } = options;
                const keys = this.supportedKeys(originalEvent);
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

            /*this._keyboardListenerId = */keyboard.on(
                this.widgetRef,
                this.widgetRef,
                opts => keyboardHandler(opts),
            );
        }

        return () => keyboard.off(this._keyboardListenerId);
    }
}
