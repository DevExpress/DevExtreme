import config from '@js/core/config';
import errors from '@js/core/errors';
import { fullVersion } from '@js/core/version';

import type { Version } from '../../utils/version';
import {
  assertedVersionsCompatible,
  getPreviousMajorVersion,
  parseVersion,
} from '../../utils/version';
import { base64ToBytes } from './byte_utils';
import { INTERNAL_USAGE_ID, PUBLIC_KEY } from './key';
import { pad } from './pkcs1';
import { compareSignatures } from './rsa_bigint';
import { sha1 } from './sha1';
import type { CustomTrialPanelStyles } from './trial_panel';
import { registerCustomComponents, renderTrialPanel } from './trial_panel';
import type {
  License,
  LicenseCheckParams,
  Token,
} from './types';
import { TokenKind } from './types';

interface Payload extends Partial<License> {
  readonly format?: number;
  readonly internalUsageId?: string;
}

const FORMAT = 1;
const RTM_MIN_PATCH_VERSION = 3;
const KEY_SPLITTER = '.';

const BUY_NOW_LINK = 'https://go.devexpress.com/Licensing_Installer_Watermark_DevExtremeJQuery.aspx';

const GENERAL_ERROR: Token = { kind: TokenKind.corrupted, error: 'general' };
const VERIFICATION_ERROR: Token = { kind: TokenKind.corrupted, error: 'verification' };
const DECODING_ERROR: Token = { kind: TokenKind.corrupted, error: 'decoding' };
const DESERIALIZATION_ERROR: Token = { kind: TokenKind.corrupted, error: 'deserialization' };
const PAYLOAD_ERROR: Token = { kind: TokenKind.corrupted, error: 'payload' };
const VERSION_ERROR: Token = { kind: TokenKind.corrupted, error: 'version' };

let validationPerformed = false;

// verifies RSASSA-PKCS1-v1.5 signature
function verifySignature({ text, signature: encodedSignature }: {
  text: string;
  signature: string;
}): boolean {
  return compareSignatures({
    key: PUBLIC_KEY,
    signature: base64ToBytes(encodedSignature),
    actual: pad(sha1(text)),
  });
}

export function parseLicenseKey(encodedKey: string | undefined): Token {
  if (encodedKey === undefined) {
    return GENERAL_ERROR;
  }

  const parts = encodedKey.split(KEY_SPLITTER);

  if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
    return GENERAL_ERROR;
  }

  if (!verifySignature({ text: parts[0], signature: parts[1] })) {
    return VERIFICATION_ERROR;
  }

  let decodedPayload = '';
  try {
    decodedPayload = atob(parts[0]);
  } catch {
    return DECODING_ERROR;
  }

  let payload: Payload = {};
  try {
    payload = JSON.parse(decodedPayload);
  } catch {
    return DESERIALIZATION_ERROR;
  }

  const {
    customerId, maxVersionAllowed, format, internalUsageId, ...rest
  } = payload;

  if (internalUsageId !== undefined) {
    return {
      kind: TokenKind.internal,
      internalUsageId,
    };
  }

  if (customerId === undefined || maxVersionAllowed === undefined || format === undefined) {
    return PAYLOAD_ERROR;
  }

  if (format !== FORMAT) {
    return VERSION_ERROR;
  }

  return {
    kind: TokenKind.verified,
    payload: {
      customerId,
      maxVersionAllowed,
      ...rest,
    },
  };
}

function isPreview(patch: number): boolean {
  return isNaN(patch) || patch < RTM_MIN_PATCH_VERSION;
}

function getLicenseCheckParams({
  licenseKey,
  version,
}: {
  licenseKey: string | undefined;
  version: Version;
}): LicenseCheckParams {
  let preview = false;

  try {
    preview = isPreview(version.patch);

    const { major, minor } = preview ? getPreviousMajorVersion(version) : version;

    if (!licenseKey) {
      return { preview, error: 'W0019' };
    }

    const license = parseLicenseKey(licenseKey);

    if (license.kind === TokenKind.corrupted) {
      return { preview, error: 'W0021' };
    }

    if (license.kind === TokenKind.internal) {
      return { preview, internal: true, error: license.internalUsageId === INTERNAL_USAGE_ID ? undefined : 'W0020' };
    }

    if (!(major && minor)) {
      return { preview, error: 'W0021' };
    }

    if (major * 10 + minor > license.payload.maxVersionAllowed) {
      return { preview, error: 'W0020' };
    }

    return { preview, error: undefined };
  } catch {
    return { preview, error: 'W0021' };
  }
}

export function showTrialPanel(
  buyNowUrl: string,
  version: string,
  customStyles?: CustomTrialPanelStyles,
): void {
  if (typeof customElements !== 'undefined') {
    renderTrialPanel(buyNowUrl, version, customStyles);
  }
}

export function registerTrialPanelComponents(customStyles?: CustomTrialPanelStyles): void {
  if (typeof customElements !== 'undefined') {
    registerCustomComponents(customStyles);
  }
}

export function validateLicense(licenseKey: string, versionStr: string = fullVersion): void {
  if (validationPerformed) {
    return;
  }
  validationPerformed = true;

  const version = parseVersion(versionStr);

  const versionsCompatible = assertedVersionsCompatible(version);

  const { internal, error } = getLicenseCheckParams({
    licenseKey,
    version,
  });

  if (!versionsCompatible && internal) {
    return;
  }

  if (error && !internal) {
    showTrialPanel(config().buyNowLink ?? BUY_NOW_LINK, fullVersion);
  }

  const preview = isPreview(version.patch);

  if (error) {
    errors.log(preview ? 'W0022' : error);
    return;
  }

  if (preview && !internal) {
    errors.log('W0022');
  }
}

export function peekValidationPerformed(): boolean {
  return validationPerformed;
}

export function setLicenseCheckSkipCondition(value = true): void {
  /// #DEBUG
  validationPerformed = value;
  /// #ENDDEBUG
}

// NOTE: We need this default export
// to allow QUnit mock the validateLicense function
export default {
  validateLicense,
};
