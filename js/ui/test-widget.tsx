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
    debugger
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

const getCssClasses = (model: any) => {
    const className = ['dx-widget'];

    if (model.disabled) {
        className.push('dx-state-disabled');
    }
    if (!model.visible) {
        className.push('dx-state-invisible');
    }
    if (model.focused) {
        className.push('dx-state-focused');
    }
    if (model._active) {
        className.push('dx-state-active');
    }
    if (model._hovered) {
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
    focused,
    _active,
    _hovered,
    rtlEnabled,
    elementAttr,
    default: children,
}: Widget) => {
    const style = getStyles({ width, height });
    const className = getCssClasses({ disabled, visible, focused, _active, _hovered, rtlEnabled, elementAttr });
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
    };
};

export const viewFunction = (viewModel: any) => {
    return (
        <div
            {...viewModel.attributes}
            className={viewModel.className}
            title={viewModel.title}
            style={viewModel.style}
            hidden={!viewModel.visible}
            onPointerOver={viewModel.onPointerOver}
            onPointerOut={viewModel.onPointerOut}
            onPointerDown={viewModel.onPointerDown}
            onClick={viewModel.onClickHandler}
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

    @Slot() default: any;

    @Event() onClick?: (e: any) => void = (() => { });

    @InternalState() _hovered: boolean = false;
    @InternalState() _active: boolean = false;

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
