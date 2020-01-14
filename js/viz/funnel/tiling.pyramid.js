const CENTER = 0.5;
const LEFTCORNER = 0;
const RIGHTCORNER = 1;

module.exports = {
    getFigures: function(data, neckWidth, neckHeight) {
        let height = 0;
        let y = 0;
        let x = 0;
        let offsetX = 0;
        const halfNeckWidth = neckWidth / 2;
        const offsetFromCorner = CENTER - halfNeckWidth;
        const funnelHeight = 1 - neckHeight;
        const neckLeftCorner = CENTER - halfNeckWidth;
        const neckRightCorner = CENTER + halfNeckWidth;
        return data.map(function(value) {
            x = offsetX;
            y = height;
            height += value;
            offsetX = offsetFromCorner * height / funnelHeight;
            if(y <= funnelHeight && height <= funnelHeight) {
                return [
                    x, y,
                    RIGHTCORNER - x, y,
                    RIGHTCORNER - offsetX, height,
                    LEFTCORNER + offsetX, height
                ];
            } else if(y <= funnelHeight && height > funnelHeight) {
                return [
                    x, y,
                    RIGHTCORNER - x, y,
                    neckRightCorner, funnelHeight,
                    neckRightCorner, height,
                    neckLeftCorner, height,
                    neckLeftCorner, funnelHeight
                ];
            } else {
                return [
                    neckLeftCorner, y,
                    neckRightCorner, y,
                    neckRightCorner, height,
                    neckLeftCorner, height
                ];
            }
        });
    },

    normalizeValues: function(items) {
        const sum = items.reduce(function(sum, item) {
            return sum + item.value;
        }, 0);

        return items.map(function(item) {
            return item.value / sum;
        });
    }
};
