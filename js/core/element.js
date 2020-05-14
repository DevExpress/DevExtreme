let strategy = function(element) {
    return element && element.get(0);
};

function getPublicElement(element) {
    return strategy(element);
}

function setPublicElementWrapper(newStrategy) {
    strategy = newStrategy;
}

exports.setPublicElementWrapper = setPublicElementWrapper;
exports.getPublicElement = getPublicElement;
