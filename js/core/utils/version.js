exports.compare = function(x, y, maxLevel) {

    function normalizeArg(value) {
        if(typeof value === 'string') {
            return value.split('.');
        }
        if(typeof value === 'number') {
            return [value];
        }
        return value;
    }

    x = normalizeArg(x);
    y = normalizeArg(y);

    var length = Math.max(x.length, y.length);

    if(isFinite(maxLevel)) {
        length = Math.min(length, maxLevel);
    }

    for(var i = 0; i < length; i++) {
        var xItem = parseInt(x[i] || 0, 10),
            yItem = parseInt(y[i] || 0, 10);

        if(xItem < yItem) {
            return -1;
        }
        if(xItem > yItem) {
            return 1;
        }
    }

    return 0;
};
