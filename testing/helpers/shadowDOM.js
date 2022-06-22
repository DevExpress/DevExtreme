function appendShadowRoot(shadowSelector) {
    const root = document.querySelector(shadowSelector);
    const control = document.createElement('div');
    const container = document.createElement('div');

    root.attachShadow({ mode: 'open' });
    root.shadowRoot.appendChild(container);
    container.appendChild(control);

    this.root = root;
    this.container = container;
    this.control = control;
}

exports.appendShadowRoot = appendShadowRoot;

