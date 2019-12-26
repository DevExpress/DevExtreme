import { getDocument } from '../core/dom_adapter';
import { getImageSourceType } from '../core/utils/icon';
import { isDefined } from '../core/utils/type';
const document = getDocument();
const ICON_CLASS = 'dx-icon';
const SVG_ICON_CLASS = 'dx-svg-icon';
const getImageContainerJSX = (source) => {
    const type = getImageSourceType(source);
    if(type === 'image') { return (Preact.h('img', { src: source, className: ICON_CLASS })); }
    if(type === 'fontIcon') { return (Preact.h('i', { className: `${ICON_CLASS} ${source}` })); }
    if(type === 'dxIcon') { return (Preact.h('i', { className: `${ICON_CLASS} ${ICON_CLASS}-${source}` })); }
    if(type === 'svg') { return (Preact.h('i', { className: `${ICON_CLASS} ${SVG_ICON_CLASS}` }, source)); }
};
const getCssClasses = (model) => {
    const classNames = ['dx-widget', 'dx-button'];
    model.elementAttr.class && classNames.push(model.elementAttr.class);
    if(model.stylingMode === 'outlined') {
        classNames.push('dx-button-mode-outlined');
    } else if(model.stylingMode === 'text') {
        classNames.push('dx-button-mode-text');
    } else {
        classNames.push('dx-button-mode-contained');
    }
    if(model.type === 'danger') {
        classNames.push('dx-button-danger');
    } else if(model.type === 'default') {
        classNames.push('dx-button-default');
    } else if(model.type === 'success') {
        classNames.push('dx-button-success');
    } else if(model.type === 'back') {
        classNames.push('dx-button-back');
    } else {
        classNames.push('dx-button-normal');
    }
    if(model.text) {
        classNames.push('dx-button-has-text');
    }
    if(model.icon) {
        classNames.push('dx-button-has-icon');
    }
    if(model._hovered) {
        classNames.push('dx-state-hover');
    }
    if(model.pressed || model._active) {
        classNames.push('dx-state-active');
    }
    if(!model.visible) {
        classNames.push('dx-state-invisible');
    }
    return classNames.concat(model.classNames).join(' ');
};
const getElementAttribute = (name, value) => {
    const validName = (name === 'role' || name === 'id') ? name : `aria-${name}`;
    const validValue = isDefined(value) ? value.toString() : null;
    const result = {};
    result[validName] = validValue;
    return result;
};
const getAttributes = (attrs) => {
    let elementAttributes = {};
    for(let attrName in attrs) {
        elementAttributes = Object.assign({}, elementAttributes, getElementAttribute(attrName, attrs[attrName]));
    }
    return elementAttributes;
};
const viewModelFunction = (model) => {
    let icon;
    if(model.icon || model.type === 'back') {
        icon = getImageContainerJSX(model.icon || 'back');
    }
    const elementAttributes = getAttributes(model.elementAttr);
    return Object.assign({}, model, { elementAttributes, cssClasses: getCssClasses(model), style: { width: model.width,
        height: model.height }, icon });
};
const viewFunction = (viewModel) => (Preact.h('div', Object.assign({}, viewModel.elementAttr, { className: viewModel.cssClasses, title: viewModel.hint, style: viewModel.style, hidden: !viewModel.visible, onPointerOver: viewModel.onPointerOver, onPointerOut: viewModel.onPointerOut, onPointerDown: viewModel.onPointerDown, onClick: viewModel.onClickHandler }), viewModel.contentRender && (Preact.h('div', { className: 'dx-button-content' },
    Preact.h(viewModel.contentRender, { icon: viewModel.icon, text: viewModel.text }))) || (Preact.h('div', { className: 'dx-button-content' },
    viewModel.icon,
    viewModel.text && Preact.h('span', { className: 'dx-button-text' }, viewModel.text)))));
import * as Preact from 'preact';
import { useState, useCallback, useEffect } from 'preact/hooks';
export default function Button(props) {
    const [__state__hovered, __state_set_hovered] = useState(false);

    const [__state__active, __state_set_active] = useState(false);
    const onPointerOver = useCallback(() => {
        __state_set_hovered(true);
    }, [__state__hovered]);
    const onPointerOut = useCallback(() => {
        __state_set_hovered(false);
    }, [__state__hovered]);
    const onPointerDown = useCallback(() => {
        __state_set_active(true);
    }, [__state__active]);
    const onPointerUp = useCallback(() => {
        __state_set_active(false);
    }, [__state__active]);
    const onClickHandler = useCallback((e) => {
        props.onClick({ type: props.type,
            text: props.text });
    }, [props.onClick, props.type, props.text]);
    useEffect(() => {
        document.addEventListener('pointerup', onPointerUp);
        return function cleanup() {
            document.removeEventListener('pointerup', onPointerUp);
        };
    });
    return viewFunction(viewModelFunction(Object.assign({}, props, { _hovered: __state__hovered, _active: __state__active, onPointerOver,
        onPointerOut,
        onPointerDown,
        onPointerUp,
        onClickHandler })));
}
Button.defaultProps = {
    elementAttr: {},
    visible: true,
    onClick: (() => {
    })
};
