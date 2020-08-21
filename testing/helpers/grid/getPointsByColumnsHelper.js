import browser from 'core/utils/browser';

export function roundPoints(pointsByColumnsResult) {
    return pointsByColumnsResult.map(point => {
        const isIE11 = browser.msie && parseInt(browser.version) <= 11;
        point.x = isIE11 ? Math.floor(point.x) : point.x;
        return point;
    });
}
