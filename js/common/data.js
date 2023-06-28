function isGroupItem(item) {
    if(item === undefined || item === null || typeof item !== 'object') {
        return false;
    }
    return 'key' in item && 'items' in item;
}

export function isSummaryResult(res) {
    return !Array.isArray(res) && 'data' in res;
}

export function isGroupItemsArray(res) {
    return Array.isArray(res) && !!res.length && isGroupItem(res[0]);
}

export function isItemsArray(res) {
    return Array.isArray(res) && !isGroupItem(res[0]);
}
