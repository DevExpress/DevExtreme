"use strict";

var _config = _interopRequireDefault(require("../../../core/config"));
var _errors = _interopRequireDefault(require("../../../core/errors"));
var _m_z_index = require("../../ui/overlay/m_z_index");
var _version = require("../../utils/version");
var _license_validation = require("./license_validation");
var trialPanel = _interopRequireWildcard(require("./trial_panel.client"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
jest.mock('./key', () => ({
  PUBLIC_KEY: {
    e: 65537,
    n: new Uint8Array([202, 208, 20, 244, 235, 89, 121, 253, 219, 161, 162, 26, 166, 22, 65, 81, 176, 0, 101, 246, 34, 101, 128, 51, 224, 52, 194, 227, 113, 10, 4, 96, 201, 33, 171, 251, 204, 57, 164, 28, 89, 249, 191, 46, 170, 74, 37, 125, 216, 95, 240, 125, 69, 31, 134, 79, 101, 62, 25, 30, 162, 31, 206, 104, 92, 42, 35, 164, 93, 97, 197, 198, 239, 225, 249, 146, 119, 88, 20, 76, 219, 218, 113, 0, 29, 246, 132, 116, 37, 252, 113, 87, 200, 99, 171, 146, 136, 182, 216, 226, 97, 67, 85, 126, 103, 117, 236, 49, 60, 32, 109, 91, 139, 166, 1, 152, 228, 36, 182, 167, 19, 106, 72, 62, 186, 243, 199, 73])
  },
  INTERNAL_USAGE_ID: 'aYC7EHibp0yxtXTihJERkA'
}));
describe('license token', () => {
  it.each([{
    token: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.DiDceRbil4IzXl5av7pNkKieyqHHhRf+CM477zDu4N9fyrhkQsjRourYvgVfkbSm+EQplkXhlMBc3s8Vm9n+VtPaMbeWXis92cdW/6HiT+Dm54xw5vZ5POGunKRrNYUzd9zTbYcz0bYA/dc/mHFeUdXA0UlKcx1uMaXmtJrkK74=',
    payload: {
      customerId: 'b1140b46-fde1-41bd-a280-4db9f8e7d9bd',
      maxVersionAllowed: 231
    }
  }, {
    token: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjYxMjFmMDIyLTFjMTItNDNjZC04YWE0LTkwNzJkNDU4YjYxNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMyCn0=.RENyZ3Ga5rCB7/XNKYbk2Ffv1n9bUexYNhyOlqcAD02YVnPw6XyQcN+ZORScKDU9gOInJ4o7vPxkgh10KvMZNn+FuBK8UcUR7kchk7z0CHGuOcIn2jD5X2hG6SYJ0UCBG/JDG35AL09T7Uv/pGj4PolRsANxtuMpoqmvX2D2vkU=',
    payload: {
      customerId: '6121f022-1c12-43cd-8aa4-9072d458b614',
      maxVersionAllowed: 232
    }
  }, {
    token: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjM3Yjg4ZjBmLWQ0MmMtNDJiZS05YjhkLTU1ZGMwYzUzYzAxZiIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjIxCn0=.NVsilC5uWlD5QGS6bocLMlsVVK0VpZXYwU2DstUiLRpEI79/onuR8dGWasCLBo4PORDHPkNA/Ej8XeCHzJ0EkXRRZ7E2LrP/xlEfHRXTruvW4IEbZt3LiwJBt6/isLz+wzXtYtjV7tpE07/Y0TFoy+mWpHoU11GVtwKh6weRxkg=',
    payload: {
      customerId: '37b88f0f-d42c-42be-9b8d-55dc0c53c01f',
      maxVersionAllowed: 221
    }
  }])('verifies and decodes payload [%#]', _ref => {
    let {
      token,
      payload: expected
    } = _ref;
    const license = (0, _license_validation.parseLicenseKey)(token);
    expect(license.kind).toBe('verified');
    if (license.kind === 'verified') {
      expect(license.payload).toEqual(expected);
    }
  });
  it('verifies and decodes payload with extra fields', () => {
    const license = (0, _license_validation.parseLicenseKey)('ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxLAogICJleHRyYUZpZWxkIjogIkE5OTk5OTkiCn0=.fqm8mVhQ9+x/R7E7MVwUP3nJaYL3KldhYffVXdDqPVyHIQi66Z2XZ2RdygH4J0jvUpjhZ6yzmGPV0J0WoPbKyhtnY4ELhove/IAwpn8WGfRw3wLSxfR+RWuaKcw2yvlUA1JqrQUrIrN23UwNQodbJ/hGm30s0h1bf8zCvQ/d31k=');
    expect(license.kind).toBe('verified');
    if (license.kind === 'verified') {
      expect(license.payload).toEqual({
        customerId: 'b1140b46-fde1-41bd-a280-4db9f8e7d9bd',
        maxVersionAllowed: 231,
        extraField: 'A999999'
      });
    }
  });
  it('fails if payload is not verified', () => {
    const license = (0, _license_validation.parseLicenseKey)('ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.NVsilC5uWlD5QGS6bocLMlsVVK0VpZXYwU2DstUiLRpEI79/onuR8dGWasCLBo4PORDHPkNA/Ej8XeCHzJ0EkXRRZ7E2LrP/xlEfHRXTruvW4IEbZt3LiwJBt6/isLz+wzXtYtjV7tpE07/Y0TFoy+mWpHoU11GVtwKh6weRxkg=');
    expect(license.kind).toBe('corrupted');
    if (license.kind === 'corrupted') {
      expect(license.error).toBe('verification');
    }
  });
  it('fails if payload is invalid JSON', () => {
    const license = (0, _license_validation.parseLicenseKey)('YWJj.vjx6wAI9jVkHJAnKcsuYNZ5UvCq3UhypQ+0f+kZ37/Qc1uj4BM6//Kfi4SVsXGOaOTFYWgzesROnHCp3jZRqphJwal4yXHD1sGFi6FEdB4MgdgNZvsZSnxNWLs/7s07CzuHLTpJrAG7sTdHVkQWZNnSCKjzV7909c/Stl9+hkLo=');
    expect(license.kind).toBe('corrupted');
    if (license.kind === 'corrupted') {
      expect(license.error).toBe('deserialization');
    }
  });
  it('fails if payload is invalid Base64', () => {
    const license = (0, _license_validation.parseLicenseKey)('ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjM3Yjg4ZjBmLWQ0MmMtNDJiZS05YjhkLTU1ZGMwYzUzYzAxZiIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjIxCn0-.EnP/RDKg0eSyaPU1eDUFll1lqOdYbhN3u73LhN1op8vjNwA0P1vKiT1DfQRmXudlleGWgDkLA2OmJYUER8j7I3LSFf3hLkBAoWoBErgveTb2zkbz8P1i9lE+XmzIXeYHyZBYUt0IPkNfajF9zzbSDDin1CvW7pnADi0vIeZ5ICQ=');
    expect(license.kind).toBe('corrupted');
    if (license.kind === 'corrupted') {
      expect(license.error).toBe('decoding');
    }
  });
  it.each(['ewogICJmb3JtYXQiOiAxLAogICJtYXhWZXJzaW9uQWxsb3dlZCI6IDIzMQp9.WH30cajUFcKqw/fwt4jITM/5tzVwPpbdbezhhdBi5oeOvU06zKY0J4M8gQy8GQ++RPYVCAo2md6vI9D80FD2CC4w+hpQLJNJJgNUHYPrgG6CX1yAB3M+NKHsPP9S71bXAgwvignb5uPo0R5emQzr4RKDhWQMKtgqEcRe+yme2mU=', 'ewogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.ok32DBaAgf3ijLmNQb+A0kUV2AiSivqvZJADdF607qqlAaduAVnotJtgdwm/Ib3MErfaGrDohCYoFMnKQevkRxFkA7tK3kOBnTZPUnZY0r3wyulMQmr4Qo+Sjf/fyXs4IYpGsC7/uJjgrCos8uzBegfmgfM93XSt6pKl9+c5xvc=', 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIKfQ==.resgTqmazrorRNw7mmtV31XQnmTSw0uLEArsmpzCjWMQJLocBfAjpFvKBf+SAG9q+1iOSFySj64Uv2xBVqHnyeNVBRbouOKOnAB8RpkKvN4sc5SDc8JAG5TkwPVSzK/VLBpQxpqbxlcrRfHwz9gXqQoPt4/ZVATn285iw3DW0CU='])('fails if payload misses required fields [%#]', token => {
    const license = (0, _license_validation.parseLicenseKey)(token);
    expect(license.kind).toBe('corrupted');
    if (license.kind === 'corrupted') {
      expect(license.error).toBe('payload');
    }
  });
  it('fails if payload has unsupported version', () => {
    const license = (0, _license_validation.parseLicenseKey)('ewogICJmb3JtYXQiOiAyLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.tTBymZMROsYyMiP6ldXFqGurbzqjhSQIu/pjyEUJA3v/57VgToomYl7FVzBj1asgHpadvysyTUiX3nFvPxbp166L3+LB3Jybw9ueMnwePu5vQOO0krqKLBqRq+TqHKn7k76uYRbkCIo5UajNfzetHhlkin3dJf3x2K/fcwbPW5A=');
    expect(license.kind).toBe('corrupted');
    if (license.kind === 'corrupted') {
      expect(license.error).toBe('version');
    }
  });
  it.each(['', '.', 'a', 'a.', '.a', '.a.', '.a.', '.a.b', 'a.b.', '.a.b.'])('is not parsed from invalid input [%#]', invalidInput => {
    const license = (0, _license_validation.parseLicenseKey)(invalidInput);
    expect(license.kind).toBe('corrupted');
    if (license.kind === 'corrupted') {
      expect(license.error).toBe('general');
    }
  });
});
describe('version mismatch', () => {
  const CORRECT_VERSION = '24.2.3';
  let errorsLogMock = null;
  beforeEach(() => {
    errorsLogMock = jest.spyOn(_errors.default, 'log').mockImplementation(() => {});
    (0, _license_validation.setLicenseCheckSkipCondition)(false);
  });
  afterEach(() => {
    jest.restoreAllMocks();
    (0, _version.clearAssertedVersions)();
  });
  test('Perform license check if versions match', () => {
    const token = 'ewogICJpbnRlcm5hbFVzYWdlSWQiOiAiUDdmNU5icU9WMDZYRFVpa3Q1bkRyQSIsCiAgImZvcm1hdCI6IDEKfQ==.ox52WAqudazQ0ZKdnJqvh/RmNNNX+IB9cmun97irvSeZK2JMf9sbBXC1YCrSZNIPBjQapyIV8Ctv9z2wzb3BkWy+R9CEh+ev7purq7Lk0ugpwDye6GaCzqlDg+58EHwPCNaasIuBiQC3ztvOItrGwWSu0aEFooiajk9uAWwzWeM=';
    (0, _version.assertDevExtremeVersion)('DevExpress.Product.A', CORRECT_VERSION);
    (0, _version.assertDevExtremeVersion)('DevExpress.Product.A', CORRECT_VERSION);
    (0, _version.assertDevExtremeVersion)('DevExpress.Product.B', CORRECT_VERSION);
    (0, _license_validation.validateLicense)(token, CORRECT_VERSION);
    expect(_errors.default.log).toHaveBeenCalledWith('W0020');
  });
  test('Perform version comparison if the license is okay', () => {
    var _errorsLogMock, _errorsLogMock2;
    const token = 'ewogICJpbnRlcm5hbFVzYWdlSWQiOiAiYVlDN0VIaWJwMHl4dFhUaWhKRVJrQSIsCiAgImZvcm1hdCI6IDEKfQ==.emWMjFDkBI2bvqc6R/hwh//2wE9YqS7yyTPSglqLBP7oPFMthW9tHNHsh1lG8MEuSKoi8TYOY+4R9GgvFi190f62iOy4iz8FenPXZodiv9hgDaovb2eIkwK4pilthOEAS9/JYhgTAentJ1f2+PlbjkTIqvYogk01GrRrd+WOtIA=';
    (0, _version.assertDevExtremeVersion)('DevExpress.Product.A', '1.2.3');
    (0, _version.assertDevExtremeVersion)('DevExpress.Product.B', '1.2.4');
    (0, _license_validation.validateLicense)(token, '1.2.3');
    expect((_errorsLogMock = errorsLogMock) === null || _errorsLogMock === void 0 ? void 0 : _errorsLogMock.mock.calls.length).toEqual(1);
    expect((_errorsLogMock2 = errorsLogMock) === null || _errorsLogMock2 === void 0 ? void 0 : _errorsLogMock2.mock.calls[0][0]).toEqual('W0023');
  });
  test.each([[[{
    name: 'A',
    version: '24.2.2'
  }]], [[{
    name: 'A',
    version: CORRECT_VERSION
  }, {
    name: 'B',
    version: '24.2.4'
  }]], [[{
    name: 'A',
    version: CORRECT_VERSION
  }, {
    name: 'A',
    version: '24.2.5'
  }, {
    name: 'B',
    version: CORRECT_VERSION
  }]], [[{
    name: 'A',
    version: '23.2.3'
  }]], [[{
    name: 'A',
    version: '24.3.3'
  }]], [[{
    name: 'A',
    version: '24.2'
  }]], [[{
    name: 'A',
    version: '.2'
  }]], [[{
    name: 'A',
    version: '24.2.a'
  }]], [[{
    name: 'A',
    version: 'a.b.c'
  }]], [[{
    name: 'A',
    version: `${CORRECT_VERSION}-beta`
  }]]])('Do not check license, fire version mismatch warning if a version does not match', reportedVersions => {
    var _errorsLogMock3, _errorsLogMock4;
    const token = 'ewogICJpbnRlcm5hbFVzYWdlSWQiOiAiUDdmNU5icU9WMDZYRFVpa3Q1bkRyQSIsCiAgImZvcm1hdCI6IDEKfQ==.ox52WAqudazQ0ZKdnJqvh/RmNNNX+IB9cmun97irvSeZK2JMf9sbBXC1YCrSZNIPBjQapyIV8Ctv9z2wzb3BkWy+R9CEh+ev7purq7Lk0ugpwDye6GaCzqlDg+58EHwPCNaasIuBiQC3ztvOItrGwWSu0aEFooiajk9uAWwzWeM=';
    reportedVersions.forEach(_ref2 => {
      let {
        name,
        version
      } = _ref2;
      (0, _version.assertDevExtremeVersion)(name, version);
    });
    (0, _license_validation.validateLicense)(token, CORRECT_VERSION);
    expect((_errorsLogMock3 = errorsLogMock) === null || _errorsLogMock3 === void 0 ? void 0 : _errorsLogMock3.mock.calls.length).toEqual(1);
    expect((_errorsLogMock4 = errorsLogMock) === null || _errorsLogMock4 === void 0 ? void 0 : _errorsLogMock4.mock.calls[0][0]).toEqual('W0023');
  });
  test.each([[[{
    name: 'A',
    version: '24.2.2'
  }], `devextreme: ${CORRECT_VERSION}\nA: 24.2.2`], [[{
    name: 'A',
    version: CORRECT_VERSION
  }, {
    name: 'A',
    version: '24.2.5'
  }, {
    name: 'B',
    version: CORRECT_VERSION
  }], `devextreme: ${CORRECT_VERSION}\nA: 24.2.5`], [[{
    name: 'A',
    version: '24.2.5'
  }, {
    name: 'A',
    version: '24.2.5'
  }, {
    name: 'B',
    version: CORRECT_VERSION
  }], `devextreme: ${CORRECT_VERSION}\nA: 24.2.5\nA: 24.2.5`], [[{
    name: 'A',
    version: CORRECT_VERSION
  }, {
    name: 'B',
    version: '24.2.5'
  }, {
    name: 'C',
    version: 'a.b.c'
  }, {
    name: 'D',
    version: 'NaN'
  }, {
    name: 'E',
    version: `${CORRECT_VERSION}-beta`
  }], `devextreme: ${CORRECT_VERSION}\nB: 24.2.5\nC: a.b.c\nD: NaN\nE: 24.2.3-beta`]])('Correct version list is generated', (reportedVersions, versionList) => {
    const token = 'ewogICJpbnRlcm5hbFVzYWdlSWQiOiAiUDdmNU5icU9WMDZYRFVpa3Q1bkRyQSIsCiAgImZvcm1hdCI6IDEKfQ==.ox52WAqudazQ0ZKdnJqvh/RmNNNX+IB9cmun97irvSeZK2JMf9sbBXC1YCrSZNIPBjQapyIV8Ctv9z2wzb3BkWy+R9CEh+ev7purq7Lk0ugpwDye6GaCzqlDg+58EHwPCNaasIuBiQC3ztvOItrGwWSu0aEFooiajk9uAWwzWeM=';
    reportedVersions.forEach(_ref3 => {
      let {
        name,
        version
      } = _ref3;
      (0, _version.assertDevExtremeVersion)(name, version);
    });
    (0, _license_validation.validateLicense)(token, CORRECT_VERSION);
    expect(_errors.default.log).toHaveBeenCalledWith('W0023', versionList);
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
  let trialPanelSpy = null;
  beforeEach(() => {
    jest.spyOn(_errors.default, 'log').mockImplementation(() => {});
    trialPanelSpy = jest.spyOn(trialPanel, 'renderTrialPanel');
    (0, _license_validation.setLicenseCheckSkipCondition)(false);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test.each([{
    token: '',
    version: '1.0.3'
  }, {
    token: null,
    version: '1.0.4'
  }, {
    token: undefined,
    version: '1.0.50'
  }])('W0019 error should be logged if license is empty', _ref4 => {
    let {
      token,
      version
    } = _ref4;
    (0, _license_validation.validateLicense)(token, version);
    expect(_errors.default.log).toHaveBeenCalledTimes(1);
    expect(_errors.default.log).toHaveBeenCalledWith('W0019');
  });
  test.each([{
    token: '',
    version: '1.0.3'
  }, {
    token: null,
    version: '1.0.4'
  }, {
    token: undefined,
    version: '1.0.50'
  }, {
    token: '',
    version: '1.0.0'
  }, {
    token: null,
    version: '1.2.4-preview'
  }, {
    token: undefined,
    version: '1.2'
  }])('trial panel should be displayed if license is empty, preview or not', _ref5 => {
    let {
      token,
      version
    } = _ref5;
    (0, _license_validation.validateLicense)(token, version);
    expect(trialPanelSpy).toHaveBeenCalledTimes(1);
  });
  test.each([{
    token: '',
    version: '1.0'
  }, {
    token: null,
    version: '1.0.'
  }, {
    token: undefined,
    version: '1.0.0'
  }, {
    token: TOKEN_23_1,
    version: '23.1.0'
  }, {
    token: TOKEN_23_1,
    version: '12.3.1'
  }, {
    token: TOKEN_23_2,
    version: '23.1.2'
  }, {
    token: TOKEN_23_2,
    version: '23.2.3-preview'
  }, {
    token: TOKEN_23_1,
    version: '23.2.0'
  }, {
    token: TOKEN_23_2,
    version: '42.4.3-alfa'
  }, {
    token: TOKEN_UNVERIFIED,
    version: '1.2.0'
  }, {
    token: TOKEN_INVALID_JSON,
    version: '1.2.1'
  }, {
    token: TOKEN_INVALID_BASE64,
    version: '1.2.2'
  }, {
    token: TOKEN_MISSING_FIELD_1,
    version: '1.2'
  }, {
    token: TOKEN_MISSING_FIELD_2,
    version: '1.2.4-preview'
  }, {
    token: TOKEN_MISSING_FIELD_3,
    version: '1.2.'
  }, {
    token: TOKEN_UNSUPPORTED_VERSION,
    version: '1.2.abc'
  }, {
    token: 'Another',
    version: '1.2.0'
  }, {
    token: '3.2.1',
    version: '1.2.1'
  }, {
    token: TOKEN_23_1,
    version: '123'
  }])('W0022 error should be logged if version is preview [%#]', _ref6 => {
    let {
      token,
      version
    } = _ref6;
    (0, _license_validation.validateLicense)(token, version);
    expect(_errors.default.log).toHaveBeenCalledWith('W0022');
  });
  test.each([{
    token: TOKEN_23_1,
    version: '23.1.3'
  }, {
    token: TOKEN_23_1,
    version: '12.3.4'
  }, {
    token: TOKEN_23_2,
    version: '23.1.5'
  }, {
    token: TOKEN_23_2,
    version: '23.2.6'
  }])('No messages should be logged if license is valid', _ref7 => {
    let {
      token,
      version
    } = _ref7;
    (0, _license_validation.validateLicense)(token, version);
    expect(_errors.default.log).not.toHaveBeenCalled();
  });
  test.each([{
    token: TOKEN_23_1,
    version: '23.1.3'
  }, {
    token: TOKEN_23_1,
    version: '12.3.4'
  }, {
    token: TOKEN_23_2,
    version: '23.1.5'
  }, {
    token: TOKEN_23_2,
    version: '23.2.6'
  }])('Trial panel should not be displayed if license is valid', _ref8 => {
    let {
      token,
      version
    } = _ref8;
    (0, _license_validation.validateLicense)(token, version);
    expect(trialPanelSpy).not.toHaveBeenCalled();
  });
  test('Trial panel "Buy Now" link must use the jQuery link if no config has been set', () => {
    var _trialPanelSpy;
    (0, _license_validation.validateLicense)('', '1.2');
    expect((_trialPanelSpy = trialPanelSpy) === null || _trialPanelSpy === void 0 ? void 0 : _trialPanelSpy.mock.calls[0][0]).toBe('https://go.devexpress.com/Licensing_Installer_Watermark_DevExtremeJQuery.aspx');
  });
  test('Trial panel "Buy Now" link must use the value from the config', () => {
    var _trialPanelSpy2;
    (0, _config.default)({
      buyNowLink: 'trial-panel-link.com'
    });
    (0, _license_validation.validateLicense)('', '1.2');
    expect((_trialPanelSpy2 = trialPanelSpy) === null || _trialPanelSpy2 === void 0 ? void 0 : _trialPanelSpy2.mock.calls[0][0]).toBe('trial-panel-link.com');
  });
  test('Message should be logged only once', () => {
    (0, _license_validation.validateLicense)('', '1.0');
    (0, _license_validation.validateLicense)('', '1.0');
    (0, _license_validation.validateLicense)('', '1.0');
    expect(_errors.default.log).toHaveBeenCalledTimes(1);
  });
  test('Base z-index should match the corresponding setting in DevExtreme', () => {
    expect(trialPanel.BASE_Z_INDEX).toEqual((0, _m_z_index.base)());
  });
  test('No messages should be logged if setLicenseCheckSkipCondition() used', () => {
    (0, _license_validation.setLicenseCheckSkipCondition)();
    (0, _license_validation.validateLicense)('', '1.0');
    expect(_errors.default.log).not.toHaveBeenCalled();
  });
  test.each([{
    token: TOKEN_23_1,
    version: '23.2.3'
  }, {
    token: TOKEN_23_2,
    version: '42.4.5'
  }])('W0020 error should be logged if license is outdated', _ref9 => {
    let {
      token,
      version
    } = _ref9;
    (0, _license_validation.validateLicense)(token, version);
    expect(_errors.default.log).toHaveBeenCalledTimes(1);
    expect(_errors.default.log).toHaveBeenCalledWith('W0020');
  });
  test.each([{
    token: TOKEN_23_1,
    version: '23.2.3'
  }, {
    token: TOKEN_23_2,
    version: '42.4.5'
  }, {
    token: TOKEN_23_1,
    version: '23.3.0'
  }, {
    token: TOKEN_23_2,
    version: '42.4.0'
  }])('Trial panel should be displayed if license is outdated (>=1 major for RTM, >=2 major for preview)', _ref10 => {
    let {
      token,
      version
    } = _ref10;
    (0, _license_validation.validateLicense)(token, version);
    expect(trialPanelSpy).toHaveBeenCalledTimes(1);
  });
  test.each([{
    token: TOKEN_23_1,
    version: '23.2.0'
  }, {
    token: TOKEN_23_1,
    version: '23.2.3-alpha'
  }, {
    token: TOKEN_23_2,
    version: '24.1.0'
  }, {
    token: TOKEN_23_2,
    version: '24.1.abc'
  }])('Trial panel should not be displayed in previews if the license is for the previous RTM', _ref11 => {
    let {
      token,
      version
    } = _ref11;
    (0, _license_validation.validateLicense)(token, version);
    expect(trialPanelSpy).not.toHaveBeenCalled();
  });
  test.each([{
    token: TOKEN_UNVERIFIED,
    version: '1.2.3'
  }, {
    token: TOKEN_INVALID_JSON,
    version: '1.2.3'
  }, {
    token: TOKEN_INVALID_BASE64,
    version: '1.2.3'
  }, {
    token: TOKEN_MISSING_FIELD_1,
    version: '1.2.3'
  }, {
    token: TOKEN_MISSING_FIELD_2,
    version: '1.2.3'
  }, {
    token: TOKEN_MISSING_FIELD_3,
    version: '1.2.3'
  }, {
    token: TOKEN_UNSUPPORTED_VERSION,
    version: '1.2.3'
  }, {
    token: 'str@nge in.put',
    version: '1.2.3'
  }, {
    token: '3.2.1',
    version: '1.2.3'
  }])('W0021 error should be logged if license is corrupted/invalid [%#]', _ref12 => {
    let {
      token,
      version
    } = _ref12;
    (0, _license_validation.validateLicense)(token, version);
    expect(_errors.default.log).toHaveBeenCalledWith('W0021');
  });
  test.each([{
    token: TOKEN_UNVERIFIED,
    version: '1.2.3'
  }, {
    token: TOKEN_INVALID_JSON,
    version: '1.2.3'
  }, {
    token: TOKEN_INVALID_BASE64,
    version: '1.2.3'
  }, {
    token: TOKEN_MISSING_FIELD_1,
    version: '1.2.3'
  }, {
    token: TOKEN_MISSING_FIELD_2,
    version: '1.2.3'
  }, {
    token: TOKEN_MISSING_FIELD_3,
    version: '1.2.3'
  }, {
    token: TOKEN_UNSUPPORTED_VERSION,
    version: '1.2.3'
  }, {
    token: 'str@nge in.put',
    version: '1.2.3'
  }, {
    token: '3.2.1',
    version: '1.2.3'
  }, {
    token: TOKEN_UNVERIFIED,
    version: '1.2.0'
  }, {
    token: TOKEN_INVALID_JSON,
    version: '1.2.0'
  }, {
    token: TOKEN_INVALID_BASE64,
    version: '1.2.0'
  }, {
    token: TOKEN_MISSING_FIELD_1,
    version: '1.2.0'
  }, {
    token: TOKEN_MISSING_FIELD_2,
    version: '1.2.0'
  }, {
    token: TOKEN_MISSING_FIELD_3,
    version: '1.2.0'
  }, {
    token: TOKEN_UNSUPPORTED_VERSION,
    version: '1.2.0'
  }, {
    token: 'str@nge in.put',
    version: '1.2.0'
  }, {
    token: '3.2.1',
    version: '1.2.0'
  }])('trial panel should be displayed if license is corrupted/invalid, preview or not', _ref13 => {
    let {
      token,
      version
    } = _ref13;
    (0, _license_validation.validateLicense)(token, version);
    expect(trialPanelSpy).toHaveBeenCalledTimes(1);
  });
});
describe('internal license check', () => {
  let trialPanelSpy = null;
  beforeEach(() => {
    jest.spyOn(_errors.default, 'log').mockImplementation(() => {});
    trialPanelSpy = jest.spyOn(trialPanel, 'renderTrialPanel');
    (0, _license_validation.setLicenseCheckSkipCondition)(false);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('valid internal usage token (correct)', () => {
    const token = 'ewogICJpbnRlcm5hbFVzYWdlSWQiOiAiYVlDN0VIaWJwMHl4dFhUaWhKRVJrQSIsCiAgImZvcm1hdCI6IDEKfQ==.emWMjFDkBI2bvqc6R/hwh//2wE9YqS7yyTPSglqLBP7oPFMthW9tHNHsh1lG8MEuSKoi8TYOY+4R9GgvFi190f62iOy4iz8FenPXZodiv9hgDaovb2eIkwK4pilthOEAS9/JYhgTAentJ1f2+PlbjkTIqvYogk01GrRrd+WOtIA=';
    (0, _license_validation.validateLicense)(token, '1.2.3');
    expect(_errors.default.log).not.toHaveBeenCalled();
    expect(trialPanelSpy).not.toHaveBeenCalled();
  });
  test('valid internal usage token (correct, pre-release)', () => {
    const token = 'ewogICJpbnRlcm5hbFVzYWdlSWQiOiAiYVlDN0VIaWJwMHl4dFhUaWhKRVJrQSIsCiAgImZvcm1hdCI6IDEKfQ==.emWMjFDkBI2bvqc6R/hwh//2wE9YqS7yyTPSglqLBP7oPFMthW9tHNHsh1lG8MEuSKoi8TYOY+4R9GgvFi190f62iOy4iz8FenPXZodiv9hgDaovb2eIkwK4pilthOEAS9/JYhgTAentJ1f2+PlbjkTIqvYogk01GrRrd+WOtIA=';
    (0, _license_validation.validateLicense)(token, '1.2.1');
    expect(_errors.default.log).not.toHaveBeenCalled();
    expect(trialPanelSpy).not.toHaveBeenCalled();
  });
  test('internal usage token (incorrect)', () => {
    const token = 'ewogICJpbnRlcm5hbFVzYWdlSWQiOiAiUDdmNU5icU9WMDZYRFVpa3Q1bkRyQSIsCiAgImZvcm1hdCI6IDEKfQ==.ox52WAqudazQ0ZKdnJqvh/RmNNNX+IB9cmun97irvSeZK2JMf9sbBXC1YCrSZNIPBjQapyIV8Ctv9z2wzb3BkWy+R9CEh+ev7purq7Lk0ugpwDye6GaCzqlDg+58EHwPCNaasIuBiQC3ztvOItrGwWSu0aEFooiajk9uAWwzWeM=';
    (0, _license_validation.validateLicense)(token, '1.2.3');
    expect(_errors.default.log).toHaveBeenCalledWith('W0020');
    expect(trialPanelSpy).not.toHaveBeenCalled();
  });
  test('internal usage token (incorrect, pre-release)', () => {
    const token = 'ewogICJpbnRlcm5hbFVzYWdlSWQiOiAiUDdmNU5icU9WMDZYRFVpa3Q1bkRyQSIsCiAgImZvcm1hdCI6IDEKfQ==.ox52WAqudazQ0ZKdnJqvh/RmNNNX+IB9cmun97irvSeZK2JMf9sbBXC1YCrSZNIPBjQapyIV8Ctv9z2wzb3BkWy+R9CEh+ev7purq7Lk0ugpwDye6GaCzqlDg+58EHwPCNaasIuBiQC3ztvOItrGwWSu0aEFooiajk9uAWwzWeM=';
    (0, _license_validation.validateLicense)(token, '1.2.1');
    expect(_errors.default.log).toHaveBeenCalledWith('W0022');
    expect(trialPanelSpy).not.toHaveBeenCalled();
  });
});