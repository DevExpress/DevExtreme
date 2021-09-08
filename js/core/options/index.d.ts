import {
    Device,
} from '../devices';

import {
    DeepPartial,
} from '../index';

/** @public */
export type DefaultOptionsRule<T> = {
    device?: ((device: Device) => boolean) | Device | Device[];
    options: DeepPartial<T>;
};
