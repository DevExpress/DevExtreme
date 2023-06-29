function isGroupItem(item) {
    if(item === undefined || item === null || typeof item !== 'object') {
        return false;
    }
    return 'key' in item && 'items' in item;
}

export function isCustomStoreSummary(res) {
    return !Array.isArray(res) && 'data' in res;
}

export function isCustomStoreGroupItemsArray(res) {
    return Array.isArray(res) && !!res.length && isGroupItem(res[0]);
}

export function isCustomStoreItemsArray(res) {
    return Array.isArray(res) && !isGroupItem(res[0]);
}
