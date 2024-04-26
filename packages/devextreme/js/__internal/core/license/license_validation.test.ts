import errors from '@js/core/errors';

import {
  parseLicenseKey,
  setLicenseCheckSkipCondition,
  validateLicense,
} from './license_validation';
import * as trialPanel from './trial_panel';

jest.mock('./key', () => ({
  PUBLIC_KEY: {
    e: 65537,
    n: new Uint8Array([
      202, 208, 20, 244, 235, 89, 121, 253, 219, 161, 162, 26, 166, 22, 65, 81, 176, 0, 101, 246,
      34, 101, 128, 51, 224, 52, 194, 227, 113, 10, 4, 96, 201, 33, 171, 251, 204, 57, 164, 28, 89,
      249, 191, 46, 170, 74, 37, 125, 216, 95, 240, 125, 69, 31, 134, 79, 101, 62, 25, 30, 162, 31,
      206, 104, 92, 42, 35, 164, 93, 97, 197, 198, 239, 225, 249, 146, 119, 88, 20, 76, 219, 218,
      113, 0, 29, 246, 132, 116, 37, 252, 113, 87, 200, 99, 171, 146, 136, 182, 216, 226, 97, 67,
      85, 126, 103, 117, 236, 49, 60, 32, 109, 91, 139, 166, 1, 152, 228, 36, 182, 167, 19, 106,
      72, 62, 186, 243, 199, 73,
    ]),
  },
  INTERNAL_USAGE_ID: 'aYC7EHibp0yxtXTihJERkA',
}));

