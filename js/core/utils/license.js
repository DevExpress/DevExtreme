import config from '../config';
import { logger } from './console';

let checked = false;

export const checkLicense = function() {
    if(checked) {
        return;
    }
    // TODO
    const license = /* process.env.DX_LICENSE || */ config().license || '';
    if(license.length !== 10) {
        logger.warn('License not found or invalid!');
    }
    checked = true;
};
