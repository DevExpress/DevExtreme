import { Component, Prop, Event, InternalState, Listen, React, Slot, Ref, Effect, State } from "../component_declaration/common";
import config from '../core/config';
import { getDocument } from '../core/dom_adapter';
import Action from '../core/action';
import { isFakeClickEvent } from '../events/utils';
import { each } from '../core/utils/iterator';
import { extend } from '../core/utils/extend';
import { dxClick, hover } from '../events/short';
const document = getDocument();

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

const setAria = (args) => {
    let attrs = {};
    each(args, (name, value) => {
        attrs = { ...attrs, ...setAttribute(name, value) };
    });
    return attrs;
};

const getAttributes = ({ elementAttr, disabled, visible, accessKey }: any) => {
    const arias = setAria({ disabled, hidden: !visible });
    const attrs = extend({}, arias, elementAttr, accessKey && { accessKey });
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

    widgetRef,
}: Widget) => {
    const style = getStyles({ width, height });
    const cssClasses = getCssClasses({
        disabled, visible, _focused, _active, _hovered, rtlEnabled, elementAttr, hoverStateEnabled,
        focusStateEnabled, className,
    });
    const attrsWithoutClass = getAttributes({ elementAttr, disabled, visible, accessKey });

    return {
        widgetRef,

        children,
        style,
        attributes: attrsWithoutClass,
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
    /** Private properties */
    @Prop() className?: string | undefined = '';
    @Prop() clickArgs?: any = {};
    @Prop() activeStateUnit?: string | undefined = undefined;
    @Prop() hoverStartHandler: (args: any) => any = (() => undefined);
    @Prop() hoverEndHandler: (args: any) => any = (() => undefined);

    /** === */

    // == DOMComponent ==
    @Prop() width?: string | number | null = null;
    @Prop() height?: string | number | null = null;
    @Prop() rtlEnabled?: { [name: string]: any } = config().rtlEnabled;
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

    @Slot() children: any;

    @Event() onClick?: (e: any) => void = (() => { });

    @State() hoveredElement: HTMLDivElement | null = null;
    @InternalState() _hovered: boolean = false;
    @InternalState() _active: boolean = false;
    @InternalState() _focused: boolean = false;

    // @Listen("pointerover")
    // onPointerOver() {
    //     this._hovered = true;
    // }

    // @Listen("pointerout")
    // onPointerOut() {
    //     this._hovered = false;
    // }

    // @Listen("pointerdown")
    // onPointerDown() {
    //     this._focused = true;
    //     this._active = true;
    // }

    // @Listen('pointerup', { target: document })
    // onPointerUp() {
    //     this._active = false;
    // }

    // @Listen("click")
    // onClickHandler(e: any) {
    //     this.onClick!(this.clickArgs); // { type: this.type, text: this.text }
    // }

    @Ref()
    widgetRef!: HTMLDivElement;

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
                debugger
            }, { excludeValidators: ['readOnly'] }), event => {
                this.hoveredElement = null;
                this._hovered = false;
                this.hoverEndHandler(event);
            }, { selector, namespace });
        }

        return () => hover.off(this.widgetRef, { selector, namespace });
    }
}
