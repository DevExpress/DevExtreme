const getRealSeparatorIndex = function(str) {
    let quoteBalance = 0;
    let separatorCount = 0;

    for(let i = 0; i < str.length; ++i) {
        if(str[i] === '\'') {
            quoteBalance++;
        }
        if(str[i] === '.') {
            ++separatorCount;
            if(quoteBalance % 2 === 0) {
                return {
                    occurrence: separatorCount,
                    index: i
                };
            }
        }
    }

    return { occurrence: 1, index: -1 };
};

const getNthOccurrence = function(str, c, n) {
    let i = -1;

    while(n-- && i++ < str.length) {
        i = str.indexOf(c, i);
    }

    return i;
};

const splitByIndex = function(str, index) {
    if(index === -1) {
        return [str];
    }

    return [str.slice(0, index), str.slice(index + 1)];
};

export {
    getRealSeparatorIndex,
    getNthOccurrence,
    splitByIndex
};
