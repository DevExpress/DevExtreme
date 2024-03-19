import { assertType, toAssertion } from './consts';

// NOTE: better not to do this, e2e should test only public things, not internal
import type * as LicenseValidationModule from '../../packages/devextreme/js/__internal/core/license/license_validation';
import type * as LicenseValidationInternalModule from '../../packages/devextreme/js/__internal/core/license/license_validation_internal';

assertType<typeof LicenseValidationModule>(toAssertion<typeof LicenseValidationInternalModule>());
assertType<typeof LicenseValidationInternalModule>(toAssertion<typeof LicenseValidationModule>());
