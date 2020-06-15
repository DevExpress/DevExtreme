let strategy = function(element) {
    return element && element.get(0);
};

function getPublicElement(element) {
    return strategy(element);
}

function setPublicElementWrapper(newStrategy) {
    strategy = newStrategy;
}

export { setPublicElementWrapper };
export { getPublicElement };
