import browser from 'core/utils/browser';

export function roundPoints(pointsByColumnsResult) {
    return pointsByColumnsResult.map(point => {
        point.x = browser.msie ? Math.floor(point.x) : point.x;
        return point;
    });
}
