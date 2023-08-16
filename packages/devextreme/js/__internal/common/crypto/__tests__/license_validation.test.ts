import { parseToken } from '../license_validation';

describe('license token', () => {

  const testCases = [
    {
      token: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.DiDceRbil4IzXl5av7pNkKieyqHHhRf+CM477zDu4N9fyrhkQsjRourYvgVfkbSm+EQplkXhlMBc3s8Vm9n+VtPaMbeWXis92cdW/6HiT+Dm54xw5vZ5POGunKRrNYUzd9zTbYcz0bYA/dc/mHFeUdXA0UlKcx1uMaXmtJrkK74=',
      payload: {
        customerId: 'b1140b46-fde1-41bd-a280-4db9f8e7d9bd',
        maxVersionAllowed: 231,
      }
    }, {
      token: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjYxMjFmMDIyLTFjMTItNDNjZC04YWE0LTkwNzJkNDU4YjYxNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMyCn0=.RENyZ3Ga5rCB7/XNKYbk2Ffv1n9bUexYNhyOlqcAD02YVnPw6XyQcN+ZORScKDU9gOInJ4o7vPxkgh10KvMZNn+FuBK8UcUR7kchk7z0CHGuOcIn2jD5X2hG6SYJ0UCBG/JDG35AL09T7Uv/pGj4PolRsANxtuMpoqmvX2D2vkU=',
      payload: {
        customerId: '6121f022-1c12-43cd-8aa4-9072d458b614',
        maxVersionAllowed: 232,
      }
    }, {
      token: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjM3Yjg4ZjBmLWQ0MmMtNDJiZS05YjhkLTU1ZGMwYzUzYzAxZiIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjIxCn0=.NVsilC5uWlD5QGS6bocLMlsVVK0VpZXYwU2DstUiLRpEI79/onuR8dGWasCLBo4PORDHPkNA/Ej8XeCHzJ0EkXRRZ7E2LrP/xlEfHRXTruvW4IEbZt3LiwJBt6/isLz+wzXtYtjV7tpE07/Y0TFoy+mWpHoU11GVtwKh6weRxkg=',
      payload: {
        customerId: '37b88f0f-d42c-42be-9b8d-55dc0c53c01f',
        maxVersionAllowed: 221,
      }
    }
  ];

  testCases.map(c => c.token).forEach((token) =>
  it(`verifies payload: '${token}'`, () => {
    const license = parseToken(token);

    expect(license.kind).toBe('verified');
  }));

  testCases.forEach(({ token, payload: expected }) =>
  it(`decodes payload '${{token}}'`, () => {
    const license = parseToken(token);

    expect(license.kind).toBe('verified');
    if (license.kind === 'verified') {
      expect(license.payload).toEqual(expected);
    }
  }));

  [
    '', '.', 'a', 'a.', '.a', '.a.', '.a.', '.a.b', 'a.b.', '.a.b.',
  ].forEach((invalidInput) => it(`is not parsed from invalid input: '${invalidInput}'`, () => {
    const license = parseToken(invalidInput);

    expect(license.kind).toBe('corrupted');

    if(license.kind === 'corrupted') {
      expect(license.error).toBe('format');
    }
  }));

});