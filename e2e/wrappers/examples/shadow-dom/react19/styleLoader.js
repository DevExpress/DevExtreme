const SDKName = "V2";

if (!window.styles) {
    window.styles = {};
}
if (!window.containers) window.containers = {};

export const createShadowContainer = (shadowContainer, id) => {

    const SDKStyle = window.styles?.[SDKName];

    if (SDKStyle) {
        const styleId = `${SDKName}_Styles`;
        const { shadowRoot } = shadowContainer;
        if (!shadowRoot.getElementById(styleId)) {
            const styleElement = window.styles[SDKName];
            styleElement.id = styleId;
            shadowRoot.insertBefore(styleElement.cloneNode(true), shadowRoot.querySelector('body'));
        }
    }

    window.containers[id] = shadowContainer;
};

export const deleteShadowContainer = id => {
    delete window.containers[id];
};

const insertStyle = style => {
    window.styles[SDKName] = style;

    Promise.resolve().then(() => {
        Object.values(window.containers).forEach(container => {
            container.shadowRoot.appendChild(style.cloneNode(true));
        });
    });
};

export default insertStyle;