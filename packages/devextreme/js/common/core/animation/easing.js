import { isFunction } from '../../../core/utils/type';

const CSS_TRANSITION_EASING_REGEX = /cubic-bezier\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/;

const TransitionTimingFuncMap = {
    'linear': 'cubic-bezier(0, 0, 1, 1)',
    'swing': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
    'ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    'ease-in': 'cubic-bezier(0.42, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.58, 1)',
    'ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)'
};

const polynomBezier = function(x1, y1, x2, y2) {
    const Cx = 3 * x1;
    const Bx = 3 * (x2 - x1) - Cx;
    const Ax = 1 - Cx - Bx;

    const Cy = 3 * y1;
    const By = 3 * (y2 - y1) - Cy;
    const Ay = 1 - Cy - By;

    const bezierX = function(t) {
        return t * (Cx + t * (Bx + t * Ax));
    };

    const bezierY = function(t) {
        return t * (Cy + t * (By + t * Ay));
    };

    const derivativeX = function(t) {
        return Cx + t * (2 * Bx + t * 3 * Ax);
    };

    const findXFor = function(t) {
        let x = t;
        let i = 0;
        let z;

        while(i < 14) {
            z = bezierX(x) - t;
            if(Math.abs(z) < 1e-3) {
                break;
            }

            x = x - z / derivativeX(x);
            i++;
        }

        return x;
    };

    return function(t) {
        return bezierY(findXFor(t));
    };
};

let easing = {};
export const convertTransitionTimingFuncToEasing = function(cssTransitionEasing) {
    cssTransitionEasing = TransitionTimingFuncMap[cssTransitionEasing] || cssTransitionEasing;

    let coeffs = cssTransitionEasing.match(CSS_TRANSITION_EASING_REGEX);
    let forceName;

    if(!coeffs) {
        forceName = 'linear';
        coeffs = TransitionTimingFuncMap[forceName].match(CSS_TRANSITION_EASING_REGEX);
    }

    coeffs = coeffs.slice(1, 5);
    for(let i = 0; i < coeffs.length; i++) {
        coeffs[i] = parseFloat(coeffs[i]);
    }

    const easingName = forceName || 'cubicbezier_' + coeffs.join('_').replace(/\./g, 'p');

    if(!isFunction(easing[easingName])) {
        easing[easingName] = function(x, t, b, c, d) {
            return c * polynomBezier(coeffs[0], coeffs[1], coeffs[2], coeffs[3])(t / d) + b;
        };
    }

    return easingName;
};

export function setEasing(value) {
    easing = value;
}

export function getEasing(name) {
    return easing[name];
}
