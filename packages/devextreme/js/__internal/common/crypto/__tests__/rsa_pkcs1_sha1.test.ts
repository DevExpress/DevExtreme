import { verify } from '../rsa_pkcs1_sha1';

describe('digital signature verification', () => {

  it('is ok for valid payload', () => {

    const text = 'aaa';
    const signature = 'LeCtQqVmeZjxUHhDdP1Qxz2tvIxB9wW/iZtumP1g3nRIKjlXebkm8M1ffqUJu4ZXbnpLTQ1yw3U8ZFsxw1+tGR/6JagUiJXazH1g9gm/buCDnj2xKTriZtLSmTbsXWNVZicvanMcn0Hy6SvVHigMeRrWKAZH13fx8PII1BorJcc=';
    expect(verify({ text, signature })).toBe(true);
  });

  it('fails for invalid payload', () => {

    const text = 'aAa';
    const signature = 'LeCtQqVmeZjxUHhDdP1Qxz2tvIxB9wW/iZtumP1g3nRIKjlXebkm8M1ffqUJu4ZXbnpLTQ1yw3U8ZFsxw1+tGR/6JagUiJXazH1g9gm/buCDnj2xKTriZtLSmTbsXWNVZicvanMcn0Hy6SvVHigMeRrWKAZH13fx8PII1BorJcc=';
    expect(verify({ text, signature })).toBe(false);
  });
});
