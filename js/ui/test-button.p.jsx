import * as Preact from "preact";
import { useState, useEffect, useCallback } from "preact/hooks";

const Button = (props) => {
    const [_hovered, _setHovered] = useState(false);
    const [_active, _setActive] = useState(false);

    const onPointerOver = useCallback(() => _setHovered(true), []);
    const onPointerOut = useCallback(() => _setHovered(false), []);
    const onPointerDown = useCallback(() => _setActive(true), []);
    const onPointerUp = useCallback(() => _setActive(false), []);

    useEffect(() => {
        document.addEventListener("pointerup", onPointerUp);
        return function cleanup() {
            document.removeEventListener("pointerup", onPointerUp);
        };
    });

    const onClickHandler = useCallback(function(e) {
        props.onClick({ type: props.type, text: props.text });
    }, [props.type, props.text, props.onClick]);

    return viewFunction(viewModelFunction(Object.assign({}, props, {
        // props
        // state
        // internal state
        _hovered,
        _active,
        // listeners
        onPointerOver,
        onPointerOut,
        onPointerDown,
        onClickHandler
    })));
};

Button.defaultProps = {
    onClick: () => {}
};


function getCssClasses(model) {
    const classNames = ['dx-widget', 'dx-button'];

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
    } else {
        classNames.push('dx-button-normal');
    }
    if(model.text) {
        classNames.push('dx-button-has-text');
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
    return Object.assign({
        cssClasses: getCssClasses(model),
        style: {
            width: model.width
        }
    }, model);
}


function viewFunction(viewModel) {
    return (
        <div className={viewModel.cssClasses}
            title={viewModel.hint}
            style={viewModel.style}
            tabIndex={0}
            onPointerDown={viewModel.onPointerDown}
            onPointerOver={viewModel.onPointerOver}
            onPointerOut={viewModel.onPointerOut}
            onClick={viewModel.onClickHandler}>
            <div className="dx-button-content">
                <span className="dx-button-text">{viewModel.text}</span>
            </div>
            
        </div>
    );
}

export default Button;
