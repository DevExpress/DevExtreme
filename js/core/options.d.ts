import {
    Device,
} from './devices';

import {
    DeepPartial,
} from './index';

/**
 * @docid
 * @public
 */
export type DefaultOptionsRule<T> = {
    device?: Device | Device[] | ((device: Device) => boolean);
    options: DeepPartial<T>;
};
