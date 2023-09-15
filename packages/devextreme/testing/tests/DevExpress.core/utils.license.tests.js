import config from 'core/config';
import errors from 'core/errors';
import { verifyLicense } from 'core/utils/license';
const { test, module } = QUnit;

module('License check', {
    beforeEach: function() {
        sinon.spy(errors, 'log');
    },
    afterEach: function() {
        config({ license: null });
        errors.log.restore();
    }
}, () => {
    const TOKEN_23_1 = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.DiDceRbil4IzXl5av7pNkKieyqHHhRf+CM477zDu4N9fyrhkQsjRourYvgVfkbSm+EQplkXhlMBc3s8Vm9n+VtPaMbeWXis92cdW/6HiT+Dm54xw5vZ5POGunKRrNYUzd9zTbYcz0bYA/dc/mHFeUdXA0UlKcx1uMaXmtJrkK74=';
    const TOKEN_23_2 = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjYxMjFmMDIyLTFjMTItNDNjZC04YWE0LTkwNzJkNDU4YjYxNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMyCn0=.RENyZ3Ga5rCB7/XNKYbk2Ffv1n9bUexYNhyOlqcAD02YVnPw6XyQcN+ZORScKDU9gOInJ4o7vPxkgh10KvMZNn+FuBK8UcUR7kchk7z0CHGuOcIn2jD5X2hG6SYJ0UCBG/JDG35AL09T7Uv/pGj4PolRsANxtuMpoqmvX2D2vkU=';
    const TOKEN_UNVERIFIED = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.NVsilC5uWlD5QGS6bocLMlsVVK0VpZXYwU2DstUiLRpEI79/onuR8dGWasCLBo4PORDHPkNA/Ej8XeCHzJ0EkXRRZ7E2LrP/xlEfHRXTruvW4IEbZt3LiwJBt6/isLz+wzXtYtjV7tpE07/Y0TFoy+mWpHoU11GVtwKh6weRxkg=';
    const TOKEN_INVALID_JSON = 'YWJj.vjx6wAI9jVkHJAnKcsuYNZ5UvCq3UhypQ+0f+kZ37/Qc1uj4BM6//Kfi4SVsXGOaOTFYWgzesROnHCp3jZRqphJwal4yXHD1sGFi6FEdB4MgdgNZvsZSnxNWLs/7s07CzuHLTpJrAG7sTdHVkQWZNnSCKjzV7909c/Stl9+hkLo=';
    const TOKEN_INVALID_BASE64 = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjM3Yjg4ZjBmLWQ0MmMtNDJiZS05YjhkLTU1ZGMwYzUzYzAxZiIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjIxCn0-.EnP/RDKg0eSyaPU1eDUFll1lqOdYbhN3u73LhN1op8vjNwA0P1vKiT1DfQRmXudlleGWgDkLA2OmJYUER8j7I3LSFf3hLkBAoWoBErgveTb2zkbz8P1i9lE+XmzIXeYHyZBYUt0IPkNfajF9zzbSDDin1CvW7pnADi0vIeZ5ICQ=';
    const TOKEN_MISSING_FIELD_1 = 'ewogICJmb3JtYXQiOiAxLAogICJtYXhWZXJzaW9uQWxsb3dlZCI6IDIzMQp9.WH30cajUFcKqw/fwt4jITM/5tzVwPpbdbezhhdBi5oeOvU06zKY0J4M8gQy8GQ++RPYVCAo2md6vI9D80FD2CC4w+hpQLJNJJgNUHYPrgG6CX1yAB3M+NKHsPP9S71bXAgwvignb5uPo0R5emQzr4RKDhWQMKtgqEcRe+yme2mU=';
    const TOKEN_MISSING_FIELD_2 = 'ewogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.ok32DBaAgf3ijLmNQb+A0kUV2AiSivqvZJADdF607qqlAaduAVnotJtgdwm/Ib3MErfaGrDohCYoFMnKQevkRxFkA7tK3kOBnTZPUnZY0r3wyulMQmr4Qo+Sjf/fyXs4IYpGsC7/uJjgrCos8uzBegfmgfM93XSt6pKl9+c5xvc=';
    const TOKEN_MISSING_FIELD_3 = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIKfQ==.resgTqmazrorRNw7mmtV31XQnmTSw0uLEArsmpzCjWMQJLocBfAjpFvKBf+SAG9q+1iOSFySj64Uv2xBVqHnyeNVBRbouOKOnAB8RpkKvN4sc5SDc8JAG5TkwPVSzK/VLBpQxpqbxlcrRfHwz9gXqQoPt4/ZVATn285iw3DW0CU=';
    const TOKEN_UNSUPPORTED_VERSION = 'ewogICJmb3JtYXQiOiAyLAogICJjdXN0b21lcklkIjogImIxMTQwYjQ2LWZkZTEtNDFiZC1hMjgwLTRkYjlmOGU3ZDliZCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMxCn0=.tTBymZMROsYyMiP6ldXFqGurbzqjhSQIu/pjyEUJA3v/57VgToomYl7FVzBj1asgHpadvysyTUiX3nFvPxbp166L3+LB3Jybw9ueMnwePu5vQOO0krqKLBqRq+TqHKn7k76uYRbkCIo5UajNfzetHhlkin3dJf3x2K/fcwbPW5A=';

    test('W0019 error should be logged if license is empty', function(assert) {
        verifyLicense('', '1.0');
        assert.equal(errors.log.callCount, 1);
        assert.strictEqual(errors.log.getCall(0).args[0], 'W0019');

        verifyLicense(null, '1.0');
        assert.equal(errors.log.callCount, 2);
        assert.strictEqual(errors.log.getCall(1).args[0], 'W0019');

        verifyLicense(undefined, '1.0');
        assert.equal(errors.log.callCount, 3);
        assert.strictEqual(errors.log.getCall(2).args[0], 'W0019');
    });

    test('No messages should be logged if license is valid', function(assert) {
        verifyLicense(TOKEN_23_1, '23.1');
        assert.ok(errors.log.notCalled);

        verifyLicense(TOKEN_23_1, '12.3');
        assert.ok(errors.log.notCalled);

        verifyLicense(TOKEN_23_2, '23.1');
        assert.ok(errors.log.notCalled);

        verifyLicense(TOKEN_23_2, '23.2');
        assert.ok(errors.log.notCalled);
    });

    test('W0020 error should be logged if license is outdated', function(assert) {
        verifyLicense(TOKEN_23_1, '23.2');
        assert.equal(errors.log.callCount, 1);
        assert.strictEqual(errors.log.getCall(0).args[0], 'W0020');

        verifyLicense(TOKEN_23_2, '42.4');
        assert.equal(errors.log.callCount, 2);
        assert.strictEqual(errors.log.getCall(1).args[0], 'W0020');
    });

    test('W0021 error should be logged if license is corrupted/invalid', function(assert) {
        verifyLicense(TOKEN_UNVERIFIED, '1.2.3');
        assert.strictEqual(errors.log.getCall(0).args[0], 'W0021');

        verifyLicense(TOKEN_INVALID_JSON, '1.2.3');
        assert.strictEqual(errors.log.getCall(1).args[0], 'W0021');

        verifyLicense(TOKEN_INVALID_BASE64, '1.2.3');
        assert.strictEqual(errors.log.getCall(2).args[0], 'W0021');

        verifyLicense(TOKEN_MISSING_FIELD_1, '1.2.3');
        assert.strictEqual(errors.log.getCall(3).args[0], 'W0021');

        verifyLicense(TOKEN_MISSING_FIELD_2, '1.2.3');
        assert.strictEqual(errors.log.getCall(4).args[0], 'W0021');

        verifyLicense(TOKEN_MISSING_FIELD_3, '1.2.3');
        assert.strictEqual(errors.log.getCall(5).args[0], 'W0021');

        verifyLicense(TOKEN_UNSUPPORTED_VERSION, '1.2.3');
        assert.strictEqual(errors.log.getCall(6).args[0], 'W0021');

        verifyLicense('Another', '1.2.3');
        assert.strictEqual(errors.log.getCall(7).args[0], 'W0021');

        verifyLicense('str@nge');
        assert.strictEqual(errors.log.getCall(8).args[0], 'W0021');

        verifyLicense('in.put');
        assert.strictEqual(errors.log.getCall(9).args[0], 'W0021');

        verifyLicense('3.2.1', '1.2.3');
        assert.strictEqual(errors.log.getCall(10).args[0], 'W0021');
    });
});
