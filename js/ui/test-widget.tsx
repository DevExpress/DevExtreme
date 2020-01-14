import { Component, Prop, Event, InternalState, Listen, React, Slot } from "../component_declaration/common";
import config from '../core/config';
import { getDocument } from '../core/dom_adapter';
import { hasWindow } from '../core/utils/window';
import { extend } from '../core/utils/extend';
const document = getDocument();

const getStyles = ({ width, height }: any) => {
    return {
        width: width === null ? '' : width,
        height: height === null ? '' : height,
    }
}

const getAttributes = ({ elementAttr }: any) => {
    const attrs = extend({}, elementAttr);
    // delete attrs.class;

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
    if (model.active) {
        className.push('dx-state-active');
    }
    if (model.hover) {
        className.push('dx-state-hover');
    }

    // DOMComponent
    if (model.rtlEnabled) {
        className.push('dx-rtl');
    }
    if (model.visibilityChanged && hasWindow()) {
        className.push('dx-visibility-change-handler');
    }
    if (model.elementAttr.class) {
        className.push(model.elementAttr.class);
    }

    return className.join(' ');
};

export const viewModelFunction = ({
    hoveredElement = null,
    isActive = false,
    disabled = false,
    visible = true,
    hint = undefined,
    activeStateEnabled = false,
    onContentReady = null,
    hoverStateEnabled = false,
    focusStateEnabled = false,
    tabIndex = 0,
    accessKey = null,
    onFocusIn = null,
    onFocusOut = null,
    onKeyboardHandled = null,
    width,
    height,
    focused,
    active,
    hover,
    rtlEnabled,
    visibilityChanged,
    elementAttr,
}: any) => {
    const style = getStyles({ width, height });
    const className = getCssClasses({ disabled, visible, focused, active, hover, rtlEnabled, visibilityChanged, elementAttr });
    const attrsWithoutClass = getAttributes({ elementAttr });

    return {
        style,
        attrsWithoutClass,
        hoveredElement,
        isActive,
        disabled,
        visible,
        title: hint,
        activeStateEnabled,
        onContentReady,
        hoverStateEnabled,
        focusStateEnabled,
        tabIndex,
        accessKey,
        onFocusIn,
        onFocusOut,
        onKeyboardHandled,
        className,
    };
};

export const viewFunction = (viewModel: any) => {
    return (
        <div
            {...viewModel.elementAttr}
            className={viewModel.className}
            title={viewModel.title}
            style={viewModel.style}
            hidden={!viewModel.visible}
            onPointerOver={viewModel.onPointerOver}
            onPointerOut={viewModel.onPointerOut}
            onPointerDown={viewModel.onPointerDown}
            onClick={viewModel.onClickHandler}
        >
            {viewModel.default}
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

    @Prop() clickArgs?: any = {};

    // == Widget ==
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

    @Listen("click")
    onClickHandler(e: any) {
        this.onClick!(this.clickArgs); // { type: this.type, text: this.text }
    }
}
