import {
    Device,
} from '../devices';

import {
    DeepPartial,
} from '../index';

/** @public */
export type DefaultsRule<T> = {
    device: ((device: Device) => boolean) | Device | Device[];
    options: DeepPartial<T>;
};
