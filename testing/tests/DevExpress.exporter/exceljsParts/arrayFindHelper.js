function find(callback) {
    let currentIndex = 0;
    while(currentIndex < this.length) {
        const currentValue = this[currentIndex];
        if(callback.call(undefined, currentValue, currentIndex, this)) {
            return currentValue;
        }
        currentIndex++;
    }
    return undefined;
}

function initializeDxArrayFind() {
    if(!Array.prototype.find) {
        const arrayType = Array;
        Object.defineProperty(arrayType.prototype, 'isFindFromDxArrayFindHelper', {
            value: true,
            writable: true,
            configurable: true
        });

        Object.defineProperty(arrayType.prototype, 'find', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: find
        });
    }
}

function clearDxArrayFind() {
    if(Array.prototype.find && Array.prototype.isFindFromDxArrayFindHelper === true) {
        delete Array.prototype.find;
        delete Array.prototype.isFindFromDxArrayFindHelper;
    }
}

export { initializeDxArrayFind, clearDxArrayFind };
