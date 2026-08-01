/**
 * Geometry helper for gauge text-cloud marker QUnit tests.
 * Kept out of product ESM (DEBUG-only in source); tests import this directly.
 */
const COEFFICIENTS_MAP = {};
COEFFICIENTS_MAP['right-bottom'] = COEFFICIENTS_MAP.rb = [0, -1, -1, 0, 0, 1, 1, 0];
COEFFICIENTS_MAP['bottom-right'] = COEFFICIENTS_MAP.br = [-1, 0, 0, -1, 1, 0, 0, 1];
COEFFICIENTS_MAP['left-bottom'] = COEFFICIENTS_MAP.lb = [0, -1, 1, 0, 0, 1, -1, 0];
COEFFICIENTS_MAP['bottom-left'] = COEFFICIENTS_MAP.bl = [1, 0, 0, -1, -1, 0, 0, 1];
COEFFICIENTS_MAP['left-top'] = COEFFICIENTS_MAP.lt = [0, 1, 1, 0, 0, -1, -1, 0];
COEFFICIENTS_MAP['top-left'] = COEFFICIENTS_MAP.tl = [1, 0, 0, 1, -1, 0, 0, -1];
COEFFICIENTS_MAP['right-top'] = COEFFICIENTS_MAP.rt = [0, 1, -1, 0, 0, -1, 1, 0];
COEFFICIENTS_MAP['top-right'] = COEFFICIENTS_MAP.tr = [-1, 0, 0, 1, 1, 0, 0, -1];

const round = Math.round;

export function getTextCloudInfo(options) {
    let x = options.x;
    let y = options.y;
    const type = COEFFICIENTS_MAP[options.type];
    const cloudWidth = options.cloudWidth;
    const cloudHeight = options.cloudHeight;
    let tailWidth;
    let tailHeight;
    const cx = x;
    const cy = y;

    tailWidth = tailHeight = options.tailLength;

    if(type[0] & 1) {
        tailHeight = Math.min(tailHeight, cloudHeight / 3);
    } else {
        tailWidth = Math.min(tailWidth, cloudWidth / 3);
    }

    return {
        cx: round(cx + type[0] * tailWidth + (type[0] + type[2]) * cloudWidth / 2),
        cy: round(cy + type[1] * tailHeight + (type[1] + type[3]) * cloudHeight / 2),
        points: [
            round(x),
            round(y),
            round(x += type[0] * (cloudWidth + tailWidth)),
            round(y += type[1] * (cloudHeight + tailHeight)),
            round(x += type[2] * cloudWidth),
            round(y += type[3] * cloudHeight),
            round(x += type[4] * cloudWidth),
            round(y += type[5] * cloudHeight),
            round(x += type[6] * (cloudWidth - tailWidth)),
            round(y += type[7] * (cloudHeight - tailHeight)),
        ],
    };
}