describe('license token', () => {
  it.each([
    {
      token: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.DiDceRbil4IzXl5av7pNkKieyqHHhRf+CM477zDu4N9fyrhkQsjRourYvgVfkbSm+EQplkXhlMBc3s8Vm9n+VtPaMbeWXis92cdW/6HiT+Dm54xw5vZ5POGunKRrNYUzd9zTbYcz0bYA/dc/mHFeUdXA0UlKcx1uMaXmtJrkK74=',
      payload: {
        customerId: 'b1140b46-fde1-41bd-a280-4db9f8e7d9bd',
        maxVersionAllowed: 231,
      },
    }, {
      token: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjYxMjFmMDIyLTFjMTItNDNjZC04YWE0LTkwNzJkNDU4YjYxNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMyCn0=.RENyZ3Ga5rCB7/XNKYbk2Ffv1n9bUexYNhyOlqcAD02YVnPw6XyQcN+ZORScKDU9gOInJ4o7vPxkgh10KvMZNn+FuBK8UcUR7kchk7z0CHGuOcIn2jD5X2hG6SYJ0UCBG/JDG35AL09T7Uv/pGj4PolRsANxtuMpoqmvX2D2vkU=',
      payload: {
        customerId: '6121f022-1c12-43cd-8aa4-9072d458b614',
        maxVersionAllowed: 232,
      },
    }, {
      token: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjM3Yjg4ZjBmLWQ0MmMtNDJiZS05YjhkLTU1ZGMwYzUzYzAxZiIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjIxCn0=.NVsilC5uWlD5QGS6bocLMlsVVK0VpZXYwU2DstUiLRpEI79/onuR8dGWasCLBo4PORDHPkNA/Ej8XeCHzJ0EkXRRZ7E2LrP/xlEfHRXTruvW4IEbZt3LiwJBt6/isLz+wzXtYtjV7tpE07/Y0TFoy+mWpHoU11GVtwKh6weRxkg=',
      payload: {
        customerId: '37b88f0f-d42c-42be-9b8d-55dc0c53c01f',
        maxVersionAllowed: 221,
      },
    },
  ])('verifies and decodes payload [%#]', ({ token, payload: expected }) => {
    const license = parseLicenseKey(token);

    expect(license.kind).toBe('verified');
    if (license.kind === 'verified') {
      expect(license.payload).toEqual(expected);
    }
  });

  it('verifies and decodes payload with extra fields', () => {
    const license = parseLicenseKey('ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxLAogICJleHRyYUZpZWxkIjogIkE5OTk5OTkiCn0=.fqm8mVhQ9+x/R7E7MVwUP3nJaYL3KldhYffVXdDqPVyHIQi66Z2XZ2RdygH4J0jvUpjhZ6yzmGPV0J0WoPbKyhtnY4ELhove/IAwpn8WGfRw3wLSxfR+RWuaKcw2yvlUA1JqrQUrIrN23UwNQodbJ/hGm30s0h1bf8zCvQ/d31k=');

    expect(license.kind).toBe('verified');
    if (license.kind === 'verified') {
      expect(license.payload).toEqual({
        customerId: 'b1140b46-fde1-41bd-a280-4db9f8e7d9bd',
        maxVersionAllowed: 231,
        extraField: 'A999999',
      });
    }
  });

  it('fails if payload is not verified', () => {
    const license = parseLicenseKey('ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.NVsilC5uWlD5QGS6bocLMlsVVK0VpZXYwU2DstUiLRpEI79/onuR8dGWasCLBo4PORDHPkNA/Ej8XeCHzJ0EkXRRZ7E2LrP/xlEfHRXTruvW4IEbZt3LiwJBt6/isLz+wzXtYtjV7tpE07/Y0TFoy+mWpHoU11GVtwKh6weRxkg=');

    expect(license.kind).toBe('corrupted');

    if (license.kind === 'corrupted') {
      expect(license.error).toBe('verification');
    }
  });

  it('fails if payload is invalid JSON', () => {
    const license = parseLicenseKey('YWJj.vjx6wAI9jVkHJAnKcsuYNZ5UvCq3UhypQ+0f+kZ37/Qc1uj4BM6//Kfi4SVsXGOaOTFYWgzesROnHCp3jZRqphJwal4yXHD1sGFi6FEdB4MgdgNZvsZSnxNWLs/7s07CzuHLTpJrAG7sTdHVkQWZNnSCKjzV7909c/Stl9+hkLo=');

    expect(license.kind).toBe('corrupted');

    if (license.kind === 'corrupted') {
      expect(license.error).toBe('deserialization');
    }
  });

  it('fails if payload is invalid Base64', () => {
    const license = parseLicenseKey('ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjM3Yjg4ZjBmLWQ0MmMtNDJiZS05YjhkLTU1ZGMwYzUzYzAxZiIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjIxCn0-.EnP/RDKg0eSyaPU1eDUFll1lqOdYbhN3u73LhN1op8vjNwA0P1vKiT1DfQRmXudlleGWgDkLA2OmJYUER8j7I3LSFf3hLkBAoWoBErgveTb2zkbz8P1i9lE+XmzIXeYHyZBYUt0IPkNfajF9zzbSDDin1CvW7pnADi0vIeZ5ICQ=');

    expect(license.kind).toBe('corrupted');

    if (license.kind === 'corrupted') {
      expect(license.error).toBe('decoding');
    }
  });

  it.each([
    'ewogICJmb3JtYXQiOiAxLAogICJtYXhWZXJzaW9uQWxsb3dlZCI6IDIzMQp9.WH30cajUFcKqw/fwt4jITM/5tzVwPpbdbezhhdBi5oeOvU06zKY0J4M8gQy8GQ++RPYVCAo2md6vI9D80FD2CC4w+hpQLJNJJgNUHYPrgG6CX1yAB3M+NKHsPP9S71bXAgwvignb5uPo0R5emQzr4RKDhWQMKtgqEcRe+yme2mU=',
    'ewogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.ok32DBaAgf3ijLmNQb+A0kUV2AiSivqvZJADdF607qqlAaduAVnotJtgdwm/Ib3MErfaGrDohCYoFMnKQevkRxFkA7tK3kOBnTZPUnZY0r3wyulMQmr4Qo+Sjf/fyXs4IYpGsC7/uJjgrCos8uzBegfmgfM93XSt6pKl9+c5xvc=',
    'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIKfQ==.resgTqmazrorRNw7mmtV31XQnmTSw0uLEArsmpzCjWMQJLocBfAjpFvKBf+SAG9q+1iOSFySj64Uv2xBVqHnyeNVBRbouOKOnAB8RpkKvN4sc5SDc8JAG5TkwPVSzK/VLBpQxpqbxlcrRfHwz9gXqQoPt4/ZVATn285iw3DW0CU=',
  ])('fails if payload misses required fields [%#]', (token) => {
    const license = parseLicenseKey(token);

    expect(license.kind).toBe('corrupted');

    if (license.kind === 'corrupted') {
      expect(license.error).toBe('payload');
    }
  });

  it('fails if payload has unsupported version', () => {
    const license = parseLicenseKey('ewogICJmb3JtYXQiOiAyLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.tTBymZMROsYyMiP6ldXFqGurbzqjhSQIu/pjyEUJA3v/57VgToomYl7FVzBj1asgHpadvysyTUiX3nFvPxbp166L3+LB3Jybw9ueMnwePu5vQOO0krqKLBqRq+TqHKn7k76uYRbkCIo5UajNfzetHhlkin3dJf3x2K/fcwbPW5A=');

    expect(license.kind).toBe('corrupted');

    if (license.kind === 'corrupted') {
      expect(license.error).toBe('version');
    }
  });

  it.each([
    '', '.', 'a', 'a.', '.a', '.a.', '.a.', '.a.b', 'a.b.', '.a.b.',
  ])('is not parsed from invalid input [%#]', (invalidInput) => {
    const license = parseLicenseKey(invalidInput);

    expect(license.kind).toBe('corrupted');

    if (license.kind === 'corrupted') {
      expect(license.error).toBe('general');
    }
  });
});

