"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.parseLicenseKey = parseLicenseKey;
exports.peekValidationPerformed = peekValidationPerformed;
exports.setLicenseCheckSkipCondition = setLicenseCheckSkipCondition;
exports.validateLicense = validateLicense;
// @ts-expect-error - only for internal usage
function parseLicenseKey(encodedKey) {}
function validateLicense(licenseKey, version) {}
// @ts-expect-error - only for internal usage
function peekValidationPerformed() {}
function setLicenseCheckSkipCondition() {}
var _default = exports.default = {
  validateLicense
};