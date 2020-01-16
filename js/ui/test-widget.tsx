import { Component, Prop, Event, InternalState, Listen, React, Slot } from "../component_declaration/common";
import config from '../core/config';
import { getDocument } from '../core/dom_adapter';
import { each } from '../core/utils/iterator';
import { extend } from '../core/utils/extend';
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

const getAttributes = ({ elementAttr, disabled, visible }: any) => {
    const arias = setAria({ disabled, hidden: !visible });
    const attrs = extend({}, arias, elementAttr);
    delete attrs.class;

    return attrs;
};

const getCssClasses = (model: Partial<Widget>) => {
    const className = ['dx-widget'];

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
    default: children,

    focusStateEnabled,
    hoverStateEnabled,

    onPointerOver,
    onPointerOut,
    onPointerDown,
    onClickHandler,
}: Widget) => {
    const style = getStyles({ width, height });
    const className = getCssClasses({
        disabled, visible, _focused, _active, _hovered, rtlEnabled, elementAttr, hoverStateEnabled,
        focusStateEnabled,
    });
    const attrsWithoutClass = getAttributes({ elementAttr, disabled, visible });

    return {
        children,
        style,
        attributes: attrsWithoutClass,
        disabled,
        visible,
        title: hint,
        tabIndex,
        className,

        focusStateEnabled,
        hoverStateEnabled,

        onPointerOver,
        onPointerOut,
        onPointerDown,
        onClickHandler,
    };
};

export const viewFunction = (viewModel: any) => {
    return (
        <div
            {...viewModel.attributes}
            {...viewModel.focusStateEnabled && !viewModel.disabled ? { tabIndex: viewModel.tabIndex } : {}}
            className={viewModel.className}
            title={viewModel.title}
            style={viewModel.style}
            hidden={!viewModel.visible}
            {...viewModel.hoverStateEnabled ? { onPointerOver: viewModel.onPointerOver } : {}}
            {...viewModel.hoverStateEnabled ? { onPointerOut: viewModel.onPointerOut } : {}}
            onPointerDown={viewModel.onPointerDown}
            {...viewModel.disabled ? { onClick: viewModel.onClickHandler } : {}}
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
    @Prop() focusStateEnabled?: boolean = false;
    @Prop() hoverStateEnabled?: boolean = false;
    @Prop() activeStateEnabled?: boolean = false;

    @Slot() default: any;

    @Event() onClick?: (e: any) => void = (() => { });

    @InternalState() _hovered: boolean = false;
    @InternalState() _active: boolean = false;
    @InternalState() _focused: boolean = false;

    @Listen("pointerover")
    onPointerOver() {
        this._hovered = true;
    }

    @Listen("pointerout")
    onPointerOut() {
        this._hovered = false;
    }

    @Listen("pointerdown")
    onPointerDown() {
        this._focused = true;
        this._active = true;
    }

    @Listen('pointerup', { target: document })
    onPointerUp() {
        this._active = false;
    }

    @Prop() clickArgs?: any = {};
    @Listen("click")
    onClickHandler(e: any) {
        this.onClick!(this.clickArgs); // { type: this.type, text: this.text }
    }
}
