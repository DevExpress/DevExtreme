import { parseToken } from '../../__internal/core/license/license_validation';
import errors from '../errors';

let isLicenseVerified = false;

export function verifyLicense(licenseToken, version) {
    if(isLicenseVerified) {
        return;
    }
    isLicenseVerified = true;

    let warning;

    if(licenseToken) {
        const license = parseToken(licenseToken);

        if(license.kind === 'corrupted') {
            warning = 'W0021';
        } else {
            const [major, minor] = version.split('.').map(Number);

            if(major * 10 + minor > license.payload.maxVersionAllowed) {
                warning = 'W0020';
            }
        }
    } else {
        warning = 'W0019';
    }

    if(warning) {
        errors.log(warning);
    }
}

///#DEBUG
export function setLicenseCheckSkipCondition(value = true) {
    isLicenseVerified = value;
}

export function getLicenseCheckSkipCondition() {
    return isLicenseVerified;
}
///#ENDDEBUG
