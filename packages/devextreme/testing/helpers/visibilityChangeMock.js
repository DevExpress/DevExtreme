import * as visibilityChange from 'common/core/events/visibility_change';

import { spySeam, stubSeam } from './moduleSeam.js';

export function spyVisibilityEvent(name) {
    return spySeam(visibilityChange, name);
}

export function stubVisibilityEvent(name) {
    return stubSeam(visibilityChange, name);
}
