let nextDataKey = 1;

export function generateDataKey() {
    return 'vectormap-data-' + nextDataKey++;
}

///#DEBUG
export function _TESTS_resetDataKey() {
    nextDataKey = 1;
}
///#ENDDEBUG
