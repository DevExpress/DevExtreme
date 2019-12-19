import { getDocument } from "../core/dom_adapter";
const document = getDocument();
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
    }, []);
    const onClickHandler = useCallback((e) => {
        props.onClick({ type: props.type,
            text: props.text });
    }, [props.onClick, props.type, props.text]);
    useEffect(() => {
        document.addEventListener("pointerup", onPointerUp);
        return function cleanup() {
            document.removeEventListener("pointerup", onPointerUp);
        };
    });
    return viewFunction(viewModelFunction(Object.assign({}, props, { _hovered: __state__hovered, _active: __state__active, onPointerOver,
        onPointerOut,
        onPointerDown,
        onPointerUp,
        onClickHandler })));
}
Button.defaultProps = {
    onClick: (() => {
    })
};
function getCssClasses(model) {
    const classNames = ["dx-button"];
    if(model.stylingMode === "outlined") {
        classNames.push("dx-button-mode-outlined");
    } else if(model.stylingMode === "text") {
        classNames.push("dx-button-mode-text");
    } else {
        classNames.push("dx-button-mode-contained");
    }
    if(model.type === "danger") {
        classNames.push("dx-button-danger");
    } else if(model.type === "default") {
        classNames.push("dx-button-default");
    } else if(model.type === "success") {
        classNames.push("dx-button-success");
    } else {
        classNames.push("dx-button-normal");
    }
    if(model.text) {
        classNames.push("dx-button-has-text");
    }
    if(model._hovered) {
        classNames.push("dx-state-hover");
    }
    if(model.pressed || model._active) {
        classNames.push("dx-state-active");
    }
    return classNames.concat(model.classNames).join(" ");
}
function viewModelFunction(model) {
    return Object.assign({ cssClasses: getCssClasses(model), style: { width: model.width } }, model);
}
function viewFunction(viewModel) {
    return (Preact.h("div", { className: viewModel.cssClasses, title: viewModel.hint, style: viewModel.style, onPointerOver: viewModel.onPointerOver, onPointerOut: viewModel.onPointerOut, onPointerDown: viewModel.onPointerDown, onClick: viewModel.onClickHandler },
        Preact.h("div", { className: "dx-button-content" },
            Preact.h("span", { className: "dx-button-text" }, viewModel.text))));
}
