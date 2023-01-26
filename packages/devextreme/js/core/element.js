let strategy = function(element) {
    return element && element.get(0);
};

export function getPublicElement(element) {
    return strategy(element);
}

export function setPublicElementWrapper(newStrategy) {
    strategy = newStrategy;
}
