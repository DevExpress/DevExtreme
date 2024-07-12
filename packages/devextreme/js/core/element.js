export function getPublicElementNonJquery(element) {
    return element?.get?.(0) ?? element;
}

let strategy = (element) => {
    return element && element.get(0);
};

export function getPublicElement(element) {
    return strategy(element);
}

export function setPublicElementWrapper(newStrategy) {
    strategy = newStrategy;
}
