function isGroupItem(item) {
    if(item === undefined || item === null || typeof item !== 'object') {
        return false;
    }
    return 'key' in item && 'items' in item;
}

export function isCustomStoreSummaryResult(res) {
    return !Array.isArray(res) && 'data' in res;
}

export function isCustomStoreGroupItemsArrayResult(res) {
    return Array.isArray(res) && !!res.length && isGroupItem(res[0]);
}

export function isCustomStoreItemsArrayResult(res) {
    return Array.isArray(res) && !isGroupItem(res[0]);
}