describe('license check', () => {
  const TOKEN_23_1 = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.DiDceRbil4IzXl5av7pNkKieyqHHhRf+CM477zDu4N9fyrhkQsjRourYvgVfkbSm+EQplkXhlMBc3s8Vm9n+VtPaMbeWXis92cdW/6HiT+Dm54xw5vZ5POGunKRrNYUzd9zTbYcz0bYA/dc/mHFeUdXA0UlKcx1uMaXmtJrkK74=';
  const TOKEN_23_2 = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjYxMjFmMDIyLTFjMTItNDNjZC04YWE0LTkwNzJkNDU4YjYxNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMyCn0=.RENyZ3Ga5rCB7/XNKYbk2Ffv1n9bUexYNhyOlqcAD02YVnPw6XyQcN+ZORScKDU9gOInJ4o7vPxkgh10KvMZNn+FuBK8UcUR7kchk7z0CHGuOcIn2jD5X2hG6SYJ0UCBG/JDG35AL09T7Uv/pGj4PolRsANxtuMpoqmvX2D2vkU=';
  const TOKEN_UNVERIFIED = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.NVsilC5uWlD5QGS6bocLMlsVVK0VpZXYwU2DstUiLRpEI79/onuR8dGWasCLBo4PORDHPkNA/Ej8XeCHzJ0EkXRRZ7E2LrP/xlEfHRXTruvW4IEbZt3LiwJBt6/isLz+wzXtYtjV7tpE07/Y0TFoy+mWpHoU11GVtwKh6weRxkg=';
  const TOKEN_INVALID_JSON = 'YWJj.vjx6wAI9jVkHJAnKcsuYNZ5UvCq3UhypQ+0f+kZ37/Qc1uj4BM6//Kfi4SVsXGOaOTFYWgzesROnHCp3jZRqphJwal4yXHD1sGFi6FEdB4MgdgNZvsZSnxNWLs/7s07CzuHLTpJrAG7sTdHVkQWZNnSCKjzV7909c/Stl9+hkLo=';
  const TOKEN_INVALID_BASE64 = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjM3Yjg4ZjBmLWQ0MmMtNDJiZS05YjhkLTU1ZGMwYzUzYzAxZiIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjIxCn0-.EnP/RDKg0eSyaPU1eDUFll1lqOdYbhN3u73LhN1op8vjNwA0P1vKiT1DfQRmXudlleGWgDkLA2OmJYUER8j7I3LSFf3hLkBAoWoBErgveTb2zkbz8P1i9lE+XmzIXeYHyZBYUt0IPkNfajF9zzbSDDin1CvW7pnADi0vIeZ5ICQ=';
  const TOKEN_MISSING_FIELD_1 = 'ewogICJmb3JtYXQiOiAxLAogICJtYXhWZXJzaW9uQWxsb3dlZCI6IDIzMQp9.WH30cajUFcKqw/fwt4jITM/5tzVwPpbdbezhhdBi5oeOvU06zKY0J4M8gQy8GQ++RPYVCAo2md6vI9D80FD2CC4w+hpQLJNJJgNUHYPrgG6CX1yAB3M+NKHsPP9S71bXAgwvignb5uPo0R5emQzr4RKDhWQMKtgqEcRe+yme2mU=';
  const TOKEN_MISSING_FIELD_2 = 'ewogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.ok32DBaAgf3ijLmNQb+A0kUV2AiSivqvZJADdF607qqlAaduAVnotJtgdwm/Ib3MErfaGrDohCYoFMnKQevkRxFkA7tK3kOBnTZPUnZY0r3wyulMQmr4Qo+Sjf/fyXs4IYpGsC7/uJjgrCos8uzBegfmgfM93XSt6pKl9+c5xvc=';
  const TOKEN_MISSING_FIELD_3 = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIKfQ==.resgTqmazrorRNw7mmtV31XQnmTSw0uLEArsmpzCjWMQJLocBfAjpFvKBf+SAG9q+1iOSFySj64Uv2xBVqHnyeNVBRbouOKOnAB8RpkKvN4sc5SDc8JAG5TkwPVSzK/VLBpQxpqbxlcrRfHwz9gXqQoPt4/ZVATn285iw3DW0CU=';
  const TOKEN_UNSUPPORTED_VERSION = 'ewogICJmb3JtYXQiOiAyLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.tTBymZMROsYyMiP6ldXFqGurbzqjhSQIu/pjyEUJA3v/57VgToomYl7FVzBj1asgHpadvysyTUiX3nFvPxbp166L3+LB3Jybw9ueMnwePu5vQOO0krqKLBqRq+TqHKn7k76uYRbkCIo5UajNfzetHhlkin3dJf3x2K/fcwbPW5A=';

  let trialPanelSpy: jest.SpyInstance<unknown> | null = null;

  beforeEach(() => {
    jest.spyOn(errors, 'log').mockImplementation(() => {});
    trialPanelSpy = jest.spyOn(trialPanel, 'showTrialPanel');
    setLicenseCheckSkipCondition(false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each([
    { token: '', version: '1.0.3' },
    { token: null, version: '1.0.4' },
    { token: undefined, version: '1.0.50' },
  ])('W0019 error should be logged if license is empty', ({ token, version }) => {
    validateLicense(token as string, version);
    expect(errors.log).toHaveBeenCalledTimes(1);
    expect(errors.log).toHaveBeenCalledWith('W0019');
  });

  test.each([
    { token: '', version: '1.0.3' },
    { token: null, version: '1.0.4' },
    { token: undefined, version: '1.0.50' },
    { token: '', version: '1.0.0' },
    { token: null, version: '1.2.4-preview' },
    { token: undefined, version: '1.2' },
  ])('trial panel should be displayed if license is empty, preview or not', ({ token, version }) => {
    validateLicense(token as string, version);
    expect(trialPanelSpy).toHaveBeenCalledTimes(1);
  });

  test.each([
    { token: '', version: '1.0' },
    { token: null, version: '1.0.' },
    { token: undefined, version: '1.0.0' },
    { token: TOKEN_23_1, version: '23.1.0' },
    { token: TOKEN_23_1, version: '12.3.1' },
    { token: TOKEN_23_2, version: '23.1.2' },
    { token: TOKEN_23_2, version: '23.2.3-preview' },
    { token: TOKEN_23_1, version: '23.2.0' },
    { token: TOKEN_23_2, version: '42.4.3-alfa' },
    { token: TOKEN_UNVERIFIED, version: '1.2.0' },
    { token: TOKEN_INVALID_JSON, version: '1.2.1' },
    { token: TOKEN_INVALID_BASE64, version: '1.2.2' },
    { token: TOKEN_MISSING_FIELD_1, version: '1.2' },
    { token: TOKEN_MISSING_FIELD_2, version: '1.2.4-preview' },
    { token: TOKEN_MISSING_FIELD_3, version: '1.2.' },
    { token: TOKEN_UNSUPPORTED_VERSION, version: '1.2.abc' },
    { token: 'Another', version: '1.2.0' },
    { token: 'str@nge', version: undefined },
    { token: 'in.put', version: undefined },
    { token: '3.2.1', version: '1.2.1' },
    { token: TOKEN_23_1, version: '123' },
  ])('W0022 error should be logged if version is preview [%#]', ({ token, version }) => {
    validateLicense(token as string, version as string);
    expect(errors.log).toHaveBeenCalledWith('W0022');
  });

  test.each([
    { token: TOKEN_23_1, version: '23.1.3' },
    { token: TOKEN_23_1, version: '12.3.4' },
    { token: TOKEN_23_2, version: '23.1.5' },
    { token: TOKEN_23_2, version: '23.2.6' },
  ])('No messages should be logged if license is valid', ({ token, version }) => {
    validateLicense(token, version);
    expect(errors.log).not.toHaveBeenCalled();
  });

  test.each([
    { token: TOKEN_23_1, version: '23.1.3' },
    { token: TOKEN_23_1, version: '12.3.4' },
    { token: TOKEN_23_2, version: '23.1.5' },
    { token: TOKEN_23_2, version: '23.2.6' },
  ])('Trial panel should not be displayed if license is valid', ({ token, version }) => {
    validateLicense(token, version);
    expect(trialPanelSpy).not.toHaveBeenCalled();
  });

  test('Message should be logged only once', () => {
    validateLicense('', '1.0');
    validateLicense('', '1.0');
    validateLicense('', '1.0');

    expect(errors.log).toHaveBeenCalledTimes(1);
  });

  test('No messages should be logged if setLicenseCheckSkipCondition() used', () => {
    setLicenseCheckSkipCondition();
    validateLicense('', '1.0');
    expect(errors.log).not.toHaveBeenCalled();
  });

  test.each([
    { token: TOKEN_23_1, version: '23.2.3' },
    { token: TOKEN_23_2, version: '42.4.5' },
  ])('W0020 error should be logged if license is outdated', ({ token, version }) => {
    validateLicense(token, version);
    expect(errors.log).toHaveBeenCalledTimes(1);
    expect(errors.log).toHaveBeenCalledWith('W0020');
  });

  test.each([
    { token: TOKEN_23_1, version: '23.2.3' },
    { token: TOKEN_23_2, version: '42.4.5' },
    { token: TOKEN_23_1, version: '23.3.0' },
    { token: TOKEN_23_2, version: '42.4.0' },
  ])('Trial panel should be displayed if license is outdated (>=1 major for RTM, >=2 major for preview)', ({ token, version }) => {
    validateLicense(token, version);
    expect(trialPanelSpy).toHaveBeenCalledTimes(1);
  });

  test.each([
    { token: TOKEN_23_1, version: '23.2.0' },
    { token: TOKEN_23_1, version: '23.2.3-alpha' },
    { token: TOKEN_23_2, version: '24.1.0' },
    { token: TOKEN_23_2, version: '24.1.abc' },
  ])('Trial panel should not be displayed in previews if the license is for the previous RTM', ({ token, version }) => {
    validateLicense(token, version);
    expect(trialPanelSpy).not.toHaveBeenCalled();
  });

  test.each([
    { token: TOKEN_UNVERIFIED, version: '1.2.3' },
    { token: TOKEN_INVALID_JSON, version: '1.2.3' },
    { token: TOKEN_INVALID_BASE64, version: '1.2.3' },
    { token: TOKEN_MISSING_FIELD_1, version: '1.2.3' },
    { token: TOKEN_MISSING_FIELD_2, version: '1.2.3' },
    { token: TOKEN_MISSING_FIELD_3, version: '1.2.3' },
    { token: TOKEN_UNSUPPORTED_VERSION, version: '1.2.3' },
    { token: 'str@nge in.put', version: '1.2.3' },
    { token: '3.2.1', version: '1.2.3' },
  ])('W0021 error should be logged if license is corrupted/invalid [%#]', ({ token, version }) => {
    validateLicense(token, version);
    expect(errors.log).toHaveBeenCalledWith('W0021');
  });

  test.each([
    { token: TOKEN_UNVERIFIED, version: '1.2.3' },
    { token: TOKEN_INVALID_JSON, version: '1.2.3' },
    { token: TOKEN_INVALID_BASE64, version: '1.2.3' },
    { token: TOKEN_MISSING_FIELD_1, version: '1.2.3' },
    { token: TOKEN_MISSING_FIELD_2, version: '1.2.3' },
    { token: TOKEN_MISSING_FIELD_3, version: '1.2.3' },
    { token: TOKEN_UNSUPPORTED_VERSION, version: '1.2.3' },
    { token: 'str@nge in.put', version: '1.2.3' },
    { token: '3.2.1', version: '1.2.3' },
    { token: TOKEN_UNVERIFIED, version: '1.2.0' },
    { token: TOKEN_INVALID_JSON, version: '1.2.0' },
    { token: TOKEN_INVALID_BASE64, version: '1.2.0' },
    { token: TOKEN_MISSING_FIELD_1, version: '1.2.0' },
    { token: TOKEN_MISSING_FIELD_2, version: '1.2.0' },
    { token: TOKEN_MISSING_FIELD_3, version: '1.2.0' },
    { token: TOKEN_UNSUPPORTED_VERSION, version: '1.2.0' },
    { token: 'str@nge in.put', version: '1.2.0' },
    { token: '3.2.1', version: '1.2.0' },
  ])('trial panel should be displayed if license is corrupted/invalid, preview or not', ({ token, version }) => {
    validateLicense(token, version);
    expect(trialPanelSpy).toHaveBeenCalledTimes(1);
  });
});

describe('internal license check', () => {
  let trialPanelSpy: jest.SpyInstance<unknown> | null = null;

  beforeEach(() => {
    jest.spyOn(errors, 'log').mockImplementation(() => {});
    trialPanelSpy = jest.spyOn(trialPanel, 'showTrialPanel');
    setLicenseCheckSkipCondition(false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('valid internal usage token (correct)', () => {
    const token = 'ewogICJpbnRlcm5hbFVzYWdlSWQiOiAiYVlDN0VIaWJwMHl4dFhUaWhKRVJrQSIsCiAgImZvcm1hdCI6IDEKfQ==.emWMjFDkBI2bvqc6R/hwh//2wE9YqS7yyTPSglqLBP7oPFMthW9tHNHsh1lG8MEuSKoi8TYOY+4R9GgvFi190f62iOy4iz8FenPXZodiv9hgDaovb2eIkwK4pilthOEAS9/JYhgTAentJ1f2+PlbjkTIqvYogk01GrRrd+WOtIA=';
    validateLicense(token, '1.2.3');
    expect(errors.log).not.toHaveBeenCalled();
    expect(trialPanelSpy).not.toHaveBeenCalled();
  });

  test('valid internal usage token (correct, pre-release)', () => {
    const token = 'ewogICJpbnRlcm5hbFVzYWdlSWQiOiAiYVlDN0VIaWJwMHl4dFhUaWhKRVJrQSIsCiAgImZvcm1hdCI6IDEKfQ==.emWMjFDkBI2bvqc6R/hwh//2wE9YqS7yyTPSglqLBP7oPFMthW9tHNHsh1lG8MEuSKoi8TYOY+4R9GgvFi190f62iOy4iz8FenPXZodiv9hgDaovb2eIkwK4pilthOEAS9/JYhgTAentJ1f2+PlbjkTIqvYogk01GrRrd+WOtIA=';
    validateLicense(token, '1.2.1');
    expect(errors.log).not.toHaveBeenCalled();
    expect(trialPanelSpy).not.toHaveBeenCalled();
  });

  test('internal usage token (incorrect)', () => {
    const token = 'ewogICJpbnRlcm5hbFVzYWdlSWQiOiAiUDdmNU5icU9WMDZYRFVpa3Q1bkRyQSIsCiAgImZvcm1hdCI6IDEKfQ==.ox52WAqudazQ0ZKdnJqvh/RmNNNX+IB9cmun97irvSeZK2JMf9sbBXC1YCrSZNIPBjQapyIV8Ctv9z2wzb3BkWy+R9CEh+ev7purq7Lk0ugpwDye6GaCzqlDg+58EHwPCNaasIuBiQC3ztvOItrGwWSu0aEFooiajk9uAWwzWeM=';
    validateLicense(token, '1.2.3');
    expect(errors.log).toHaveBeenCalledWith('W0020');
    expect(trialPanelSpy).not.toHaveBeenCalled();
  });

  test('internal usage token (incorrect, pre-release)', () => {
    const token = 'ewogICJpbnRlcm5hbFVzYWdlSWQiOiAiUDdmNU5icU9WMDZYRFVpa3Q1bkRyQSIsCiAgImZvcm1hdCI6IDEKfQ==.ox52WAqudazQ0ZKdnJqvh/RmNNNX+IB9cmun97irvSeZK2JMf9sbBXC1YCrSZNIPBjQapyIV8Ctv9z2wzb3BkWy+R9CEh+ev7purq7Lk0ugpwDye6GaCzqlDg+58EHwPCNaasIuBiQC3ztvOItrGwWSu0aEFooiajk9uAWwzWeM=';
    validateLicense(token, '1.2.1');
    expect(errors.log).toHaveBeenCalledWith('W0022');
    expect(trialPanelSpy).not.toHaveBeenCalled();
  });
});
