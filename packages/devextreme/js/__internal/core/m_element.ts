export function getPublicElementNonJquery(element) {
    if(element && element.get) {
        return element.get(0);
    }
    return element;
}

let strategy = getPublicElementNonJquery;

export function getPublicElement(element) {
    return strategy(element);
}

export function setPublicElementWrapper(newStrategy) {
    strategy = newStrategy;
}
