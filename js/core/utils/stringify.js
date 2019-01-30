function ensureProperties(obj) {
    var parentObjects = [ ];
    const MAX_DEEP = 4;

    function visit(obj) {
        if(obj === null || typeof obj !== 'object') {
            return obj;
        }

        if(parentObjects.length > MAX_DEEP) {
            return "[MAX_DEEP]";
        }

        if(parentObjects.indexOf(obj) !== -1) {
            return '[Circular]';
        }
        parentObjects.push(obj);

        if(Array.isArray(obj)) {
            var aResult = obj.map(visit);
            parentObjects.pop();
            return aResult;
        }

        var result = Object.keys(obj).reduce(function(result, prop) {
            result[prop] = visit(obj[prop]);
            return result;
        }, {});
        parentObjects.pop();
        return result;
    }

    return visit(obj);
}

export const stringify = function(value) {
    try {
        return JSON.stringify(value);
    } catch(e) {
        return JSON.stringify(ensureProperties(value));
    }
};
