import { assertType, toAssertion } from './consts';

import type * as LicenseValidationModule from '../../js/__internal/core/license/license_validation';
import type * as LicenseValidationInternalModule from '../../js/__internal/core/license/license_validation_internal';

assertType<typeof LicenseValidationModule>(toAssertion<typeof LicenseValidationInternalModule>());
assertType<typeof LicenseValidationInternalModule>(toAssertion<typeof LicenseValidationModule>());
