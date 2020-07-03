import { getMatchers } from 'expect/build/jestMatchersObject';

const matchers = getMatchers();

expect.extend({
  toBeWithMessage(received, expected, message) {
    const res = matchers.toBe(received, expected);
    if (!res.pass && message) {
      message = `${message}\n\n${res.message()}`; // eslint-disable-line no-param-reassign
      res.message = () => message;
    }
    return res;
  },
});
